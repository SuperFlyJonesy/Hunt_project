import crypto from 'node:crypto';
import { datastore, getQualifyingMinCents } from './lib/datastore.js';

/**
 * Verify Patreon Webhook HMAC Signature
 * Patreon V2 webhooks use HMAC-MD5 over the raw body with the Webhook Secret
 */
export function verifyPatreonSignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader || !secret) return false;

  try {
    // 1. Primary verification: HMAC-MD5 (Patreon V2 Standard)
    const hmacMd5 = crypto.createHmac('md5', secret).update(rawBody).digest('hex');
    const sigBuffer = Buffer.from(signatureHeader.trim().toLowerCase(), 'utf8');
    const md5Buffer = Buffer.from(hmacMd5.toLowerCase(), 'utf8');

    if (sigBuffer.length === md5Buffer.length && crypto.timingSafeEqual(sigBuffer, md5Buffer)) {
      return true;
    }

    // 2. Secondary fallback: HMAC-SHA256 (for updated API keys / custom signature setups)
    const hmacSha256 = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    const sha256Buffer = Buffer.from(hmacSha256.toLowerCase(), 'utf8');

    if (sigBuffer.length === sha256Buffer.length && crypto.timingSafeEqual(sigBuffer, sha256Buffer)) {
      return true;
    }
  } catch (err) {
    console.error('[Patreon Webhook] Signature verification error:', err.message);
    return false;
  }

  return false;
}

/**
 * Extract membership details from Patreon JSON:API payload
 */
export function parsePatreonPayload(body) {
  if (!body || typeof body !== 'object') return null;

  const data = body.data || {};
  const attributes = data.attributes || {};
  const memberId = data.id || attributes.id || null;

  // Extract pledge in cents/pence
  let pledgeAmountCents = 0;
  if (typeof attributes.currently_entitled_amount_cents === 'number') {
    pledgeAmountCents = attributes.currently_entitled_amount_cents;
  } else if (typeof attributes.pledge_amount_cents === 'number') {
    pledgeAmountCents = attributes.pledge_amount_cents;
  } else if (typeof attributes.will_pay_amount_cents === 'number') {
    pledgeAmountCents = attributes.will_pay_amount_cents;
  }

  const patronStatus = attributes.patron_status || attributes.membership_status || 'unknown';

  // Extract tier title if included
  let tierTitle = 'Standard Member';
  if (Array.isArray(body.included)) {
    const tierItem = body.included.find(item => item.type === 'tier' || item.type === 'reward');
    if (tierItem && tierItem.attributes && tierItem.attributes.title) {
      tierTitle = tierItem.attributes.title;
    }
  }

  return {
    memberId,
    pledgeAmountCents,
    patronStatus,
    tierTitle
  };
}

/**
 * Netlify Function Serverless Handler
 */
export const handler = async (event, context) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'POST' },
      body: JSON.stringify({ error: 'Method Not Allowed. Webhooks must be POST.' })
    };
  }

  const rawBody = event.body || '';
  const headers = event.headers || {};

  // Case-insensitive header lookups
  const signature = headers['x-patreon-signature'] || headers['X-Patreon-Signature'];
  const eventType = headers['x-patreon-event'] || headers['X-Patreon-Event'] || 'members:create';
  const eventId = headers['x-patreon-event-id'] || headers['X-Patreon-Event-Id'] || 
                  headers['x-request-id'] || `evt_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

  const webhookSecret = process.env.PATREON_WEBHOOK_SECRET;

  // Check if webhook is disabled via feature flag
  if (process.env.DISABLE_PATREON_WEBHOOK === 'true') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'DISABLED', message: 'Webhook processing is temporarily paused via configuration.' })
    };
  }

  // 1. Signature Verification
  if (!webhookSecret) {
    console.error('[Patreon Webhook] CRITICAL: PATREON_WEBHOOK_SECRET is not configured in environment variables.');
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server configuration error.' })
    };
  }

  const isDevBypass = process.env.NODE_ENV === 'test' && headers['x-test-bypass-sig'] === 'true';

  if (!isDevBypass && !verifyPatreonSignature(rawBody, signature, webhookSecret)) {
    console.warn('[Patreon Webhook] Rejected unauthorized webhook delivery: Invalid signature.');
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unauthorized. Invalid X-Patreon-Signature.' })
    };
  }

  // 2. Parse JSON Payload
  let parsedJson;
  try {
    parsedJson = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
  } catch (err) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Malformed JSON payload.' })
    };
  }

  const memberData = parsePatreonPayload(parsedJson);
  if (!memberData || !memberData.memberId) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Payload missing required member identifier.' })
    };
  }

  // 3. Business Rule Routing based on Event Type
  try {
    // Cancellations & Member Deletions: Do NOT change counter
    if (eventType === 'members:delete' || eventType.includes('delete')) {
      await datastore.appendAuditLog({
        timestamp: new Date().toISOString(),
        eventId,
        memberIdHash: memberData.memberId ? crypto.createHash('sha256').update(String(memberData.memberId)).digest('hex').slice(0, 16) : 'none',
        eventType,
        previousCount: (await datastore.getCounterState()).remaining,
        newCount: (await datastore.getCounterState()).remaining,
        status: 'CANCELLATION_RECORDED_NO_COUNT_CHANGE',
        reason: 'Patreon membership cancellation received; counter remains unchanged per policy.'
      });

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'RECORDED_NO_CHANGE',
          event: eventType,
          message: 'Cancellation noted. Public counter not incremented.'
        })
      };
    }

    // Qualifying Membership Events (members:pledge:create, members:create, members:update)
    const result = await datastore.processPatreonEvent({
      eventId,
      memberId: memberData.memberId,
      eventType,
      pledgeAmountCents: memberData.pledgeAmountCents,
      rawTierName: memberData.tierTitle
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'SUCCESS',
        changed: result.changed,
        previousCount: result.previousCount,
        newCount: result.newCount,
        action: result.status,
        reason: result.reason
      })
    };
  } catch (err) {
    console.error('[Patreon Webhook] Processing failure:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal processing failure.' })
    };
  }
};

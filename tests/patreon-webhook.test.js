import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';

import { handler as webhookHandler, verifyPatreonSignature } from '../netlify/functions/patreon-webhook.js';
import { handler as counterHandler } from '../netlify/functions/counter.js';
import { handler as adminHandler } from '../netlify/functions/admin-counter.js';
import { datastore, hashMemberId } from '../netlify/functions/lib/datastore.js';

// Setup test environment
const TEST_SECRET = 'test_patreon_webhook_secret_xyz123';
const TEST_ADMIN_KEY = 'test_admin_key_9999';

process.env.PATREON_WEBHOOK_SECRET = TEST_SECRET;
process.env.ADMIN_API_KEY = TEST_ADMIN_KEY;
process.env.STARTING_TARGET_COUNT = '62220';
process.env.QUALIFYING_TIER_MIN_CENTS = '100'; // 100 cents minimum (£1.00)

function cleanTestDb() {
  datastore.resetForTesting(62220);
}

function generateSignature(payloadStr, secret = TEST_SECRET) {
  return crypto.createHmac('md5', secret).update(payloadStr).digest('hex');
}

function makePatreonPayload({ id = 'pat_member_123', amountCents = 300, status = 'active_patron', title = 'Initiate Supporter' } = {}) {
  return JSON.stringify({
    data: {
      id,
      type: 'member',
      attributes: {
        currently_entitled_amount_cents: amountCents,
        patron_status: status,
        email: 'patron@example.com'
      }
    },
    included: [
      {
        type: 'tier',
        id: 'tier_1',
        attributes: {
          title
        }
      }
    ]
  });
}

test('Patreon Webhook & Counter Full Test Suite', async (t) => {
  cleanTestDb();

  await t.test('1. Valid first qualifying paid-member event decrements counter', async () => {
    cleanTestDb();
    const payload = makePatreonPayload({ id: 'member_alpha', amountCents: 500 });
    const sig = generateSignature(payload);

    const res = await webhookHandler({
      httpMethod: 'POST',
      body: payload,
      headers: {
        'x-patreon-signature': sig,
        'x-patreon-event': 'members:pledge:create',
        'x-patreon-event-id': 'evt_001'
      }
    });

    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.status, 'SUCCESS');
    assert.equal(body.changed, true);
    assert.equal(body.previousCount, 62220);
    assert.equal(body.newCount, 62219);
  });

  await t.test('2. Duplicate delivery of the exact same event ID is ignored idempotently', async () => {
    const payload = makePatreonPayload({ id: 'member_alpha', amountCents: 500 });
    const sig = generateSignature(payload);

    const res = await webhookHandler({
      httpMethod: 'POST',
      body: payload,
      headers: {
        'x-patreon-signature': sig,
        'x-patreon-event': 'members:pledge:create',
        'x-patreon-event-id': 'evt_001' // Same event ID as test 1
      }
    });

    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.changed, false);
    assert.equal(body.newCount, 62219);
  });

  await t.test('3. Same member receiving a new event is not decremented twice', async () => {
    const payload = makePatreonPayload({ id: 'member_alpha', amountCents: 500 });
    const sig = generateSignature(payload);

    const res = await webhookHandler({
      httpMethod: 'POST',
      body: payload,
      headers: {
        'x-patreon-signature': sig,
        'x-patreon-event': 'members:update',
        'x-patreon-event-id': 'evt_002' // Different event ID, but same member
      }
    });

    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.changed, false);
    assert.equal(body.action, 'IDEMPOTENT_NO_CHANGE');
    assert.equal(body.newCount, 62219);
  });

  await t.test('4. Free member event (0 cents) does not decrement counter', async () => {
    const payload = makePatreonPayload({ id: 'member_free_user', amountCents: 0, status: 'free_follower' });
    const sig = generateSignature(payload);

    const res = await webhookHandler({
      httpMethod: 'POST',
      body: payload,
      headers: {
        'x-patreon-signature': sig,
        'x-patreon-event': 'members:create',
        'x-patreon-event-id': 'evt_free_01'
      }
    });

    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.changed, false);
    assert.equal(body.action, 'IGNORED_FREE_OR_LOW_TIER');
    assert.equal(body.newCount, 62219);
  });

  await t.test('5. Renewal / monthly charge update event does not change count for existing member', async () => {
    const payload = makePatreonPayload({ id: 'member_alpha', amountCents: 500, status: 'active_patron' });
    const sig = generateSignature(payload);

    const res = await webhookHandler({
      httpMethod: 'POST',
      body: payload,
      headers: {
        'x-patreon-signature': sig,
        'x-patreon-event': 'members:pledge:update',
        'x-patreon-event-id': 'evt_renewal_01'
      }
    });

    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.changed, false);
    assert.equal(body.newCount, 62219);
  });

  await t.test('6. Upgrade event does not decrement again if member was already counted', async () => {
    const payload = makePatreonPayload({ id: 'member_alpha', amountCents: 1500, title: 'Gold Hunter' });
    const sig = generateSignature(payload);

    const res = await webhookHandler({
      httpMethod: 'POST',
      body: payload,
      headers: {
        'x-patreon-signature': sig,
        'x-patreon-event': 'members:update',
        'x-patreon-event-id': 'evt_upgrade_01'
      }
    });

    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.changed, false);
    assert.equal(body.newCount, 62219);
  });

  await t.test('7. Downgrade event does not alter counter', async () => {
    const payload = makePatreonPayload({ id: 'member_alpha', amountCents: 300 });
    const sig = generateSignature(payload);

    const res = await webhookHandler({
      httpMethod: 'POST',
      body: payload,
      headers: {
        'x-patreon-signature': sig,
        'x-patreon-event': 'members:update',
        'x-patreon-event-id': 'evt_downgrade_01'
      }
    });

    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.changed, false);
    assert.equal(body.newCount, 62219);
  });

  await t.test('8. Cancellation event does not increase the counter', async () => {
    const payload = makePatreonPayload({ id: 'member_alpha', amountCents: 0, status: 'former_patron' });
    const sig = generateSignature(payload);

    const res = await webhookHandler({
      httpMethod: 'POST',
      body: payload,
      headers: {
        'x-patreon-signature': sig,
        'x-patreon-event': 'members:delete',
        'x-patreon-event-id': 'evt_delete_01'
      }
    });

    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.status, 'RECORDED_NO_CHANGE');

    // Confirm counter remained at 62219
    const countCheck = await counterHandler({ httpMethod: 'GET' });
    const countData = JSON.parse(countCheck.body);
    assert.equal(countData.remaining, 62219);
  });

  await t.test('9. Invalid webhook signature is rejected with 401 Unauthorized', async () => {
    const payload = makePatreonPayload({ id: 'member_attacker', amountCents: 500 });
    const fakeSig = 'invalid_hmac_signature_value';

    const res = await webhookHandler({
      httpMethod: 'POST',
      body: payload,
      headers: {
        'x-patreon-signature': fakeSig,
        'x-patreon-event': 'members:pledge:create'
      }
    });

    assert.equal(res.statusCode, 401);
    const body = JSON.parse(res.body);
    assert.match(body.error, /Invalid X-Patreon-Signature/);
  });

  await t.test('10. Malformed JSON payload returns 400 Bad Request', async () => {
    const badPayload = '{"invalid_json: ...';
    const sig = generateSignature(badPayload);

    const res = await webhookHandler({
      httpMethod: 'POST',
      body: badPayload,
      headers: {
        'x-patreon-signature': sig,
        'x-patreon-event': 'members:pledge:create'
      }
    });

    assert.equal(res.statusCode, 400);
    const body = JSON.parse(res.body);
    assert.match(body.error, /Malformed JSON/);
  });

  await t.test('11. Payload missing member ID returns 400 Bad Request', async () => {
    const badPayload = JSON.stringify({ data: { type: 'member', attributes: { currently_entitled_amount_cents: 500 } } });
    const sig = generateSignature(badPayload);

    const res = await webhookHandler({
      httpMethod: 'POST',
      body: badPayload,
      headers: {
        'x-patreon-signature': sig,
        'x-patreon-event': 'members:pledge:create'
      }
    });

    assert.equal(res.statusCode, 400);
    const body = JSON.parse(res.body);
    assert.match(body.error, /missing required member identifier/);
  });

  await t.test('12. Concurrent duplicate deliveries cannot decrement counter twice', async () => {
    const payload = makePatreonPayload({ id: 'member_concurrent_1', amountCents: 500 });
    const sig = generateSignature(payload);

    // Dispatch 5 concurrent requests with the same member ID
    const promises = Array.from({ length: 5 }).map((_, i) =>
      webhookHandler({
        httpMethod: 'POST',
        body: payload,
        headers: {
          'x-patreon-signature': sig,
          'x-patreon-event': 'members:pledge:create',
          'x-patreon-event-id': `evt_concurrent_${i}`
        }
      })
    );

    const results = await Promise.all(promises);
    const changedCount = results.filter(r => JSON.parse(r.body).changed === true).length;
    assert.equal(changedCount, 1, 'Only exactly 1 request should decrement the counter');
  });

  await t.test('13. Floor check: Counter cannot fall below zero', async () => {
    await adminHandler({
      httpMethod: 'POST',
      queryStringParameters: { action: 'adjust' },
      headers: { Authorization: `Bearer ${TEST_ADMIN_KEY}` },
      body: JSON.stringify({ newCount: 0, reason: 'Test floor zero' })
    });

    const payload = makePatreonPayload({ id: 'member_zero_test', amountCents: 500 });
    const sig = generateSignature(payload);

    const res = await webhookHandler({
      httpMethod: 'POST',
      body: payload,
      headers: {
        'x-patreon-signature': sig,
        'x-patreon-event': 'members:pledge:create',
        'x-patreon-event-id': 'evt_zero_01'
      }
    });

    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.newCount, 0);
  });

  await t.test('14. Public read-only counter endpoint returns clean JSON without secrets', async () => {
    const res = await counterHandler({ httpMethod: 'GET' });
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['Content-Type'], 'application/json');
    assert.ok(res.headers['Cache-Control']);

    const data = JSON.parse(res.body);
    assert.equal(typeof data.remaining, 'number');
    assert.equal(typeof data.starting, 'number');
    assert.equal(typeof data.updated_at, 'string');
    // Ensure no secrets or tokens leaked
    assert.equal(data.secret, undefined);
    assert.equal(data.token, undefined);
  });

  await t.test('15. Admin API authentication & authorization', async () => {
    // Unauthenticated GET
    const unauth = await adminHandler({ httpMethod: 'GET', headers: {} });
    assert.equal(unauth.statusCode, 401);

    // Authenticated GET with Bearer token
    const auth = await adminHandler({
      httpMethod: 'GET',
      headers: { Authorization: `Bearer ${TEST_ADMIN_KEY}` }
    });
    assert.equal(auth.statusCode, 200);
    const data = JSON.parse(auth.body);
    assert.ok(data.state);
    assert.ok(Array.isArray(data.auditLogs));
  });

  await t.test('16. Manual admin offset adjustment functions properly and logs audit', async () => {
    const res = await adminHandler({
      httpMethod: 'POST',
      queryStringParameters: { action: 'adjust' },
      headers: { Authorization: `Bearer ${TEST_ADMIN_KEY}` },
      body: JSON.stringify({
        newCount: 62200,
        reason: 'Verified Bristol audit calibration',
        adminUser: 'Jason-Founder'
      })
    });

    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.newCount, 62200);
    assert.equal(body.audit.status, 'ADMIN_OVERRIDE');
  });

  await t.test('17. Admin reconciliation tool compares member lists without mutating counter', async () => {
    const patreonMockMembers = [
      { id: 'pat_1', currently_entitled_amount_cents: 300, tier_title: 'Patreon Initiate' },
      { id: 'pat_2', currently_entitled_amount_cents: 0, tier_title: 'Free Follower' },
      { id: 'pat_3', currently_entitled_amount_cents: 600, tier_title: 'Hunter Tier' }
    ];

    const res = await adminHandler({
      httpMethod: 'POST',
      queryStringParameters: { action: 'reconcile' },
      headers: { Authorization: `Bearer ${TEST_ADMIN_KEY}` },
      body: JSON.stringify({ patreonMembers: patreonMockMembers })
    });

    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.status, 'RECONCILIATION_REPORT_GENERATED');
    assert.ok(body.report.requiresManualConfirmation);
    assert.equal(body.report.patreonQualifyingPaidMembers, 2);
  });

  await t.test('18. GDPR right-to-erasure endpoint removes member identifier', async () => {
    const res = await adminHandler({
      httpMethod: 'POST',
      queryStringParameters: { action: 'gdpr-delete' },
      headers: { Authorization: `Bearer ${TEST_ADMIN_KEY}` },
      body: JSON.stringify({ memberId: 'member_alpha' })
    });

    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.success, true);
  });

  cleanTestDb();
});

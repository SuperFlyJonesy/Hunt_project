import { datastore } from './lib/datastore.js';

function verifyAdminAuth(headers) {
  const adminKey = process.env.ADMIN_API_KEY || '1608'; // Defaults to Founder PIN if not explicitly overridden
  const authHeader = headers['authorization'] || headers['Authorization'] || '';
  const customHeader = headers['x-admin-key'] || headers['X-Admin-Key'] || '';

  if (customHeader && customHeader === adminKey) return true;
  if (authHeader.startsWith('Bearer ') && authHeader.slice(7).trim() === adminKey) return true;
  if (authHeader.startsWith('Basic ') && Buffer.from(authHeader.slice(6), 'base64').toString('utf8').includes(adminKey)) return true;

  return false;
}

export const handler = async (event, context) => {
  // CORS Preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Key'
      }
    };
  }

  const headers = event.headers || {};
  if (!verifyAdminAuth(headers)) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Unauthorized. Invalid or missing Admin API Key.' })
    };
  }

  const action = (event.queryStringParameters?.action || '').toLowerCase();

  try {
    // 1. GET Stats & Audit Logs
    if (event.httpMethod === 'GET') {
      const state = await datastore.getCounterState();
      const logs = await datastore.getAuditLogs(parseInt(event.queryStringParameters?.limit || '50', 10));
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          state,
          auditLogs: logs
        })
      };
    }

    // 2. POST Actions
    if (event.httpMethod === 'POST') {
      let body = {};
      try {
        body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body || {};
      } catch (e) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'Malformed JSON body.' })
        };
      }

      // Action: Manual Adjustment
      if (action === 'adjust' || body.action === 'adjust') {
        const { newCount, offset, reason, adminUser } = body;
        const result = await datastore.adjustCounterManual({
          newCount: typeof newCount === 'number' ? newCount : undefined,
          offset: typeof offset === 'number' ? offset : undefined,
          reason,
          adminUser: adminUser || 'Founder'
        });
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify(result)
        };
      }

      // Action: Reconciliation (Read-Only Comparison Tool)
      if (action === 'reconcile' || body.action === 'reconcile') {
        const membersList = Array.isArray(body.patreonMembers) ? body.patreonMembers : [];
        const result = await datastore.reconcileMembers(membersList);
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({
            status: 'RECONCILIATION_REPORT_GENERATED',
            notice: 'This is a read-only audit. No counter numbers were automatically altered.',
            report: result
          })
        };
      }

      // Action: GDPR Erasure
      if (action === 'gdpr-delete' || body.action === 'gdpr-delete') {
        const memberId = body.memberId;
        if (!memberId) {
          return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Missing memberId for GDPR erasure.' })
          };
        }
        const result = await datastore.removeMemberGdpr(memberId);
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify(result)
        };
      }

      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Unknown action specified. Valid actions: adjust, reconcile, gdpr-delete.' })
      };
    }

    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'GET, POST, OPTIONS' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  } catch (err) {
    console.error('[Admin API] Error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Internal Admin API error.' })
    };
  }
};

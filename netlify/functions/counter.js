import { datastore } from './lib/datastore.js';

export const handler = async (event, context) => {
  // Support CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'GET, OPTIONS' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const state = await datastore.getCounterState();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=15, stale-while-revalidate=60',
        'ETag': `W/"hli-${state.remaining}-${state.updatedAt}"`
      },
      body: JSON.stringify({
        remaining: state.remaining,
        starting: state.starting,
        totalCounted: state.totalCounted,
        updated_at: state.updatedAt
      })
    };
  } catch (err) {
    console.error('[Counter API] Error fetching counter state:', err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Failed to retrieve counter data',
        fallback: 62220
      })
    };
  }
};

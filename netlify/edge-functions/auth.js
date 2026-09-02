export default async (request, context) => {
  const url = new URL(request.url);
  const pathname = url.pathname.toLowerCase();

  // Allow serverless API endpoints, webhooks, and public functions to bypass Basic Auth
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/.netlify/functions/') ||
    pathname.startsWith('/.netlify/images/')
  ) {
    return context.next();
  }

  const authHeader = request.headers.get("authorization");

  // Site preview password protection
  const expectedCredentials = btoa("Guest:1608");

  if (authHeader !== `Basic ${expectedCredentials}`) {
    return new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Private Site"',
      },
    });
  }

  return context.next();
};
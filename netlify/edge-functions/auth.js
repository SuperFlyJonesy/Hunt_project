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

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return new Response("Unauthorized - Access Restricted", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Bristol Hearing Loss Initiative Preview"',
      },
    });
  }

  try {
    const base64Credentials = authHeader.replace(/^Basic\s+/i, "");
    const decoded = atob(base64Credentials);
    const [user, pass] = decoded.split(":");

    const validUsers = ["guest", "admin", "jo", "jason"];
    const validPasswords = ["1608", "2203"];

    if (
      user &&
      pass &&
      validUsers.includes(user.trim().toLowerCase()) &&
      validPasswords.includes(pass.trim())
    ) {
      return context.next();
    }
  } catch (err) {
    console.error("Auth decoding error:", err);
  }

  return new Response("Unauthorized - Invalid Credentials", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Bristol Hearing Loss Initiative Preview"',
    },
  });
};
export default async (request, context) => {
  const authHeader = request.headers.get("authorization");

  // You can change 'partner' and 'password123' to whatever you want
  const expectedCredentials = btoa("Jo:2203");

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
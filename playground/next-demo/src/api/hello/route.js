// src/app/api/hello/route.js
export async function GET(req) {
  return new Response(JSON.stringify({ message: "Hello from Next.js API!" }), {
    headers: { "Content-Type": "application/json" },
  });
}

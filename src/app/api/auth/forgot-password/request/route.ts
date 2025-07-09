// In-memory store for demo only
const pinStore = new Map<string, string>();

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email) {
    return new Response(JSON.stringify({ message: "Email required" }), { status: 400 });
  }
  // Generate 6-digit PIN
  const pin = Math.floor(100000 + Math.random() * 900000).toString();
  pinStore.set(email, pin);
  // Mock send email
  console.log(`Sending PIN ${pin} to ${email}`);
  return new Response(JSON.stringify({ message: "PIN sent" }), { status: 200 });
}

export { pinStore };

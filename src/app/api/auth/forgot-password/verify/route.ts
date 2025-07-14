import { pinStore } from "@/lib/pin-store";

export async function POST(request: Request) {
  const { email, pin } = await request.json();
  if (!email || !pin) {
    return new Response(JSON.stringify({ message: "Email and PIN required" }), { status: 400 });
  }
  const validPin = pinStore.get(email);
  if (validPin && validPin === pin) {
    pinStore.delete(email); // Invalidate PIN after use
    return new Response(JSON.stringify({ message: "PIN verified" }), { status: 200 });
  }
  return new Response(JSON.stringify({ message: "Invalid PIN" }), { status: 400 });
}

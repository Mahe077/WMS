export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return new Response(JSON.stringify({ message: "Email and password required" }), { status: 400 });
  }
  // Here you would update the user's password in the database
  // For demo, just log and return success
  console.log(`Password reset for ${email} to new password: ${password}`);
  return new Response(JSON.stringify({ message: "Password reset successful" }), { status: 200 });
}

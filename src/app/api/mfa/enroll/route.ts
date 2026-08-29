import { NextRequest, NextResponse } from "next/server";
import { callIdentity } from "@/lib/auth/backend";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.method) {
    return NextResponse.json({ message: "A method ('totp' or 'email') is required." }, { status: 400 });
  }

  const upstream = await callIdentity(req, "/mfa/enroll", {
    method: "POST",
    body: JSON.stringify({ method: body.method }),
  });
  if (!upstream) {
    return NextResponse.json({ message: "Not signed in." }, { status: 401 });
  }
  if (!upstream.ok) {
    return NextResponse.json({ message: "Could not start MFA enrollment." }, { status: upstream.status });
  }

  const data = await upstream.json();
  return NextResponse.json(data);
}

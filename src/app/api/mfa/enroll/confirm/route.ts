import { NextRequest, NextResponse } from "next/server";
import { callIdentity } from "@/lib/auth/backend";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.code) {
    return NextResponse.json({ message: "Enter the six-digit code to continue." }, { status: 400 });
  }

  const upstream = await callIdentity(req, "/mfa/enroll/confirm", {
    method: "POST",
    body: JSON.stringify({ code: body.code }),
  });
  if (!upstream) {
    return NextResponse.json({ message: "Not signed in." }, { status: 401 });
  }
  if (!upstream.ok) {
    return NextResponse.json({ message: "That code isn't right." }, { status: upstream.status });
  }

  return NextResponse.json({ ok: true });
}

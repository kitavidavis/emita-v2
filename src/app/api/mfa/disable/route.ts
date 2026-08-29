import { NextRequest, NextResponse } from "next/server";
import { callIdentity } from "@/lib/auth/backend";

export async function POST(req: NextRequest) {
  const upstream = await callIdentity(req, "/mfa/disable", { method: "POST" });
  if (!upstream) {
    return NextResponse.json({ message: "Not signed in." }, { status: 401 });
  }
  if (!upstream.ok) {
    return NextResponse.json({ message: "Could not turn off two-factor authentication." }, { status: upstream.status });
  }

  return NextResponse.json({ ok: true });
}

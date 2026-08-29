import { NextRequest, NextResponse } from "next/server";
import { callIdentity } from "@/lib/auth/backend";

export async function GET(req: NextRequest) {
  const upstream = await callIdentity(req, "/mfa/status");
  if (!upstream) {
    return NextResponse.json({ message: "Not signed in." }, { status: 401 });
  }
  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}

import { NextRequest, NextResponse } from "next/server";
import { callIdentityAsAdmin } from "@/lib/auth/backend";

export async function GET(req: NextRequest) {
  const upstream = await callIdentityAsAdmin(req, "/invoices");
  if (!upstream) return NextResponse.json({ message: "Not signed in." }, { status: 401 });
  const data = await upstream.json().catch(() => null);
  return NextResponse.json(data, { status: upstream.status });
}

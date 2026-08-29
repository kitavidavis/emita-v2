import { NextRequest, NextResponse } from "next/server";

const IDENTITY_API = process.env.EMITA_IDENTITY_API_URL ?? "https://api.emita.co.ke/identity";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const accountSlug = body?.accountSlug?.trim();
  const email = body?.email?.trim();

  if (!accountSlug || !email) {
    return NextResponse.json({ message: "Workspace and email are both required." }, { status: 400 });
  }

  try {
    // Always 200 regardless of upstream outcome — this endpoint never reveals whether an
    // account/email combination exists, matching the backend's own "never reveal" posture.
    await fetch(`${IDENTITY_API}/auth/password-reset/staff/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountSlug, email }),
      cache: "no-store",
    });
  } catch {
    // Swallowed for the same reason — a network error here shouldn't leak account existence either.
  }

  return NextResponse.json({ ok: true });
}

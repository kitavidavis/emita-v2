import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/auth/session";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  clearAdminSessionCookie(res);
  return res;
}

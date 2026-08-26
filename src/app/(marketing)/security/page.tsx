import type { Metadata } from "next";
import { StubPage } from "@/components/StubPage";

export const metadata: Metadata = { title: "Security — Emita" };

export default function SecurityPage() {
  return (
    <StubPage
      kicker="Legal / Security"
      title="Built for utility-grade operations."
      body="Data residency in your region or on-premise where required, role-based access with a full audit trail, encryption in transit and at rest, and documented, open APIs. A full security overview is coming soon — ask us directly in the meantime."
    />
  );
}

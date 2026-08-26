import type { Metadata } from "next";
import { StubPage } from "@/components/StubPage";

export const metadata: Metadata = { title: "Privacy Policy — Emita" };

export default function PrivacyPage() {
  return (
    <StubPage
      kicker="Legal / Privacy"
      title="Privacy Policy"
      body="Our full privacy policy is being finalised ahead of launch. For questions about how Emita handles data today, contact us directly and we'll respond within one working day."
    />
  );
}

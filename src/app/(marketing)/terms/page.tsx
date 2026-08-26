import type { Metadata } from "next";
import { StubPage } from "@/components/StubPage";

export const metadata: Metadata = { title: "Terms of Service — Emita" };

export default function TermsPage() {
  return (
    <StubPage
      kicker="Legal / Terms"
      title="Terms of Service"
      body="Our terms of service are being finalised ahead of launch. For questions in the meantime, contact us directly and we'll respond within one working day."
    />
  );
}

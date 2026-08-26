import type { Metadata } from "next";
import { StubPage } from "@/components/StubPage";

export const metadata: Metadata = { title: "Leadership — Emita" };

export default function LeadershipPage() {
  return (
    <StubPage
      kicker="Company / Leadership"
      title="The team behind Emita."
      body="Leadership profiles are coming soon. If you'd like to speak with the team in the meantime, request a demo and we'll get you in touch with the right person."
    />
  );
}

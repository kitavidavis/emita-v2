import type { Metadata } from "next";
import { StubPage } from "@/components/StubPage";

export const metadata: Metadata = { title: "Careers — Emita" };

export default function CareersPage() {
  return (
    <StubPage
      kicker="Company / Careers"
      title="Help utilities run on evidence, not anecdote."
      body="Open roles aren't listed yet. Check back soon, or reach out directly if you'd like to introduce yourself ahead of time."
    />
  );
}

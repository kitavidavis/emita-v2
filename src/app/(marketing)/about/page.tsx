import type { Metadata } from "next";
import { StubPage } from "@/components/StubPage";

export const metadata: Metadata = { title: "About — Emita" };

export default function AboutPage() {
  return (
    <StubPage
      kicker="Company / About"
      title="Building the intelligence layer for African utilities."
      body="Emita connects the physical world of utility infrastructure to the digital intelligence needed to operate it. More on our story is coming soon — in the meantime, get in touch and we'll walk you through it directly."
    />
  );
}

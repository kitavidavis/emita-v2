import type { Metadata } from "next";
import { StubPage } from "@/components/StubPage";

export const metadata: Metadata = { title: "Partners — Emita" };

export default function PartnersPage() {
  return (
    <StubPage
      kicker="Company / Partners"
      title="Partner with Emita."
      body="Our partner programme is being finalised. If you integrate with metering, GIS, billing or field systems and want to explore working together, get in touch."
    />
  );
}

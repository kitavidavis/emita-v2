import type { Metadata } from "next";
import Link from "next/link";
import s from "@/styles/detail.module.css";
import { Reveal } from "@/components/Reveal";
import { ClosingCta } from "@/components/ClosingCta";
import { AnomalyChart } from "@/components/illustrations/AnomalyChart";

export const metadata: Metadata = {
  title: "Emita Intelligence — Emita",
  description: "Emita Intelligence reads the connected estate continuously and tells operations teams what changed, where, and whether it matters.",
};

const capabilities = [
  { title: "Anomaly detection", body: "Deviations from a zone's own normal behaviour, not a fixed threshold." },
  { title: "Consumption intelligence", body: "Usage patterns by customer class, zone and season." },
  { title: "Demand forecasting", body: "Expected draw ahead of time, so supply planning has a baseline." },
  { title: "Leakage indicators", body: "Night-flow and balance signals that point to a physical loss." },
  { title: "Revenue risk detection", body: "Accounts and clusters whose billed volume stops tracking their usage." },
  { title: "Device anomaly detection", body: "Meters that stop reporting, drift, or report the impossible." },
  { title: "Infrastructure performance", body: "Pressure, flow and pump behaviour read against the network model." },
  { title: "Pattern discovery", body: "Recurring behaviour across zones that no single dashboard would show." },
];

export default function IntelligencePage() {
  return (
    <main>
      <section className={`${s.section} ${s.deep}`}>
        <div className={s.sectionPad}>
          <div className={s.kickerLight}>Platform / Emita Intelligence</div>
          <h1 className={s.h1Light} style={{ maxWidth: "16ch" }}>Turn utility data into decisions.</h1>
          <p className={s.bodyLargeLight}>
            Emita Intelligence reads the connected estate continuously — every meter, sensor and system — and tells operations teams what changed, where, and whether it matters.
          </p>
          <Link href="/demo" className="btn" style={{ background: "var(--color-bg)", color: "var(--color-text)", padding: "15px 26px", fontSize: 15 }}>
            See it on your data
          </Link>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionPad}>
          <Reveal><h2 className={s.h2}>Capabilities</h2></Reveal>
          <Reveal>
            <div className={s.capGrid}>
              {capabilities.map((c) => (
                <div key={c.title} className={s.capCell}>
                  <h4>{c.title}</h4>
                  <p>{c.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className={`${s.section} ${s.surface}`}>
        <div className={`${s.sectionPad} ${s.chartSplit}`}>
          <Reveal>
            <h2 style={{ fontSize: 40, letterSpacing: "-0.03em", margin: "0 0 16px" }}>An anomaly, in context</h2>
            <p style={{ fontSize: 16, color: "var(--color-neutral-800)" }}>
              Night flow in DMA 04 held steady for eleven weeks, then stepped up and stayed there. Emita flags the step, holds the evidence alongside it, and places it on the network.
            </p>
          </Reveal>
          <Reveal>
            <AnomalyChart />
          </Reveal>
        </div>
      </section>

      <ClosingCta />
    </main>
  );
}

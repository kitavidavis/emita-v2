import type { Metadata } from "next";
import s from "@/styles/detail.module.css";
import { Reveal } from "@/components/Reveal";
import { ClosingCta } from "@/components/ClosingCta";

export const metadata: Metadata = {
  title: "Customers — Emita",
  description: "Emita is working with Busia Water on a proof of concept exploring how connected infrastructure and data intelligence can support improved utility operations.",
};

const moreStories = [
  { title: "From monthly paper reads to a daily record" },
  { title: "Locating loss in a network that had only aggregate figures" },
  { title: "Bringing billing, GIS and field work onto one record" },
];

export default function CustomersPage() {
  return (
    <main>
      <section className={s.section}>
        <div className={s.heroPad}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 26 }}>
            <span className={s.kicker} style={{ margin: 0 }}>Customers / Busia Water</span>
            <span className="tag tag-outline">Proof of concept</span>
          </div>
          <div style={{ width: 150, height: 44, background: "var(--color-neutral-300)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, letterSpacing: "0.12em", color: "var(--color-neutral-600)", marginBottom: 30 }}>
            LOGO
          </div>
          <h1 className={s.h1} style={{ maxWidth: "20ch" }}>Building the next generation of utility intelligence.</h1>
          <p className={s.bodyLarge} style={{ margin: 0 }}>
            Emita is working with Busia Water on a proof of concept exploring how connected infrastructure and data intelligence can support improved utility operations.
          </p>
        </div>
      </section>

      <section className={`${s.section} ${s.surface}`}>
        <div className={s.sectionPad}>
          <div className={s.infoThree}>
            <Reveal>
              <div className={s.infoThreeItem}>
                <div className={s.infoLabel}>The challenge</div>
                <p className={s.infoBody}>Operational data sat across separate systems and manual records, which made it difficult to build a single, current picture of the network.</p>
              </div>
            </Reveal>
            <Reveal>
              <div className={s.infoThreeItem}>
                <div className={s.infoLabel}>The Emita approach</div>
                <p className={s.infoBody}>Connect a defined set of metering and operational sources, resolve them against one model of the zones, and put the result in front of the operations team.</p>
              </div>
            </Reveal>
            <Reveal>
              <div className={s.infoThreeItem}>
                <div className={s.infoLabelAccent}>Where it stands</div>
                <p className={s.infoBody}>The proof of concept is underway. Findings will be published here once they have been reviewed with the utility.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionPad}>
          <Reveal><h2 className={s.h2} style={{ marginBottom: 36 }}>More customer stories</h2></Reveal>
          <Reveal>
            <div className={s.relatedGrid} style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
              {moreStories.map((story) => (
                <div key={story.title} className={s.tile} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ width: 100, height: 28, background: "var(--color-neutral-300)" }} />
                  <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 18, lineHeight: 1.2 }}>{story.title}</div>
                  <span className="btn btn-ghost" style={{ paddingLeft: 0 }}>Read the story →</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <ClosingCta />
    </main>
  );
}

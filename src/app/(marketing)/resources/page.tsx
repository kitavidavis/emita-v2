import type { Metadata } from "next";
import Link from "next/link";
import s from "@/styles/detail.module.css";
import { Reveal } from "@/components/Reveal";
import { ClosingCta } from "@/components/ClosingCta";
import { ReportBars } from "@/components/illustrations/AnomalyChart";

export const metadata: Metadata = {
  title: "Resources — Emita",
  description: "Ideas shaping the future of utility operations.",
};

const cards = [
  { tag: "Insight", title: "Why smart metering alone is not enough", body: "Reads are input, not insight. What has to sit above the meter.", meta: "6 min read →" },
  { tag: "Insight", title: "How GIS can transform NRW management", body: "A loss figure with a location behind it changes what crews do.", meta: "8 min read →" },
  { tag: "Case study", title: "Connecting infrastructure to intelligence", body: "What it takes to get from scattered systems to one record.", meta: "Case study →", href: "/customers" },
  { tag: "Research", title: "The future of data-driven utilities", body: "Where operational intelligence is heading over the next decade.", meta: "Research →" },
  { tag: "Webinar", title: "Reading night flow: a working session", body: "Forty minutes on what the overnight curve is telling you.", meta: "Watch →" },
  { tag: "Insight", title: "Estimated bills are a data problem", body: "Estimation compounds quietly until the register no longer matches reality.", meta: "5 min read →" },
];

export default function ResourcesPage() {
  return (
    <main>
      <section className={s.section}>
        <div className={s.heroPad} style={{ paddingBottom: 56 }}>
          <div className={s.kicker} style={{ marginBottom: 22 }}>Resources</div>
          <h1 className={s.h1} style={{ maxWidth: "20ch", marginBottom: 30 }}>Ideas shaping the future of utility operations.</h1>
          <div className={s.tagsRow}>
            <span className="tag tag-accent" style={{ padding: "7px 14px", fontSize: 12 }}>All</span>
            <span className="tag tag-neutral" style={{ padding: "7px 14px", fontSize: 12 }}>Reports</span>
            <span className="tag tag-neutral" style={{ padding: "7px 14px", fontSize: 12 }}>Insights</span>
            <span className="tag tag-neutral" style={{ padding: "7px 14px", fontSize: 12 }}>Research</span>
            <span className="tag tag-neutral" style={{ padding: "7px 14px", fontSize: 12 }}>Case studies</span>
            <span className="tag tag-neutral" style={{ padding: "7px 14px", fontSize: 12 }}>Webinars</span>
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.container}>
          <Link href="/resources" className={s.featured}>
            <div>
              <span style={{ fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-accent)" }}>Report — Featured</span>
              <h2 style={{ fontSize: "clamp(28px,4vw,46px)", letterSpacing: "-0.03em", margin: "14px 0 16px" }}>The State of Utility Intelligence in Africa</h2>
              <p style={{ fontSize: 16, color: "var(--color-neutral-800)", maxWidth: "56ch" }}>
                Where utilities are on metering, data and analytics — what has been deployed, what is working, and what the next five years require.
              </p>
              <span className="btn btn-secondary" style={{ padding: "13px 22px", marginTop: 12, display: "inline-flex" }}>Download the report</span>
            </div>
            <div className={s.featuredVisual}>
              <ReportBars />
            </div>
          </Link>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionPad} style={{ padding: "64px 40px 88px" }}>
          <Reveal>
            <div className={s.cardGrid3}>
              {cards.map((c) => (
                <Link key={c.title} href={c.href ?? "/resources"} className={s.cardTile}>
                  <span className={s.cardTag}>{c.tag}</span>
                  <span className={s.cardTitle}>{c.title}</span>
                  <span className={s.cardBody}>{c.body}</span>
                  <span className={s.cardMeta}>{c.meta}</span>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <ClosingCta />
    </main>
  );
}

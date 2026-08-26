import Link from "next/link";
import styles from "./page.module.css";
import { Reveal } from "@/components/Reveal";
import { NetworkSchematic } from "@/components/illustrations/NetworkSchematic";
import { GisMap } from "@/components/illustrations/GisMap";
import { ConsolePreview } from "@/components/ConsolePreview";
import { CapabilityPicker } from "@/components/CapabilityPicker";
import { FaqAccordion } from "@/components/FaqAccordion";

const partnerLogos = [
  { name: "NIMBUS CLOUD", weight: 800, tracking: "0.02em" },
  { name: "Zuria Telecom", weight: 700, tracking: "-0.01em" },
  { name: "HEXTRONICS", weight: 600, tracking: "0.08em" },
  { name: "vantra", weight: 800, tracking: "-0.02em" },
  { name: "MERIDIAN GROUP", weight: 700, tracking: "0.04em" },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className={styles.section}>
        <div className={`${styles.container} ${styles.hero}`}>
          <div className={styles.heroLeft}>
            <Reveal style={{ marginBottom: 0 }}>
              <div className={styles.eyebrow}>
                <span className={styles.eyebrowBar} />
                <span className={styles.eyebrowText}>The Emita Platform</span>
              </div>
              <h1 className={styles.heroTitle}>Intelligence for every utility decision.</h1>
              <p className={styles.heroBody}>
                Emita connects infrastructure, unifies operational data and turns complex utility environments into clear, actionable intelligence.
              </p>
              <div className={styles.heroCtas}>
                <Link href="/demo" className="btn btn-primary" style={{ padding: "15px 26px", fontSize: 15 }}>Request a Demo</Link>
                <Link href="/platform" className="btn btn-secondary" style={{ padding: "15px 26px", fontSize: 15 }}>Explore the Platform</Link>
              </div>
              <div className={styles.heroStats}>
                <div className={styles.heroStat}>
                  <div className={styles.heroStatTitle}>Meters & sensors</div>
                  <div className={styles.heroStatBody}>Connected at the edge</div>
                </div>
                <div className={styles.heroStat}>
                  <div className={styles.heroStatTitle}>Operational systems</div>
                  <div className={styles.heroStatBody}>Billing, GIS, ERP, field</div>
                </div>
                <div className={styles.heroStat}>
                  <div className={styles.heroStatTitle}>One intelligence layer</div>
                  <div className={styles.heroStatBody}>Context, not fragments</div>
                </div>
              </div>
            </Reveal>
          </div>
          <div className={styles.heroRight}>
            <NetworkSchematic />
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className={styles.section}>
        <div className={styles.logos}>
          <Reveal>
            <div className={styles.logosLabel}>Powering the digital transformation of utility operations.</div>
          </Reveal>
          <Reveal style={{ flex: 1 }}>
            <div className={styles.logosGrid}>
              {partnerLogos.map((p) => (
                <div key={p.name} className={styles.logoBox} style={{ fontWeight: p.weight, letterSpacing: p.tracking }}>{p.name}</div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Understand / Predict / Act */}
      <section className={styles.section}>
        <div className={styles.containerPad}>
          <Reveal><h2 className={styles.stepsTitle}>Understand. Predict. Act.</h2></Reveal>
          <div className={styles.stepsGrid}>
            <Reveal>
              <div className={styles.step}>
                <div className={styles.stepNum}>01</div>
                <h3 className={styles.stepTitle}>Understand your infrastructure</h3>
                <p className={styles.stepBody}>Connect meters, sensors, systems and operational data to build a complete view of the utility as it actually runs.</p>
              </div>
            </Reveal>
            <Reveal>
              <div className={styles.step}>
                <div className={styles.stepNum}>02</div>
                <h3 className={styles.stepTitle}>Predict what needs attention</h3>
                <p className={styles.stepBody}>Detect anomalies, identify emerging risks and uncover patterns across zones, assets and consumption.</p>
              </div>
            </Reveal>
            <Reveal>
              <div className={styles.step}>
                <div className={styles.stepNum}>03</div>
                <h3 className={styles.stepTitle}>Act with confidence</h3>
                <p className={styles.stepBody}>Turn intelligence into prioritized actions that improve operations, reduce losses and protect revenue.</p>
              </div>
            </Reveal>
          </div>
          <Reveal style={{ marginTop: 44 }}>
            <Link href="/platform" className="btn btn-secondary" style={{ padding: "14px 24px" }}>Explore the Emita Platform</Link>
          </Reveal>
        </div>
      </section>

      {/* Console preview */}
      <section className={`${styles.section} ${styles.deep}`}>
        <div className={styles.containerPad}>
          <Reveal>
            <div className={styles.consoleHead}>
              <div>
                <div className={styles.consoleKicker}>Inside the product</div>
                <h2 className={styles.consoleTitle}>The console your operations team opens each morning.</h2>
              </div>
              <p className={styles.consoleNote}>Illustrative interface. Figures shown are representative, not customer data.</p>
            </div>
          </Reveal>
          <Reveal>
            <ConsolePreview />
          </Reveal>
        </div>
      </section>

      {/* Capability picker */}
      <section className={styles.section}>
        <div className={styles.containerPad}>
          <Reveal>
            <div className={styles.capHead}>
              <h2 className={styles.capTitle}>One platform for every layer of utility intelligence.</h2>
              <p className={styles.capNote}>Select a capability to see what it covers. Every one of them reads from the same connected data foundation.</p>
            </div>
          </Reveal>
          <Reveal>
            <CapabilityPicker />
          </Reveal>
        </div>
      </section>

      {/* Platform / Spatial split */}
      <section className={styles.section}>
        <div className={styles.split}>
          <div className={styles.splitLeft}>
            <div className={styles.splitKicker}>Emita Data Platform</div>
            <h2 className={styles.splitTitle}>Understand all your utility data in context.</h2>
            <p className={styles.splitBody}>
              Utility data becomes more valuable when it is connected. Emita brings together infrastructure, operational, spatial and consumption data so teams can understand not only what is happening, but where, when and in what context.
            </p>
            <div className={styles.splitList}>
              <div className={styles.splitListRow}><span className={styles.splitListNum}>01</span><span>Time-series readings held at full resolution</span></div>
              <div className={styles.splitListRow}><span className={styles.splitListNum}>02</span><span>Assets, zones and accounts resolved to one model</span></div>
              <div className={styles.splitListRow} style={{ borderBottom: 0 }}><span className={styles.splitListNum}>03</span><span>Queries that cross systems without an export</span></div>
            </div>
          </div>
          <div className={styles.splitRight}>
            <div className={styles.splitKicker}>Spatial Intelligence</div>
            <h2 className={styles.splitTitle}>See your data where it matters.</h2>
            <p className={styles.splitBody}>
              Infrastructure is physical, and operational intelligence should be too. Emita combines operational data with spatial intelligence so utilities can read their networks, zones and assets geographically.
            </p>
            <div style={{ margin: "28px 0 24px" }}>
              <GisMap />
            </div>
            <Link href="/products/gis-intelligence" className="btn btn-secondary" style={{ padding: "13px 22px" }}>Explore GIS Intelligence</Link>
          </div>
        </div>
      </section>

      {/* Integrations marquee */}
      <section className={styles.section}>
        <div style={{ maxWidth: "var(--content-max)", margin: "0 auto", padding: "80px 0" }}>
          <Reveal>
            <div className={styles.integHead}>
              <h2 className={styles.integTitle}>Integrate with the infrastructure and technologies you rely on.</h2>
              <Link href="/platform" className="btn btn-secondary" style={{ padding: "13px 22px", flex: "none" }}>Explore Integrations</Link>
            </div>
          </Reveal>
          <div className={styles.marqueeWrap}>
            <div className={styles.marqueeTrack}>
              {[...integrations, ...integrations].map((label, i) => (
                <span key={i} className={styles.marqueeItem}>
                  <span className={styles.marqueeDot} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className={styles.section}>
        <div className={styles.containerPad}>
          <Reveal><h2 className={styles.outcomesTitle}>Act on intelligence, not assumptions.</h2></Reveal>
          <Reveal>
            <div className={styles.outcomesGrid}>
              <div className={styles.outcome}><h4>Reduce losses</h4><p>Clearer visibility into operational patterns and the areas that warrant investigation.</p></div>
              <div className={styles.outcome}><h4>Protect revenue</h4><p>Understand the anomalies and operational risks that affect what gets billed.</p></div>
              <div className={styles.outcome}><h4>Improve efficiency</h4><p>Less time spent collecting, reconciling and interpreting operational information.</p></div>
              <div className={styles.outcome}><h4>Respond faster</h4><p>Teams get the intelligence they need to prioritize action in the field.</p></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Customer spotlight */}
      <section className={styles.section}>
        <div className={styles.containerPad}>
          <Reveal>
            <div className={styles.customerHead}>
              <h2>Utilities delivering impact where it matters.</h2>
              <p>See how utilities are using Emita to connect infrastructure, improve visibility and make better operational decisions.</p>
            </div>
          </Reveal>
          <Reveal>
            <div className={styles.customerGrid}>
              <div className={styles.customerCard}>
                <div className={styles.customerLogo}>LOGO</div>
                <div><div className={styles.customerLabel}>The challenge</div><div className={styles.customerText}>Meter data arrived monthly, on paper, and never matched the billing record.</div></div>
                <div><div className={styles.customerLabel}>The Emita solution</div><div className={styles.customerText}>Smart Metering and Revenue Intelligence on one connected data foundation.</div></div>
                <div><div className={styles.customerLabelAccent}>The outcome</div><div className={styles.customerText}>Reads land daily and exceptions are worked the same week.</div></div>
                <Link href="/customers" className="btn btn-ghost" style={{ paddingLeft: 0, marginTop: "auto" }}>Read the story →</Link>
              </div>
              <div className={styles.customerCard}>
                <div className={styles.customerLogo}>LOGO</div>
                <div><div className={styles.customerLabel}>The challenge</div><div className={styles.customerText}>Losses were known in aggregate but could not be located in the network.</div></div>
                <div><div className={styles.customerLabel}>The Emita solution</div><div className={styles.customerText}>NRW Intelligence with zone-level balance and GIS context.</div></div>
                <div><div className={styles.customerLabelAccent}>The outcome</div><div className={styles.customerText}>Investigations start from a ranked list of zones instead of a hunch.</div></div>
                <Link href="/customers" className="btn btn-ghost" style={{ paddingLeft: 0, marginTop: "auto" }}>Read the story →</Link>
              </div>
              <div className={styles.customerCard}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className={styles.customerLogo}>LOGO</span>
                  <span className="tag tag-outline">PoC</span>
                </div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 20, letterSpacing: "-0.02em" }}>Busia Water</div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 16, lineHeight: 1.25 }}>Building the next generation of utility intelligence.</div>
                <p style={{ fontSize: 14.5, color: "var(--color-neutral-800)", margin: 0 }}>Emita is working with Busia Water on a proof of concept exploring how connected infrastructure and data intelligence can support improved utility operations.</p>
                <Link href="/customers" className="btn btn-ghost" style={{ paddingLeft: 0, marginTop: "auto" }}>Follow the PoC →</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Resources */}
      <section className={styles.section}>
        <div className={styles.containerPad}>
          <Reveal>
            <div className={styles.resHead}>
              <h2 className={styles.resTitle}>Ideas shaping the future of utility operations.</h2>
              <Link href="/resources" className="btn btn-secondary" style={{ padding: "13px 22px", flex: "none" }}>All resources</Link>
            </div>
          </Reveal>
          <Reveal>
            <div className={styles.resGrid}>
              <Link href="/resources" className={styles.resCard}><span className={styles.resKicker}>Report</span><span className={styles.resCardTitle}>The State of Utility Intelligence in Africa</span><span className={styles.resRead}>Read →</span></Link>
              <Link href="/resources" className={styles.resCard}><span className={styles.resKicker}>Insight</span><span className={styles.resCardTitle}>Why smart metering alone is not enough</span><span className={styles.resRead}>Read →</span></Link>
              <Link href="/resources" className={styles.resCard}><span className={styles.resKicker}>Insight</span><span className={styles.resCardTitle}>How GIS can transform NRW management</span><span className={styles.resRead}>Read →</span></Link>
              <Link href="/customers" className={styles.resCard}><span className={styles.resKicker}>Case study</span><span className={styles.resCardTitle}>Connecting infrastructure to intelligence</span><span className={styles.resRead}>Read →</span></Link>
              <Link href="/resources" className={styles.resCard}><span className={styles.resKicker}>Research</span><span className={styles.resCardTitle}>The future of data-driven utilities</span><span className={styles.resRead}>Read →</span></Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Emita Intelligence CTA */}
      <section className={`${styles.section} ${styles.deep}`}>
        <div className={styles.containerPad} style={{ padding: "100px 40px" }}>
          <div className={styles.intelSplit}>
            <Reveal>
              <div className={styles.intelKicker}>Emita Intelligence</div>
              <h2 className={styles.intelTitle}>Turn utility data into decisions.</h2>
              <p className={styles.intelBody}>
                Emita Intelligence analyzes connected infrastructure and operational data to identify patterns, detect anomalies and surface the insights that tell utility teams what needs attention.
              </p>
              <Link href="/platform/intelligence" className="btn" style={{ background: "var(--color-bg)", color: "var(--color-text)", padding: "15px 26px", fontSize: 15 }}>
                Explore Emita Intelligence
              </Link>
            </Reveal>
            <Reveal>
              <div className={styles.capsGrid}>
                {[
                  "Anomaly detection", "Consumption intelligence", "Demand forecasting", "Leakage indicators",
                  "Revenue risk detection", "Device anomaly detection", "Infrastructure performance", "Pattern discovery",
                ].map((c) => (
                  <div key={c} className={styles.capsCell}>{c}</div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Testimonial + FAQ */}
      <section className={styles.section}>
        <div className={styles.containerPad}>
          <div className={styles.testiSplit}>
            <Reveal>
              <div className={styles.testiKicker}>In their words</div>
              <blockquote className={styles.quote}>
                &ldquo;We knew roughly how much water we were losing. What we could not do was point at a zone and say start here. That is the part that changed.&rdquo;
              </blockquote>
              <div className={styles.quoteBy}>
                <span className={styles.avatar} />
                <span style={{ fontSize: 13.5, lineHeight: 1.4 }}>
                  <strong style={{ display: "block" }}>Head of Operations</strong>
                  <span style={{ color: "var(--color-neutral-700)" }}>Regional water utility · East Africa</span>
                </span>
              </div>
            </Reveal>
            <Reveal>
              <div className={styles.faqKicker}>Common questions</div>
              <FaqAccordion />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Compliance strip */}
      <section className={styles.section}>
        <div className={styles.containerPad} style={{ padding: "72px 40px" }}>
          <Reveal>
            <div className={styles.compliance}>
              <div className={styles.complianceHead}>Built for utility-grade operations</div>
              <div className={styles.complianceItem}><div className={styles.complianceTitle}>Data residency</div><div className={styles.complianceBody}>Hosted in your region, or on-premise where required.</div></div>
              <div className={styles.complianceItem}><div className={styles.complianceTitle}>Role-based access</div><div className={styles.complianceBody}>SSO, granular permissions and a full audit trail.</div></div>
              <div className={styles.complianceItem}><div className={styles.complianceTitle}>Encryption</div><div className={styles.complianceBody}>In transit and at rest, key management included.</div></div>
              <div className={styles.complianceItem}><div className={styles.complianceTitle}>Open APIs</div><div className={styles.complianceBody}>Documented endpoints for every system of record.</div></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCta}>
        <div className={styles.containerPad} style={{ padding: "110px 40px" }}>
          <Reveal>
            <h2 className={styles.finalTitle}>Ready to understand your utility differently?</h2>
            <p className={styles.finalBody}>Connect your infrastructure, unlock your data and turn insight into action.</p>
            <div className={styles.finalCtas}>
              <Link href="/demo" className="btn" style={{ background: "var(--color-bg)", color: "var(--color-text)", padding: "16px 28px", fontSize: 15 }}>Request a Demo</Link>
              <Link href="/demo" className="btn" style={{ border: "1px solid rgba(255,255,255,0.6)", color: "var(--color-bg)", padding: "16px 28px", fontSize: 15 }}>Talk to an Expert</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

const integrations = [
  "Meter manufacturers", "LoRaWAN & NB-IoT", "Cloud platforms", "GIS technologies",
  "Billing & CIS", "ERP systems", "Databases", "Messaging platforms", "Open APIs",
];

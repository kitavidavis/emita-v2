import type { Metadata } from "next";
import Link from "next/link";
import s from "@/styles/detail.module.css";
import { Reveal } from "@/components/Reveal";
import { ClosingCta } from "@/components/ClosingCta";

export const metadata: Metadata = {
  title: "Platform — Emita",
  description: "Emita connects the physical world of utility infrastructure to the digital intelligence needed to operate it.",
};

const includes = [
  { title: "Emita Intelligence", body: "Anomaly detection, forecasting and pattern discovery across the connected estate.", href: "/platform/intelligence" },
  { title: "Data Platform", body: "Full-resolution time series, one asset model and cross-system queries without exports.", href: "/platform" },
  { title: "GIS & Spatial", body: "Zones, assets and readings on the map they belong to.", href: "/products/gis-intelligence" },
  { title: "Integrations", body: "Meter vendors, network technologies, cloud, enterprise systems and open APIs.", href: "/platform" },
  { title: "Security & Architecture", body: "Deployment models, access control and the operational record of who saw what.", href: "/security" },
];

export default function PlatformPage() {
  return (
    <main>
      <section className={s.section}>
        <div className={s.heroPad}>
          <div className={s.kicker}>Platform / Overview</div>
          <h1 className={s.h1} style={{ maxWidth: "18ch" }}>The platform beneath every Emita capability.</h1>
          <p className={s.bodyLarge}>
            Emita connects the physical world of utility infrastructure to the digital intelligence needed to operate it. One data foundation, one model of the network, one place to act.
          </p>
          <Link href="/demo" className="btn btn-primary" style={{ padding: "15px 26px", fontSize: 15 }}>Request a Demo</Link>
        </div>
      </section>

      <section className={`${s.section} ${s.surface}`}>
        <div className={s.sectionPad}>
          <Reveal><h2 className={s.h2}>Platform architecture</h2></Reveal>
          <Reveal>
            <div className={s.tileGrid} style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
              <div className={s.tile}>
                <div className={s.tileEyebrow}>LAYER 01</div>
                <h3 className={s.tileTitle}>Connect</h3>
                <p className={s.tileBody}>Meters, flow and pressure sensors, IoT devices, GIS, billing, ERP and operational sources — ingested continuously.</p>
              </div>
              <div className={s.tile}>
                <div className={s.tileEyebrow}>LAYER 02</div>
                <h3 className={s.tileTitle}>Understand</h3>
                <p className={s.tileBody}>Readings, assets, zones and accounts resolved against one model, so context travels with the data.</p>
              </div>
              <div className={s.tile}>
                <div className={s.tileEyebrow}>LAYER 03</div>
                <h3 className={s.tileTitle}>Act</h3>
                <p className={s.tileBody}>Anomalies ranked, risks prioritised and work routed to the teams who can resolve it.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionPad}>
          <Reveal><h2 className={s.h2}>What the platform includes</h2></Reveal>
          <Reveal>
            <div className={s.arrowList}>
              {includes.map((item) => (
                <Link key={item.title} href={item.href} className={s.arrowRow}>
                  <span className={s.arrowRowTitle}>{item.title}</span>
                  <span className={s.arrowRowBody}>{item.body}</span>
                  <span className={s.arrowRowIcon}>→</span>
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

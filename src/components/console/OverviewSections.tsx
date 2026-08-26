"use client";

import Link from "next/link";
import styles from "./console.module.css";
import {
  ICONS,
  NRW_ALERT,
  SHORTCUT_CARDS,
  TREND_MONTHS,
  CATEGORY_SERIES,
  CATEGORY_BY_ZONE,
  HIGHEST_NRW_ZONE,
  NRW_TREND,
  REVENUE_SUMMARY,
  REVENUE_SERIES,
  REVENUE_BY_ZONE,
  EXPLAINER_CARDS,
  type IconKey,
  type Series,
  type Tone,
} from "@/lib/content/console";

function toneVar(t: Tone) {
  return `var(--d-${t === "ink" ? "ink" : t})`;
}

// Every "imported" cluster below sits under one of these — a small icon chip,
// an uppercase kicker naming the zone, a title, and (optionally) the one or
// two numbers worth leading with, so a reader orients before the charts load.
export function SectionHeader({
  icon, kicker, title, stats, first,
}: { icon: IconKey; kicker: string; title: string; stats?: { label: string; value: string }[]; first?: boolean }) {
  return (
    <div className={`${styles.sectionHead} ${first ? styles.sectionHeadFirst : ""}`}>
      <div className={styles.sectionHeadMain}>
        <span className={styles.sectionIcon}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="var(--d-ink-2)" strokeWidth="1.6">
            <path d={ICONS[icon]} />
          </svg>
        </span>
        <div className={styles.sectionText}>
          <div className={styles.sectionKicker}>{kicker}</div>
          <div className={styles.sectionTitle}>{title}</div>
        </div>
      </div>
      {stats && stats.length > 0 && (
        <div className={styles.sectionStats}>
          {stats.map((s) => (
            <span key={s.label} className={styles.sectionStat}><strong>{s.value}</strong>{s.label}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// Shared trend-chart primitive: a single series gets an area wash (no legend
// needed — the title already names it); 2-3 series get plain lines with a
// legend and direct end-labels via end-dots, never a dual axis.
function TrendChart({ months, series, height = 200 }: { months: string[]; series: Series[]; height?: number }) {
  const w = 700, h = height;
  const padL = 8, padR = 8, padT = 10, padB = 24;
  const plotW = w - padL - padR, plotH = h - padT - padB;
  const n = months.length;
  const max = Math.max(...series.flatMap((s) => s.points)) * 1.15;
  const x = (i: number) => padL + (i / (n - 1)) * plotW;
  const y = (v: number) => padT + plotH - (v / max) * plotH;
  const linePath = (pts: number[]) => pts.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join("");
  const single = series.length === 1;

  return (
    <div>
      {series.length > 1 && (
        <div style={{ display: "flex", gap: 15, fontSize: 11.5, color: "var(--d-ink-2)", marginBottom: 8 }}>
          {series.map((s) => (
            <span key={s.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 14, height: 2, background: toneVar(s.tone) }} />
              {s.label}
            </span>
          ))}
        </div>
      )}
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "auto" }}>
        <g stroke="var(--d-ink)" strokeWidth="1" opacity="0.12">
          {[0, 0.25, 0.5, 0.75, 1].map((f) => {
            const yy = padT + plotH * f;
            return <path key={f} d={`M${padL} ${yy}H${w - padR}`} />;
          })}
        </g>
        {single && (
          <path d={`${linePath(series[0].points)} L${x(n - 1)} ${padT + plotH} L${x(0)} ${padT + plotH} Z`} fill={toneVar(series[0].tone)} opacity={0.1} />
        )}
        {series.map((s) => (
          <path key={s.key} d={linePath(s.points)} fill="none" stroke={toneVar(s.tone)} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {series.map((s) => {
          const last = s.points.length - 1;
          return (
            <g key={`${s.key}-end`}>
              <title>{`${s.label}: ${s.points[last]}`}</title>
              <circle cx={x(last)} cy={y(s.points[last])} r={5} fill="var(--d-panel)" />
              <circle cx={x(last)} cy={y(s.points[last])} r={3} fill={toneVar(s.tone)} />
            </g>
          );
        })}
        <g fontFamily="Space Grotesk, sans-serif" fontSize="10" fill="var(--d-ink-3)">
          {months.map((m, i) => (i % 2 === 0 ? <text key={m} x={x(i)} y={h - 6} textAnchor="middle">{m}</text> : null))}
        </g>
      </svg>
    </div>
  );
}

function NrwAlertLine() {
  return (
    <div className={styles.alertBanner}>
      <span className={styles.alertBody}>{NRW_ALERT.body}</span>
      <Link href={NRW_ALERT.href} className={styles.alertCta}>{NRW_ALERT.cta} →</Link>
    </div>
  );
}

const NRW_BY_ZONE: { name: string; pct: string; status: string; tone: Tone }[] = [
  { name: "Elugulu North", pct: "44%", status: "Critical", tone: "bad" },
  { name: "Bwaliro Central", pct: "31%", status: "Critical", tone: "bad" },
  { name: "Market", pct: "28%", status: "Review", tone: "warn" },
  { name: "Elugulu South", pct: "19%", status: "Review", tone: "warn" },
  { name: "Riverside", pct: "14%", status: "Healthy", tone: "ok" },
  { name: "Sio Port road", pct: "8%", status: "Healthy", tone: "ok" },
];

// Network & supply — alert, supply/consumption, and NRW trend all live under
// one heading; the "highest NRW zone" figure that used to be its own panel is
// now just the number this whole section leads with.
export function NetworkSupplySection({ trend }: { trend: { sup: string; con: string; supplied: string; consumed: string; balance: string }; children?: never }) {
  const z = HIGHEST_NRW_ZONE;
  return (
    <>
      <SectionHeader
        icon="supply"
        kicker="Network & supply"
        title="Where the water is going"
        stats={[{ label: `highest NRW zone · ${z.zone}`, value: z.totalNrw }]}
      />
      <NrwAlertLine />

      <div className={styles.twoCol}>
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <div className={styles.panelTitle}>Supply and consumption trend</div>
              <div style={{ fontSize: 12, color: "var(--d-ink-3)", marginTop: 2 }}>Twelve months · cubic metres</div>
            </div>
            <div style={{ display: "flex", gap: 15, fontSize: 11.5, color: "var(--d-ink-2)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 14, height: 2, background: "var(--d-cyan)" }} />Supplied</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 14, height: 2, background: "var(--d-accent)" }} />Consumed</span>
            </div>
          </div>
          <div style={{ padding: "16px 18px" }}>
            <svg viewBox="0 0 700 200" style={{ width: "100%", height: "auto" }}>
              <g stroke="var(--d-ink)" strokeWidth="1" opacity="0.12">
                <path d="M40 30H690M40 70H690M40 110H690M40 150H690M40 184H690" />
              </g>
              <path d={`${trend.sup} L690 184 L40 184 Z`} fill="rgba(47,128,237,0.18)" />
              <path d={trend.sup} fill="none" stroke="var(--d-cyan)" strokeWidth="2.5" />
              <path d={trend.con} fill="none" stroke="var(--d-accent)" strokeWidth="2.5" />
              <g fontFamily="Space Grotesk, sans-serif" fontSize="10" fill="var(--d-ink-3)" letterSpacing="0.6">
                <text x="40" y="198">AUG</text><text x="148" y="198">OCT</text><text x="256" y="198">DEC</text>
                <text x="364" y="198">FEB</text><text x="472" y="198">APR</text><text x="580" y="198">JUN</text>
              </g>
            </svg>
          </div>
          <div style={{ borderTop: "1px solid var(--d-line)", padding: "11px 18px", display: "flex", gap: 22, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "var(--d-ink-2)" }}>Supplied <strong style={{ fontFamily: "var(--font-heading)", fontSize: 13, color: "var(--d-ink)" }}>{trend.supplied}</strong></span>
            <span style={{ fontSize: 12, color: "var(--d-ink-2)" }}>Consumed <strong style={{ fontFamily: "var(--font-heading)", fontSize: 13, color: "var(--d-ink)" }}>{trend.consumed}</strong></span>
            <span style={{ fontSize: 12, color: "var(--d-ink-2)" }}>Balance <strong style={{ fontFamily: "var(--font-heading)", fontSize: 13, color: "var(--d-warn)" }}>{trend.balance}</strong></span>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <div className={styles.panelTitle}>Non-revenue water by zone</div>
          </div>
          <div className={styles.tableWrap} style={{ border: 0 }}>
            <table className={`${styles.dTable} ${styles.dTableCompact}`}>
              <thead><tr><th>Zone</th><th>Unaccounted</th><th>Status</th></tr></thead>
              <tbody>
                {NRW_BY_ZONE.map((zn) => (
                  <tr key={zn.name}>
                    <td style={{ color: "var(--d-ink)", fontWeight: 600 }}>{zn.name}</td>
                    <td className={styles.mono} style={{ color: toneVar(zn.tone) }}>{zn.pct}</td>
                    <td><span className={styles.statusPill} style={{ color: toneVar(zn.tone) }}>{zn.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <div>
            <div className={styles.panelTitle}>Non-revenue water trend</div>
            <div style={{ fontSize: 12, color: "var(--d-ink-3)", marginTop: 2 }}>Twelve months · % of supply unaccounted · {z.zone} peaked at {z.totalNrw} ({z.priorTrend})</div>
          </div>
        </div>
        <div style={{ padding: "16px 18px" }}>
          <TrendChart months={TREND_MONTHS} series={NRW_TREND} height={140} />
        </div>
      </div>
    </>
  );
}

export function ShortcutCards() {
  return (
    <>
      <SectionHeader icon="task" kicker="Quick actions" title="Jump into setup" />
      <div className={styles.cardGrid3}>
        {SHORTCUT_CARDS.map((c) => (
          <div key={c.title} className={`${styles.actionCard} ${styles.actionCardRow}`}>
            <span className={styles.actionIcon}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--d-ink-2)" strokeWidth="1.6">
                <path d={ICONS[c.icon]} />
              </svg>
            </span>
            <span style={{ minWidth: 0, flex: 1 }}>
              <span className={styles.actionTitle} style={{ display: "block" }}>{c.title}</span>
              <Link href={c.href} className={styles.actionCta}>{c.cta} →</Link>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

export function CategoryConsumptionSection() {
  return (
    <>
      <SectionHeader icon="users" kicker="Customers & consumption" title="Who is using it" />
      <div className={styles.twoCol}>
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <div className={styles.panelTitle}>Consumption by customer category</div>
              <div style={{ fontSize: 12, color: "var(--d-ink-3)", marginTop: 2 }}>Twelve months · thousand m³</div>
            </div>
          </div>
          <div style={{ padding: "16px 18px" }}>
            <TrendChart months={TREND_MONTHS} series={CATEGORY_SERIES} height={170} />
          </div>
        </div>
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <div className={styles.panelTitle}>By category and zone</div>
          </div>
          <div className={styles.tableWrap} style={{ border: 0 }}>
            <table className={`${styles.dTable} ${styles.dTableCompact}`}>
              <thead>
                <tr><th>Zone</th><th>Domestic (m³)</th><th>Public (m³)</th><th>Kiosks (m³)</th></tr>
              </thead>
              <tbody>
                {CATEGORY_BY_ZONE.map((z) => (
                  <tr key={z.zone}>
                    <td style={{ color: "var(--d-ink)", fontWeight: 600 }}>{z.zone}</td>
                    <td className={styles.mono}>{z.domestic}</td>
                    <td className={styles.mono}>{z.public}</td>
                    <td className={styles.mono}>{z.kiosks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export function RevenueTrendSection() {
  const r = REVENUE_SUMMARY;
  return (
    <>
      <SectionHeader
        icon="cash"
        kicker="Revenue"
        title="What's been billed and collected"
        stats={[
          { label: "expected", value: r.expected },
          { label: "received", value: r.received },
          { label: "efficiency", value: r.efficiency },
        ]}
      />
      <div className={styles.twoCol}>
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <div className={styles.panelTitle}>Revenue trend</div>
              <div style={{ fontSize: 12, color: "var(--d-ink-3)", marginTop: 2 }}>Twelve months · KSh thousands</div>
            </div>
          </div>
          <div style={{ padding: "16px 18px" }}>
            <TrendChart months={TREND_MONTHS} series={REVENUE_SERIES} height={170} />
          </div>
        </div>
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <div className={styles.panelTitle}>Revenue by zone</div>
          </div>
          <div className={styles.tableWrap} style={{ border: 0 }}>
            <table className={`${styles.dTable} ${styles.dTableCompact}`}>
              <thead><tr><th>Zone</th><th>Gross (KSh)</th><th>Net (KSh)</th><th>Efficiency</th></tr></thead>
              <tbody>
                {REVENUE_BY_ZONE.map((z) => (
                  <tr key={z.zone}>
                    <td style={{ color: "var(--d-ink)", fontWeight: 600 }}>{z.zone}</td>
                    <td className={styles.mono}>{z.gross}</td>
                    <td className={styles.mono}>{z.net}</td>
                    <td className={styles.mono}>{z.efficiency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export function ExplainerCards() {
  return (
    <>
      <SectionHeader icon="support" kicker="Resources" title="Learn more" />
      <div className={styles.cardGrid3}>
        {EXPLAINER_CARDS.map((c) => (
          <div key={c.title} className={styles.actionCard}>
            <span className={styles.actionKicker}>{c.title}</span>
            <div className={styles.actionQuestion} style={{ fontSize: 12.5 }}>{c.question}</div>
            <Link href={c.href} className={styles.actionCta}>{c.cta} →</Link>
          </div>
        ))}
      </div>
    </>
  );
}

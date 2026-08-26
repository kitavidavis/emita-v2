"use client";

import { useState } from "react";
import styles from "./console.module.css";
import {
  ICONS,
  SETUP_ADVISORY,
  ACCOUNT_PANEL,
  SUMMARY_TILES,
  RANGES,
  TREND_BY_RANGE,
  buildMetrics,
  ATTENTION_ITEMS,
  ACTIVITY_FEED,
  type Tone,
} from "@/lib/content/console";
import {
  SectionHeader,
  ShortcutCards,
  NetworkSupplySection,
  CategoryConsumptionSection,
  RevenueTrendSection,
  ExplainerCards,
} from "./OverviewSections";

function toneVar(t: Tone) {
  return `var(--d-${t === "ink" ? "ink" : t})`;
}

export function OverviewView() {
  const [range, setRange] = useState(1);
  const [advisoryOpen, setAdvisoryOpen] = useState(true);

  const advisory = SETUP_ADVISORY;
  const trend = TREND_BY_RANGE[range];
  const metrics = buildMetrics(trend);

  return (
    <>
      {advisoryOpen && (
        <div className={styles.advisory}>
          <div className={styles.advisoryLeft}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 14 }}>
              <span style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--d-ink-3)" }}>{advisory.title}</span>
              <button type="button" onClick={() => setAdvisoryOpen(false)} aria-label="Dismiss" className={styles.dismissBtn}>×</button>
            </div>
            <div className={styles.stepBars}>
              {advisory.steps.map((s, i) => (
                <span key={i} className={styles.stepBar} style={{ background: s.done ? "var(--d-ok)" : s.current ? "var(--d-accent)" : "var(--d-line)" }} />
              ))}
            </div>
            {advisory.steps.map((s) => (
              <div key={s.title} className={styles.stepRow}>
                <span className={styles.stepMark} style={{ borderColor: s.done ? "var(--d-ok)" : "var(--d-line-2)", background: s.done ? "var(--d-ok)" : "transparent" }}>
                  {s.done ? "✓" : ""}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: s.done ? "var(--d-ink-3)" : "var(--d-ink)" }}>{s.title}</span>
                  <span style={{ display: "block", fontSize: 12, color: "var(--d-ink-3)", marginTop: 2 }}>{s.note}</span>
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: s.muted ? "var(--d-mut)" : s.current ? "var(--d-accent)" : "var(--d-mut)", flex: "none" }}>{s.action}</span>
              </div>
            ))}
          </div>
          <div className={styles.advisoryRight}>
            <span style={{ fontSize: 12, color: "var(--d-ink-3)" }}>{ACCOUNT_PANEL.note}</span>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 19, lineHeight: 1.25, color: "var(--d-ink)" }}>{ACCOUNT_PANEL.headline}</div>
            <div style={{ display: "grid", gap: 7 }}>
              {ACCOUNT_PANEL.rows.map((r) => (
                <span key={r.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--d-ink-2)", borderBottom: "1px solid var(--d-line)", paddingBottom: 6 }}>
                  <span>{r.label}</span>
                  <span style={{ fontFamily: "ui-monospace, Menlo, monospace", color: toneVar(r.tone) }}>{r.value}</span>
                </span>
              ))}
            </div>
            <div style={{ marginTop: "auto", display: "flex", gap: 9, flexWrap: "wrap" }}>
              <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} style={{ padding: "11px 18px", fontSize: 12.5 }}>
                {ACCOUNT_PANEL.primary}
              </button>
              <button type="button" className={styles.dBtn} style={{ padding: "11px 18px", fontSize: 12.5 }}>{ACCOUNT_PANEL.secondary}</button>
            </div>
          </div>
        </div>
      )}

      <SectionHeader icon="home" kicker="At a glance" title="This month, in numbers" first />

      <div className={styles.statGrid4}>
        {SUMMARY_TILES.map((s) => (
          <div key={s.label} className={styles.statCell}>
            <div className={styles.statLabelRow}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke={toneVar(s.tone)} strokeWidth="1.8">
                <path d={ICONS[s.icon]} />
              </svg>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
            <div className={styles.statValueRow}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statUnit}>{s.unit}</span>
            </div>
            <div className={styles.statNote}>{s.note}</div>
          </div>
        ))}
      </div>

      <div className={styles.filterRow}>
        <span style={{ fontSize: 12, color: "var(--d-ink-3)" }}>Analytics window</span>
        <div className={styles.rangeGroup}>
          {RANGES.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setRange(i)}
              className={`${styles.rangeBtn} ${range === i ? styles.rangeBtnActive : ""}`}
            >
              {label}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 12, color: "var(--d-ink-3)", marginLeft: 8 }}>Month to date</span>
        <span style={{ border: "1px solid var(--d-line)", background: "var(--d-panel)", fontSize: 12.5, padding: "8px 12px" }}>July 2026</span>
        <span style={{ marginLeft: "auto", display: "flex", gap: 9 }}>
          <button type="button" className={styles.dBtn}>Download reports</button>
          <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`}>Run billing</button>
        </span>
      </div>

      <div className={styles.metricGrid}>
        {metrics.map((m) => (
          <div key={m.label} className={styles.metricCard}>
            <div className={styles.metricTop}>
              <span className={styles.metricLabel}>{m.label}</span>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="var(--d-ink-3)" strokeWidth="1.6" style={{ flex: "none" }}>
                <path d={ICONS[m.icon]} />
              </svg>
            </div>
            <div className={styles.metricBottom}>
              <span className={styles.metricValue}>{m.value}</span>
            </div>
            <div className={styles.metricFoot}>
              <span className={styles.metricDelta}>{m.delta}</span>
              <span className={styles.metricNote}>{m.note}</span>
            </div>
          </div>
        ))}
      </div>

      <NetworkSupplySection trend={trend} />

      <ShortcutCards />

      <CategoryConsumptionSection />

      <RevenueTrendSection />

      <SectionHeader icon="alert" kicker="Today" title="What needs you" />

      <div className={styles.twoColEven}>
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <span className={styles.panelTitle}>Needs your attention</span>
            <button type="button" className={styles.dBtn} style={{ border: 0, padding: 0, background: "transparent", color: "var(--d-accent)", fontWeight: 600, fontSize: 12 }}>All tasks →</button>
          </div>
          {ATTENTION_ITEMS.map((a) => (
            <div key={a.title} className={styles.listRow}>
              <span className={styles.attentionBar} style={{ background: toneVar(a.tone) }} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--d-ink)" }}>{a.title}</span>
                <span style={{ display: "block", fontSize: 11.5, color: "var(--d-ink-3)", marginTop: 2 }}>{a.meta}</span>
              </span>
              <span className={styles.attentionTag} style={{ color: toneVar(a.tone) }}>{a.tag}</span>
            </div>
          ))}
        </div>
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <span className={styles.panelTitle}>Recent activity</span>
          </div>
          {ACTIVITY_FEED.map((a, i) => (
            <div key={i} className={styles.activityRow}>
              <span className={styles.activityWhen}>{a.when}</span>
              <span className={styles.activityWhat}>{a.what}</span>
            </div>
          ))}
        </div>
      </div>

      <ExplainerCards />
    </>
  );
}

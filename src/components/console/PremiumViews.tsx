"use client";

import { useState } from "react";
import styles from "./console.module.css";
import {
  ZONE_FILTERS,
  ZONE_ROWS,
  CASE_COLUMNS,
  NET_LAYERS,
  MAP_SELECTED_ZONE,
  REVENUE_ROWS,
  REVENUE_STATS,
  CONNECTORS,
  type Tone,
} from "@/lib/content/console";

function toneVar(t: Tone) {
  return `var(--d-${t === "ink" ? "ink" : t})`;
}

export function ZonesView() {
  const [filter, setFilter] = useState(0);
  const wanted = filter === 0 ? null : ZONE_FILTERS[filter];
  const rows = wanted ? ZONE_ROWS.filter((z) => z.status === wanted) : ZONE_ROWS;

  return (
    <>
      <div className={styles.filterRow}>
        {ZONE_FILTERS.map((f, i) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(i)}
            className={`${styles.filterBtn} ${filter === i ? styles.filterBtnActive : ""}`}
          >
            {f}
          </button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--d-ink-3)" }}>Flow balance recomputed 04:05 EAT</span>
      </div>
      <div className={styles.tableWrap}>
        <table className={`${styles.dTable} ${styles.dTableCompact}`}>
          <thead>
            <tr>
              <th>Zone</th><th>Supplied</th><th>Measured</th><th>Unaccounted</th><th>Night flow</th><th>Meters</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((z) => (
              <tr key={z.name}>
                <td><strong style={{ fontWeight: 600, fontSize: 13, color: "var(--d-ink)" }}>{z.name}</strong><span style={{ display: "block", fontSize: 11.5, color: "var(--d-ink-3)", marginTop: 2 }}>{z.source}</span></td>
                <td className={styles.mono}>{z.supplied}</td>
                <td className={styles.mono}>{z.measured}</td>
                <td>
                  <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 70, height: 7, background: "var(--d-chip)", flex: "none" }}>
                      <span style={{ display: "block", height: 7, width: z.pct === "—" ? "0%" : z.pct, background: toneVar(z.tone) }} />
                    </span>
                    <span className={styles.mono}>{z.pct}</span>
                  </span>
                </td>
                <td className={styles.mono}>{z.night}</td>
                <td className={styles.mono}>{z.meters}</td>
                <td><span className={styles.statusPill} style={{ color: toneVar(z.tone) }}>{z.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function InvestigationsView() {
  return (
    <div className={styles.kanban}>
      {CASE_COLUMNS.map((col) => (
        <div key={col.name} className={styles.kanbanCol}>
          <div className={styles.kanbanColHead}>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13.5, color: "var(--d-ink)" }}>{col.name}</span>
            <span className={styles.mono} style={{ color: "var(--d-ink-3)" }}>{col.cards.length}</span>
          </div>
          {col.cards.map((c) => (
            <div key={c.id} className={styles.kanbanCard}>
              <div className={styles.kanbanCardHead}>
                <span className={styles.mono} style={{ color: "var(--d-ink-3)" }}>{c.id}</span>
                <span className={styles.statusPill} style={{ fontSize: 10.5, padding: "1px 6px", color: toneVar(c.tone) }}>{c.level}</span>
              </div>
              <div className={styles.kanbanCardTitle}>{c.title}</div>
              <div className={styles.kanbanCardMeta}>{c.meta}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function NetworkMapView() {
  return (
    <div className={styles.panel} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 260px" }}>
      <div style={{ borderRight: "1px solid var(--d-line)" }}>
        <svg viewBox="0 0 900 540" style={{ width: "100%", height: "auto", display: "block", background: "var(--d-panel-2)" }}>
          <g stroke="var(--d-ink)" strokeWidth="1" opacity="0.1">
            <path d="M0 90H900M0 180H900M0 270H900M0 360H900M0 450H900" />
            <path d="M100 0V540M200 0V540M300 0V540M400 0V540M500 0V540M600 0V540M700 0V540M800 0V540" />
          </g>
          <path d="M280 60H620V300H280Z" fill="var(--d-accent)" opacity="0.1" />
          <path d="M280 60H620V300H280Z" fill="none" stroke="var(--d-accent)" strokeWidth="2" />
          <g stroke="var(--d-ink)" strokeWidth="2.5" fill="none" opacity="0.8">
            <path d="M60 480L200 370L360 390L480 210L700 240L850 130" />
            <path d="M200 370L240 130" /><path d="M360 390L400 510" /><path d="M480 210L600 450L820 480" />
          </g>
          <g fill="var(--d-cyan)"><circle cx="200" cy="370" r="6" /><circle cx="360" cy="390" r="6" /><circle cx="700" cy="240" r="6" /><circle cx="600" cy="450" r="6" /><circle cx="240" cy="130" r="6" /></g>
          <circle cx="480" cy="210" r="11" fill="var(--d-bad)" />
          <g fontFamily="Space Grotesk, sans-serif" fontSize="11" letterSpacing="1" fill="var(--d-ink-2)">
            <text x="286" y="52">ELUGULU NORTH — 44% UNACCOUNTED</text>
            <text x="500" y="204">LEAK CANDIDATE</text>
            <text x="712" y="234">BOREHOLE 2</text>
            <text x="246" y="124">TANK A</text>
          </g>
        </svg>
      </div>
      <div>
        <div style={{ padding: "15px 18px", borderBottom: "1px solid var(--d-line)", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, color: "var(--d-ink)" }}>Layers</div>
        {NET_LAYERS.map((l) => (
          <div key={l.name} style={{ display: "flex", alignItems: "center", gap: 11, padding: "12px 18px", borderBottom: "1px solid var(--d-line)", fontSize: 13 }}>
            <span style={{ width: 15, height: 15, border: `1.5px solid ${l.on ? "var(--d-accent)" : "var(--d-line-2)"}`, background: l.on ? "var(--d-accent)" : "transparent", color: "#fff", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
              {l.on ? "✓" : ""}
            </span>
            <span style={{ flex: 1, color: "var(--d-ink)" }}>{l.name}</span>
            <span className={styles.mono} style={{ color: "var(--d-ink-3)" }}>{l.count}</span>
          </div>
        ))}
        <div style={{ padding: "16px 18px" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--d-ink-3)", marginBottom: 9 }}>Selected</div>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, marginBottom: 6, color: "var(--d-ink)" }}>{MAP_SELECTED_ZONE.name}</div>
          <div style={{ fontSize: 12.5, color: "var(--d-ink-2)", marginBottom: 14 }}>{MAP_SELECTED_ZONE.note}</div>
          <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} style={{ width: "100%" }}>Open investigation</button>
        </div>
      </div>
    </div>
  );
}

export function RevenueView() {
  return (
    <>
      <div className={styles.twoCol} style={{ gridTemplateColumns: "minmax(0,1.35fr) minmax(0,1fr)" }}>
        <div className={styles.panel}>
          <div className={styles.panelHead}><span className={styles.panelTitle}>Billed against measured consumption</span></div>
          <div style={{ padding: 18 }}>
            <svg viewBox="0 0 700 240" style={{ width: "100%", height: "auto" }}>
              <g stroke="var(--d-ink)" strokeWidth="1" opacity="0.12"><path d="M0 60H700M0 120H700M0 180H700" /></g>
              <g fill="var(--d-cyan)" opacity="0.75"><rect x="30" y="96" width="34" height="124" /><rect x="130" y="82" width="34" height="138" /><rect x="230" y="104" width="34" height="116" /><rect x="330" y="74" width="34" height="146" /><rect x="430" y="90" width="34" height="130" /><rect x="530" y="68" width="34" height="152" /></g>
              <g fill="var(--d-accent)"><rect x="68" y="132" width="34" height="88" /><rect x="168" y="126" width="34" height="94" /><rect x="268" y="150" width="34" height="70" /><rect x="368" y="120" width="34" height="100" /><rect x="468" y="138" width="34" height="82" /><rect x="568" y="112" width="34" height="108" /></g>
              <g fontFamily="Space Grotesk, sans-serif" fontSize="10" fill="var(--d-ink-3)"><text x="30" y="234">FEB</text><text x="130" y="234">MAR</text><text x="230" y="234">APR</text><text x="330" y="234">MAY</text><text x="430" y="234">JUN</text><text x="530" y="234">JUL</text></g>
            </svg>
            <div style={{ display: "flex", gap: 20, fontSize: 11.5, color: "var(--d-ink-2)", marginTop: 6 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 12, height: 12, background: "var(--d-cyan)", opacity: 0.75 }} />Measured</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 12, height: 12, background: "var(--d-accent)" }} />Billed</span>
            </div>
          </div>
        </div>
        <div className={styles.panel}>
          <div className={styles.panelHead}><span className={styles.panelTitle}>Revenue risk register</span></div>
          {REVENUE_ROWS.map((r) => (
            <div key={r.name} style={{ padding: "13px 18px", borderBottom: "1px solid var(--d-line)", display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--d-ink)" }}>{r.name}</span>
                <span style={{ display: "block", fontSize: 11.5, color: "var(--d-ink-3)", marginTop: 2 }}>{r.meta}</span>
              </span>
              <span className={styles.mono} style={{ color: toneVar(r.tone), flex: "none" }}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.statGrid4}>
        {REVENUE_STATS.map((s) => (
          <div key={s.label} className={styles.statCell}>
            <div className={styles.statLabel} style={{ marginBottom: 10 }}>{s.label}</div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 26, letterSpacing: "-0.02em", color: toneVar(s.tone) }}>{s.value}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export function IntegrationsView() {
  return (
    <div className={styles.connectorGrid}>
      {CONNECTORS.map((c) => (
        <div key={c.name} className={styles.connectorCard}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <span className={styles.connectorMark}>{c.mark}</span>
            <span className={styles.connectorState} style={{ color: toneVar(c.tone) }}>{c.state}</span>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15, marginBottom: 5, color: "var(--d-ink)" }}>{c.name}</div>
            <div style={{ fontSize: 12.5, color: "var(--d-ink-2)" }}>{c.note}</div>
          </div>
          <div className={styles.connectorFoot}>
            <span className={styles.mono} style={{ color: "var(--d-ink-3)" }}>{c.sync}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--d-accent)" }}>Configure</span>
          </div>
        </div>
      ))}
    </div>
  );
}

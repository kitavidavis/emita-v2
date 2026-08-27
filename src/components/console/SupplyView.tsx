"use client";

import { useMemo, useState } from "react";
import styles from "./console.module.css";
import { SUPPLY_POINTS, SUPPLY_STATS, READINGS, READING_TYPE_META } from "@/lib/content/supply";
import { type Tone } from "@/lib/content/console";

function toneVar(t: Tone) {
  return `var(--d-${t === "ink" ? "ink" : t})`;
}

export function SupplyView() {
  const [pointFilter, setPointFilter] = useState<string>("All points");
  const names = useMemo(() => ["All points", ...SUPPLY_POINTS.map((p) => p.name)], []);
  const rows = pointFilter === "All points" ? READINGS : READINGS.filter((r) => r.point === pointFilter);

  return (
    <>
      <div className={styles.statGrid4}>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Supply points</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue}>{SUPPLY_STATS.points}</span></div>
          <div className={styles.statNote}>Feeding 6 zones</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>On telemetry</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue} style={{ color: toneVar("cyan") }}>{SUPPLY_STATS.telemetry}</span></div>
          <div className={styles.statNote}>Report on their own, no task generated</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Manually read</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue}>{SUPPLY_STATS.manual}</span></div>
          <div className={styles.statNote}>Daily or twice-daily route</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Missing a zone</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue} style={{ color: toneVar("warn") }}>{SUPPLY_STATS.unzoned}</span></div>
          <div className={styles.statNote}>Blocks flow-balance for that supply</div>
        </div>
      </div>

      <div className={styles.cardGrid4}>
        {SUPPLY_POINTS.map((p) => (
          <div key={p.id} className={styles.actionCard} style={{ gap: 9 }}>
            <span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
              <span className={styles.actionTitle}>{p.name}</span>
              <span className={styles.statusPill} style={{ fontSize: 9.5, padding: "1px 5px", color: p.source === "telemetry" ? "var(--d-cyan)" : "var(--d-ink-3)" }}>
                {p.source}
              </span>
            </span>
            <span style={{ fontSize: 11.5, color: "var(--d-ink-3)" }}>{p.zone} · {p.cadence}</span>
            <span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "1px solid var(--d-line)", paddingTop: 8, marginTop: 2 }}>
              <span className={styles.mono} style={{ fontSize: 12, color: "var(--d-ink-2)" }}>{p.latestVolume}</span>
              <span className={styles.mono} style={{ fontSize: 13, fontWeight: 600, color: toneVar(p.trend) }}>{p.latestFlow}</span>
            </span>
          </div>
        ))}
      </div>

      <div className={styles.filterRow}>
        <span style={{ fontSize: 12, color: "var(--d-ink-3)" }}>Reading history</span>
        <select
          value={pointFilter}
          onChange={(e) => setPointFilter(e.target.value)}
          style={{ background: "var(--d-panel)", border: "1px solid var(--d-line)", color: "var(--d-ink)", fontFamily: "var(--font-body)", fontSize: 12.5, padding: "8px 10px" }}
        >
          {names.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        <span style={{ marginLeft: "auto" }}>
          <button type="button" className={styles.dBtn}>Export CSV</button>
        </span>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.dTable}>
          <thead>
            <tr><th>Reading</th><th>Supply point</th><th>Type</th><th>Value</th><th>Source</th><th>Evidence</th><th>Recorded</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const type = READING_TYPE_META[r.type];
              return (
                <tr key={r.id}>
                  <td className={styles.mono} style={{ color: "var(--d-ink)" }}>{r.id}</td>
                  <td style={{ color: "var(--d-ink)", fontWeight: 600 }}>{r.point}</td>
                  <td>
                    <span className={styles.statusPill} style={{ color: r.type === "cumulative_volume" ? "var(--d-accent)" : "var(--d-cyan)" }}>{type.label}</span>
                  </td>
                  <td className={styles.mono}>{r.value}</td>
                  <td style={{ color: "var(--d-ink-3)", fontSize: 12.5 }}>{r.source}</td>
                  <td>
                    {r.hasEvidence ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "var(--d-ink-2)" }}>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="var(--d-ink-3)" strokeWidth="1.6"><path d="M2 5h2l1.2-2h5.6L12 5h2v8H2z" /><circle cx="8" cy="9" r="2.4" /></svg>
                        Photo
                      </span>
                    ) : <span style={{ color: "var(--d-ink-3)" }}>—</span>}
                  </td>
                  <td style={{ color: "var(--d-ink-3)", fontSize: 12.5 }}>{r.recordedAt}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

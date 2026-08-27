"use client";

import styles from "./console.module.css";
import { ASSETS, ASSET_STATS, CONDITION_META } from "@/lib/content/assets";
import { type Tone } from "@/lib/content/console";

function toneVar(t: Tone) {
  return `var(--d-${t === "ink" ? "ink" : t})`;
}

export function AssetsView() {
  return (
    <>
      <div className={styles.statGrid3}>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Registered assets</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue}>{ASSET_STATS.total}</span></div>
          <div className={styles.statNote}>Pumps, tanks, mains and valves</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Poor or critical</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue} style={{ color: toneVar("bad") }}>{ASSET_STATS.critical}</span></div>
          <div className={styles.statNote}>Need a service visit</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Inspection overdue</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue} style={{ color: toneVar("warn") }}>{ASSET_STATS.overdue}</span></div>
          <div className={styles.statNote}>Past their review interval</div>
        </div>
      </div>

      <div className={styles.filterRow}>
        <span style={{ fontSize: 12, color: "var(--d-ink-3)" }}>Condition is set from a field visit&apos;s service record, not edited directly</span>
        <span style={{ marginLeft: "auto" }}>
          <button type="button" className={styles.dBtn}>+ Register asset</button>
        </span>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.dTable}>
          <thead>
            <tr><th>Asset</th><th>Type</th><th>Zone</th><th>Condition</th><th>Last inspected</th></tr>
          </thead>
          <tbody>
            {ASSETS.map((a) => {
              const meta = CONDITION_META[a.condition];
              return (
                <tr key={a.id}>
                  <td style={{ color: "var(--d-ink)", fontWeight: 600 }}>{a.name}</td>
                  <td style={{ color: "var(--d-ink-2)" }}>{a.type}</td>
                  <td style={{ color: "var(--d-ink-2)" }}>{a.zone}</td>
                  <td><span className={styles.statusPill} style={{ color: toneVar(meta.tone) }}>{meta.label}</span></td>
                  <td style={{ color: "var(--d-ink-3)", fontSize: 12.5 }}>{a.lastInspected}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

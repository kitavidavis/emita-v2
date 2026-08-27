"use client";

import styles from "./console.module.css";
import { INCIDENTS, INCIDENT_STATS, STATUS_META } from "@/lib/content/incidents";
import { type Tone } from "@/lib/content/console";

function toneVar(t: Tone) {
  return `var(--d-${t === "ink" ? "ink" : t})`;
}

export function IncidentsView() {
  return (
    <>
      <div className={styles.statGrid3}>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Open</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue} style={{ color: toneVar("bad") }}>{INCIDENT_STATS.open}</span></div>
          <div className={styles.statNote}>Across all zones</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Breaching response time</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue} style={{ color: toneVar("warn") }}>{INCIDENT_STATS.breaching}</span></div>
          <div className={styles.statNote}>Past target for their severity</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Resolved this month</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue}>{INCIDENT_STATS.resolvedThisMonth}</span></div>
          <div className={styles.statNote}>Median 52 minutes to close</div>
        </div>
      </div>

      <div className={styles.filterRow}>
        <span style={{ fontSize: 12, color: "var(--d-ink-3)" }}>An incident tied to a registered asset also appears on that asset&apos;s service history</span>
        <span style={{ marginLeft: "auto" }}>
          <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`}>+ Log incident</button>
        </span>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.dTable}>
          <thead>
            <tr><th>Incident</th><th>Zone</th><th>Linked asset</th><th>Status</th><th>Response time</th><th>Reported</th></tr>
          </thead>
          <tbody>
            {INCIDENTS.map((i) => {
              const meta = STATUS_META[i.status];
              return (
                <tr key={i.id}>
                  <td>
                    <span className={styles.mono} style={{ color: "var(--d-ink-3)", fontSize: 11.5, display: "block" }}>{i.id}</span>
                    <span style={{ color: "var(--d-ink)", fontWeight: 600 }}>{i.title}</span>
                  </td>
                  <td style={{ color: "var(--d-ink-2)" }}>{i.zone}</td>
                  <td style={{ color: "var(--d-ink-2)" }}>{i.linkedAsset ?? "—"}</td>
                  <td><span className={styles.statusPill} style={{ color: toneVar(meta.tone) }}>{meta.label}</span></td>
                  <td className={styles.mono} style={{ color: i.breaching ? toneVar("warn") : "var(--d-ink-2)" }}>{i.responseTime}</td>
                  <td style={{ color: "var(--d-ink-3)", fontSize: 12.5 }}>{i.reportedAt}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

"use client";

import styles from "./console.module.css";
import { REPORT_KINDS, RECENT_REPORTS } from "@/lib/content/reports";

export function ReportsView() {
  return (
    <>
      <div className={styles.cardGrid3}>
        {REPORT_KINDS.map((r) => (
          <div key={r.id} className={styles.actionCard}>
            <span className={styles.actionKicker}>{r.source}</span>
            <div className={styles.actionTitle}>{r.name}</div>
            <div className={styles.actionBody}>{r.body}</div>
            <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} style={{ alignSelf: "flex-start", padding: "7px 14px", fontSize: 12 }}>Generate</button>
          </div>
        ))}
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHead}><span className={styles.panelTitle}>Recently generated</span></div>
        <div className={styles.tableWrap} style={{ border: 0 }}>
          <table className={`${styles.dTable} ${styles.dTableCompact}`}>
            <thead><tr><th>Report</th><th>Period</th><th>Format</th><th>Generated</th><th></th></tr></thead>
            <tbody>
              {RECENT_REPORTS.map((r, i) => (
                <tr key={i}>
                  <td style={{ color: "var(--d-ink)", fontWeight: 600 }}>{r.name}</td>
                  <td style={{ color: "var(--d-ink-2)" }}>{r.period}</td>
                  <td><span className={styles.statusPill} style={{ color: "var(--d-ink-3)" }}>{r.format}</span></td>
                  <td style={{ color: "var(--d-ink-3)", fontSize: 12.5 }}>{r.generatedAt}</td>
                  <td><a href="#" style={{ color: "var(--d-accent)", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>Download</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

"use client";

import styles from "./console.module.css";
import { HELP_RESOURCES } from "@/lib/content/console";

export function SupportView() {
  return (
    <div className={styles.twoCol} style={{ gridTemplateColumns: "minmax(0,1.3fr) minmax(0,0.8fr)" }}>
      <div className={styles.panel}>
        <div className={styles.panelHead}><span className={styles.panelTitle}>Guides &amp; resources</span></div>
        {HELP_RESOURCES.map((r) => (
          <div key={r.name} className={styles.resourceItem}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 5 }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--d-ink)" }}>{r.name}</span>
              <span style={{ fontSize: 10, letterSpacing: "0.1em", color: "var(--d-ink-3)", border: "1px solid var(--d-line)", padding: "1px 6px", flex: "none" }}>{r.kind}</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--d-ink-3)", lineHeight: 1.5 }}>{r.note}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className={styles.panel}>
          <div className={styles.panelHead}><span className={styles.panelTitle}>Talk to Emita</span></div>
          <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: "var(--d-ink-2)" }}>
              Response within one business day. For an outage affecting billing or payments, call — don&apos;t wait on email.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: 12.5, color: "var(--d-ink-2)" }}>support@emita.io</span>
              <span style={{ fontSize: 12.5, color: "var(--d-ink-2)" }}>+254 20 000 0000 · weekdays 08:00–18:00 EAT</span>
            </div>
            <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} style={{ width: "100%" }}>Open a ticket</button>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHead}><span className={styles.panelTitle}>Book training</span></div>
          <div style={{ padding: "18px 20px" }}>
            <p style={{ margin: "0 0 14px", fontSize: 12.5, lineHeight: 1.55, color: "var(--d-ink-2)" }}>
              Ninety minutes with your team, tailored to your last billing cycle&apos;s actual numbers.
            </p>
            <button type="button" className={styles.dBtn} style={{ width: "100%" }}>Choose a time</button>
          </div>
        </div>
      </div>
    </div>
  );
}

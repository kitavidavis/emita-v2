"use client";

import styles from "./console.module.css";
import { ACCOUNT, LIFECYCLE_LABEL, RETENTION } from "@/lib/content/settings";

function Field({ label, value, hint, disabled }: { label: string; value: string; hint?: string; disabled?: boolean }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontSize: 11.5, color: "var(--d-ink-3)", marginBottom: 6 }}>{label}</span>
      <input
        defaultValue={value}
        disabled={disabled}
        style={{
          width: "100%", background: disabled ? "var(--d-chip)" : "var(--d-panel-2)", border: "1px solid var(--d-line)",
          color: disabled ? "var(--d-ink-3)" : "var(--d-ink)", fontFamily: "var(--font-body)", fontSize: 13, padding: "9px 12px",
        }}
      />
      {hint && <span style={{ display: "block", fontSize: 11, color: "var(--d-ink-3)", marginTop: 5 }}>{hint}</span>}
    </label>
  );
}

export function SettingsView() {
  return (
    <div className={styles.twoCol} style={{ gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className={styles.panel}>
          <div className={styles.panelHead}><span className={styles.panelTitle}>Project details</span></div>
          <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Utility name" value={ACCOUNT.name} />
            <Field label="Console URL" value={`app.emita.io/${ACCOUNT.slug}`} disabled hint="Used for customer mobile-app login — contact Emita to change." />
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }}><Field label="Country" value={ACCOUNT.defaultCountry} /></div>
              <div style={{ flex: 1 }}><Field label="Currency" value={ACCOUNT.currency} /></div>
            </div>
            <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} style={{ alignSelf: "flex-start", padding: "9px 16px" }}>Save changes</button>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHead}><span className={styles.panelTitle}>Security policy</span></div>
          <div style={{ padding: "6px 20px 8px" }}>
            <div className={styles.lockedFeature} style={{ borderTop: 0, justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "var(--d-ink)" }}>Require two-factor for all staff</span>
              <span style={{ fontSize: 12, color: "var(--d-warn)" }}>5 of 9 not enrolled</span>
            </div>
            <div className={styles.lockedFeature} style={{ justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "var(--d-ink)" }}>Session length</span>
              <span style={{ fontSize: 12, color: "var(--d-ink-3)" }}>12 hours</span>
            </div>
            <div className={styles.lockedFeature} style={{ justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "var(--d-ink)" }}>API keys issued</span>
              <span style={{ fontSize: 12, color: "var(--d-ink-3)" }}>2 active — manage in Access</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className={styles.panel}>
          <div className={styles.panelHead}><span className={styles.panelTitle}>Account status</span></div>
          <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
            <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12.5, color: "var(--d-ink-2)" }}>Access</span>
              <span className={styles.statusPill} style={{ color: "var(--d-ok)" }}>{ACCOUNT.accessStatus}</span>
            </span>
            <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12.5, color: "var(--d-ink-2)" }}>Relationship stage</span>
              <span className={styles.statusPill} style={{ color: "var(--d-accent)" }}>{LIFECYCLE_LABEL[ACCOUNT.lifecycleStage]}</span>
            </span>
            <p style={{ margin: "4px 0 0", fontSize: 11.5, lineHeight: 1.5, color: "var(--d-ink-3)" }}>
              Set by Emita, not editable here — access is suspended only for account issues like unpaid invoices, and the relationship stage reflects Emita&apos;s own records, not your usage.
            </p>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHead}><span className={styles.panelTitle}>Data retention</span></div>
          <div style={{ padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 26, color: "var(--d-ink)" }}>{RETENTION.months}</span>
              <span style={{ fontSize: 12.5, color: "var(--d-ink-3)" }}>months of history retained</span>
            </div>
            <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: "var(--d-ink-3)" }}>Since onboarding, {RETENTION.since}. Export anytime — nothing is held hostage.</p>
            <button type="button" className={styles.dBtn} style={{ marginTop: 14 }}>Export all data</button>
          </div>
        </div>
      </div>
    </div>
  );
}

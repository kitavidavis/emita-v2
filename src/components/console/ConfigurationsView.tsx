"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./console.module.css";
import {
  TEMPLATES,
  PROVIDERS,
  ZONES,
  SERVICE_FEES,
  DISCONNECTION_POLICY,
  DEFAULTING_POLICY,
  RECURRING_TASKS,
} from "@/lib/content/configurations";

const TABS = ["Notifications", "Zones & DMAs", "Other services & fees", "Automation"] as const;

function TogglePill({ on }: { on: boolean }) {
  return (
    <span className={styles.statusPill} style={{ color: on ? "var(--d-ok)" : "var(--d-ink-3)" }}>
      {on ? "On" : "Off"}
    </span>
  );
}

export function ConfigurationsView() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Notifications");

  return (
    <>
      <div className={styles.filterRow}>
        {TABS.map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`${styles.filterBtn} ${tab === t ? styles.filterBtnActive : ""}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Notifications" && (
        <div className={styles.twoCol} style={{ gridTemplateColumns: "minmax(0,1.3fr) minmax(0,0.9fr)" }}>
          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <div>
                <span className={styles.panelTitle}>Notification templates</span>
                <div style={{ fontSize: 12, color: "var(--d-ink-3)", marginTop: 2 }}>A blank row falls back to Emita&apos;s platform default for that event</div>
              </div>
            </div>
            {TEMPLATES.map((t) => (
              <div key={t.eventType} style={{ padding: "13px 20px", borderBottom: "1px solid var(--d-line)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className={styles.mono} style={{ color: "var(--d-ink)", fontSize: 12.5 }}>{t.eventType}</span>
                    <span className={styles.statusPill} style={{ fontSize: 9.5, padding: "0 5px", color: "var(--d-ink-3)" }}>{t.channel}</span>
                    {t.custom && <span className={styles.statusPill} style={{ fontSize: 9.5, padding: "0 5px", color: "var(--d-accent)" }}>Customized</span>}
                  </span>
                  <button type="button" style={{ appearance: "none", background: "transparent", border: 0, cursor: "pointer", color: "var(--d-accent)", fontSize: 12, fontWeight: 600, flex: "none" }}>Edit</button>
                </div>
                <div style={{ fontSize: 12.5, color: "var(--d-ink-2)", lineHeight: 1.5 }}>{t.body}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className={styles.panel}>
              <div className={styles.panelHead}><span className={styles.panelTitle}>Delivery providers</span></div>
              {PROVIDERS.map((p) => (
                <div key={p.channel} style={{ padding: "14px 20px", borderBottom: "1px solid var(--d-line)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <span>
                    <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--d-ink)", textTransform: "capitalize" }}>{p.channel}</span>
                    <span style={{ display: "block", fontSize: 12, color: "var(--d-ink-3)", marginTop: 2 }}>{p.provider}</span>
                  </span>
                  <span className={styles.statusPill} style={{ color: p.status === "connected" ? "var(--d-ok)" : "var(--d-warn)" }}>{p.status}</span>
                </div>
              ))}
              <div style={{ padding: "12px 20px", fontSize: 11.5, color: "var(--d-ink-3)" }}>
                Each channel picks its own provider — a utility in a different country isn&apos;t stuck with the same SMS gateway.
              </div>
            </div>

            <div className={styles.panel}>
              <div className={styles.panelHead}><span className={styles.panelTitle}>Water &amp; sewer tariffs</span></div>
              <div style={{ padding: "16px 20px" }}>
                <p style={{ margin: "0 0 12px", fontSize: 12.5, lineHeight: 1.55, color: "var(--d-ink-2)" }}>
                  Standing charges, billing methods and sewer charges aren&apos;t separate setup screens anymore — they&apos;re all components of the same tariff, computed together. Sewer, for instance, is just &quot;30% of the volume charge.&quot;
                </p>
                <Link href="/dashboard/billing" className={styles.actionCta}>Manage tariffs &amp; groups →</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "Zones & DMAs" && (
        <>
          <div className={styles.filterRow}>
            <span style={{ fontSize: 12, color: "var(--d-ink-3)" }}>Boundaries are drawn on the Network Map or captured in the field — this is naming and hierarchy only</span>
            <span style={{ marginLeft: "auto" }}>
              <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`}>+ Add zone</button>
            </span>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.dTable}>
              <thead><tr><th>Zone</th><th>DMA code</th><th>Parent zone</th><th></th></tr></thead>
              <tbody>
                {ZONES.map((z) => (
                  <tr key={z.id}>
                    <td style={{ color: "var(--d-ink)", fontWeight: 600 }}>{z.name}</td>
                    <td className={styles.mono}>{z.dmaCode}</td>
                    <td style={{ color: "var(--d-ink-3)" }}>{z.parentZone ?? "— top level —"}</td>
                    <td style={{ textAlign: "right" }}>
                      <button type="button" style={{ appearance: "none", background: "transparent", border: 0, cursor: "pointer", color: "var(--d-accent)", fontSize: 12, fontWeight: 600 }}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "Other services & fees" && (
        <>
          <div className={styles.filterRow}>
            <span style={{ fontSize: 12, color: "var(--d-ink-3)" }}>One-off charges outside the regular tariff — new connections, reconnections, deposits</span>
            <span style={{ marginLeft: "auto" }}>
              <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`}>+ Add fee</button>
            </span>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.dTable}>
              <thead><tr><th>Service</th><th>Amount</th><th>Kind</th><th></th></tr></thead>
              <tbody>
                {SERVICE_FEES.map((f) => (
                  <tr key={f.id}>
                    <td style={{ color: "var(--d-ink)", fontWeight: 600 }}>{f.name}</td>
                    <td className={styles.mono}>KSh {f.amount.toLocaleString()}</td>
                    <td><span className={styles.statusPill} style={{ color: "var(--d-ink-3)" }}>{f.kind}</span></td>
                    <td style={{ textAlign: "right" }}>
                      <button type="button" style={{ appearance: "none", background: "transparent", border: 0, cursor: "pointer", color: "var(--d-accent)", fontSize: 12, fontWeight: 600 }}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.alertBanner}>
            <span className={styles.alertBody}>
              Carried forward from the previous system&apos;s config menu — the billing engine doesn&apos;t yet have a way to attach one of these to a specific bill. Recorded here so nothing&apos;s lost; wiring it in is a backend task.
            </span>
          </div>
        </>
      )}

      {tab === "Automation" && (
        <div className={styles.twoCol} style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <span className={styles.panelTitle}>Disconnection policy</span>
                <TogglePill on={DISCONNECTION_POLICY.automated} />
              </div>
              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55, color: "var(--d-ink-2)" }}>
                  Disconnection is a manual, staff-initiated action today — there&apos;s no automated rule running yet. Shown here so the setting has a home once it exists.
                </p>
                <span style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--d-ink-2)", borderTop: "1px solid var(--d-line)", paddingTop: 10 }}>
                  <span>Overdue threshold</span><span className={styles.mono}>{DISCONNECTION_POLICY.thresholdDays} days</span>
                </span>
                <span style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--d-ink-2)" }}>
                  <span>Balance threshold</span><span className={styles.mono}>KSh {DISCONNECTION_POLICY.thresholdAmount.toLocaleString()}</span>
                </span>
              </div>
            </div>

            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <span className={styles.panelTitle}>Defaulting policy</span>
                <TogglePill on={true} />
              </div>
              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55, color: "var(--d-ink-2)" }}>
                  Applied automatically when a billing cycle closes with a balance still outstanding. The percentage below is platform-wide right now, not yet set per utility from here.
                </p>
                <span style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--d-ink-2)", borderTop: "1px solid var(--d-line)", paddingTop: 10 }}>
                  <span>Fee</span><span className={styles.mono}>{DEFAULTING_POLICY.percentage}% of balance</span>
                </span>
                <span style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--d-ink-2)" }}>
                  <span>Grace period</span><span className={styles.mono}>{DEFAULTING_POLICY.gracePeriodDays} days</span>
                </span>
              </div>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHead}><span className={styles.panelTitle}>Recurring tasks</span></div>
            {RECURRING_TASKS.map((t) => (
              <div key={t.name} style={{ padding: "13px 20px", borderBottom: "1px solid var(--d-line)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--d-ink)" }}>{t.name}</span>
                  <span style={{ display: "block", fontSize: 11.5, color: "var(--d-ink-3)", marginTop: 2 }}>{t.frequency} · next {t.nextRun}</span>
                </span>
                <TogglePill on={t.enabled} />
              </div>
            ))}
            <div style={{ padding: "12px 20px", fontSize: 11.5, color: "var(--d-ink-3)" }}>
              None of these run on a schedule yet — every cycle and task batch today is started by an explicit action, on Billing or Tasks.
            </div>
          </div>
        </div>
      )}
    </>
  );
}

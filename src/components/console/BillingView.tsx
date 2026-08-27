"use client";

import { useState } from "react";
import styles from "./console.module.css";
import {
  CYCLES,
  CYCLE_STATS,
  CYCLE_STATUS_META,
  TARIFFS,
  TARIFF_STATUS_META,
  GROUPS,
  UNMATCHED_PAYMENTS,
  INVOICES,
  INVOICE_STATUS_META,
  type ComponentType,
} from "@/lib/content/billing";
import { type Tone } from "@/lib/content/console";

function toneVar(t: Tone) {
  return `var(--d-${t === "ink" ? "ink" : t})`;
}

const COMPONENT_TONE: Record<ComponentType, Tone> = {
  fixed: "mut",
  volume: "accent",
  derived: "cyan",
  discount: "ok",
};

const TABS = ["Billing cycles", "Invoices", "Tariffs", "Customer groups"] as const;

export function BillingView() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Billing cycles");
  const [selectedTariff, setSelectedTariff] = useState(TARIFFS[0].id);
  const tariff = TARIFFS.find((t) => t.id === selectedTariff) ?? TARIFFS[0];

  return (
    <>
      <div className={styles.alertBanner}>
        <span className={styles.alertBody}>
          {UNMATCHED_PAYMENTS.count} payments worth {UNMATCHED_PAYMENTS.amount} couldn&apos;t be matched to an account this cycle. {UNMATCHED_PAYMENTS.note}
        </span>
        <a href="#" className={styles.alertCta}>Review unmatched →</a>
      </div>

      <div className={styles.filterRow}>
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`${styles.filterBtn} ${tab === t ? styles.filterBtnActive : ""}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Billing cycles" && (
        <>
          <div className={styles.statGrid4}>
            <div className={styles.statCell}>
              <div className={styles.statLabel}>Current period</div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 22, marginTop: 10, color: "var(--d-ink)" }}>{CYCLE_STATS.currentPeriod}</div>
              <div className={styles.statNote}>{CYCLE_STATS.awaitingSnapshots}</div>
            </div>
            <div className={styles.statCell}>
              <div className={styles.statLabel}>Cycles run this year</div>
              <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue}>{CYCLE_STATS.billsThisYear}</span></div>
              <div className={styles.statNote}>Every one idempotent — safe to re-run</div>
            </div>
            <div className={styles.statCell}>
              <div className={styles.statLabel}>Last cycle billed</div>
              <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue}>{CYCLES[1].bills}</span><span className={styles.statUnit}>accounts</span></div>
              <div className={styles.statNote}>{CYCLES[1].total}</div>
            </div>
            <div className={styles.statCell} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div className={styles.statLabel}>Ready to run</div>
                <div style={{ fontSize: 12.5, color: "var(--d-ink-2)", marginTop: 10, lineHeight: 1.5 }}>All consumption snapshots for August are in.</div>
              </div>
              <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} style={{ marginTop: 12, width: "100%" }}>Run August cycle</button>
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.dTable}>
              <thead>
                <tr><th>Period</th><th>Status</th><th>Bills</th><th>Total billed</th><th>Run at</th></tr>
              </thead>
              <tbody>
                {CYCLES.map((c) => {
                  const meta = CYCLE_STATUS_META[c.status];
                  return (
                    <tr key={c.id}>
                      <td style={{ color: "var(--d-ink)", fontWeight: 600 }}>{c.period}</td>
                      <td><span className={styles.statusPill} style={{ color: toneVar(meta.tone) }}>{meta.label}</span></td>
                      <td className={styles.mono}>{c.bills || "—"}</td>
                      <td className={styles.mono}>{c.total}</td>
                      <td style={{ color: "var(--d-ink-3)", fontSize: 12.5 }}>{c.runAt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "Invoices" && (
        <>
          <div className={styles.filterRow}>
            <div className={styles.searchBox} style={{ maxWidth: 280, background: "var(--d-panel)" }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="var(--d-ink-3)" strokeWidth="1.8">
                <circle cx="7" cy="7" r="4.6" /><path d="M10.4 10.4L14 14" />
              </svg>
              <input type="text" placeholder="Customer, account or invoice number" />
            </div>
            <span style={{ marginLeft: "auto" }}>
              <button type="button" className={styles.dBtn}>Export CSV</button>
            </span>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.dTable}>
              <thead><tr><th>Invoice</th><th>Customer</th><th>Period</th><th>Total</th><th>Status</th><th>Issued</th></tr></thead>
              <tbody>
                {INVOICES.map((inv) => {
                  const meta = INVOICE_STATUS_META[inv.status];
                  return (
                    <tr key={inv.id}>
                      <td className={styles.mono} style={{ color: "var(--d-ink)" }}>{inv.id}</td>
                      <td>
                        <span style={{ display: "block", color: "var(--d-ink)", fontWeight: 600 }}>{inv.customer}</span>
                        <span style={{ display: "block", fontSize: 11.5, color: "var(--d-ink-3)", marginTop: 2 }}>{inv.accountNumber}</span>
                      </td>
                      <td style={{ color: "var(--d-ink-2)" }}>{inv.period}</td>
                      <td className={styles.mono}>{inv.total}</td>
                      <td><span className={styles.statusPill} style={{ color: toneVar(meta.tone) }}>{meta.label}</span></td>
                      <td style={{ color: "var(--d-ink-3)", fontSize: 12.5 }}>{inv.issuedAt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "Tariffs" && (
        <div className={styles.twoCol} style={{ gridTemplateColumns: "minmax(0,0.9fr) minmax(0,1.3fr)" }}>
          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <span className={styles.panelTitle}>Tariffs</span>
              <button type="button" className={styles.dBtn} style={{ padding: "6px 12px", fontSize: 12 }}>+ New</button>
            </div>
            {TARIFFS.map((t) => {
              const meta = TARIFF_STATUS_META[t.status];
              const active = t.id === selectedTariff;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTariff(t.id)}
                  style={{
                    display: "block", width: "100%", textAlign: "left", appearance: "none", cursor: "pointer",
                    background: active ? "var(--d-chip)" : "transparent", border: 0,
                    borderLeft: `3px solid ${active ? "var(--d-accent)" : "transparent"}`,
                    borderBottom: "1px solid var(--d-line)", padding: "13px 18px",
                  }}
                >
                  <span style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--d-ink)" }}>{t.name}</span>
                    <span className={styles.statusPill} style={{ fontSize: 10, padding: "1px 6px", color: toneVar(meta.tone), flex: "none" }}>{meta.label}</span>
                  </span>
                  <span style={{ display: "block", fontSize: 11.5, color: "var(--d-ink-3)", marginTop: 4 }}>
                    {t.groupsUsing} group{t.groupsUsing === 1 ? "" : "s"} · effective {t.effectiveFrom}
                  </span>
                </button>
              );
            })}
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <div>
                <span className={styles.panelTitle}>{tariff.name}</span>
                <div style={{ fontSize: 12, color: "var(--d-ink-3)", marginTop: 2 }}>Computed in this order — a later component may reference an earlier one, or the running subtotal, by name</div>
              </div>
              {tariff.status === "draft" && <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} style={{ padding: "7px 14px", fontSize: 12 }}>Publish</button>}
            </div>
            <ul className={styles.tariffStepper}>
              {tariff.components.map((c) => (
                <li key={c.label} className={styles.tariffStep}>
                  <span className={styles.tariffStepDot} style={{ borderColor: toneVar(COMPONENT_TONE[c.type]) }} />
                  <div className={styles.tariffStepHead}>
                    <span className={styles.tariffStepLabel}>{c.label}</span>
                    <span className={styles.tariffStepType} style={{ color: toneVar(COMPONENT_TONE[c.type]) }}>{c.type}</span>
                  </div>
                  <div className={styles.tariffStepSummary}>{c.summary}</div>
                </li>
              ))}
            </ul>
            {tariff.status !== "draft" && (
              <div style={{ borderTop: "1px solid var(--d-line)", padding: "12px 22px", fontSize: 11.5, color: "var(--d-ink-3)" }}>
                Published tariffs are immutable — a rate change creates a new tariff and moves each affected group onto it.
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "Customer groups" && (
        <div className={styles.cardGrid3}>
          {GROUPS.map((g) => {
            const t = TARIFFS.find((x) => x.id === g.tariffId);
            return (
              <div key={g.id} className={styles.actionCard}>
                <span className={styles.actionKicker}>{g.members} customers</span>
                <div className={styles.actionTitle}>{g.name}</div>
                <div className={styles.actionBody}>
                  Billed on <strong style={{ color: "var(--d-ink)" }}>{t?.name}</strong>. Moving this group to a different tariff re-rates every member from the next cycle.
                </div>
                <a href="#" className={styles.actionCta}>Change tariff →</a>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

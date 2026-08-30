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
  INVOICE_CATEGORIES,
  PAYMENT_PIPELINES,
  type TemplateRow,
  type ProviderRow,
  type ZoneConfig,
  type ServiceFee,
  type RecurringTask,
  type InvoiceCategory,
  type InvoiceCategoryMode,
  type PaymentPipeline,
} from "@/lib/content/configurations";
import { BILLING_CYCLE_CONFIG, recentCycles, formatCyclePeriod, type BillingCycleConfig } from "@/lib/content/billingCycle";
import { EditTemplateModal } from "./configurations/EditTemplateModal";
import { ProviderModal } from "./configurations/ProviderModal";
import { ZoneModal } from "./configurations/ZoneModal";
import { FeeModal } from "./configurations/FeeModal";
import { InvoiceCategoryModal } from "./configurations/InvoiceCategoryModal";
import { PaymentPipelineModal } from "./configurations/PaymentPipelineModal";
import { ActionMenu, type MenuAction } from "./shared/ActionMenu";
import { useToast, ToastStack } from "./shared/Toast";

const TABS = ["Billing Cycle", "Notifications", "Billing Methods", "Invoice Categories", "Zones & DMAs", "Other services & fees", "Automation"] as const;

const ORDINAL = (n: number) => (n === 1 || n === 21 || n === 31 ? "st" : n === 2 || n === 22 ? "nd" : n === 3 || n === 23 ? "rd" : "th");

function TogglePill({ on, onClick }: { on: boolean; onClick?: () => void }) {
  const pill = (
    <span className={styles.statusPill} style={{ color: on ? "var(--d-ok)" : "var(--d-ink-3)" }}>
      {on ? "On" : "Off"}
    </span>
  );
  if (!onClick) return pill;
  return (
    <button type="button" onClick={onClick} style={{ appearance: "none", background: "transparent", border: 0, cursor: "pointer", padding: 0 }}>
      {pill}
    </button>
  );
}

let zoneSeq = 100;
let feeSeq = 100;
let categorySeq = 100;
let pipelineSeq = 100;

export function ConfigurationsView() {
  const { toasts, show } = useToast();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Billing Cycle");

  const [templates, setTemplates] = useState<TemplateRow[]>(TEMPLATES);
  const [providers, setProviders] = useState<ProviderRow[]>(PROVIDERS);
  const [zones, setZones] = useState<ZoneConfig[]>(ZONES);
  const [fees, setFees] = useState<ServiceFee[]>(SERVICE_FEES);
  const [disconnectionAutomated, setDisconnectionAutomated] = useState(DISCONNECTION_POLICY.automated);
  const [chargeFeeOnDisconnect, setChargeFeeOnDisconnect] = useState(DISCONNECTION_POLICY.chargeFeeOnDisconnect);
  const [recurringTasks, setRecurringTasks] = useState<RecurringTask[]>(RECURRING_TASKS);
  const [invoiceCategories, setInvoiceCategories] = useState<InvoiceCategory[]>(INVOICE_CATEGORIES);
  const [paymentPipelines, setPaymentPipelines] = useState<PaymentPipeline[]>(PAYMENT_PIPELINES);
  const [cycleConfig, setCycleConfig] = useState<BillingCycleConfig>(BILLING_CYCLE_CONFIG);
  const [cycleDraft, setCycleDraft] = useState<BillingCycleConfig>(BILLING_CYCLE_CONFIG);

  const [templateTarget, setTemplateTarget] = useState<TemplateRow | null>(null);
  const [providerTarget, setProviderTarget] = useState<ProviderRow | null>(null);
  const [zoneModalOpen, setZoneModalOpen] = useState(false);
  const [zoneTarget, setZoneTarget] = useState<ZoneConfig | null>(null);
  const [feeModalOpen, setFeeModalOpen] = useState(false);
  const [feeTarget, setFeeTarget] = useState<ServiceFee | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryTarget, setCategoryTarget] = useState<InvoiceCategory | null>(null);
  const [pipelineModalOpen, setPipelineModalOpen] = useState(false);

  const disconnectionCategory = invoiceCategories.find((c) => c.id === DISCONNECTION_POLICY.feeCategoryId);
  const previewCycle = recentCycles(cycleDraft, 1)[0];

  return (
    <>
      <div className={styles.filterRow}>
        {TABS.map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`${styles.filterBtn} ${tab === t ? styles.filterBtnActive : ""}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Billing Cycle" && (
        <div className={styles.twoCol} style={{ gridTemplateColumns: "minmax(0,0.9fr) minmax(0,1.1fr)" }}>
          <div className={styles.panel}>
            <div className={styles.panelHead}><span className={styles.panelTitle}>Cycle rule</span></div>
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
              <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55, color: "var(--d-ink-2)" }}>
                Most utilities don&apos;t read meters on the calendar month — a cycle is a rolling window that can span two months. Set it once here; every month&apos;s cycle is computed from these three numbers.
              </p>
              <label className={styles.gisField}>
                <span>Starts on (day of month)</span>
                <input type="number" min="1" max="31" value={cycleDraft.startDay} onChange={(e) => setCycleDraft((c) => ({ ...c, startDay: Number(e.target.value) }))} />
              </label>
              <label className={styles.gisField}>
                <span>Reading duration (days)</span>
                <input type="number" min="1" max="31" value={cycleDraft.durationDays} onChange={(e) => setCycleDraft((c) => ({ ...c, durationDays: Number(e.target.value) }))} />
              </label>
              <label className={styles.gisField}>
                <span>Review window (days)</span>
                <input type="number" min="0" max="14" value={cycleDraft.reviewDays} onChange={(e) => setCycleDraft((c) => ({ ...c, reviewDays: Number(e.target.value) }))} />
              </label>
              <button
                type="button"
                className={`${styles.dBtn} ${styles.dBtnPrimary}`}
                disabled={cycleDraft.startDay === cycleConfig.startDay && cycleDraft.durationDays === cycleConfig.durationDays && cycleDraft.reviewDays === cycleConfig.reviewDays}
                onClick={() => {
                  setCycleConfig(cycleDraft);
                  show("Billing cycle rule updated — future cycles use the new dates.");
                }}
              >
                Save changes
              </button>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHead}><span className={styles.panelTitle}>Preview — current cycle under this rule</span></div>
            <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
              <span style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--d-ink-2)" }}>
                <span>Reading window</span>
                <span className={styles.mono} style={{ color: "var(--d-ink)" }}>{formatCyclePeriod(previewCycle)}</span>
              </span>
              <span style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--d-ink-2)", borderTop: "1px solid var(--d-line)", paddingTop: 10 }}>
                <span>Review closes</span>
                <span className={styles.mono} style={{ color: "var(--d-ink)" }}>{previewCycle.reviewEnd.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
              </span>
              <span style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--d-ink-2)" }}>
                <span>Bills issue</span>
                <span className={styles.mono} style={{ color: "var(--d-ink)" }}>{previewCycle.billIssueDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
              </span>
              <div style={{ fontSize: 11.5, color: "var(--d-ink-3)", borderTop: "1px solid var(--d-line)", paddingTop: 10 }}>
                Starts {cycleDraft.startDay}
                {ORDINAL(cycleDraft.startDay)} of the month, reads for {cycleDraft.durationDays} days, reviews for {cycleDraft.reviewDays} more, then bills — this can and does cross into the next calendar month.
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "Notifications" && (
        <div className={styles.twoCol} style={{ gridTemplateColumns: "minmax(0,1.3fr) minmax(0,0.9fr)" }}>
          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <div>
                <span className={styles.panelTitle}>Notification templates</span>
                <div style={{ fontSize: 12, color: "var(--d-ink-3)", marginTop: 2 }}>A blank row falls back to Emita&apos;s platform default for that event</div>
              </div>
            </div>
            {templates.map((t) => (
              <div key={t.eventType} style={{ padding: "13px 20px", borderBottom: "1px solid var(--d-line)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className={styles.mono} style={{ color: "var(--d-ink)", fontSize: 12.5 }}>{t.eventType}</span>
                    <span className={styles.statusPill} style={{ fontSize: 9.5, padding: "0 5px", color: "var(--d-ink-3)" }}>{t.channel}</span>
                    {t.custom && <span className={styles.statusPill} style={{ fontSize: 9.5, padding: "0 5px", color: "var(--d-accent)" }}>Customized</span>}
                  </span>
                  <button type="button" style={{ appearance: "none", background: "transparent", border: 0, cursor: "pointer", color: "var(--d-accent)", fontSize: 12, fontWeight: 600, flex: "none" }} onClick={() => setTemplateTarget(t)}>
                    Edit
                  </button>
                </div>
                <div style={{ fontSize: 12.5, color: "var(--d-ink-2)", lineHeight: 1.5 }}>{t.body}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className={styles.panel}>
              <div className={styles.panelHead}><span className={styles.panelTitle}>Delivery providers</span></div>
              {providers.map((p) => (
                <div key={p.channel} style={{ padding: "14px 20px", borderBottom: "1px solid var(--d-line)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <span>
                    <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--d-ink)", textTransform: "capitalize" }}>{p.channel}</span>
                    <span style={{ display: "block", fontSize: 12, color: "var(--d-ink-3)", marginTop: 2 }}>{p.provider}</span>
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className={styles.statusPill} style={{ color: p.status === "connected" ? "var(--d-ok)" : "var(--d-warn)" }}>{p.status}</span>
                    <button type="button" style={{ appearance: "none", background: "transparent", border: 0, cursor: "pointer", color: "var(--d-accent)", fontSize: 12, fontWeight: 600 }} onClick={() => setProviderTarget(p)}>
                      {p.status === "connected" ? "Change" : "Configure"}
                    </button>
                  </span>
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
              <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} onClick={() => { setZoneTarget(null); setZoneModalOpen(true); }}>+ Add zone</button>
            </span>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.dTable}>
              <thead><tr><th>Zone</th><th>DMA code</th><th>Parent zone</th><th></th></tr></thead>
              <tbody>
                {zones.map((z) => (
                  <tr key={z.id}>
                    <td style={{ color: "var(--d-ink)", fontWeight: 600 }}>{z.name}</td>
                    <td className={styles.mono}>{z.dmaCode}</td>
                    <td style={{ color: "var(--d-ink-3)" }}>{z.parentZone ?? "— top level —"}</td>
                    <td style={{ textAlign: "right" }}>
                      <button type="button" style={{ appearance: "none", background: "transparent", border: 0, cursor: "pointer", color: "var(--d-accent)", fontSize: 12, fontWeight: 600 }} onClick={() => { setZoneTarget(z); setZoneModalOpen(true); }}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "Billing Methods" && (
        <>
          <div className={styles.filterRow}>
            <span style={{ fontSize: 12, color: "var(--d-ink-3)" }}>M-Pesa payment pipelines — one shortcode can cover all DMAs, or each zone can run its own</span>
            <span style={{ marginLeft: "auto" }}>
              <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} onClick={() => setPipelineModalOpen(true)}>+ New payment pipeline</button>
            </span>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.dTable}>
              <thead><tr><th>Shortcode</th><th>Type</th><th>DMA</th><th>Registered</th><th></th></tr></thead>
              <tbody>
                {paymentPipelines.map((p) => {
                  const actions: MenuAction[] = [
                    p.registered
                      ? { label: "Mark as unregistered", onSelect: () => { setPaymentPipelines((list) => list.map((x) => (x.id === p.id ? { ...x, registered: false } : x))); show(`${p.shortCode} marked unregistered.`); } }
                      : { label: "Mark as registered", onSelect: () => { setPaymentPipelines((list) => list.map((x) => (x.id === p.id ? { ...x, registered: true } : x))); show(`${p.shortCode} marked registered with Safaricom.`); } },
                    { label: "Delete pipeline", danger: true, onSelect: () => { setPaymentPipelines((list) => list.filter((x) => x.id !== p.id)); show(`${p.shortCode} removed.`); } },
                  ];
                  return (
                    <tr key={p.id}>
                      <td className={styles.mono} style={{ color: "var(--d-ink)" }}>{p.shortCode}</td>
                      <td style={{ color: "var(--d-ink-2)", textTransform: "capitalize" }}>{p.type === "paybill" ? "PayBill" : "Till (BuyGoods)"}</td>
                      <td style={{ color: "var(--d-ink-2)" }}>{p.dma}</td>
                      <td><span className={styles.statusPill} style={{ color: p.registered ? "var(--d-ok)" : "var(--d-warn)" }}>{p.registered ? "Yes" : "No"}</span></td>
                      <td style={{ textAlign: "right" }}><ActionMenu actions={actions} /></td>
                    </tr>
                  );
                })}
                {paymentPipelines.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--d-ink-3)", padding: "26px 18px" }}>No payment pipelines configured yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className={styles.alertBanner}>
            <span className={styles.alertBody}>
              The passkey saved here is what lets Emita initiate Lipa Na M-Pesa Online (STK Push) — prompting a customer&apos;s phone to pay — rather than only receiving payments they send in on their own.
            </span>
          </div>
        </>
      )}

      {tab === "Invoice Categories" && (
        <>
          <div className={styles.filterRow}>
            <span style={{ fontSize: 12, color: "var(--d-ink-3)" }}>Named, priced line items — Disconnection and Defaulting reference these instead of holding their own amounts</span>
            <span style={{ marginLeft: "auto" }}>
              <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} onClick={() => { setCategoryTarget(null); setCategoryModalOpen(true); }}>+ Add category</button>
            </span>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.dTable}>
              <thead><tr><th>Name</th><th>Mode</th><th>Amount</th><th></th></tr></thead>
              <tbody>
                {invoiceCategories.map((c) => (
                  <tr key={c.id}>
                    <td style={{ color: "var(--d-ink)", fontWeight: 600 }}>{c.name}</td>
                    <td><span className={styles.statusPill} style={{ color: c.mode === "dynamic" ? "var(--d-cyan)" : "var(--d-ink-3)" }}>{c.mode}</span></td>
                    <td className={styles.mono}>{c.amount ? `KSh ${c.amount.toLocaleString()}` : "computed at billing time"}</td>
                    <td style={{ textAlign: "right" }}>
                      <button type="button" style={{ appearance: "none", background: "transparent", border: 0, cursor: "pointer", color: "var(--d-accent)", fontSize: 12, fontWeight: 600 }} onClick={() => { setCategoryTarget(c); setCategoryModalOpen(true); }}>
                        Edit
                      </button>
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
              <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} onClick={() => { setFeeTarget(null); setFeeModalOpen(true); }}>+ Add fee</button>
            </span>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.dTable}>
              <thead><tr><th>Service</th><th>Amount</th><th>Kind</th><th></th></tr></thead>
              <tbody>
                {fees.map((f) => (
                  <tr key={f.id}>
                    <td style={{ color: "var(--d-ink)", fontWeight: 600 }}>{f.name}</td>
                    <td className={styles.mono}>KSh {f.amount.toLocaleString()}</td>
                    <td><span className={styles.statusPill} style={{ color: "var(--d-ink-3)" }}>{f.kind}</span></td>
                    <td style={{ textAlign: "right" }}>
                      <button type="button" style={{ appearance: "none", background: "transparent", border: 0, cursor: "pointer", color: "var(--d-accent)", fontSize: 12, fontWeight: 600 }} onClick={() => { setFeeTarget(f); setFeeModalOpen(true); }}>
                        Edit
                      </button>
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
                <TogglePill
                  on={disconnectionAutomated}
                  onClick={() => {
                    setDisconnectionAutomated((v) => !v);
                    show(`Automated disconnection turned ${disconnectionAutomated ? "off" : "on"}.`);
                  }}
                />
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
                <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5, color: "var(--d-ink-2)", borderTop: "1px solid var(--d-line)", paddingTop: 10 }}>
                  <span>Charge fee on disconnect</span>
                  <TogglePill on={chargeFeeOnDisconnect} onClick={() => { setChargeFeeOnDisconnect((v) => !v); show(`Charging the disconnection fee turned ${chargeFeeOnDisconnect ? "off" : "on"}.`); }} />
                </span>
                {chargeFeeOnDisconnect && (
                  <span style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--d-ink-2)" }}>
                    <span>Fee (from Invoice Categories)</span>
                    <span className={styles.mono}>{disconnectionCategory ? `${disconnectionCategory.name} — KSh ${disconnectionCategory.amount?.toLocaleString()}` : "no category linked"}</span>
                  </span>
                )}
              </div>
            </div>

            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <span className={styles.panelTitle}>Defaulting policy</span>
                <TogglePill on={true} />
              </div>
              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55, color: "var(--d-ink-2)" }}>
                  Applied automatically when a billing cycle closes with a balance still outstanding. The percentage below is platform-wide right now, not yet set per utility from here. Grace period is set per invoice category — a disconnection fee doesn&apos;t need to default on the same clock as the water bill.
                </p>
                <span style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--d-ink-2)", borderTop: "1px solid var(--d-line)", paddingTop: 10 }}>
                  <span>Fee</span><span className={styles.mono}>{DEFAULTING_POLICY.percentage}% of balance</span>
                </span>
                {DEFAULTING_POLICY.graceDaysByCategory.map((g) => {
                  const cat = invoiceCategories.find((c) => c.id === g.categoryId);
                  return (
                    <span key={g.categoryId} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--d-ink-2)" }}>
                      <span>{cat?.name ?? g.categoryId}</span><span className={styles.mono}>{g.days} days</span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHead}><span className={styles.panelTitle}>Recurring tasks</span></div>
            {recurringTasks.map((t) => (
              <div key={t.name} style={{ padding: "13px 20px", borderBottom: "1px solid var(--d-line)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--d-ink)" }}>{t.name}</span>
                  <span style={{ display: "block", fontSize: 11.5, color: "var(--d-ink-3)", marginTop: 2 }}>{t.frequency} · next {t.nextRun}</span>
                </span>
                <TogglePill
                  on={t.enabled}
                  onClick={() => {
                    setRecurringTasks((list) => list.map((x) => (x.name === t.name ? { ...x, enabled: !x.enabled } : x)));
                    show(`"${t.name}" turned ${t.enabled ? "off" : "on"}.`);
                  }}
                />
              </div>
            ))}
            <div style={{ padding: "12px 20px", fontSize: 11.5, color: "var(--d-ink-3)" }}>
              None of these run on a schedule yet — every cycle and task batch today is started by an explicit action, on Billing or Tasks.
            </div>
          </div>
        </div>
      )}

      <EditTemplateModal
        template={templateTarget}
        onClose={() => setTemplateTarget(null)}
        onSave={(body) => {
          if (!templateTarget) return;
          setTemplates((list) => list.map((t) => (t.eventType === templateTarget.eventType ? { ...t, body, custom: true } : t)));
          show(`Template for ${templateTarget.eventType} updated.`);
        }}
      />
      <ProviderModal
        provider={providerTarget}
        onClose={() => setProviderTarget(null)}
        onSave={(providerName) => {
          if (!providerTarget) return;
          setProviders((list) => list.map((p) => (p.channel === providerTarget.channel ? { ...p, provider: providerName, status: "connected" } : p)));
          show(`${providerTarget.channel.toUpperCase()} provider set to ${providerName}.`);
        }}
      />
      <ZoneModal
        open={zoneModalOpen}
        zone={zoneTarget}
        zones={zones}
        onClose={() => setZoneModalOpen(false)}
        onSave={(fields) => {
          if (zoneTarget) {
            setZones((list) => list.map((z) => (z.id === zoneTarget.id ? { ...z, ...fields } : z)));
            show(`${fields.name} updated.`);
          } else {
            setZones((list) => [...list, { id: `z-${++zoneSeq}`, ...fields }]);
            show(`${fields.name} added.`);
          }
        }}
      />
      <FeeModal
        open={feeModalOpen}
        fee={feeTarget}
        onClose={() => setFeeModalOpen(false)}
        onSave={(fields) => {
          if (feeTarget) {
            setFees((list) => list.map((f) => (f.id === feeTarget.id ? { ...f, ...fields } : f)));
            show(`${fields.name} updated.`);
          } else {
            setFees((list) => [...list, { id: `f-${++feeSeq}`, ...fields }]);
            show(`${fields.name} added.`);
          }
        }}
      />
      <InvoiceCategoryModal
        open={categoryModalOpen}
        category={categoryTarget}
        onClose={() => setCategoryModalOpen(false)}
        onSave={(fields) => {
          if (categoryTarget) {
            setInvoiceCategories((list) => list.map((c) => (c.id === categoryTarget.id ? { ...c, ...fields } : c)));
            show(`${fields.name} updated.`);
          } else {
            setInvoiceCategories((list) => [...list, { id: `cat-${++categorySeq}`, ...fields }]);
            show(`${fields.name} added.`);
          }
        }}
      />
      <PaymentPipelineModal
        open={pipelineModalOpen}
        dmaOptions={zones.map((z) => z.name)}
        onClose={() => setPipelineModalOpen(false)}
        onCreate={(fields) => {
          setPaymentPipelines((list) => [...list, { id: `pp-${++pipelineSeq}`, ...fields, registered: false }]);
          show(`Payment pipeline for shortcode ${fields.shortCode} created.`);
        }}
      />

      <ToastStack toasts={toasts} />
    </>
  );
}

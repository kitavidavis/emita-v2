"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import styles from "./console.module.css";
import {
  CUSTOMERS,
  STATUS_META,
  BILLING_TYPE_META,
  INVOICE_STATUS_META,
  CHANNEL_META,
  ALLOWED_NEXT,
  getCustomerDetail,
  type CustomerStatus,
  type Invoice,
  type Payment,
  type NotificationLogEntry,
  type NotificationChannel,
} from "@/lib/content/customers";
import { type Tone } from "@/lib/content/console";
import { NotificationPanel } from "./customers/NotificationPanel";
import { InvoiceModal } from "./customers/InvoiceModal";
import { PaymentModal } from "./customers/PaymentModal";
import { useToast, ToastStack } from "./shared/Toast";
import { downloadStatement } from "./customers/download";

// Leaflet touches `window` at import time, so it must be a client-only dynamic import.
const CustomerLocationMap = dynamic(() => import("./customers/CustomerLocationMap").then((m) => m.CustomerLocationMap), {
  ssr: false,
  loading: () => <div className={styles.leafletLoading} style={{ height: 340 }}>Loading map…</div>,
});

function toneVar(t: Tone) {
  return `var(--d-${t === "ink" ? "ink" : t})`;
}

function money(n: number) {
  return n === 0 ? "—" : `KSh ${n.toLocaleString()}`;
}

function initials(name: string) {
  const parts = name.replace(/[^A-Za-z\s]/g, "").split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

type TabKey = "overview" | "consumption" | "invoices" | "payments" | "notifications" | "location";
const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "consumption", label: "Consumption" },
  { key: "invoices", label: "Invoices" },
  { key: "payments", label: "Payments" },
  { key: "notifications", label: "Notifications" },
  { key: "location", label: "Location" },
];

export function CustomerDetailView({ customerId }: { customerId: string }) {
  const router = useRouter();
  const { toasts, show } = useToast();
  const [tab, setTab] = useState<TabKey>("overview");

  const base = CUSTOMERS.find((c) => c.id === customerId);
  const seeded = useMemo(() => (base ? getCustomerDetail(base) : null), [base]);

  const [status, setStatus] = useState<CustomerStatus | null>(base?.status ?? null);
  const [balance, setBalance] = useState(base?.balance ?? 0);
  const [invoices, setInvoices] = useState<Invoice[]>(seeded?.invoices ?? []);
  const [payments, setPayments] = useState<Payment[]>(seeded?.payments ?? []);
  const [notifications, setNotifications] = useState<NotificationLogEntry[]>(seeded?.notifications ?? []);

  const [notifOpen, setNotifOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  if (!base || !status) {
    return (
      <div className={styles.panel} style={{ padding: 24 }}>
        <p style={{ color: "var(--d-ink-2)" }}>No customer found for id "{customerId}".</p>
        <button type="button" className={styles.dBtn} onClick={() => router.push("/dashboard/customers")}>Back to customers</button>
      </div>
    );
  }

  const c = base;
  const meta = STATUS_META[status];

  const applyStatus = (next: CustomerStatus) => {
    setStatus(next);
    show(`${c.name} moved to ${STATUS_META[next].label}.`);
  };

  const sendNotification = (channel: NotificationChannel, message: string) => {
    setNotifications((n) => [
      { id: `manual-${Date.now()}`, channel, message, sentAt: "Just now", status: "delivered" },
      ...n,
    ]);
    show(`Sent via ${CHANNEL_META[channel].label} to ${c.name}.`);
    setNotifOpen(false);
  };

  const avgConsumption = seeded ? Math.round(seeded.consumption.reduce((s, r) => s + r.consumption, 0) / seeded.consumption.length) : 0;
  const totalPaidYtd = payments.reduce((s, p) => s + p.amount, 0);

  return (
    <>
      <button
        type="button"
        onClick={() => router.push("/dashboard/customers")}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: 0, cursor: "pointer", color: "var(--d-ink-3)", fontSize: 12.5, padding: 0 }}
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 3L5 8l5 5" /></svg>
        All customers
      </button>

      <div className={styles.panel}>
        <div style={{ padding: "18px 20px" }}>
          <div className={styles.profileHead}>
            <span className={styles.profileAvatar}>{initials(c.name)}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, color: "var(--d-ink)" }}>{c.name}</span>
                <span className={styles.statusPill} style={{ color: toneVar(meta.tone) }}>{meta.label}</span>
              </div>
              <span className={styles.mono} style={{ fontSize: 12.5, color: "var(--d-ink-3)" }}>{c.accountNumber} · {c.meterNumber}</span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button type="button" className={styles.dBtn} onClick={() => setNotifOpen(true)}>Send notification</button>
              <button type="button" className={styles.dBtn} onClick={() => setInvoiceOpen(true)}>Add invoice</button>
              <button type="button" className={styles.dBtn} onClick={() => setPaymentOpen(true)}>Record payment</button>
              <button type="button" className={styles.dBtn} onClick={() => downloadStatement(c, { consumption: seeded?.consumption ?? [], invoices, payments, notifications })}>
                Download statement
              </button>
              {ALLOWED_NEXT[status].map((next) => (
                <button key={next} type="button" className={styles.dBtn} onClick={() => applyStatus(next)}>
                  {next === "archived" ? "Archive" : next === "connected" ? "Reconnect" : "Disconnect"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.profileInfoGrid} style={{ borderTop: "1px solid var(--d-line)" }}>
          <div><div className={styles.profileInfoLabel}>Phone</div><div className={styles.profileInfoValue}>{c.phone}</div></div>
          <div><div className={styles.profileInfoLabel}>Email</div><div className={styles.profileInfoValue}>{c.email}</div></div>
          <div><div className={styles.profileInfoLabel}>Address</div><div className={styles.profileInfoValue}>{c.address}</div></div>
          <div><div className={styles.profileInfoLabel}>Zone / DMA</div><div className={styles.profileInfoValue}>{c.zone} / {c.dma}</div></div>
          <div><div className={styles.profileInfoLabel}>Group</div><div className={styles.profileInfoValue}>{c.group}</div></div>
          <div><div className={styles.profileInfoLabel}>Tariff</div><div className={styles.profileInfoValue}>{c.tariff}</div></div>
          <div><div className={styles.profileInfoLabel}>Billing type</div><div className={styles.profileInfoValue}>{BILLING_TYPE_META[c.billingType].label}</div></div>
          <div><div className={styles.profileInfoLabel}>Connected since</div><div className={styles.profileInfoValue}>{c.connectedSince}</div></div>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.tabRow}>
          {TABS.map((t) => (
            <button key={t.key} type="button" className={`${styles.tabBtn} ${tab === t.key ? styles.tabBtnActive : ""}`} onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <>
            <div className={styles.statGrid4}>
              <div className={styles.statCell}>
                <div className={styles.statLabel}>Balance</div>
                <div className={styles.statValueRow} style={{ marginTop: 10 }}>
                  <span className={styles.statValue} style={{ color: balance > 0 ? toneVar("warn") : "var(--d-ink)" }}>{money(balance)}</span>
                </div>
              </div>
              <div className={styles.statCell}>
                <div className={styles.statLabel}>Current reading</div>
                <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue}>{c.currentReadingValue}</span><span className={styles.statUnit}>m³</span></div>
                <div className={styles.statNote}>as of {c.lastReadingDate}</div>
              </div>
              <div className={styles.statCell}>
                <div className={styles.statLabel}>Avg. monthly use</div>
                <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue}>{avgConsumption}</span><span className={styles.statUnit}>m³</span></div>
              </div>
              <div className={styles.statCell}>
                <div className={styles.statLabel}>Paid, last 6 months</div>
                <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue} style={{ color: toneVar("ok") }}>{money(totalPaidYtd)}</span></div>
              </div>
            </div>

            <div className={styles.twoCol} style={{ padding: 18 }}>
              <div className={styles.panel}>
                <div className={styles.panelHead}><span className={styles.panelTitle}>Recent invoices</span></div>
                <div className={styles.tableWrap} style={{ border: 0 }}>
                  <table className={`${styles.dTable} ${styles.dTableCompact}`}>
                    <tbody>
                      {invoices.slice(-4).reverse().map((inv) => (
                        <tr key={inv.id}>
                          <td className={styles.mono}>{inv.number}</td>
                          <td className={styles.mono}>{money(inv.amount)}</td>
                          <td><span className={styles.statusPill} style={{ color: toneVar(INVOICE_STATUS_META[inv.status].tone) }}>{INVOICE_STATUS_META[inv.status].label}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className={styles.panel}>
                <div className={styles.panelHead}><span className={styles.panelTitle}>Recent notifications</span></div>
                <div style={{ maxHeight: 220, overflowY: "auto" }}>
                  {notifications.slice(0, 5).map((n) => (
                    <div key={n.id} className={styles.activityRow}>
                      <span className={styles.activityWhen}>{n.sentAt}</span>
                      <span className={styles.activityWhat}><strong style={{ color: "var(--d-ink)" }}>{CHANNEL_META[n.channel].label}</strong> — {n.message}</span>
                    </div>
                  ))}
                  {notifications.length === 0 && <div style={{ padding: 20, color: "var(--d-ink-3)", fontSize: 12.5 }}>No notifications sent yet.</div>}
                </div>
              </div>
            </div>
          </>
        )}

        {tab === "consumption" && (
          <>
            <div className={styles.tableWrap}>
              <table className={styles.dTable}>
                <thead><tr><th>Period</th><th>Reading</th><th>Consumption (m³)</th><th>Billed</th></tr></thead>
                <tbody>
                  {(seeded?.consumption ?? []).map((r) => (
                    <tr key={r.period}>
                      <td>{r.period}</td>
                      <td className={styles.mono}>{r.reading}</td>
                      <td className={styles.mono}>{r.consumption}</td>
                      <td className={styles.mono}>{money(r.billed)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "invoices" && (
          <>
            <div className={styles.filterRow} style={{ padding: "14px 20px 0" }}>
              <span style={{ marginLeft: "auto" }}>
                <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} onClick={() => setInvoiceOpen(true)}>+ Add invoice</button>
              </span>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.dTable}>
                <thead><tr><th>Invoice</th><th>Period</th><th>Issued</th><th>Due</th><th>Amount</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {invoices.slice().reverse().map((inv) => (
                    <tr key={inv.id}>
                      <td className={styles.mono}>{inv.number}</td>
                      <td>{inv.period}</td>
                      <td style={{ color: "var(--d-ink-3)", fontSize: 12.5 }}>{inv.issuedDate}</td>
                      <td style={{ color: "var(--d-ink-3)", fontSize: 12.5 }}>{inv.dueDate}</td>
                      <td className={styles.mono}>{money(inv.amount)}</td>
                      <td><span className={styles.statusPill} style={{ color: toneVar(INVOICE_STATUS_META[inv.status].tone) }}>{INVOICE_STATUS_META[inv.status].label}</span></td>
                      <td style={{ textAlign: "right" }}>
                        {inv.status !== "paid" && inv.status !== "void" && (
                          <button
                            type="button"
                            className={styles.dBtn}
                            onClick={() => {
                              setInvoices((list) => list.map((x) => (x.id === inv.id ? { ...x, status: "paid", paidDate: "Just now" } : x)));
                              setBalance((b) => Math.max(0, b - inv.amount));
                              show(`${inv.number} marked as paid.`);
                            }}
                          >
                            Mark paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {invoices.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--d-ink-3)", padding: 20 }}>No invoices yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "payments" && (
          <>
            <div className={styles.filterRow} style={{ padding: "14px 20px 0" }}>
              <span style={{ marginLeft: "auto" }}>
                <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} onClick={() => setPaymentOpen(true)}>+ Record payment</button>
              </span>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.dTable}>
                <thead><tr><th>Date</th><th>Method</th><th>Reference</th><th>Applied to</th><th>Amount</th></tr></thead>
                <tbody>
                  {payments.slice().reverse().map((p) => (
                    <tr key={p.id}>
                      <td style={{ color: "var(--d-ink-3)", fontSize: 12.5 }}>{p.date}</td>
                      <td>{p.method}</td>
                      <td className={styles.mono}>{p.reference}</td>
                      <td className={styles.mono}>{p.appliedTo}</td>
                      <td className={styles.mono} style={{ color: toneVar("ok") }}>{money(p.amount)}</td>
                    </tr>
                  ))}
                  {payments.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--d-ink-3)", padding: 20 }}>No payments recorded.</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "notifications" && (
          <>
            <div className={styles.filterRow} style={{ padding: "14px 20px 0" }}>
              <span style={{ marginLeft: "auto" }}>
                <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} onClick={() => setNotifOpen(true)}>Send notification</button>
              </span>
            </div>
            {notifications.map((n) => (
              <div key={n.id} className={styles.activityRow}>
                <span className={styles.activityWhen}>{n.sentAt}</span>
                <span className={styles.activityWhat}>
                  <strong style={{ color: "var(--d-ink)" }}>{CHANNEL_META[n.channel].label}</strong>
                  {n.subject && <> — <em>{n.subject}</em></>} — {n.message}
                  <span style={{ marginLeft: 8, color: n.status === "delivered" ? "var(--d-ok)" : "var(--d-bad)" }}>· {n.status}</span>
                </span>
              </div>
            ))}
            {notifications.length === 0 && <div style={{ padding: 20, color: "var(--d-ink-3)", fontSize: 12.5 }}>No notifications sent yet.</div>}
          </>
        )}

        {tab === "location" && (
          <div style={{ padding: 18 }}>
            {c.lat !== null && c.lng !== null ? (
              <CustomerLocationMap lat={c.lat} lng={c.lng} name={c.name} accountNumber={c.accountNumber} />
            ) : (
              <div className={styles.panel} style={{ padding: 28, textAlign: "center" }}>
                <p style={{ color: "var(--d-ink-2)", marginBottom: 4 }}>No mapped location for this customer.</p>
                <p style={{ color: "var(--d-ink-3)", fontSize: 12.5 }}>A field capture with GPS coordinates will populate this map automatically.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <NotificationPanel
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        recipientCount={1}
        recipientLabel="customer"
        onSend={sendNotification}
      />
      <InvoiceModal
        open={invoiceOpen}
        onClose={() => setInvoiceOpen(false)}
        onCreate={({ description, amount, dueDate }) => {
          const number = `INV-${c.accountNumber.replace("BW-", "")}-${String(invoices.length + 1).padStart(2, "0")}`;
          setInvoices((list) => [
            ...list,
            { id: `manual-${Date.now()}`, number, period: description, issuedDate: "Just now", dueDate, amount, status: "unpaid" },
          ]);
          setBalance((b) => b + amount);
          show(`Invoice "${description}" for ${money(amount)} added.`);
        }}
      />
      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        onRecord={({ amount, method, reference }) => {
          setPayments((list) => [
            ...list,
            { id: `manual-${Date.now()}`, date: "Just now", amount, method, reference, appliedTo: "Account balance" },
          ]);
          setBalance((b) => Math.max(0, b - amount));
          show(`Payment of ${money(amount)} via ${method} recorded.`);
        }}
      />

      <ToastStack toasts={toasts} />
    </>
  );
}

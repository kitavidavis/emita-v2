"use client";

import { useEffect, useState, use as usePromise } from "react";
import styles from "@/components/console/console.module.css";

type Account = {
  id: string;
  slug: string;
  name: string;
  defaultCountry: string;
  currency: string;
  accessStatus: "active" | "suspended";
  lifecycleStage: "poc" | "trial" | "active_customer" | "pivot" | "churned";
};

type Invoice = {
  id: string;
  accountId: string;
  amount: number;
  currency: string;
  description: string;
  status: "issued" | "paid" | "voided";
  dueDate: string;
  overdue: boolean;
  issuedAt: string;
  paidAt: string | null;
};

const LIFECYCLE_OPTIONS: Account["lifecycleStage"][] = ["poc", "trial", "active_customer", "pivot", "churned"];

function statusColor(invoice: Invoice) {
  if (invoice.status === "paid") return "var(--d-ok)";
  if (invoice.status === "voided") return "var(--d-mut)";
  if (invoice.overdue) return "var(--d-bad)";
  return "var(--d-warn)";
}

export default function UtilityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params);
  const [account, setAccount] = useState<Account | null>(null);
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({ amount: "", currency: "KES", description: "", dueDate: "" });

  const load = async () => {
    const [accountRes, invoicesRes] = await Promise.all([
      fetch(`/api/backoffice/accounts/${id}`),
      fetch(`/api/backoffice/accounts/${id}/invoices`),
    ]);
    if (accountRes.ok) setAccount(await accountRes.json());
    if (invoicesRes.ok) setInvoices(await invoicesRes.json());
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const updateField = async (field: string, newValue: string, reasonPrompt: string) => {
    const reason = window.prompt(reasonPrompt);
    if (reason === null) return;
    setBusy(true);
    const res = await fetch(`/api/backoffice/accounts/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field, newValue, reason: reason || undefined }),
    });
    setBusy(false);
    if (res.ok) load();
    else setError("That update did not go through.");
  };

  const createInvoice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const res = await fetch(`/api/backoffice/accounts/${id}/invoices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(invoiceForm.amount),
        currency: invoiceForm.currency.trim().toUpperCase(),
        description: invoiceForm.description,
        dueDate: invoiceForm.dueDate,
      }),
    });
    setBusy(false);
    if (res.ok) {
      setInvoiceForm({ amount: "", currency: invoiceForm.currency, description: "", dueDate: "" });
      setShowInvoiceForm(false);
      load();
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.message ?? "Could not create that invoice.");
    }
  };

  const invoiceAction = async (invoiceId: string, action: "mark-paid" | "void") => {
    setBusy(true);
    const res = await fetch(`/api/backoffice/invoices/${invoiceId}/${action}`, { method: "POST" });
    setBusy(false);
    if (res.ok) load();
    else setError("That invoice update did not go through.");
  };

  if (!account) {
    return <div style={{ color: "var(--d-ink-3)" }}>Loading…</div>;
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 19, letterSpacing: "-0.02em", color: "var(--d-ink)", fontFamily: "var(--font-heading)", fontWeight: 700 }}>
            {account.name}
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--d-ink-3)" }} className={styles.mono}>
            {account.slug} · {account.defaultCountry} · {account.currency}
          </p>
        </div>
        <span className={styles.statusPill} style={{ color: account.accessStatus === "active" ? "var(--d-ok)" : "var(--d-bad)" }}>
          {account.accessStatus}
        </span>
        <button
          type="button"
          className={styles.dBtn}
          disabled={busy}
          onClick={() =>
            updateField(
              "access_status",
              account.accessStatus === "active" ? "suspended" : "active",
              account.accessStatus === "active" ? `Reason for suspending ${account.name}?` : `Reason for reactivating ${account.name}?`
            )
          }
        >
          {account.accessStatus === "active" ? "Suspend" : "Reactivate"}
        </button>
      </div>

      {error && <div className={styles.panel} style={{ padding: 14, color: "var(--d-bad)", fontSize: 13 }}>{error}</div>}

      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <span className={styles.panelTitle}>Lifecycle stage</span>
        </div>
        <div style={{ padding: "14px 18px", display: "flex", gap: 10, flexWrap: "wrap" }}>
          {LIFECYCLE_OPTIONS.map((stage) => (
            <button
              key={stage}
              type="button"
              disabled={busy || stage === account.lifecycleStage}
              className={`${styles.filterBtn} ${stage === account.lifecycleStage ? styles.filterBtnActive : ""}`}
              onClick={() => updateField("lifecycle_stage", stage, `Reason for moving ${account.name} to "${stage}"?`)}
            >
              {stage.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <span className={styles.panelTitle}>Platform invoices</span>
          <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} onClick={() => setShowInvoiceForm((v) => !v)}>
            {showInvoiceForm ? "Cancel" : "Raise invoice"}
          </button>
        </div>

        {showInvoiceForm && (
          <form onSubmit={createInvoice} style={{ padding: "16px 18px", borderBottom: "1px solid var(--d-line)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <label className={styles.gisField}>
              <span>Amount</span>
              <input required type="number" min="0.01" step="0.01" value={invoiceForm.amount} onChange={(e) => setInvoiceForm((f) => ({ ...f, amount: e.target.value }))} />
            </label>
            <label className={styles.gisField}>
              <span>Currency</span>
              <input required pattern="[A-Za-z]{3}" maxLength={3} value={invoiceForm.currency} onChange={(e) => setInvoiceForm((f) => ({ ...f, currency: e.target.value }))} />
            </label>
            <label className={styles.gisField} style={{ gridColumn: "1 / -1" }}>
              <span>Description</span>
              <input required value={invoiceForm.description} onChange={(e) => setInvoiceForm((f) => ({ ...f, description: e.target.value }))} placeholder="Platform subscription — September 2026" />
            </label>
            <label className={styles.gisField}>
              <span>Due date</span>
              <input required type="date" value={invoiceForm.dueDate} onChange={(e) => setInvoiceForm((f) => ({ ...f, dueDate: e.target.value }))} />
            </label>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button type="submit" className={`${styles.dBtn} ${styles.dBtnPrimary}`} disabled={busy}>Create invoice</button>
            </div>
          </form>
        )}

        <div className={styles.tableWrap}>
          <table className={`${styles.dTable} ${styles.dTableCompact}`}>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Due</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {invoices === null && <tr><td colSpan={5} style={{ color: "var(--d-ink-3)" }}>Loading…</td></tr>}
              {invoices?.length === 0 && <tr><td colSpan={5} style={{ color: "var(--d-ink-3)" }}>No invoices yet.</td></tr>}
              {invoices?.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.description}</td>
                  <td className={styles.mono}>{inv.amount.toLocaleString()} {inv.currency}</td>
                  <td className={styles.mono}>{inv.dueDate}</td>
                  <td>
                    <span className={styles.statusPill} style={{ color: statusColor(inv) }}>
                      {inv.status === "issued" && inv.overdue ? "overdue" : inv.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    {inv.status === "issued" && (
                      <>
                        <button type="button" className={styles.dBtn} disabled={busy} onClick={() => invoiceAction(inv.id, "mark-paid")} style={{ marginRight: 8 }}>
                          Mark paid
                        </button>
                        <button type="button" className={styles.dBtn} disabled={busy} onClick={() => invoiceAction(inv.id, "void")}>
                          Void
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

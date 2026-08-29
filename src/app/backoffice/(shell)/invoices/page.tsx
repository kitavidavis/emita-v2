"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "@/components/console/console.module.css";

type Account = { id: string; name: string; slug: string };

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

function statusColor(invoice: Invoice) {
  if (invoice.status === "paid") return "var(--d-ok)";
  if (invoice.status === "voided") return "var(--d-mut)";
  if (invoice.overdue) return "var(--d-bad)";
  return "var(--d-warn)";
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [accounts, setAccounts] = useState<Record<string, Account>>({});
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "issued" | "overdue" | "paid" | "voided">("all");

  const load = async () => {
    const [invoicesRes, accountsRes] = await Promise.all([
      fetch("/api/backoffice/invoices"),
      fetch("/api/backoffice/accounts"),
    ]);
    if (invoicesRes.ok) setInvoices(await invoicesRes.json());
    else setError("Could not load invoices.");
    if (accountsRes.ok) {
      const list: Account[] = await accountsRes.json();
      setAccounts(Object.fromEntries(list.map((a) => [a.id, a])));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const invoiceAction = async (invoiceId: string, action: "mark-paid" | "void") => {
    setBusyId(invoiceId);
    const res = await fetch(`/api/backoffice/invoices/${invoiceId}/${action}`, { method: "POST" });
    setBusyId(null);
    if (res.ok) load();
    else setError("That invoice update did not go through.");
  };

  const filtered = invoices?.filter((inv) => {
    if (filter === "all") return true;
    if (filter === "overdue") return inv.status === "issued" && inv.overdue;
    if (filter === "issued") return inv.status === "issued" && !inv.overdue;
    return inv.status === filter;
  });

  const totalOutstanding = invoices
    ?.filter((i) => i.status === "issued")
    .reduce((sum, i) => sum + i.amount, 0) ?? 0;
  const overdueCount = invoices?.filter((i) => i.status === "issued" && i.overdue).length ?? 0;
  const paidCount = invoices?.filter((i) => i.status === "paid").length ?? 0;

  return (
    <>
      <h1 style={{ margin: 0, fontSize: 19, letterSpacing: "-0.02em", color: "var(--d-ink)", fontFamily: "var(--font-heading)", fontWeight: 700 }}>
        Platform invoices
      </h1>
      <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--d-ink-3)" }}>What Emita bills its utility customers, across every account.</p>

      {error && <div className={styles.panel} style={{ padding: 14, color: "var(--d-bad)", fontSize: 13 }}>{error}</div>}

      <div className={styles.statGrid4}>
        <div className={styles.statCell}>
          <div className={styles.statLabelRow}><span className={styles.statLabel}>Total invoices</span></div>
          <div className={styles.statValueRow}><span className={styles.statValue}>{invoices?.length ?? 0}</span></div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabelRow}><span className={styles.statLabel}>Outstanding</span></div>
          <div className={styles.statValueRow}><span className={styles.statValue}>{totalOutstanding.toLocaleString()}</span></div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabelRow}><span className={styles.statLabel}>Overdue</span></div>
          <div className={styles.statValueRow}><span className={styles.statValue} style={{ color: overdueCount ? "var(--d-bad)" : "var(--d-ink)" }}>{overdueCount}</span></div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabelRow}><span className={styles.statLabel}>Paid</span></div>
          <div className={styles.statValueRow}><span className={styles.statValue} style={{ color: "var(--d-ok)" }}>{paidCount}</span></div>
        </div>
      </div>

      <div className={styles.filterRow}>
        {(["all", "issued", "overdue", "paid", "voided"] as const).map((f) => (
          <button key={f} type="button" className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ""}`} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.dTable}>
          <thead>
            <tr>
              <th>Utility</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Due</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered === undefined && <tr><td colSpan={6} style={{ color: "var(--d-ink-3)" }}>Loading…</td></tr>}
            {filtered?.length === 0 && <tr><td colSpan={6} style={{ color: "var(--d-ink-3)" }}>No invoices match this filter.</td></tr>}
            {filtered?.map((inv) => (
              <tr key={inv.id}>
                <td>
                  <Link href={`/backoffice/utilities/${inv.accountId}`} style={{ color: "var(--d-ink)", textDecoration: "none", fontWeight: 600 }}>
                    {accounts[inv.accountId]?.name ?? inv.accountId}
                  </Link>
                </td>
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
                      <button type="button" className={styles.dBtn} disabled={busyId === inv.id} onClick={() => invoiceAction(inv.id, "mark-paid")} style={{ marginRight: 8 }}>
                        Mark paid
                      </button>
                      <button type="button" className={styles.dBtn} disabled={busyId === inv.id} onClick={() => invoiceAction(inv.id, "void")}>
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
    </>
  );
}

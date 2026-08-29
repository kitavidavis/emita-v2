"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

const LIFECYCLE_LABEL: Record<Account["lifecycleStage"], string> = {
  poc: "PoC",
  trial: "Trial",
  active_customer: "Active customer",
  pivot: "Pivot",
  churned: "Churned",
};

export default function UtilitiesPage() {
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch("/api/backoffice/accounts");
    if (!res.ok) {
      setError("Could not load utilities.");
      return;
    }
    setAccounts(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const toggleStatus = async (account: Account) => {
    const newValue = account.accessStatus === "active" ? "suspended" : "active";
    const reason = window.prompt(
      newValue === "suspended" ? `Reason for suspending ${account.name}?` : `Reason for reactivating ${account.name}?`
    );
    if (reason === null) return;

    setBusyId(account.id);
    const res = await fetch(`/api/backoffice/accounts/${account.id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field: "access_status", newValue, reason: reason || undefined }),
    });
    setBusyId(null);
    if (res.ok) load();
    else setError("Could not update that utility's status.");
  };

  const total = accounts?.length ?? 0;
  const active = accounts?.filter((a) => a.accessStatus === "active").length ?? 0;
  const suspended = accounts?.filter((a) => a.accessStatus === "suspended").length ?? 0;
  const customers = accounts?.filter((a) => a.lifecycleStage === "active_customer").length ?? 0;

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 19, letterSpacing: "-0.02em", color: "var(--d-ink)", fontFamily: "var(--font-heading)", fontWeight: 700 }}>
            Utilities
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--d-ink-3)" }}>Every utility running on Emita.</p>
        </div>
        <Link href="/backoffice/utilities/new" className={`${styles.dBtn} ${styles.dBtnPrimary}`} style={{ textDecoration: "none" }}>
          Add utility
        </Link>
      </div>

      {error && <div className={styles.panel} style={{ padding: 14, color: "var(--d-bad)", fontSize: 13 }}>{error}</div>}

      <div className={styles.statGrid4}>
        <div className={styles.statCell}>
          <div className={styles.statLabelRow}><span className={styles.statLabel}>Total utilities</span></div>
          <div className={styles.statValueRow}><span className={styles.statValue}>{total}</span></div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabelRow}><span className={styles.statLabel}>Active access</span></div>
          <div className={styles.statValueRow}><span className={styles.statValue} style={{ color: "var(--d-ok)" }}>{active}</span></div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabelRow}><span className={styles.statLabel}>Suspended</span></div>
          <div className={styles.statValueRow}><span className={styles.statValue} style={{ color: suspended ? "var(--d-bad)" : "var(--d-ink)" }}>{suspended}</span></div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabelRow}><span className={styles.statLabel}>Active customers</span></div>
          <div className={styles.statValueRow}><span className={styles.statValue}>{customers}</span></div>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.dTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Country</th>
              <th>Currency</th>
              <th>Access</th>
              <th>Lifecycle</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {accounts === null && (
              <tr><td colSpan={7} style={{ color: "var(--d-ink-3)" }}>Loading…</td></tr>
            )}
            {accounts?.length === 0 && (
              <tr><td colSpan={7} style={{ color: "var(--d-ink-3)" }}>No utilities yet.</td></tr>
            )}
            {accounts?.map((a) => (
              <tr key={a.id}>
                <td>
                  <Link href={`/backoffice/utilities/${a.id}`} style={{ color: "var(--d-ink)", textDecoration: "none", fontWeight: 600 }}>
                    {a.name}
                  </Link>
                </td>
                <td className={styles.mono}>{a.slug}</td>
                <td>{a.defaultCountry}</td>
                <td>{a.currency}</td>
                <td>
                  <span className={styles.statusPill} style={{ color: a.accessStatus === "active" ? "var(--d-ok)" : "var(--d-bad)" }}>
                    {a.accessStatus}
                  </span>
                </td>
                <td>{LIFECYCLE_LABEL[a.lifecycleStage]}</td>
                <td style={{ textAlign: "right" }}>
                  <button
                    type="button"
                    className={styles.dBtn}
                    disabled={busyId === a.id}
                    onClick={() => toggleStatus(a)}
                  >
                    {a.accessStatus === "active" ? "Suspend" : "Reactivate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

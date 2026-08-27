"use client";

import { useMemo, useState } from "react";
import styles from "./console.module.css";
import {
  CUSTOMERS,
  CUSTOMER_STATS,
  STATUS_FILTERS,
  STATUS_META,
  type CustomerStatus,
} from "@/lib/content/customers";
import { type Tone } from "@/lib/content/console";

function toneVar(t: Tone) {
  return `var(--d-${t === "ink" ? "ink" : t})`;
}

function money(n: number) {
  return n === 0 ? "—" : `KSh ${n.toLocaleString()}`;
}

export function CustomersView() {
  const [filter, setFilter] = useState<CustomerStatus | "all">("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const byStatus = filter === "all" ? CUSTOMERS : CUSTOMERS.filter((c) => c.status === filter);
    const q = query.trim().toLowerCase();
    if (!q) return byStatus;
    return byStatus.filter(
      (c) => c.name.toLowerCase().includes(q) || c.accountNumber.toLowerCase().includes(q) || c.phone.includes(q)
    );
  }, [filter, query]);

  return (
    <>
      <div className={styles.statGrid4}>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Total accounts</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}>
            <span className={styles.statValue}>{CUSTOMER_STATS.total}</span>
          </div>
          <div className={styles.statNote}>Across 6 zones · excludes deleted accounts</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Connected</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}>
            <span className={styles.statValue} style={{ color: toneVar("ok") }}>{CUSTOMER_STATS.connected}</span>
          </div>
          <div className={styles.statNote}>Billed on the active cycle</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Disconnected</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}>
            <span className={styles.statValue} style={{ color: toneVar("warn") }}>{CUSTOMER_STATS.disconnected}</span>
          </div>
          <div className={styles.statNote}>Service off, balance may remain</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Archived</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}>
            <span className={styles.statValue} style={{ color: toneVar("mut") }}>{CUSTOMER_STATS.archived}</span>
          </div>
          <div className={styles.statNote}>Vacated, kept for history</div>
        </div>
      </div>

      <div className={styles.filterRow}>
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`${styles.filterBtn} ${filter === f.key ? styles.filterBtnActive : ""}`}
          >
            {f.label}
          </button>
        ))}
        <div className={styles.searchBox} style={{ maxWidth: 280, background: "var(--d-panel)" }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="var(--d-ink-3)" strokeWidth="1.8">
            <circle cx="7" cy="7" r="4.6" />
            <path d="M10.4 10.4L14 14" />
          </svg>
          <input
            type="text"
            placeholder="Name, account number or phone"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <span style={{ marginLeft: "auto", display: "flex", gap: 9 }}>
          <button type="button" className={styles.dBtn}>Import CSV</button>
          <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`}>+ Add customer</button>
        </span>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.dTable}>
          <thead>
            <tr>
              <th>Account</th>
              <th>Customer</th>
              <th>Zone</th>
              <th>Group</th>
              <th>Status</th>
              <th>Balance</th>
              <th>Connected since</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => {
              const meta = STATUS_META[c.status];
              return (
                <tr key={c.id}>
                  <td className={styles.mono} style={{ color: "var(--d-ink)" }}>{c.accountNumber}</td>
                  <td>
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 600, color: "var(--d-ink)" }}>{c.name}</span>
                      {!c.location && (
                        <span title="No mapped location" style={{ color: "var(--d-warn)", flex: "none" }}>
                          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M8 1.5C5.2 5.4 3.8 7.6 3.8 9.4a4.2 4.2 0 008.4 0c0-1.8-1.4-4-4.2-7.9z" />
                          </svg>
                        </span>
                      )}
                    </span>
                    <span style={{ display: "block", fontSize: 11.5, color: "var(--d-ink-3)", marginTop: 2 }}>{c.phone}</span>
                  </td>
                  <td style={{ color: "var(--d-ink-2)" }}>{c.zone}</td>
                  <td style={{ color: "var(--d-ink-2)" }}>{c.group}</td>
                  <td><span className={styles.statusPill} style={{ color: toneVar(meta.tone) }}>{meta.label}</span></td>
                  <td className={styles.mono} style={{ color: c.balance > 0 ? toneVar("warn") : "var(--d-ink-3)" }}>{money(c.balance)}</td>
                  <td style={{ color: "var(--d-ink-3)", fontSize: 12.5 }}>{c.connectedSince}</td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: "var(--d-ink-3)", padding: "26px 18px" }}>
                  No accounts match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./console.module.css";
import {
  CUSTOMERS,
  STATUS_FILTERS,
  STATUS_META,
  BILLING_TYPE_META,
  ALLOWED_NEXT,
  type CustomerRow,
  type CustomerStatus,
  type NotificationChannel,
} from "@/lib/content/customers";
import { type Tone } from "@/lib/content/console";
import { FiltersDrawer, EMPTY_FILTERS, countActiveFilters, type CustomerFilters } from "./customers/FiltersDrawer";
import { NotificationPanel } from "./customers/NotificationPanel";
import { InvoiceModal } from "./customers/InvoiceModal";
import { PaymentModal } from "./customers/PaymentModal";
import { ActionMenu, type MenuAction } from "./shared/ActionMenu";
import { useToast, ToastStack } from "./shared/Toast";
import { downloadCustomersCSV } from "./customers/download";

function toneVar(t: Tone) {
  return `var(--d-${t === "ink" ? "ink" : t})`;
}

function money(n: number) {
  return n === 0 ? "—" : `KSh ${n.toLocaleString()}`;
}

const PAGE_SIZES = [10, 25, 50, 100];

export function CustomersView() {
  const router = useRouter();
  const { toasts, show } = useToast();

  const [customers, setCustomers] = useState<CustomerRow[]>(CUSTOMERS);
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<CustomerFilters>(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [importOpen, setImportOpen] = useState(false);

  const [notifTarget, setNotifTarget] = useState<CustomerRow[] | null>(null);
  const [invoiceTarget, setInvoiceTarget] = useState<CustomerRow | null>(null);
  const [paymentTarget, setPaymentTarget] = useState<CustomerRow | null>(null);

  const CUSTOMER_STATS = useMemo(
    () => ({
      total: customers.length,
      connected: customers.filter((c) => c.status === "connected").length,
      disconnected: customers.filter((c) => c.status === "disconnected").length,
      archived: customers.filter((c) => c.status === "archived").length,
    }),
    [customers]
  );

  const rows = useMemo(() => {
    let list = statusFilter === "all" ? customers : customers.filter((c) => c.status === statusFilter);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.accountNumber.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.meterNumber.toLowerCase().includes(q)
      );
    }
    if (filters.zones.length) list = list.filter((c) => filters.zones.includes(c.zone));
    if (filters.dmas.length) list = list.filter((c) => filters.dmas.includes(c.dma));
    if (filters.groups.length) list = list.filter((c) => filters.groups.includes(c.group));
    if (filters.billingTypes.length) list = list.filter((c) => filters.billingTypes.includes(c.billingType));
    if (filters.owingOnly) list = list.filter((c) => c.balance > 0);
    if (filters.unmappedOnly) list = list.filter((c) => !c.location);
    return list;
  }, [customers, statusFilter, query, filters]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const allOnPageSelected = pageRows.length > 0 && pageRows.every((c) => selected.has(c.id));

  const toggleOne = (id: string) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllOnPage = () => {
    setSelected((s) => {
      const next = new Set(s);
      if (allOnPageSelected) pageRows.forEach((c) => next.delete(c.id));
      else pageRows.forEach((c) => next.add(c.id));
      return next;
    });
  };

  const selectedRows = customers.filter((c) => selected.has(c.id));
  const activeFilterCount = countActiveFilters(filters);

  const applyStatus = (customer: CustomerRow, next: CustomerStatus) => {
    setCustomers((cs) => cs.map((c) => (c.id === customer.id ? { ...c, status: next } : c)));
    show(`${customer.name} moved to ${STATUS_META[next].label}.`);
  };

  const rowActions = (c: CustomerRow): MenuAction[] => {
    const actions: MenuAction[] = [
      { label: "View profile", onSelect: () => router.push(`/dashboard/customers/${c.id}`) },
      { label: "Send SMS", onSelect: () => setNotifTarget([c]) },
      { label: "Send email", onSelect: () => setNotifTarget([c]) },
      { label: "Add invoice", onSelect: () => setInvoiceTarget(c) },
      { label: "Record payment", onSelect: () => setPaymentTarget(c) },
    ];
    ALLOWED_NEXT[c.status].forEach((next) => {
      actions.push({
        label: next === "archived" ? "Archive" : next === "connected" ? "Reconnect" : "Disconnect",
        danger: next === "disconnected" || next === "archived",
        onSelect: () => applyStatus(c, next),
      });
    });
    return actions;
  };

  const sendNotification = (channel: NotificationChannel, message: string) => {
    const targets = notifTarget ?? [];
    show(`${message ? "Message" : "Notification"} sent to ${targets.length} customer${targets.length === 1 ? "" : "s"} via ${channel === "in-app" ? "in-app" : channel.toUpperCase()}.`);
    setNotifTarget(null);
  };

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
        <button type="button" className={styles.dBtn} onClick={() => downloadCustomersCSV(rows)}>Export CSV</button>
        <button type="button" className={styles.dBtn} onClick={() => setImportOpen(true)}>Import CSV</button>
        <button type="button" className={styles.dBtn} onClick={() => setFiltersOpen(true)}>
          Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </button>
        <span style={{ marginLeft: "auto", display: "flex", gap: 9 }}>
          <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} onClick={() => show("Add-customer form is handled from the registration flow.")}>
            + Add customer
          </button>
        </span>
      </div>

      {selected.size > 0 ? (
        <div className={styles.bulkBar}>
          <span className={styles.bulkCount}>{selected.size} selected</span>
          <button type="button" className={styles.bulkClear} onClick={() => setSelected(new Set())}>Clear</button>
          <span style={{ marginLeft: "auto", display: "flex", gap: 9, flexWrap: "wrap" }}>
            <button type="button" className={styles.dBtn} onClick={() => setNotifTarget(selectedRows)}>Send notification</button>
            <button type="button" className={styles.dBtn} onClick={() => downloadCustomersCSV(selectedRows)}>Export selected</button>
          </span>
        </div>
      ) : (
        <div className={styles.filterRow}>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => {
                setStatusFilter(f.key);
                setPage(1);
              }}
              className={`${styles.filterBtn} ${statusFilter === f.key ? styles.filterBtnActive : ""}`}
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
              placeholder="Name, account, phone or meter"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      )}

      <div style={{ fontSize: 12, color: "var(--d-ink-3)" }}>
        Viewing {rows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, rows.length)} of {rows.length} customers
        {rows.length !== customers.length ? ` (filtered from ${customers.length})` : ""}
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.dTable}>
          <thead>
            <tr>
              <th className={styles.checkCell}>
                <input type="checkbox" className={styles.checkbox} checked={allOnPageSelected} onChange={toggleAllOnPage} />
              </th>
              <th>Customer</th>
              <th>Meter</th>
              <th>DMA</th>
              <th>Tariff</th>
              <th>Type</th>
              <th>Status</th>
              <th>Balance</th>
              <th>Last reading</th>
              <th>Modified</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((c) => {
              const meta = STATUS_META[c.status];
              return (
                <tr key={c.id}>
                  <td className={styles.checkCell}>
                    <input type="checkbox" className={styles.checkbox} checked={selected.has(c.id)} onChange={() => toggleOne(c.id)} />
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => router.push(`/dashboard/customers/${c.id}`)}
                      style={{ background: "none", border: 0, cursor: "pointer", textAlign: "left", padding: 0, display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span style={{ fontWeight: 600, color: "var(--d-ink)" }}>{c.name}</span>
                      {!c.location && (
                        <span title="No mapped location" style={{ color: "var(--d-warn)", flex: "none" }}>
                          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M8 1.5C5.2 5.4 3.8 7.6 3.8 9.4a4.2 4.2 0 008.4 0c0-1.8-1.4-4-4.2-7.9z" />
                          </svg>
                        </span>
                      )}
                    </button>
                    <span className={styles.mono} style={{ display: "block", fontSize: 11.5, color: "var(--d-ink-3)", marginTop: 2 }}>
                      {c.accountNumber} · {c.phone}
                    </span>
                  </td>
                  <td className={styles.mono} style={{ fontSize: 12 }}>{c.meterNumber}</td>
                  <td style={{ color: "var(--d-ink-2)" }}>{c.dma}</td>
                  <td style={{ color: "var(--d-ink-2)", fontSize: 12.5 }}>{c.tariff}</td>
                  <td style={{ color: "var(--d-ink-2)" }}>{BILLING_TYPE_META[c.billingType].label}</td>
                  <td><span className={styles.statusPill} style={{ color: toneVar(meta.tone) }}>{meta.label}</span></td>
                  <td className={styles.mono} style={{ color: c.balance > 0 ? toneVar("warn") : "var(--d-ink-3)" }}>{money(c.balance)}</td>
                  <td style={{ color: "var(--d-ink-3)", fontSize: 12 }}>{c.lastReadingDate}</td>
                  <td style={{ color: "var(--d-ink-3)", fontSize: 12 }}>{c.modifiedAt}</td>
                  <td style={{ textAlign: "right" }}>
                    <ActionMenu actions={rowActions(c)} />
                  </td>
                </tr>
              );
            })}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={11} style={{ textAlign: "center", color: "var(--d-ink-3)", padding: "26px 18px" }}>
                  No accounts match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.filterRow}>
        <span style={{ fontSize: 12, color: "var(--d-ink-3)" }}>Rows per page</span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
          style={{ background: "var(--d-panel-2)", border: "1px solid var(--d-line)", color: "var(--d-ink)", padding: "6px 10px", fontSize: 12.5 }}
        >
          {PAGE_SIZES.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <span style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <button type="button" className={styles.dBtn} disabled={currentPage <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <span style={{ fontSize: 12.5, color: "var(--d-ink-3)" }}>Page {currentPage} of {totalPages}</span>
          <button type="button" className={styles.dBtn} disabled={currentPage >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
        </span>
      </div>

      <FiltersDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} />

      <NotificationPanel
        open={notifTarget !== null}
        onClose={() => setNotifTarget(null)}
        recipientCount={notifTarget?.length ?? 0}
        recipientLabel={(notifTarget?.length ?? 0) === 1 ? "customer" : "customers"}
        onSend={sendNotification}
      />

      <InvoiceModal
        open={invoiceTarget !== null}
        onClose={() => setInvoiceTarget(null)}
        onCreate={({ description, amount }) => {
          if (!invoiceTarget) return;
          setCustomers((cs) => cs.map((c) => (c.id === invoiceTarget.id ? { ...c, balance: c.balance + amount } : c)));
          show(`Invoice "${description}" for KSh ${amount.toLocaleString()} added to ${invoiceTarget.name}.`);
        }}
      />

      <PaymentModal
        open={paymentTarget !== null}
        onClose={() => setPaymentTarget(null)}
        onRecord={({ amount, method }) => {
          if (!paymentTarget) return;
          setCustomers((cs) => cs.map((c) => (c.id === paymentTarget.id ? { ...c, balance: Math.max(0, c.balance - amount) } : c)));
          show(`Payment of KSh ${amount.toLocaleString()} via ${method} recorded for ${paymentTarget.name}.`);
        }}
      />

      {importOpen && (
        <div className={styles.gisModalOverlay} onClick={() => setImportOpen(false)}>
          <div className={styles.gisModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.gisModalHead}>
              Import customers
              <button type="button" className={styles.closeBtn} onClick={() => setImportOpen(false)} aria-label="Close">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8" /></svg>
              </button>
            </div>
            <div className={styles.gisModalBody}>
              <label className={styles.gisField}>
                <span>CSV file</span>
                <input type="file" accept=".csv" />
              </label>
              <div style={{ fontSize: 12, color: "var(--d-ink-3)" }}>
                Expected columns: Account, Name, Phone, Email, Meter, DMA, Zone, Group, Tariff, Type.
              </div>
            </div>
            <div className={styles.gisModalFoot}>
              <button type="button" className={styles.dBtn} onClick={() => setImportOpen(false)}>Cancel</button>
              <button
                type="button"
                className={`${styles.dBtn} ${styles.dBtnPrimary}`}
                onClick={() => {
                  setImportOpen(false);
                  show("Import queued — this preview does not persist imported rows.");
                }}
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastStack toasts={toasts} />
    </>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "../console.module.css";
import { TECHNICIANS, AD_HOC_TASK_TYPE_META, type AdHocTaskType, type ZoneAssignment } from "@/lib/content/tasks";
import { CUSTOMERS, GROUPS, ZONE_OPTIONS, DMA_OPTIONS, BILLING_TYPE_META, type CustomerRow, type BillingType } from "@/lib/content/customers";
import { CustomerCombobox } from "./CustomerCombobox";

const TASK_TYPES: AdHocTaskType[] = ["meter_reading", "disconnect", "reconnect", "gps_capture", "other"];
export const AUTO_ASSIGN = "auto";

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

type GroupFilters = {
  zones: string[];
  dmas: string[];
  groups: string[];
  billingTypes: BillingType[];
  minBalance: string;
  unmappedOnly: boolean;
};

const EMPTY_GROUP_FILTERS: GroupFilters = { zones: [], dmas: [], groups: [], billingTypes: [], minBalance: "", unmappedOnly: false };

export type AdHocTaskPayload =
  | { mode: "single"; customer: CustomerRow; taskType: AdHocTaskType; assignedTo: string; dueDate: string }
  | { mode: "group"; customers: CustomerRow[]; taskType: AdHocTaskType; assignedTo: string; dueDate: string };

export function AdHocTaskModal({
  open,
  onClose,
  zoneAssignments,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  zoneAssignments: ZoneAssignment[];
  onCreate: (payload: AdHocTaskPayload) => void;
}) {
  const [taskType, setTaskType] = useState<AdHocTaskType>("meter_reading");
  const [targetMode, setTargetMode] = useState<"single" | "group">("single");
  const [customer, setCustomer] = useState<CustomerRow | null>(null);
  const [filters, setFilters] = useState<GroupFilters>(EMPTY_GROUP_FILTERS);
  const [assignedTo, setAssignedTo] = useState<string>(TECHNICIANS[0]);
  const [dueDate, setDueDate] = useState("");

  // Group targeting defaults to splitting by zone route; single targeting defaults to picking someone.
  useEffect(() => {
    setAssignedTo(targetMode === "group" ? AUTO_ASSIGN : TECHNICIANS[0]);
  }, [targetMode]);

  const matching = useMemo(() => {
    if (targetMode !== "group") return [];
    const min = Number(filters.minBalance);
    return CUSTOMERS.filter((c) => {
      if (filters.zones.length && !filters.zones.includes(c.zone)) return false;
      if (filters.dmas.length && !filters.dmas.includes(c.dma)) return false;
      if (filters.groups.length && !filters.groups.includes(c.group)) return false;
      if (filters.billingTypes.length && !filters.billingTypes.includes(c.billingType)) return false;
      if (filters.minBalance.trim() && !(c.balance > min)) return false;
      if (filters.unmappedOnly && c.location) return false;
      return true;
    });
  }, [targetMode, filters]);

  const zoneByName = useMemo(() => new Map(zoneAssignments.map((z) => [z.zone, z.technician])), [zoneAssignments]);

  const autoBreakdown = useMemo(() => {
    if (assignedTo !== AUTO_ASSIGN) return [];
    const counts = new Map<string, number>();
    for (const c of matching) {
      const tech = zoneByName.get(c.zone) ?? "Unassigned zone";
      counts.set(tech, (counts.get(tech) ?? 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [matching, assignedTo, zoneByName]);

  if (!open) return null;

  const canSubmit = targetMode === "single" ? customer !== null : matching.length > 0;

  const reset = () => {
    setTaskType("meter_reading");
    setTargetMode("single");
    setCustomer(null);
    setFilters(EMPTY_GROUP_FILTERS);
    setAssignedTo(TECHNICIANS[0]);
    setDueDate("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (targetMode === "single" && customer) {
      onCreate({ mode: "single", customer, taskType, assignedTo, dueDate });
    } else {
      onCreate({ mode: "group", customers: matching, taskType, assignedTo, dueDate });
    }
    reset();
    onClose();
  };

  return (
    <div className={styles.gisModalOverlay} onClick={onClose}>
      <form className={styles.gisModal} style={{ width: "min(560px, 92vw)" }} onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className={styles.gisModalHead}>
          Add ad-hoc task
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8" /></svg>
          </button>
        </div>
        <div className={styles.gisModalBody}>
          <label className={styles.gisField}>
            <span>Task type</span>
            <select value={taskType} onChange={(e) => setTaskType(e.target.value as AdHocTaskType)}>
              {TASK_TYPES.map((t) => (<option key={t} value={t}>{AD_HOC_TASK_TYPE_META[t].label}</option>))}
            </select>
          </label>

          <div className={styles.filterChipRow}>
            <button type="button" className={`${styles.filterChip} ${targetMode === "single" ? styles.filterChipActive : ""}`} onClick={() => setTargetMode("single")}>
              Single customer
            </button>
            <button type="button" className={`${styles.filterChip} ${targetMode === "group" ? styles.filterChipActive : ""}`} onClick={() => setTargetMode("group")}>
              Customer group (filter)
            </button>
          </div>

          {targetMode === "single" ? (
            <label className={styles.gisField}>
              <span>Customer</span>
              <CustomerCombobox value={customer} onChange={setCustomer} />
            </label>
          ) : (
            <>
              <label className={styles.gisField}>
                <span>Zone</span>
                <div className={styles.filterChipRow}>
                  {ZONE_OPTIONS.map((z) => (
                    <button key={z} type="button" className={`${styles.filterChip} ${filters.zones.includes(z) ? styles.filterChipActive : ""}`} onClick={() => setFilters((f) => ({ ...f, zones: toggle(f.zones, z) }))}>
                      {z}
                    </button>
                  ))}
                </div>
              </label>
              <label className={styles.gisField}>
                <span>DMA</span>
                <div className={styles.filterChipRow}>
                  {DMA_OPTIONS.map((d) => (
                    <button key={d} type="button" className={`${styles.filterChip} ${filters.dmas.includes(d) ? styles.filterChipActive : ""}`} onClick={() => setFilters((f) => ({ ...f, dmas: toggle(f.dmas, d) }))}>
                      {d}
                    </button>
                  ))}
                </div>
              </label>
              <label className={styles.gisField}>
                <span>Customer group</span>
                <div className={styles.filterChipRow}>
                  {GROUPS.map((g) => (
                    <button key={g} type="button" className={`${styles.filterChip} ${filters.groups.includes(g) ? styles.filterChipActive : ""}`} onClick={() => setFilters((f) => ({ ...f, groups: toggle(f.groups, g) }))}>
                      {g}
                    </button>
                  ))}
                </div>
              </label>
              <label className={styles.gisField}>
                <span>Billing type</span>
                <div className={styles.filterChipRow}>
                  {(Object.keys(BILLING_TYPE_META) as BillingType[]).map((b) => (
                    <button key={b} type="button" className={`${styles.filterChip} ${filters.billingTypes.includes(b) ? styles.filterChipActive : ""}`} onClick={() => setFilters((f) => ({ ...f, billingTypes: toggle(f.billingTypes, b) }))}>
                      {BILLING_TYPE_META[b].label}
                    </button>
                  ))}
                </div>
              </label>
              <label className={styles.gisField}>
                <span>Balance greater than (KSh)</span>
                <input type="number" min="0" value={filters.minBalance} onChange={(e) => setFilters((f) => ({ ...f, minBalance: e.target.value }))} placeholder="e.g. 1000" />
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "var(--d-ink-2)" }}>
                <input type="checkbox" className={styles.checkbox} checked={filters.unmappedOnly} onChange={(e) => setFilters((f) => ({ ...f, unmappedOnly: e.target.checked }))} />
                Only customers with no mapped location
              </label>
              <div style={{ fontSize: 12.5, color: matching.length ? "var(--d-ink)" : "var(--d-bad)", fontWeight: 600 }}>
                {matching.length} customer{matching.length === 1 ? "" : "s"} match{matching.length === 1 ? "es" : ""} this filter
              </div>
            </>
          )}

          <label className={styles.gisField}>
            <span>Assign to</span>
            <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
              {targetMode === "group" && <option value={AUTO_ASSIGN}>Auto — split by each customer's zone route</option>}
              {TECHNICIANS.map((t) => (<option key={t} value={t}>{t}</option>))}
            </select>
          </label>

          {targetMode === "group" && assignedTo === AUTO_ASSIGN && matching.length > 0 && (
            <div style={{ border: "1px solid var(--d-line)", padding: "10px 14px", display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--d-ink-3)" }}>Split preview</span>
              {autoBreakdown.map(([tech, count]) => (
                <span key={tech} style={{ fontSize: 12.5, color: "var(--d-ink-2)", display: "flex", justifyContent: "space-between" }}>
                  <span>{tech}</span>
                  <span className={styles.mono} style={{ color: "var(--d-ink)" }}>{count}</span>
                </span>
              ))}
            </div>
          )}

          <label className={styles.gisField}>
            <span>Due date (optional)</span>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </label>
        </div>
        <div className={styles.gisModalFoot}>
          <button type="button" className={styles.dBtn} onClick={onClose}>Cancel</button>
          <button type="submit" className={`${styles.dBtn} ${styles.dBtnPrimary}`} disabled={!canSubmit}>
            {targetMode === "single" ? "Create task" : `Create ${matching.length} task${matching.length === 1 ? "" : "s"}`}
          </button>
        </div>
      </form>
    </div>
  );
}

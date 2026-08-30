"use client";

import styles from "../console.module.css";
import { GROUPS, ZONE_OPTIONS, DMA_OPTIONS, BILLING_TYPE_META, type BillingType } from "@/lib/content/customers";

export type CustomerFilters = {
  zones: string[];
  dmas: string[];
  groups: string[];
  billingTypes: BillingType[];
  owingOnly: boolean;
  unmappedOnly: boolean;
};

export const EMPTY_FILTERS: CustomerFilters = {
  zones: [],
  dmas: [],
  groups: [],
  billingTypes: [],
  owingOnly: false,
  unmappedOnly: false,
};

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function countActiveFilters(f: CustomerFilters): number {
  return f.zones.length + f.dmas.length + f.groups.length + f.billingTypes.length + (f.owingOnly ? 1 : 0) + (f.unmappedOnly ? 1 : 0);
}

export function FiltersDrawer({
  open,
  onClose,
  filters,
  onChange,
}: {
  open: boolean;
  onClose: () => void;
  filters: CustomerFilters;
  onChange: (f: CustomerFilters) => void;
}) {
  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.drawerHead}>
          <span className={styles.drawerTitle}>Filter customers</span>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        <div className={styles.filterGroup}>
          <div className={styles.filterGroupLabel}>Zone</div>
          <div className={styles.filterChipRow}>
            {ZONE_OPTIONS.map((z) => (
              <button
                key={z}
                type="button"
                className={`${styles.filterChip} ${filters.zones.includes(z) ? styles.filterChipActive : ""}`}
                onClick={() => onChange({ ...filters, zones: toggle(filters.zones, z) })}
              >
                {z}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <div className={styles.filterGroupLabel}>DMA</div>
          <div className={styles.filterChipRow}>
            {DMA_OPTIONS.map((d) => (
              <button
                key={d}
                type="button"
                className={`${styles.filterChip} ${filters.dmas.includes(d) ? styles.filterChipActive : ""}`}
                onClick={() => onChange({ ...filters, dmas: toggle(filters.dmas, d) })}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <div className={styles.filterGroupLabel}>Customer group</div>
          <div className={styles.filterChipRow}>
            {GROUPS.map((g) => (
              <button
                key={g}
                type="button"
                className={`${styles.filterChip} ${filters.groups.includes(g) ? styles.filterChipActive : ""}`}
                onClick={() => onChange({ ...filters, groups: toggle(filters.groups, g) })}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <div className={styles.filterGroupLabel}>Billing type</div>
          <div className={styles.filterChipRow}>
            {(Object.keys(BILLING_TYPE_META) as BillingType[]).map((b) => (
              <button
                key={b}
                type="button"
                className={`${styles.filterChip} ${filters.billingTypes.includes(b) ? styles.filterChipActive : ""}`}
                onClick={() => onChange({ ...filters, billingTypes: toggle(filters.billingTypes, b) })}
              >
                {BILLING_TYPE_META[b].label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup} style={{ borderBottom: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "var(--d-ink-2)" }}>
            <input type="checkbox" className={styles.checkbox} checked={filters.owingOnly} onChange={(e) => onChange({ ...filters, owingOnly: e.target.checked })} />
            Only customers with an outstanding balance
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "var(--d-ink-2)" }}>
            <input type="checkbox" className={styles.checkbox} checked={filters.unmappedOnly} onChange={(e) => onChange({ ...filters, unmappedOnly: e.target.checked })} />
            Only customers with no mapped location
          </label>
        </div>

        <div className={styles.gisModalFoot}>
          <button type="button" className={styles.dBtn} onClick={() => onChange(EMPTY_FILTERS)}>Clear all</button>
          <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} onClick={onClose}>Show results</button>
        </div>
      </div>
    </div>
  );
}

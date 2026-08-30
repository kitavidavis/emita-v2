"use client";

import { useMemo, useState } from "react";
import styles from "../console.module.css";
import { CUSTOMERS, type CustomerRow } from "@/lib/content/customers";

export function CustomerCombobox({ value, onChange }: { value: CustomerRow | null; onChange: (c: CustomerRow | null) => void }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return CUSTOMERS.filter(
      (c) => c.name.toLowerCase().includes(q) || c.accountNumber.toLowerCase().includes(q) || c.meterNumber.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  if (value) {
    return (
      <div className={styles.selectedChip}>
        <span>
          <strong>{value.name}</strong> · {value.accountNumber} · {value.meterNumber}
        </span>
        <button type="button" className={styles.selectedChipClear} onClick={() => onChange(null)} aria-label="Clear selected customer">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8" /></svg>
        </button>
      </div>
    );
  }

  return (
    <div className={styles.comboBox}>
      <input
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Search by name, account or meter"
      />
      {open && query.trim() && (
        <div className={styles.comboResults}>
          {results.length === 0 && <div className={styles.comboEmpty}>No customers match "{query}".</div>}
          {results.map((c) => (
            <button
              key={c.id}
              type="button"
              className={styles.comboResultItem}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(c);
                setQuery("");
                setOpen(false);
              }}
            >
              <strong style={{ color: "var(--d-ink)" }}>{c.name}</strong> · {c.accountNumber} · {c.meterNumber}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import styles from "../console.module.css";
import type { InvoiceCategory, InvoiceCategoryMode } from "@/lib/content/configurations";

export function InvoiceCategoryModal({
  open,
  category,
  onClose,
  onSave,
}: {
  open: boolean;
  category: InvoiceCategory | null;
  onClose: () => void;
  onSave: (fields: { name: string; mode: InvoiceCategoryMode; amount?: number }) => void;
}) {
  const [name, setName] = useState("");
  const [mode, setMode] = useState<InvoiceCategoryMode>("fixed");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(category?.name ?? "");
    setMode(category?.mode ?? "fixed");
    setAmount(category?.amount ? String(category.amount) : "");
  }, [open, category]);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (mode === "fixed" && !Number(amount)) return;
    onSave({ name: name.trim(), mode, amount: mode === "fixed" ? Number(amount) : undefined });
    onClose();
  };

  return (
    <div className={styles.gisModalOverlay} onClick={onClose}>
      <form className={styles.gisModal} onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className={styles.gisModalHead}>
          {category ? "Edit invoice category" : "Add invoice category"}
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8" /></svg>
          </button>
        </div>
        <div className={styles.gisModalBody}>
          <label className={styles.gisField}>
            <span>Category name</span>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Meter replacement" />
          </label>
          <label className={styles.gisField}>
            <span>Mode</span>
            <select value={mode} onChange={(e) => setMode(e.target.value as InvoiceCategoryMode)}>
              <option value="fixed">Fixed — a set amount</option>
              <option value="dynamic">Dynamic — computed at billing time</option>
            </select>
          </label>
          {mode === "fixed" && (
            <label className={styles.gisField}>
              <span>Amount (KSh)</span>
              <input required type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </label>
          )}
          <div style={{ fontSize: 11.5, color: "var(--d-ink-3)" }}>
            Other settings (Disconnection, Defaulting) reference a category by name rather than holding their own amount.
          </div>
        </div>
        <div className={styles.gisModalFoot}>
          <button type="button" className={styles.dBtn} onClick={onClose}>Cancel</button>
          <button type="submit" className={`${styles.dBtn} ${styles.dBtnPrimary}`}>{category ? "Save changes" : "Add category"}</button>
        </div>
      </form>
    </div>
  );
}

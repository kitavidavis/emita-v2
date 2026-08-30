"use client";

import { useState } from "react";
import styles from "../console.module.css";
import { COMPLAINT_CATEGORIES, type ComplaintCategory } from "@/lib/content/incidents";
import { CustomerCombobox } from "../tasks/CustomerCombobox";
import type { CustomerRow } from "@/lib/content/customers";

export function LogComplaintModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (fields: { customer: CustomerRow; category: ComplaintCategory; description: string }) => void;
}) {
  const [customer, setCustomer] = useState<CustomerRow | null>(null);
  const [category, setCategory] = useState<ComplaintCategory>("No water supply");
  const [description, setDescription] = useState("");

  if (!open) return null;

  const canSubmit = customer && description.trim();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !customer) return;
    onCreate({ customer, category, description: description.trim() });
    setCustomer(null);
    setCategory("No water supply");
    setDescription("");
    onClose();
  };

  return (
    <div className={styles.gisModalOverlay} onClick={onClose}>
      <form className={styles.gisModal} onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className={styles.gisModalHead}>
          Log complaint
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8" /></svg>
          </button>
        </div>
        <div className={styles.gisModalBody}>
          <label className={styles.gisField}>
            <span>Customer</span>
            <CustomerCombobox value={customer} onChange={setCustomer} />
          </label>
          <label className={styles.gisField}>
            <span>Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value as ComplaintCategory)}>
              {COMPLAINT_CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </label>
          <label className={styles.gisField}>
            <span>Description</span>
            <textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} style={{ resize: "vertical" }} placeholder="What the customer reported, in their own words where possible." />
          </label>
        </div>
        <div className={styles.gisModalFoot}>
          <button type="button" className={styles.dBtn} onClick={onClose}>Cancel</button>
          <button type="submit" className={`${styles.dBtn} ${styles.dBtnPrimary}`} disabled={!canSubmit}>Log complaint</button>
        </div>
      </form>
    </div>
  );
}

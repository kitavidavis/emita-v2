"use client";

import { useState } from "react";
import styles from "../console.module.css";

export function InvoiceModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (invoice: { description: string; amount: number; dueDate: string }) => void;
}) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    if (!description.trim() || !value || !dueDate) return;
    onCreate({ description: description.trim(), amount: value, dueDate });
    setDescription("");
    setAmount("");
    setDueDate("");
    onClose();
  };

  return (
    <div className={styles.gisModalOverlay} onClick={onClose}>
      <form className={styles.gisModal} onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className={styles.gisModalHead}>
          Add invoice
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>
        <div className={styles.gisModalBody}>
          <label className={styles.gisField}>
            <span>Description</span>
            <input required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Manual adjustment — reconnection fee" />
          </label>
          <label className={styles.gisField}>
            <span>Amount (KSh)</span>
            <input required type="number" min="1" step="1" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </label>
          <label className={styles.gisField}>
            <span>Due date</span>
            <input required type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </label>
        </div>
        <div className={styles.gisModalFoot}>
          <button type="button" className={styles.dBtn} onClick={onClose}>Cancel</button>
          <button type="submit" className={`${styles.dBtn} ${styles.dBtnPrimary}`}>Create invoice</button>
        </div>
      </form>
    </div>
  );
}

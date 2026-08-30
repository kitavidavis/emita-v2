"use client";

import { useState } from "react";
import styles from "../console.module.css";
import type { PaymentMethod } from "@/lib/content/customers";

const METHODS: PaymentMethod[] = ["M-Pesa", "Cash", "Bank transfer", "Card"];

export function PaymentModal({
  open,
  onClose,
  onRecord,
}: {
  open: boolean;
  onClose: () => void;
  onRecord: (payment: { amount: number; method: PaymentMethod; reference: string }) => void;
}) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("M-Pesa");
  const [reference, setReference] = useState("");

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    if (!value) return;
    onRecord({ amount: value, method, reference: reference.trim() || "—" });
    setAmount("");
    setReference("");
    onClose();
  };

  return (
    <div className={styles.gisModalOverlay} onClick={onClose}>
      <form className={styles.gisModal} onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className={styles.gisModalHead}>
          Record payment
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>
        <div className={styles.gisModalBody}>
          <label className={styles.gisField}>
            <span>Amount (KSh)</span>
            <input required type="number" min="1" step="1" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </label>
          <label className={styles.gisField}>
            <span>Method</span>
            <select value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}>
              {METHODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </label>
          <label className={styles.gisField}>
            <span>Reference</span>
            <input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="M-Pesa code or receipt no." />
          </label>
        </div>
        <div className={styles.gisModalFoot}>
          <button type="button" className={styles.dBtn} onClick={onClose}>Cancel</button>
          <button type="submit" className={`${styles.dBtn} ${styles.dBtnPrimary}`}>Record payment</button>
        </div>
      </form>
    </div>
  );
}

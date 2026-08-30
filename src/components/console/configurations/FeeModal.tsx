"use client";

import { useEffect, useState } from "react";
import styles from "../console.module.css";
import type { ServiceFee } from "@/lib/content/configurations";

export function FeeModal({
  open,
  fee,
  onClose,
  onSave,
}: {
  open: boolean;
  fee: ServiceFee | null;
  onClose: () => void;
  onSave: (fields: { name: string; amount: number; kind: ServiceFee["kind"] }) => void;
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [kind, setKind] = useState<ServiceFee["kind"]>("one-off");

  useEffect(() => {
    if (!open) return;
    setName(fee?.name ?? "");
    setAmount(fee ? String(fee.amount) : "");
    setKind(fee?.kind ?? "one-off");
  }, [open, fee]);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    if (!name.trim() || !value) return;
    onSave({ name: name.trim(), amount: value, kind });
    onClose();
  };

  return (
    <div className={styles.gisModalOverlay} onClick={onClose}>
      <form className={styles.gisModal} onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className={styles.gisModalHead}>
          {fee ? "Edit fee" : "Add fee"}
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8" /></svg>
          </button>
        </div>
        <div className={styles.gisModalBody}>
          <label className={styles.gisField}>
            <span>Service name</span>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="New connection fee" />
          </label>
          <label className={styles.gisField}>
            <span>Amount (KSh)</span>
            <input required type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </label>
          <label className={styles.gisField}>
            <span>Kind</span>
            <select value={kind} onChange={(e) => setKind(e.target.value as ServiceFee["kind"])}>
              <option value="one-off">One-off</option>
              <option value="recurring">Recurring</option>
            </select>
          </label>
        </div>
        <div className={styles.gisModalFoot}>
          <button type="button" className={styles.dBtn} onClick={onClose}>Cancel</button>
          <button type="submit" className={`${styles.dBtn} ${styles.dBtnPrimary}`}>{fee ? "Save changes" : "Add fee"}</button>
        </div>
      </form>
    </div>
  );
}

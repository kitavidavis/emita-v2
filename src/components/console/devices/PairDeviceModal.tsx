"use client";

import { useState } from "react";
import styles from "../console.module.css";
import { DEVICE_TYPE_META, type DeviceType } from "@/lib/content/devices";
import { CustomerCombobox } from "../tasks/CustomerCombobox";
import type { CustomerRow } from "@/lib/content/customers";

const DEVICE_TYPES: DeviceType[] = ["gsm", "sigfox", "lora", "other"];

export function PairDeviceModal({
  open,
  onClose,
  onPair,
}: {
  open: boolean;
  onClose: () => void;
  onPair: (device: { externalId: string; type: DeviceType; customer: CustomerRow }) => void;
}) {
  const [externalId, setExternalId] = useState("");
  const [type, setType] = useState<DeviceType>("lora");
  const [customer, setCustomer] = useState<CustomerRow | null>(null);

  if (!open) return null;

  const canSubmit = externalId.trim() && customer;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !customer) return;
    onPair({ externalId: externalId.trim(), type, customer });
    setExternalId("");
    setType("lora");
    setCustomer(null);
    onClose();
  };

  return (
    <div className={styles.gisModalOverlay} onClick={onClose}>
      <form className={styles.gisModal} onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className={styles.gisModalHead}>
          Pair device
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8" /></svg>
          </button>
        </div>
        <div className={styles.gisModalBody}>
          <label className={styles.gisField}>
            <span>Device ID</span>
            <input required value={externalId} onChange={(e) => setExternalId(e.target.value)} placeholder="LW-88240" />
          </label>
          <label className={styles.gisField}>
            <span>Device type</span>
            <select value={type} onChange={(e) => setType(e.target.value as DeviceType)}>
              {DEVICE_TYPES.map((t) => (<option key={t} value={t}>{DEVICE_TYPE_META[t].label}</option>))}
            </select>
          </label>
          <label className={styles.gisField}>
            <span>Meter / customer</span>
            <CustomerCombobox value={customer} onChange={setCustomer} />
          </label>
        </div>
        <div className={styles.gisModalFoot}>
          <button type="button" className={styles.dBtn} onClick={onClose}>Cancel</button>
          <button type="submit" className={`${styles.dBtn} ${styles.dBtnPrimary}`} disabled={!canSubmit}>Pair device</button>
        </div>
      </form>
    </div>
  );
}

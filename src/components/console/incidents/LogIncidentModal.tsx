"use client";

import { useState } from "react";
import styles from "../console.module.css";
import { ZONE_OPTIONS } from "@/lib/content/customers";

export function LogIncidentModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (fields: { title: string; zone: string; linkedAsset: string }) => void;
}) {
  const [title, setTitle] = useState("");
  const [zone, setZone] = useState(ZONE_OPTIONS[0]);
  const [linkedAsset, setLinkedAsset] = useState("");

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title: title.trim(), zone, linkedAsset: linkedAsset.trim() });
    setTitle("");
    setLinkedAsset("");
    onClose();
  };

  return (
    <div className={styles.gisModalOverlay} onClick={onClose}>
      <form className={styles.gisModal} onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className={styles.gisModalHead}>
          Log incident
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8" /></svg>
          </button>
        </div>
        <div className={styles.gisModalBody}>
          <label className={styles.gisField}>
            <span>Title</span>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Burst main" />
          </label>
          <label className={styles.gisField}>
            <span>Zone</span>
            <select value={zone} onChange={(e) => setZone(e.target.value)}>
              {ZONE_OPTIONS.map((z) => (<option key={z} value={z}>{z}</option>))}
            </select>
          </label>
          <label className={styles.gisField}>
            <span>Linked asset (optional)</span>
            <input value={linkedAsset} onChange={(e) => setLinkedAsset(e.target.value)} placeholder="Main MN-04" />
          </label>
        </div>
        <div className={styles.gisModalFoot}>
          <button type="button" className={styles.dBtn} onClick={onClose}>Cancel</button>
          <button type="submit" className={`${styles.dBtn} ${styles.dBtnPrimary}`}>Log incident</button>
        </div>
      </form>
    </div>
  );
}

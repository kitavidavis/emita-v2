"use client";

import { useEffect, useState } from "react";
import styles from "../console.module.css";
import type { ZoneConfig } from "@/lib/content/configurations";

export function ZoneModal({
  open,
  zone,
  zones,
  onClose,
  onSave,
}: {
  open: boolean;
  zone: ZoneConfig | null;
  zones: ZoneConfig[];
  onClose: () => void;
  onSave: (fields: { name: string; dmaCode: string; parentZone: string | null }) => void;
}) {
  const [name, setName] = useState("");
  const [dmaCode, setDmaCode] = useState("");
  const [parentZone, setParentZone] = useState<string>("");

  useEffect(() => {
    if (!open) return;
    setName(zone?.name ?? "");
    setDmaCode(zone?.dmaCode ?? "");
    setParentZone(zone?.parentZone ?? "");
  }, [open, zone]);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dmaCode.trim()) return;
    onSave({ name: name.trim(), dmaCode: dmaCode.trim(), parentZone: parentZone || null });
    onClose();
  };

  return (
    <div className={styles.gisModalOverlay} onClick={onClose}>
      <form className={styles.gisModal} onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className={styles.gisModalHead}>
          {zone ? "Edit zone" : "Add zone"}
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8" /></svg>
          </button>
        </div>
        <div className={styles.gisModalBody}>
          <label className={styles.gisField}>
            <span>Zone name</span>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Riverside" />
          </label>
          <label className={styles.gisField}>
            <span>DMA code</span>
            <input required value={dmaCode} onChange={(e) => setDmaCode(e.target.value)} placeholder="DMA-07" />
          </label>
          <label className={styles.gisField}>
            <span>Parent zone (optional)</span>
            <select value={parentZone} onChange={(e) => setParentZone(e.target.value)}>
              <option value="">— top level —</option>
              {zones.filter((z) => z.id !== zone?.id).map((z) => (<option key={z.id} value={z.name}>{z.name}</option>))}
            </select>
          </label>
        </div>
        <div className={styles.gisModalFoot}>
          <button type="button" className={styles.dBtn} onClick={onClose}>Cancel</button>
          <button type="submit" className={`${styles.dBtn} ${styles.dBtnPrimary}`}>{zone ? "Save changes" : "Add zone"}</button>
        </div>
      </form>
    </div>
  );
}

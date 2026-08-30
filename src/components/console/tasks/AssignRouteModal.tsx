"use client";

import { useState } from "react";
import styles from "../console.module.css";
import { TECHNICIANS } from "@/lib/content/tasks";

const ZONES = ["Riverside", "Elugulu North", "Elugulu South", "Market", "Bwaliro Central", "Sio Port road"];

export function AssignRouteModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (route: { assignedTo: string; zone: string; label: string; scheduledDate: string }) => void;
}) {
  const [assignedTo, setAssignedTo] = useState(TECHNICIANS[0]);
  const [zone, setZone] = useState(ZONES[0]);
  const [label, setLabel] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !scheduledDate) return;
    onCreate({ assignedTo, zone, label: label.trim(), scheduledDate });
    setLabel("");
    setScheduledDate("");
    onClose();
  };

  return (
    <div className={styles.gisModalOverlay} onClick={onClose}>
      <form className={styles.gisModal} onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className={styles.gisModalHead}>
          Assign route
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8" /></svg>
          </button>
        </div>
        <div className={styles.gisModalBody}>
          <label className={styles.gisField}>
            <span>Supply point</span>
            <input required value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Borehole 3" />
          </label>
          <label className={styles.gisField}>
            <span>Zone</span>
            <select value={zone} onChange={(e) => setZone(e.target.value)}>
              {ZONES.map((z) => (<option key={z} value={z}>{z}</option>))}
            </select>
          </label>
          <label className={styles.gisField}>
            <span>Assign to</span>
            <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
              {TECHNICIANS.map((t) => (<option key={t} value={t}>{t}</option>))}
            </select>
          </label>
          <label className={styles.gisField}>
            <span>Scheduled date</span>
            <input required type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
          </label>
        </div>
        <div className={styles.gisModalFoot}>
          <button type="button" className={styles.dBtn} onClick={onClose}>Cancel</button>
          <button type="submit" className={`${styles.dBtn} ${styles.dBtnPrimary}`}>Assign</button>
        </div>
      </form>
    </div>
  );
}

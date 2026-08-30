"use client";

import { useState } from "react";
import styles from "../console.module.css";
import { ROLE_META, ROLE_OPTIONS, type RoleCode, type StaffRow } from "@/lib/content/staff";

export function ChangeRoleModal({
  staff,
  onClose,
  onChange,
}: {
  staff: StaffRow | null;
  onClose: () => void;
  onChange: (role: RoleCode) => void;
}) {
  const [role, setRole] = useState<RoleCode>(staff?.role ?? "field_technician");

  if (!staff) return null;

  return (
    <div className={styles.gisModalOverlay} onClick={onClose}>
      <div className={styles.gisModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.gisModalHead}>
          Change role — {staff.name}
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8" /></svg>
          </button>
        </div>
        <div className={styles.gisModalBody}>
          <label className={styles.gisField}>
            <span>Role</span>
            <select value={role} onChange={(e) => setRole(e.target.value as RoleCode)} autoFocus>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{ROLE_META[r].label}</option>
              ))}
            </select>
          </label>
        </div>
        <div className={styles.gisModalFoot}>
          <button type="button" className={styles.dBtn} onClick={onClose}>Cancel</button>
          <button
            type="button"
            className={`${styles.dBtn} ${styles.dBtnPrimary}`}
            onClick={() => {
              onChange(role);
              onClose();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import styles from "../console.module.css";
import { ROLE_META, ROLE_OPTIONS, type RoleCode } from "@/lib/content/staff";

export function InviteStaffModal({
  open,
  onClose,
  onInvite,
}: {
  open: boolean;
  onClose: () => void;
  onInvite: (invite: { email: string; role: RoleCode }) => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<RoleCode>("field_technician");

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onInvite({ email: email.trim(), role });
    setEmail("");
    setRole("field_technician");
    onClose();
  };

  return (
    <div className={styles.gisModalOverlay} onClick={onClose}>
      <form className={styles.gisModal} onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className={styles.gisModalHead}>
          Invite staff
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8" /></svg>
          </button>
        </div>
        <div className={styles.gisModalBody}>
          <label className={styles.gisField}>
            <span>Work email</span>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@bwaliro.co.ke" />
          </label>
          <label className={styles.gisField}>
            <span>Role</span>
            <select value={role} onChange={(e) => setRole(e.target.value as RoleCode)}>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{ROLE_META[r].label}</option>
              ))}
            </select>
          </label>
          <div style={{ fontSize: 11.5, color: "var(--d-ink-3)" }}>
            A password-reset link is sent to this email once the invite is accepted.
          </div>
        </div>
        <div className={styles.gisModalFoot}>
          <button type="button" className={styles.dBtn} onClick={onClose}>Cancel</button>
          <button type="submit" className={`${styles.dBtn} ${styles.dBtnPrimary}`}>Send invite</button>
        </div>
      </form>
    </div>
  );
}

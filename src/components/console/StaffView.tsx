"use client";

import styles from "./console.module.css";
import { STAFF, STAFF_STATS, PENDING_INVITES, ROLE_META } from "@/lib/content/staff";
import { type Tone } from "@/lib/content/console";

function toneVar(t: Tone) {
  return `var(--d-${t === "ink" ? "ink" : t})`;
}

function initials(name: string) {
  const parts = name.replace(/@.*/, "").split(/[.\s]+/).filter(Boolean);
  return (parts[0]?.[0] ?? "").toUpperCase() + (parts[1]?.[0] ?? "").toUpperCase();
}

export function StaffView() {
  return (
    <>
      <div className={styles.statGrid4}>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Staff accounts</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue}>{STAFF_STATS.total}</span></div>
          <div className={styles.statNote}>Across 6 roles</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Two-factor enrolled</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}>
            <span className={styles.statValue} style={{ color: toneVar(STAFF_STATS.mfaEnabled === STAFF_STATS.total ? "ok" : "warn") }}>{STAFF_STATS.mfaEnabled}</span>
            <span className={styles.statUnit}>/ {STAFF_STATS.total}</span>
          </div>
          <div className={styles.statNote}>Not enforced by role yet</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Field technicians</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue}>{STAFF_STATS.fieldStaff}</span></div>
          <div className={styles.statNote}>Hold read-task routes</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Pending invites</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue}>{STAFF_STATS.pendingInvites}</span></div>
          <div className={styles.statNote}>Awaiting first sign-in</div>
        </div>
      </div>

      <div className={styles.filterRow}>
        <span style={{ fontSize: 12, color: "var(--d-ink-3)" }}>Every account here holds exactly one role — permissions come from the role, not the person</span>
        <span style={{ marginLeft: "auto" }}>
          <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`}>+ Invite staff</button>
        </span>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.dTable}>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Two-factor</th><th>Last active</th></tr>
          </thead>
          <tbody>
            {STAFF.map((s) => {
              const role = ROLE_META[s.role];
              return (
                <tr key={s.id}>
                  <td>
                    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span className={styles.userAvatar} style={{ width: 26, height: 26, fontSize: 10.5 }}>{initials(s.name)}</span>
                      <span style={{ fontWeight: 600, color: "var(--d-ink)" }}>{s.name}</span>
                    </span>
                  </td>
                  <td style={{ color: "var(--d-ink-3)", fontSize: 12.5 }}>{s.email}</td>
                  <td><span className={styles.statusPill} style={{ color: toneVar(role.tone) }}>{role.label}</span></td>
                  <td>
                    {s.mfaEnabled ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--d-ok)" }}>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8.5L6.2 12 13 4.5" /></svg>
                        Enabled
                      </span>
                    ) : <span style={{ color: "var(--d-ink-3)", fontSize: 12 }}>Not enrolled</span>}
                  </td>
                  <td style={{ color: "var(--d-ink-3)", fontSize: 12.5 }}>{s.lastActive}</td>
                </tr>
              );
            })}
            {PENDING_INVITES.map((inv) => (
              <tr key={inv.email} style={{ opacity: 0.7 }}>
                <td style={{ color: "var(--d-ink-2)", fontStyle: "italic" }}>Invitation sent</td>
                <td style={{ color: "var(--d-ink-3)", fontSize: 12.5 }}>{inv.email}</td>
                <td><span className={styles.statusPill} style={{ color: toneVar(ROLE_META[inv.role].tone) }}>{ROLE_META[inv.role].label}</span></td>
                <td style={{ color: "var(--d-ink-3)", fontSize: 12 }}>—</td>
                <td style={{ color: "var(--d-ink-3)", fontSize: 12.5 }}>Sent {inv.sentAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

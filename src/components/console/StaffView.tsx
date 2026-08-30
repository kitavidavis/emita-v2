"use client";

import { useMemo, useState } from "react";
import styles from "./console.module.css";
import { STAFF, PENDING_INVITES, ROLE_META, ROLE_OPTIONS, type StaffRow, type PendingInvite, type RoleCode } from "@/lib/content/staff";
import { type Tone } from "@/lib/content/console";
import { InviteStaffModal } from "./staff/InviteStaffModal";
import { ChangeRoleModal } from "./staff/ChangeRoleModal";
import { ActionMenu, type MenuAction } from "./shared/ActionMenu";
import { useToast, ToastStack } from "./shared/Toast";

function toneVar(t: Tone) {
  return `var(--d-${t === "ink" ? "ink" : t})`;
}

function initials(name: string) {
  const parts = name.replace(/@.*/, "").split(/[.\s]+/).filter(Boolean);
  return (parts[0]?.[0] ?? "").toUpperCase() + (parts[1]?.[0] ?? "").toUpperCase();
}

export function StaffView() {
  const { toasts, show } = useToast();
  const [staff, setStaff] = useState<StaffRow[]>(STAFF);
  const [invites, setInvites] = useState<PendingInvite[]>(PENDING_INVITES);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleCode | "all">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [inviteOpen, setInviteOpen] = useState(false);
  const [roleTarget, setRoleTarget] = useState<StaffRow | null>(null);

  const stats = useMemo(
    () => ({
      total: staff.length,
      mfaEnabled: staff.filter((s) => s.mfaEnabled).length,
      fieldStaff: staff.filter((s) => s.role === "field_technician").length,
      pendingInvites: invites.length,
    }),
    [staff, invites]
  );

  const rows = useMemo(() => {
    let list = roleFilter === "all" ? staff : staff.filter((s) => s.role === roleFilter);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
    return list;
  }, [staff, roleFilter, query]);

  const toggleOne = (id: string) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedStaff = staff.filter((s) => selected.has(s.id));

  const bulkDeactivate = () => {
    setStaff((list) => list.map((s) => (selected.has(s.id) ? { ...s, active: false } : s)));
    show(`Deactivated ${selected.size} account${selected.size === 1 ? "" : "s"}.`);
    setSelected(new Set());
  };

  const bulkMfaReminder = () => {
    show(`MFA reminder sent to ${selected.size} staff member${selected.size === 1 ? "" : "s"} without MFA enrolled.`);
    setSelected(new Set());
  };

  const rowActions = (s: StaffRow): MenuAction[] => [
    { label: "Change role", onSelect: () => setRoleTarget(s) },
    { label: "Resend MFA reminder", onSelect: () => show(`MFA reminder sent to ${s.name}.`) },
    {
      label: s.active ? "Deactivate" : "Reactivate",
      danger: s.active,
      onSelect: () => {
        setStaff((list) => list.map((x) => (x.id === s.id ? { ...x, active: !x.active } : x)));
        show(`${s.name} ${s.active ? "deactivated" : "reactivated"}.`);
      },
    },
    {
      label: "Remove",
      danger: true,
      onSelect: () => {
        setStaff((list) => list.filter((x) => x.id !== s.id));
        show(`${s.name} removed from this utility.`);
      },
    },
  ];

  const inviteActions = (inv: PendingInvite): MenuAction[] => [
    { label: "Resend invite", onSelect: () => show(`Invite resent to ${inv.email}.`) },
    {
      label: "Revoke invite",
      danger: true,
      onSelect: () => {
        setInvites((list) => list.filter((x) => x.email !== inv.email));
        show(`Invite to ${inv.email} revoked.`);
      },
    },
  ];

  return (
    <>
      <div className={styles.statGrid4}>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Staff accounts</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue}>{stats.total}</span></div>
          <div className={styles.statNote}>Across 6 roles</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Two-factor enrolled</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}>
            <span className={styles.statValue} style={{ color: toneVar(stats.mfaEnabled === stats.total ? "ok" : "warn") }}>{stats.mfaEnabled}</span>
            <span className={styles.statUnit}>/ {stats.total}</span>
          </div>
          <div className={styles.statNote}>Not enforced by role yet</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Field technicians</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue}>{stats.fieldStaff}</span></div>
          <div className={styles.statNote}>Hold read-task routes</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Pending invites</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue}>{stats.pendingInvites}</span></div>
          <div className={styles.statNote}>Awaiting first sign-in</div>
        </div>
      </div>

      {selected.size > 0 ? (
        <div className={styles.bulkBar}>
          <span className={styles.bulkCount}>{selected.size} selected</span>
          <button type="button" className={styles.bulkClear} onClick={() => setSelected(new Set())}>Clear</button>
          <span style={{ marginLeft: "auto", display: "flex", gap: 9, flexWrap: "wrap" }}>
            <button type="button" className={styles.dBtn} onClick={bulkMfaReminder}>Send MFA reminder</button>
            <button type="button" className={styles.dBtn} onClick={bulkDeactivate}>Deactivate</button>
          </span>
        </div>
      ) : (
        <div className={styles.filterRow}>
          <button type="button" className={`${styles.filterBtn} ${roleFilter === "all" ? styles.filterBtnActive : ""}`} onClick={() => setRoleFilter("all")}>All roles</button>
          {ROLE_OPTIONS.map((r) => (
            <button key={r} type="button" className={`${styles.filterBtn} ${roleFilter === r ? styles.filterBtnActive : ""}`} onClick={() => setRoleFilter(r)}>
              {ROLE_META[r].label}
            </button>
          ))}
          <div className={styles.searchBox} style={{ maxWidth: 240, background: "var(--d-panel)" }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="var(--d-ink-3)" strokeWidth="1.8"><circle cx="7" cy="7" r="4.6" /><path d="M10.4 10.4L14 14" /></svg>
            <input type="text" placeholder="Name or email" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <span style={{ marginLeft: "auto" }}>
            <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} onClick={() => setInviteOpen(true)}>+ Invite staff</button>
          </span>
        </div>
      )}

      <div className={styles.tableWrap}>
        <table className={styles.dTable}>
          <thead>
            <tr>
              <th className={styles.checkCell}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={rows.length > 0 && rows.every((s) => selected.has(s.id))}
                  onChange={() => {
                    setSelected((sel) => {
                      const next = new Set(sel);
                      const allSelected = rows.every((s) => next.has(s.id));
                      rows.forEach((s) => (allSelected ? next.delete(s.id) : next.add(s.id)));
                      return next;
                    });
                  }}
                />
              </th>
              <th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Two-factor</th><th>Status</th><th>Last active</th><th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => {
              const role = ROLE_META[s.role];
              return (
                <tr key={s.id} style={{ opacity: s.active ? 1 : 0.6 }}>
                  <td className={styles.checkCell}>
                    <input type="checkbox" className={styles.checkbox} checked={selected.has(s.id)} onChange={() => toggleOne(s.id)} />
                  </td>
                  <td>
                    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span className={styles.userAvatar} style={{ width: 26, height: 26, fontSize: 10.5 }}>{initials(s.name)}</span>
                      <span style={{ fontWeight: 600, color: "var(--d-ink)" }}>{s.name}</span>
                    </span>
                  </td>
                  <td style={{ color: "var(--d-ink-3)", fontSize: 12.5 }}>{s.email}</td>
                  <td className={styles.mono} style={{ fontSize: 12 }}>{s.phone}</td>
                  <td><span className={styles.statusPill} style={{ color: toneVar(role.tone) }}>{role.label}</span></td>
                  <td>
                    {s.mfaEnabled ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--d-ok)" }}>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8.5L6.2 12 13 4.5" /></svg>
                        Enabled
                      </span>
                    ) : <span style={{ color: "var(--d-ink-3)", fontSize: 12 }}>Not enrolled</span>}
                  </td>
                  <td>
                    <span className={styles.statusPill} style={{ color: toneVar(s.active ? "ok" : "mut") }}>{s.active ? "Active" : "Inactive"}</span>
                  </td>
                  <td style={{ color: "var(--d-ink-3)", fontSize: 12.5 }}>{s.lastActive}</td>
                  <td style={{ textAlign: "right" }}><ActionMenu actions={rowActions(s)} /></td>
                </tr>
              );
            })}
            {invites.map((inv) => (
              <tr key={inv.email} style={{ opacity: 0.7 }}>
                <td className={styles.checkCell} />
                <td style={{ color: "var(--d-ink-2)", fontStyle: "italic" }}>Invitation sent</td>
                <td style={{ color: "var(--d-ink-3)", fontSize: 12.5 }}>{inv.email}</td>
                <td style={{ color: "var(--d-ink-3)", fontSize: 12 }}>—</td>
                <td><span className={styles.statusPill} style={{ color: toneVar(ROLE_META[inv.role].tone) }}>{ROLE_META[inv.role].label}</span></td>
                <td style={{ color: "var(--d-ink-3)", fontSize: 12 }}>—</td>
                <td style={{ color: "var(--d-ink-3)", fontSize: 12 }}>—</td>
                <td style={{ color: "var(--d-ink-3)", fontSize: 12.5 }}>Sent {inv.sentAt}</td>
                <td style={{ textAlign: "right" }}><ActionMenu actions={inviteActions(inv)} /></td>
              </tr>
            ))}
            {rows.length === 0 && invites.length === 0 && (
              <tr><td colSpan={9} style={{ textAlign: "center", color: "var(--d-ink-3)", padding: "26px 18px" }}>No staff match this filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <InviteStaffModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvite={({ email, role }) => {
          setInvites((list) => [...list, { email, role, sentAt: "Just now" }]);
          show(`Invite sent to ${email}.`);
        }}
      />
      <ChangeRoleModal
        staff={roleTarget}
        onClose={() => setRoleTarget(null)}
        onChange={(role) => {
          if (!roleTarget) return;
          setStaff((list) => list.map((x) => (x.id === roleTarget.id ? { ...x, role } : x)));
          show(`${roleTarget.name} is now ${ROLE_META[role].label}.`);
        }}
      />

      <ToastStack toasts={toasts} />
    </>
  );
}

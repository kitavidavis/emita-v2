// Identity & Access: a staff member has exactly one role from the platform's fixed set
// (owner, admin, billing_clerk, field_supervisor, field_technician, read_only) — never a
// free-text title — and MFA is enrolled per person, checked at login only when enabled.

import type { Tone } from "./console";

export type RoleCode = "owner" | "admin" | "billing_clerk" | "field_supervisor" | "field_technician" | "read_only";

export const ROLE_META: Record<RoleCode, { label: string; tone: Tone }> = {
  owner: { label: "Owner", tone: "accent" },
  admin: { label: "Administrator", tone: "cyan" },
  billing_clerk: { label: "Billing clerk", tone: "ok" },
  field_supervisor: { label: "Field supervisor", tone: "warn" },
  field_technician: { label: "Field technician", tone: "mut" },
  read_only: { label: "Read only", tone: "ink" },
};

export type StaffRow = {
  id: string;
  name: string;
  email: string;
  role: RoleCode;
  mfaEnabled: boolean;
  lastActive: string;
};

export const STAFF: StaffRow[] = [
  { id: "1", name: "Nelly Wanjala", email: "n.wanjala@bwaliro.co.ke", role: "owner", mfaEnabled: true, lastActive: "Just now" },
  { id: "2", name: "D. Kitavi", email: "d.kitavi@bwaliro.co.ke", role: "admin", mfaEnabled: true, lastActive: "2 hours ago" },
  { id: "3", name: "C. Mutua", email: "c.mutua@bwaliro.co.ke", role: "billing_clerk", mfaEnabled: false, lastActive: "Yesterday" },
  { id: "4", name: "P. Wekesa", email: "p.wekesa@bwaliro.co.ke", role: "field_technician", mfaEnabled: false, lastActive: "09:12 today" },
  { id: "5", name: "G. Atieno", email: "g.atieno@bwaliro.co.ke", role: "field_technician", mfaEnabled: false, lastActive: "08:40 today" },
  { id: "6", name: "J. Odhiambo", email: "j.odhiambo@bwaliro.co.ke", role: "field_technician", mfaEnabled: false, lastActive: "07:55 today" },
  { id: "7", name: "M. Nafula", email: "m.nafula@bwaliro.co.ke", role: "field_supervisor", mfaEnabled: true, lastActive: "Yesterday" },
  { id: "8", name: "R. Simiyu", email: "r.simiyu@bwaliro.co.ke", role: "read_only", mfaEnabled: false, lastActive: "3 days ago" },
  { id: "9", name: "auditor@wasreb.go.ke", email: "auditor@wasreb.go.ke", role: "read_only", mfaEnabled: true, lastActive: "12 Jul" },
];

export const PENDING_INVITES = [
  { email: "f.okoth@bwaliro.co.ke", role: "billing_clerk" as RoleCode, sentAt: "2 days ago" },
];

export const STAFF_STATS = {
  total: STAFF.length,
  mfaEnabled: STAFF.filter((s) => s.mfaEnabled).length,
  fieldStaff: STAFF.filter((s) => s.role === "field_technician").length,
  pendingInvites: PENDING_INVITES.length,
};

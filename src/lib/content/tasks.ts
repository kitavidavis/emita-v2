// Field-technician read assignment, as redesigned server-side: two parallel workflows, not one.
// Customer meter reads are numerous, monthly, and tied to a billing cycle. Bulk/DMA supply-point
// reads are few, need to be far more frequent than monthly (night-flow leak analysis), and are
// scheduled by calendar date, independent of any billing cycle — a telemetry-fed point never
// generates a task at all. Same status vocabulary either way: unread / read / could-not-read
// with a reason, never a single "done" checkbox.

import type { Tone } from "./console";

export type TaskStatus = "unread" | "read" | "could_not_read";

export const TASK_STATUS_META: Record<TaskStatus, { label: string; tone: Tone }> = {
  unread: { label: "Unread", tone: "mut" },
  read: { label: "Read", tone: "ok" },
  could_not_read: { label: "Could not read", tone: "bad" },
};

export type MeterTask = {
  id: string;
  meter: string;
  customer: string;
  zone: string;
  assignedTo: string;
  status: TaskStatus;
  reason?: string;
};

export const METER_TASKS: MeterTask[] = [
  { id: "RT-3311", meter: "MTR-41208", customer: "J. Barasa · BW-000158", zone: "Bwaliro Central", assignedTo: "P. Wekesa", status: "could_not_read", reason: "Gate locked, no one home" },
  { id: "RT-3308", meter: "MTR-40992", customer: "Riverside Apartments · BW-000181", zone: "Riverside", assignedTo: "P. Wekesa", status: "read" },
  { id: "RT-3305", meter: "MTR-40871", customer: "A. Nakhumicha · BW-000174", zone: "Elugulu North", assignedTo: "G. Atieno", status: "read" },
  { id: "RT-3298", meter: "MTR-40760", customer: "Market Kiosk 4 · BW-000163", zone: "Market", assignedTo: "G. Atieno", status: "unread" },
  { id: "RT-3291", meter: "MTR-40602", customer: "Sio Bakery & Stores · BW-000141", zone: "Sio Port road", assignedTo: "J. Odhiambo", status: "unread" },
  { id: "RT-3287", meter: "MTR-40519", customer: "P. Wafula · BW-000149", zone: "Bwaliro Central", assignedTo: "P. Wekesa", status: "could_not_read", reason: "Dog on premises" },
  { id: "RT-3280", meter: "MTR-40403", customer: "Elugulu Primary School · BW-000152", zone: "Elugulu South", assignedTo: "J. Odhiambo", status: "read" },
];

export const METER_TASK_STATS = {
  unread: METER_TASKS.filter((t) => t.status === "unread").length,
  read: METER_TASKS.filter((t) => t.status === "read").length,
  couldNotRead: METER_TASKS.filter((t) => t.status === "could_not_read").length,
  cycle: "August 2026",
};

export type SupplyTask = {
  id: string;
  point: string;
  kind: string;
  zone: string;
  scheduledDate: string;
  assignedTo: string;
  status: TaskStatus;
  reason?: string;
};

export const SUPPLY_TASKS: SupplyTask[] = [
  { id: "SRT-882", point: "Borehole 1", kind: "Manual · daily", zone: "Elugulu North", scheduledDate: "26 Aug", assignedTo: "P. Wekesa", status: "unread" },
  { id: "SRT-881", point: "Borehole 2", kind: "Manual · daily", zone: "Bwaliro Central", scheduledDate: "26 Aug", assignedTo: "G. Atieno", status: "read" },
  { id: "SRT-878", point: "Tank A outflow", kind: "Manual · daily", zone: "Market", scheduledDate: "26 Aug", assignedTo: "G. Atieno", status: "read" },
  { id: "SRT-875", point: "Tank B outflow", kind: "Manual · daily", zone: "Elugulu South", scheduledDate: "25 Aug", assignedTo: "J. Odhiambo", status: "could_not_read", reason: "Access road flooded" },
  { id: "SRT-870", point: "Booster B-01", kind: "Manual · twice daily", zone: "Sio Port road", scheduledDate: "26 Aug (AM)", assignedTo: "J. Odhiambo", status: "unread" },
];

export const SUPPLY_TASK_STATS = {
  unread: SUPPLY_TASKS.filter((t) => t.status === "unread").length,
  read: SUPPLY_TASKS.filter((t) => t.status === "read").length,
  couldNotRead: SUPPLY_TASKS.filter((t) => t.status === "could_not_read").length,
  telemetryPoints: 3,
};

export const TECHNICIANS = ["P. Wekesa", "G. Atieno", "J. Odhiambo"];

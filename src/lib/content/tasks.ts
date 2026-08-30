// Field-technician read assignment, as redesigned server-side: two parallel workflows, not one.
// Customer meter reads are numerous, monthly, and tied to a billing cycle. Bulk/DMA supply-point
// reads are few, need to be far more frequent than monthly (night-flow leak analysis), and are
// scheduled by calendar date, independent of any billing cycle — a telemetry-fed point never
// generates a task at all. Same status vocabulary either way: unread / read / could-not-read
// with a reason, never a single "done" checkbox.

import type { Tone } from "./console";
import { BILLING_CYCLE_CONFIG, recentCycles, formatCyclePeriod } from "./billingCycle";

export type TaskStatus = "unread" | "read" | "could_not_read";

export const TASK_STATUS_META: Record<TaskStatus, { label: string; tone: Tone }> = {
  unread: { label: "Unread", tone: "mut" },
  read: { label: "Read", tone: "ok" },
  could_not_read: { label: "Could not read", tone: "bad" },
};

// The recurring, bulk-generated cycle tasks are always "meter_reading". An ad-hoc task can carry
// a different field action entirely — e.g. disconnecting every customer over a balance threshold,
// or sending someone out to capture GPS coordinates for accounts with no mapped location.
export type AdHocTaskType = "meter_reading" | "disconnect" | "reconnect" | "gps_capture" | "other";

export const AD_HOC_TASK_TYPE_META: Record<AdHocTaskType, { label: string }> = {
  meter_reading: { label: "Meter reading" },
  disconnect: { label: "Disconnect service" },
  reconnect: { label: "Reconnect service" },
  gps_capture: { label: "Capture GPS location" },
  other: { label: "Other" },
};

export type MeterTask = {
  id: string;
  meter: string;
  customer: string;
  zone: string;
  assignedTo: string;
  status: TaskStatus;
  reason?: string;
  taskType?: AdHocTaskType;
  customerId?: string;
};

// A technician's real assignment is a standing zone/route, not an individual meter — at 100k
// customers and 50 technicians, hand-picking one meter at a time doesn't scale. Reading tasks
// are generated in bulk from this table at the start of each monthly cycle; reassigning a
// technician's whole zone (not each of their meters one by one) is the normal edit here.
export type ZoneAssignment = { zone: string; dma: string; technician: string; meterCount: number };

export const ZONE_ASSIGNMENTS: ZoneAssignment[] = [
  { zone: "Riverside", dma: "DMA 01", technician: "P. Wekesa", meterCount: 52 },
  { zone: "Elugulu North", dma: "DMA 02", technician: "G. Atieno", meterCount: 61 },
  { zone: "Elugulu South", dma: "DMA 03", technician: "J. Odhiambo", meterCount: 44 },
  { zone: "Market", dma: "DMA 04", technician: "G. Atieno", meterCount: 38 },
  { zone: "Bwaliro Central", dma: "DMA 05", technician: "P. Wekesa", meterCount: 57 },
  { zone: "Sio Port road", dma: "DMA 06", technician: "J. Odhiambo", meterCount: 34 },
];

export const METER_CYCLE = {
  period: formatCyclePeriod(recentCycles(BILLING_CYCLE_CONFIG, 1)[0]),
  totalMeters: ZONE_ASSIGNMENTS.reduce((s, z) => s + z.meterCount, 0),
};

function mulberry32c(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const READ_REASONS = ["Gate locked, no one home", "Dog on premises", "Meter buried / inaccessible", "Customer disputed access"];

// Generated in one batch from ZONE_ASSIGNMENTS, the way "run the August cycle" would in a real
// dispatch — not typed in one at a time.
function generateMeterTasks(): MeterTask[] {
  const rand = mulberry32c(814);
  const rows: MeterTask[] = [];
  let seq = 5000;
  for (const za of ZONE_ASSIGNMENTS) {
    for (let i = 0; i < za.meterCount; i++) {
      const roll = rand();
      const status: TaskStatus = roll > 0.55 ? "read" : roll > 0.45 ? "could_not_read" : "unread";
      rows.push({
        id: `RT-${seq--}`,
        meter: `MTR-${40000 + Math.floor(rand() * 9999)}`,
        customer: `Account BW-${String(100000 + Math.floor(rand() * 900000)).slice(0, 6)}`,
        zone: za.zone,
        assignedTo: za.technician,
        status,
        reason: status === "could_not_read" ? READ_REASONS[Math.floor(rand() * READ_REASONS.length)] : undefined,
      });
    }
  }
  return rows;
}

export const METER_TASKS: MeterTask[] = generateMeterTasks();

export const METER_TASK_STATS = {
  unread: METER_TASKS.filter((t) => t.status === "unread").length,
  read: METER_TASKS.filter((t) => t.status === "read").length,
  couldNotRead: METER_TASKS.filter((t) => t.status === "could_not_read").length,
  cycle: METER_CYCLE.period,
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

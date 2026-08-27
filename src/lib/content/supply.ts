// Metering & Consumption's bulk/DMA side: a supply point's readings are typed —
// cumulative_volume (a meter total, what NRW flow-balance is computed from) vs
// instantaneous_flow_rate (a snapshot, what night-flow / leak detection actually needs) — a
// distinction the old system's production.js never made. Manual points generate a daily read
// task; telemetry points just report on their own.

import type { Tone } from "./console";

export type ReadingType = "cumulative_volume" | "instantaneous_flow_rate";

export const READING_TYPE_META: Record<ReadingType, { label: string; unit: string }> = {
  cumulative_volume: { label: "Cumulative volume", unit: "m³" },
  instantaneous_flow_rate: { label: "Instantaneous flow", unit: "l/s" },
};

export type SupplyPoint = {
  id: string;
  name: string;
  zone: string;
  source: "manual" | "telemetry";
  cadence: string;
  latestVolume: string;
  latestFlow: string;
  trend: Tone; // ok = flow stable/falling, warn = rising, bad = spiking
};

export const SUPPLY_POINTS: SupplyPoint[] = [
  { id: "sp-bh1", name: "Borehole 1", zone: "Elugulu North", source: "manual", cadence: "Daily, 06:00", latestVolume: "1,840 m³ (Aug MTD)", latestFlow: "18.4 l/s", trend: "bad" },
  { id: "sp-bh2", name: "Borehole 2", zone: "Bwaliro Central", source: "telemetry", cadence: "Hourly", latestVolume: "2,210 m³ (Aug MTD)", latestFlow: "22.1 l/s", trend: "bad" },
  { id: "sp-tka", name: "Tank A outflow", zone: "Market", source: "manual", cadence: "Daily, 06:00", latestVolume: "1,120 m³ (Aug MTD)", latestFlow: "11.8 l/s", trend: "warn" },
  { id: "sp-tkb", name: "Tank B outflow", zone: "Elugulu South", source: "manual", cadence: "Daily, 06:00", latestVolume: "980 m³ (Aug MTD)", latestFlow: "7.2 l/s", trend: "warn" },
  { id: "sp-bh3", name: "Borehole 3", zone: "Riverside", source: "telemetry", cadence: "Hourly", latestVolume: "880 m³ (Aug MTD)", latestFlow: "4.9 l/s", trend: "ok" },
  { id: "sp-boo1", name: "Booster B-01", zone: "Sio Port road", source: "manual", cadence: "Twice daily", latestVolume: "410 m³ (Aug MTD)", latestFlow: "2.2 l/s", trend: "ok" },
  { id: "sp-int-c", name: "Intake C", zone: "Unassigned", source: "telemetry", cadence: "Hourly", latestVolume: "—", latestFlow: "—", trend: "warn" },
];

export type ReadingRow = {
  id: string;
  point: string;
  type: ReadingType;
  value: string;
  recordedAt: string;
  source: "manual" | "telemetry";
  hasEvidence: boolean;
};

export const READINGS: ReadingRow[] = [
  { id: "sr-9021", point: "Borehole 1", type: "cumulative_volume", value: "1,840 m³", recordedAt: "26 Aug, 06:04", source: "manual", hasEvidence: true },
  { id: "sr-9020", point: "Borehole 1", type: "instantaneous_flow_rate", value: "18.4 l/s", recordedAt: "26 Aug, 03:00", source: "telemetry", hasEvidence: false },
  { id: "sr-9018", point: "Borehole 2", type: "cumulative_volume", value: "2,210 m³", recordedAt: "26 Aug, 05:00", source: "telemetry", hasEvidence: false },
  { id: "sr-9015", point: "Tank A outflow", type: "cumulative_volume", value: "1,120 m³", recordedAt: "26 Aug, 06:11", source: "manual", hasEvidence: true },
  { id: "sr-9012", point: "Tank B outflow", type: "cumulative_volume", value: "980 m³", recordedAt: "25 Aug, 06:09", source: "manual", hasEvidence: true },
  { id: "sr-9008", point: "Borehole 3", type: "instantaneous_flow_rate", value: "4.9 l/s", recordedAt: "26 Aug, 03:00", source: "telemetry", hasEvidence: false },
  { id: "sr-9004", point: "Booster B-01", type: "cumulative_volume", value: "410 m³", recordedAt: "26 Aug, 12:02", source: "manual", hasEvidence: true },
];

export const SUPPLY_STATS = {
  points: SUPPLY_POINTS.length,
  manual: SUPPLY_POINTS.filter((p) => p.source === "manual").length,
  telemetry: SUPPLY_POINTS.filter((p) => p.source === "telemetry").length,
  unzoned: SUPPLY_POINTS.filter((p) => p.zone === "Unassigned").length,
};

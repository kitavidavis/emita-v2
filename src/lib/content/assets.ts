// Network & Assets' physical inventory — valves, reservoirs, pumps and similar. Condition is a
// fixed four-value scale set by a field visit's service record, not free text.

import type { Tone } from "./console";

export type Condition = "good" | "fair" | "poor" | "critical";

export const CONDITION_META: Record<Condition, { label: string; tone: Tone }> = {
  good: { label: "Good", tone: "ok" },
  fair: { label: "Fair", tone: "accent" },
  poor: { label: "Poor", tone: "warn" },
  critical: { label: "Critical", tone: "bad" },
};

export type AssetRow = {
  id: string;
  name: string;
  type: string;
  zone: string;
  condition: Condition;
  lastInspected: string;
};

export const ASSETS: AssetRow[] = [
  { id: "a-201", name: "Pump 2", type: "Pump", zone: "Elugulu North", condition: "poor", lastInspected: "11 Jul 2026" },
  { id: "a-198", name: "Main MN-04", type: "Main", zone: "Market", condition: "critical", lastInspected: "9 Jul 2026" },
  { id: "a-190", name: "Tank A", type: "Reservoir", zone: "Market", condition: "good", lastInspected: "2 Jul 2026" },
  { id: "a-184", name: "Tank B", type: "Reservoir", zone: "Elugulu South", condition: "good", lastInspected: "2 Jul 2026" },
  { id: "a-176", name: "Valve V-12", type: "Valve", zone: "Bwaliro Central", condition: "fair", lastInspected: "28 Jun 2026" },
  { id: "a-171", name: "Booster B-01", type: "Booster", zone: "Sio Port road", condition: "good", lastInspected: "25 Jun 2026" },
  { id: "a-165", name: "Valve V-07", type: "Valve", zone: "Riverside", condition: "good", lastInspected: "20 Jun 2026" },
];

export const ASSET_STATS = {
  total: ASSETS.length,
  critical: ASSETS.filter((a) => a.condition === "critical" || a.condition === "poor").length,
  overdue: 2,
};

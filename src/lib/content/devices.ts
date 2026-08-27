// Registry's device pairing (gsm / sigfox / lora / other), kept separate from the meter record
// itself — most meters have no device at all. "Last payload" reflects raw_device_payloads, the
// pre-decode store Metering & Consumption keeps for replay/debugging.

import type { Tone } from "./console";

export type DeviceType = "gsm" | "sigfox" | "lora" | "other";

export const DEVICE_TYPE_META: Record<DeviceType, { label: string; tone: Tone }> = {
  gsm: { label: "GSM", tone: "accent" },
  sigfox: { label: "Sigfox", tone: "cyan" },
  lora: { label: "LoRaWAN", tone: "ok" },
  other: { label: "Other", tone: "mut" },
};

export type DeviceRow = {
  id: string;
  externalId: string;
  type: DeviceType;
  meter: string;
  customer: string;
  lastPayload: string;
  silent: boolean;
};

export const DEVICES: DeviceRow[] = [
  { id: "d1", externalId: "SFX-0A19C2", type: "sigfox", meter: "MTR-40992", customer: "Riverside Apartments Ltd", lastPayload: "6 min ago", silent: false },
  { id: "d2", externalId: "LW-88213", type: "lora", meter: "MTR-40871", customer: "A. Nakhumicha", lastPayload: "22 min ago", silent: false },
  { id: "d3", externalId: "LW-88190", type: "lora", meter: "MTR-40760", customer: "Market Kiosk 4", lastPayload: "9 hours ago", silent: false },
  { id: "d4", externalId: "SFX-0A18F1", type: "sigfox", meter: "MTR-41208", customer: "J. Barasa", lastPayload: "6 days ago", silent: true },
  { id: "d5", externalId: "GSM-2201", type: "gsm", meter: "MTR-BULK-01", customer: "Borehole 2 (bulk)", lastPayload: "1 hour ago", silent: false },
  { id: "d6", externalId: "GSM-2198", type: "gsm", meter: "MTR-BULK-03", customer: "Borehole 3 (bulk)", lastPayload: "58 min ago", silent: false },
  { id: "d7", externalId: "LW-87965", type: "lora", meter: "MTR-40519", customer: "P. Wafula", lastPayload: "3 days ago", silent: true },
];

export const DEVICE_STATS = {
  total: DEVICES.length,
  byType: (["gsm", "sigfox", "lora", "other"] as DeviceType[]).map((t) => ({
    type: t,
    count: DEVICES.filter((d) => d.type === t).length,
  })).filter((x) => x.count > 0),
  silent: DEVICES.filter((d) => d.silent).length,
  connectedMeters: 41, // fleet-wide; the table below shows the most recently active devices, not all 41
  totalMeters: 312,
};

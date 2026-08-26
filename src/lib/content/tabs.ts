export type ConsoleStat = { label: string; value: string; flagged: boolean };
export type ConsoleRow = { label: string; state: string; flagged: boolean };

export type ConsoleTab = {
  key: string;
  label: string;
  title: string;
  note: string;
  chart: string;
  flag: string;
  path: string;
  stats: ConsoleStat[];
  rows: ConsoleRow[];
};

export const consoleTabs: ConsoleTab[] = [
  {
    key: "overview",
    label: "Overview",
    title: "Network overview",
    note: "Every zone, ranked by what needs attention today.",
    chart: "SUPPLIED VS BILLED — 12 WEEKS",
    flag: "DIVERGENCE",
    path: "M10 200L70 186L130 192L190 176L250 184L310 168L370 96L430 88L490 94L550 82L610 88",
    stats: [
      { label: "Zones monitored", value: "42", flagged: false },
      { label: "Open cases", value: "17", flagged: true },
      { label: "Reads today", value: "98.2%", flagged: false },
      { label: "Devices offline", value: "31", flagged: false },
    ],
    rows: [
      { label: "DMA 04 — night-flow step", state: "High", flagged: true },
      { label: "Meter 88231 — no read, 6d", state: "High", flagged: true },
      { label: "Pump station B — drift", state: "Medium", flagged: false },
      { label: "Cluster 12 — usage step", state: "Medium", flagged: false },
    ],
  },
  {
    key: "zones",
    label: "Zones",
    title: "Zone balance",
    note: "Supplied against measured, recomputed each night.",
    chart: "ZONE INFLOW VS MEASURED — DMA 04",
    flag: "GAP WIDENING",
    path: "M10 168L70 172L130 160L190 164L250 150L310 152L370 138L430 120L490 112L550 96L610 84",
    stats: [
      { label: "Zones in balance", value: "25", flagged: false },
      { label: "Zones over 25% gap", value: "9", flagged: true },
      { label: "Largest gap", value: "48%", flagged: false },
      { label: "Balance refreshed", value: "04:05", flagged: false },
    ],
    rows: [
      { label: "DMA 11 — 48% unaccounted", state: "Review", flagged: true },
      { label: "DMA 07 — 31% unaccounted", state: "Review", flagged: false },
      { label: "DMA 02 — 19% unaccounted", state: "Watch", flagged: false },
      { label: "DMA 18 — within tolerance", state: "Clear", flagged: false },
    ],
  },
  {
    key: "alerts",
    label: "Alerts",
    title: "Investigation queue",
    note: "Ranked cases with the evidence attached.",
    chart: "CASES OPENED VS CLOSED — 12 WEEKS",
    flag: "BACKLOG PEAK",
    path: "M10 190L70 176L130 182L190 150L250 158L310 120L370 108L430 132L490 146L550 168L610 184",
    stats: [
      { label: "Open cases", value: "17", flagged: true },
      { label: "Assigned today", value: "8", flagged: false },
      { label: "Closed this week", value: "12", flagged: false },
      { label: "Median age", value: "3.4d", flagged: false },
    ],
    rows: [
      { label: "DMA 04 — leak suspected", state: "Field", flagged: true },
      { label: "Meter 88231 — swap raised", state: "Field", flagged: true },
      { label: "Account 4471 — bypass check", state: "Revenue", flagged: false },
      { label: "Pump B — pressure review", state: "Assets", flagged: false },
    ],
  },
  {
    key: "devices",
    label: "Devices",
    title: "Device fleet",
    note: "Communication, battery and read quality across the estate.",
    chart: "READ SUCCESS RATE — 12 WEEKS",
    flag: "GATEWAY FAULT",
    path: "M10 96L70 92L130 100L190 94L250 98L310 90L370 168L430 150L490 118L550 100L610 94",
    stats: [
      { label: "Devices connected", value: "12,480", flagged: false },
      { label: "Offline over 48h", value: "31", flagged: true },
      { label: "Battery under 20%", value: "104", flagged: false },
      { label: "Firmware current", value: "96%", flagged: false },
    ],
    rows: [
      { label: "Gateway NRB-07 — offline", state: "Critical", flagged: true },
      { label: "112 meters — weak signal", state: "Degraded", flagged: true },
      { label: "Meter 51190 — drift", state: "Fault", flagged: false },
      { label: "Batch F-22 — firmware due", state: "Planned", flagged: false },
    ],
  },
];

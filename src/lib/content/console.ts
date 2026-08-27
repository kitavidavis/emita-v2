// Ported from the design mockup (Emita Console v2.dc.html) and its embedded
// seed data. Colors, labels and figures are taken verbatim where the mockup
// specified them; anything not fully designed there (the 16 free-tier
// secondary modules) gets a lighter-weight, still-branded placeholder.

export type IconKey =
  | "home" | "users" | "bill" | "staff" | "task" | "supply" | "report" | "device"
  | "config" | "incident" | "log" | "support" | "settings" | "map" | "asset"
  | "access" | "cash" | "gauge" | "plug" | "alert";

export const ICONS: Record<IconKey, string> = {
  home: "M2 7l6-5 6 5v7H2z",
  users: "M6 7a2.4 2.4 0 100-4.8A2.4 2.4 0 006 7zM1.5 14c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4M11 3.5a2 2 0 010 4M14.5 14c0-1.8-.8-3-2.2-3.6",
  bill: "M3.5 1.5h9v13l-2-1.2-2 1.2-2-1.2-2 1.2zM6 5h4M6 8h4",
  staff: "M8 7.5a2.6 2.6 0 100-5.2 2.6 2.6 0 000 5.2zM3 14c0-2.6 2.2-4.2 5-4.2s5 1.6 5 4.2",
  task: "M2 4h3M2 8h3M2 12h3M7 4h7M7 8h7M7 12h7",
  supply: "M8 1.5C5.2 5.4 3.8 7.6 3.8 9.4a4.2 4.2 0 008.4 0c0-1.8-1.4-4-4.2-7.9z",
  report: "M2 14V2M2 14h12M5 11V6M8.5 11V3.5M12 11V8",
  device: "M3 2h10v12H3zM6 5h4M6 8h4M6 11h2",
  config: "M8 5.6A2.4 2.4 0 108 10.4 2.4 2.4 0 008 5.6M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M12.6 3.4l-1.4 1.4M4.8 11.2l-1.4 1.4",
  incident: "M8 2l6 11H2zM8 6.5v3M8 11.2v.4",
  log: "M4 2h8v12H4zM6 5h4M6 8h4M6 11h3",
  support: "M8 1.8a6.2 6.2 0 100 12.4A6.2 6.2 0 008 1.8zM6.4 6a1.7 1.7 0 013.2.6c0 1.2-1.6 1.4-1.6 2.6M8 11.6v.3",
  settings: "M8 5.6A2.4 2.4 0 108 10.4 2.4 2.4 0 008 5.6M13.2 9.6l1.3.8-1.5 2.6-1.4-.6a5.5 5.5 0 01-1.4.8L9.9 15H6.9l-.3-1.8a5.5 5.5 0 01-1.4-.8l-1.4.6L2.3 10.4l1.3-.8a5.6 5.6 0 010-1.6l-1.3-.8 1.5-2.6 1.4.6a5.5 5.5 0 011.4-.8L6.9 1h3l.3 1.8a5.5 5.5 0 011.4.8l1.4-.6 1.5 2.6-1.3.8a5.6 5.6 0 010 1.6z",
  map: "M6 2v11M10 3v11M2 4l4-2 4 1 4-2v11l-4 2-4-1-4 2z",
  asset: "M2 6l6-4 6 4v8H2zM6.5 14V9h3v5",
  access: "M4 7V5a4 4 0 018 0v2M3 7h10v7H3z",
  cash: "M2 4h12v8H2zM8 6.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3",
  gauge: "M8 13a5.5 5.5 0 115.5-5.5M8 8l3.2-2.2",
  plug: "M6 2v4M10 2v4M4 6h8v3a4 4 0 01-8 0zM8 13v1.5",
  alert: "M8 1.8a6.2 6.2 0 100 12.4A6.2 6.2 0 008 1.8zM8 5v4M8 11v.4",
};

export const UTILITY = {
  name: "Malanga Elugulu / Bwaliro Water Project",
  short: "Bwaliro Water",
};

export type NavItem = { key: string; label: string; icon: IconKey; href: string; tag?: string; tagAccent?: boolean };

export const NAV_ITEMS: NavItem[] = [
  { key: "home", label: "Home", icon: "home", href: "/dashboard" },
  { key: "customers", label: "Customers", icon: "users", href: "/dashboard/customers" },
  { key: "billing", label: "Billing", icon: "bill", href: "/dashboard/billing" },
  { key: "staff", label: "Staff", icon: "staff", href: "/dashboard/staff" },
  { key: "tasks", label: "Tasks", icon: "task", href: "/dashboard/tasks" },
  { key: "supply", label: "Supply History", icon: "supply", href: "/dashboard/supply" },
  { key: "reports", label: "Reports", icon: "report", href: "/dashboard/reports" },
  { key: "devices", label: "Devices", icon: "device", href: "/dashboard/devices" },
  { key: "config", label: "Configurations", icon: "config", href: "/dashboard/configurations" },
  { key: "incidents", label: "Incidents", icon: "incident", href: "/dashboard/incidents" },
  { key: "logs", label: "Logs", icon: "log", href: "/dashboard/logs" },
  { key: "support", label: "Support", icon: "support", href: "/dashboard/support" },
  { key: "settings", label: "Settings", icon: "settings", href: "/dashboard/settings" },
  { key: "mapper", label: "Inventory Mapper", icon: "map", href: "/dashboard/mapper", tag: "7", tagAccent: true },
  { key: "assets", label: "Utility Assets", icon: "asset", href: "/dashboard/assets" },
  { key: "access", label: "Access", icon: "access", href: "/dashboard/access", tag: "BETA" },
];

export const PREMIUM_NAV_ITEMS: NavItem[] = [
  { key: "zones", label: "Zones & NRW", icon: "gauge", href: "/dashboard/zones" },
  { key: "cases", label: "Investigations", icon: "incident", href: "/dashboard/investigations" },
  { key: "netmap", label: "Network map", icon: "map", href: "/dashboard/map" },
  { key: "revenue", label: "Revenue intelligence", icon: "cash", href: "/dashboard/revenue" },
  { key: "integrations", label: "Integrations", icon: "plug", href: "/dashboard/integrations" },
];

export const TITLES: Record<string, [string, string]> = {
  home: ["Home", "Malanga Elugulu / Bwaliro Water Project · July 2026"],
  customers: ["Customers", "286 accounts across 6 zones"],
  billing: ["Billing", "August 2026 cycle · 4 runs this year"],
  staff: ["Staff", "9 users · SSO not configured"],
  tasks: ["Tasks", "Meter reads and supply-point reads, tracked separately"],
  supply: ["Supply History", "7 intake points · 12 months retained"],
  reports: ["Reports", "Generated on demand or on a schedule"],
  devices: ["Devices", "312 meters registered · 41 connected"],
  config: ["Configurations", "Notifications, zones, fees and automation"],
  incidents: ["Incidents", "3 open · 2 breaching response time"],
  logs: ["Logs", "Every event, from every service"],
  support: ["Support", "Documentation, training and contact"],
  settings: ["Settings", "Project, security and data"],
  mapper: ["Inventory Mapper", "7 field captures awaiting review"],
  assets: ["Utility Assets", "Pumps, tanks, mains and valves"],
  access: ["Access", "Beta · scoped API keys for external parties"],
};

export const PREMIUM_TITLES: Record<string, [string, string]> = {
  zones: ["Zones & NRW", "6 zones · flow balance recomputed 04:05 EAT"],
  cases: ["Investigations", "8 open cases · ranked by volume at risk"],
  netmap: ["Network map", "Zones, customers, mains and supply points, in geographic context"],
  revenue: ["Revenue intelligence", "Billed against measured, exception detection"],
  integrations: ["Integrations", "9 connectors · meters, billing, GIS, messaging"],
};

export const NOTIFICATIONS = [
  { title: "3 intake points missing a zone tag", meta: "Blocks NRW reporting · Supply History", tone: "warn" as const },
  { title: "July bill run ready for review", meta: "286 bills · KSh 316,190", tone: "accent" as const },
  { title: "12 payments could not be matched", meta: "M-Pesa reference mismatch", tone: "bad" as const },
];

export const HELP_RESOURCES = [
  { name: "Structuring supply data for NRW", kind: "GUIDE", note: "How to tag intake points and supply intervals so flow balance computes." },
  { name: "Reading import templates", kind: "TEMPLATE", note: "CSV formats for meter readings, customers and payments." },
  { name: "Tariff configuration", kind: "GUIDE", note: "Bands, standing charges and how proration is applied." },
  { name: "M-Pesa reconciliation", kind: "GUIDE", note: "Matching rules, common reference errors and manual overrides." },
  { name: "Field reader app", kind: "APP", note: "Android app for route reading offline, syncs when back in signal." },
  { name: "Training session", kind: "BOOKING", note: "Ninety minutes with your team on the July cycle." },
];

// ---- Home / Overview ----

export type Tone = "accent" | "cyan" | "ok" | "warn" | "bad" | "mut" | "ink";

type SetupStep = { title: string; note: string; done: boolean; action: string; current?: boolean; muted?: boolean };

export const SETUP_ADVISORY: { title: string; steps: SetupStep[] } = {
  title: "Deployment · 4 of 5 complete",
  steps: [
    { title: "Customers imported", note: "286 accounts across 6 zones", done: true, action: "Done" },
    { title: "Meters registered", note: "312 meters, 41 connected", done: true, action: "Done" },
    { title: "Intake points tagged to zones", note: "7 of 7 · flow balance computing", done: true, action: "Done" },
    { title: "SMS notifications live", note: "Bill, payment and interruption alerts", done: true, action: "Done" },
    { title: "Connect the billing system", note: "Register sync still manual", done: false, action: "Continue →", current: true },
  ],
};

export const ACCOUNT_PANEL = {
  note: "Renews 12 Nov 2026",
  headline: "SMS notifications, nightly backups, NRW reporting and the intelligence modules are active.",
  rows: [
    { label: "Customers", value: "286 / unlimited", tone: "ink" as Tone },
    { label: "SMS credits", value: "8,400 remaining", tone: "ok" as Tone },
    { label: "Data retention", value: "24 months", tone: "ink" as Tone },
  ],
  primary: "Manage plan",
  secondary: "Billing history",
};

export const SUMMARY_TILES = [
  { label: "Customers", value: "286", unit: "accounts", note: "+12 this month", tone: "accent" as Tone, icon: "users" as IconKey },
  { label: "Bills issued", value: "316.19k", unit: "KSh", note: "July cycle, issued 12 Jul", tone: "cyan" as Tone, icon: "bill" as IconKey },
  { label: "Payments received", value: "241.8k", unit: "KSh", note: "76% of the cycle settled", tone: "ok" as Tone, icon: "cash" as IconKey },
  { label: "Collection efficiency", value: "76.4", unit: "%", note: "+3.1 points on June", tone: "ok" as Tone, icon: "gauge" as IconKey },
];

export const RANGES = ["1M", "3M", "6M", "12M"] as const;

export const TREND_BY_RANGE = [
  { sup: "M40 96L148 90L256 100L364 86L472 92L580 80L690 86", con: "M40 158L148 150L256 162L364 148L472 154L580 142L690 148", supplied: "38.2k m³", consumed: "24.6k m³", balance: "35.6%" },
  { sup: "M40 88L148 82L256 94L364 78L472 86L580 72L690 78", con: "M40 150L148 146L256 156L364 142L472 150L580 136L690 142", supplied: "112.4k m³", consumed: "73.8k m³", balance: "34.3%" },
  { sup: "M40 92L148 84L256 90L364 74L472 82L580 68L690 74", con: "M40 154L148 148L256 152L364 138L472 146L580 132L690 138", supplied: "226.1k m³", consumed: "150.2k m³", balance: "33.6%" },
  { sup: "M40 100L148 88L256 96L364 78L472 84L580 66L690 70", con: "M40 162L148 152L256 158L364 140L472 148L580 128L690 134", supplied: "451.8k m³", consumed: "316.2k m³", balance: "30.0%" },
];

// Sparkline y-values (SVG-space: lower number = higher on the chart), oldest to
// current. Seven points across a 90x32 viewBox, x-step fixed at 12.
export function buildMetrics(trend: (typeof TREND_BY_RANGE)[number]) {
  return [
    { label: "Supplied quantity", value: trend.supplied, delta: "+4.2% on previous period", note: "7 intake points", icon: "supply" as IconKey },
    { label: "Consumed quantity", value: trend.consumed, delta: "+2.8% on previous period", note: "312 meters read", icon: "gauge" as IconKey },
    { label: "NRW (flow balance)", value: trend.balance, delta: "+1.4 points on previous period", note: "All 7 intake points reporting", icon: "alert" as IconKey },
    { label: "MTD revenue", value: "316.19k", delta: "Billed, not yet collected", note: "July 2026", icon: "cash" as IconKey },
    { label: "New connections", value: "12", delta: "+3 on previous month", note: "8 metered, 4 pending", icon: "plug" as IconKey },
    { label: "Payments with issues", value: "12", delta: "Unmatched references", note: "Since onboarding 18 Nov 2023", icon: "alert" as IconKey },
  ];
}


export const ATTENTION_ITEMS = [
  { title: "3 intake points have no zone tag", meta: "Blocks NRW flow balance", tag: "Blocking", tone: "bad" as Tone },
  { title: "12 payments unmatched", meta: "M-Pesa reference mismatch", tag: "Billing", tone: "warn" as Tone },
  { title: "July bill run awaiting approval", meta: "286 bills · KSh 316,190", tag: "Review", tone: "accent" as Tone },
  { title: "7 field captures awaiting review", meta: "Inventory Mapper", tag: "Data", tone: "warn" as Tone },
  { title: "2FA not enrolled for 5 staff", meta: "Security recommendation", tag: "Security", tone: "warn" as Tone },
];

export const ACTIVITY_FEED = [
  { when: "09:12", what: "P. Wekesa recorded 41 readings on route Elugulu North." },
  { when: "08:40", what: "July bill run generated — 286 bills, KSh 316,190." },
  { when: "Yesterday", what: "N. Wanjala added customer BW-000181 (Riverside)." },
  { when: "Yesterday", what: "Tariff schedule 2025-B applied to 4 zones." },
  { when: "12 Jul", what: "Meter MTR-41208 flagged for replacement." },
  { when: "11 Jul", what: "Incident #214 closed — burst main, Market zone." },
];

// ---- Premium: Zones & NRW ----

export const ZONE_FILTERS = ["All zones", "Critical", "Review", "Healthy"];

export const ZONE_ROWS = [
  { name: "Elugulu North", source: "Boreholes 1 & 2", supplied: "1,840 m³", measured: "1,030 m³", pct: "44%", night: "18.4 l/s", meters: "96", status: "Critical", tone: "bad" as Tone },
  { name: "Bwaliro Central", source: "Borehole 2", supplied: "2,210 m³", measured: "1,525 m³", pct: "31%", night: "22.1 l/s", meters: "84", status: "Critical", tone: "bad" as Tone },
  { name: "Market", source: "Tank A outflow", supplied: "1,120 m³", measured: "806 m³", pct: "28%", night: "11.8 l/s", meters: "42", status: "Review", tone: "warn" as Tone },
  { name: "Elugulu South", source: "Tank B outflow", supplied: "980 m³", measured: "794 m³", pct: "19%", night: "7.2 l/s", meters: "38", status: "Review", tone: "warn" as Tone },
  { name: "Riverside", source: "Borehole 3", supplied: "880 m³", measured: "757 m³", pct: "14%", night: "4.9 l/s", meters: "26", status: "Healthy", tone: "ok" as Tone },
  { name: "Sio Port road", source: "Booster B-01", supplied: "410 m³", measured: "377 m³", pct: "8%", night: "2.2 l/s", meters: "0", status: "Healthy", tone: "ok" as Tone },
];

// ---- Premium: Investigations ----

export const CASE_COLUMNS = [
  { name: "Triage", cards: [
    { id: "CASE-1042", title: "Elugulu North — night-flow step change", meta: "1,240 m³/wk at risk · unassigned", level: "High", tone: "bad" as Tone },
    { id: "CASE-1039", title: "MTR-41208 — no read for six days", meta: "Bwaliro Central · device silence", level: "High", tone: "bad" as Tone },
    { id: "CASE-1036", title: "Intake C — untagged supply", meta: "960 m³ unattributed", level: "Data", tone: "warn" as Tone },
  ]},
  { name: "Assigned", cards: [
    { id: "CASE-1035", title: "Account cluster — usage step down", meta: "9 accounts · G. Atieno", level: "Medium", tone: "warn" as Tone },
    { id: "CASE-1031", title: "Pump 2 — pressure drift", meta: "Elugulu North · J. Odhiambo", level: "Medium", tone: "warn" as Tone },
  ]},
  { name: "In field", cards: [
    { id: "CASE-1028", title: "Bwaliro Central — 31% unaccounted", meta: "Step test in progress", level: "High", tone: "bad" as Tone },
    { id: "CASE-1024", title: "Main MN-04 — third burst", meta: "Repair crew on site", level: "Critical", tone: "bad" as Tone },
  ]},
  { name: "Verified", cards: [
    { id: "CASE-1019", title: "Market — burst service line", meta: "Balance restored 11 Jul", level: "Closed", tone: "ok" as Tone },
  ]},
];

// Network map layer config now lives with react-leaflet's own LayersControl —
// see components/console/NetworkMap.tsx and lib/content/geomap.ts.

// ---- Premium: Revenue intelligence ----

export const REVENUE_ROWS = [
  { name: "Estimated bills", meta: "38 accounts read as estimates", value: "13.3%", tone: "warn" as Tone },
  { name: "Zero-consumption accounts", meta: "Active connection, no usage", value: "22", tone: "warn" as Tone },
  { name: "Usage step-downs", meta: "Flagged for verification", value: "9", tone: "warn" as Tone },
  { name: "Unmatched payments", meta: "M-Pesa reference mismatch", value: "12", tone: "bad" as Tone },
  { name: "Recovered after review", meta: "Year to date", value: "KSh 412k", tone: "ok" as Tone },
];

export const REVENUE_STATS = [
  { label: "Collection rate", value: "76.4%", tone: "ink" as Tone },
  { label: "Estimated bills", value: "13.3%", tone: "warn" as Tone },
  { label: "Accounts flagged", value: "43", tone: "ink" as Tone },
  { label: "Recovered YTD", value: "KSh 412k", tone: "ok" as Tone },
];

// ---- Premium: Integrations ----

export const CONNECTORS = [
  { name: "Bulk meter telemetry", mark: "BM", note: "Seven intake points reporting hourly.", state: "Connected", tone: "ok" as Tone, sync: "6 MIN AGO" },
  { name: "LoRaWAN network", mark: "LO", note: "41 connected customer meters.", state: "Connected", tone: "ok" as Tone, sync: "4 MIN AGO" },
  { name: "Field reader app", mark: "FR", note: "Offline route reading, syncs on signal.", state: "Connected", tone: "ok" as Tone, sync: "09:12 TODAY" },
  { name: "M-Pesa", mark: "MP", note: "Payment notifications and reconciliation.", state: "Connected", tone: "ok" as Tone, sync: "LIVE" },
  { name: "Billing register", mark: "BR", note: "Customer register and issued bills.", state: "Manual", tone: "warn" as Tone, sync: "MANUAL EXPORT" },
  { name: "QGIS / shapefiles", mark: "GI", note: "Zone boundaries and main alignments.", state: "Stale", tone: "warn" as Tone, sync: "3 DAYS AGO" },
  { name: "SMS gateway", mark: "SM", note: "Bill, payment and interruption alerts.", state: "Connected", tone: "ok" as Tone, sync: "LIVE" },
  { name: "WASREB reporting", mark: "WA", note: "Quarterly regulator return template.", state: "Connected", tone: "ok" as Tone, sync: "Q2 FILED" },
  { name: "Emita open API", mark: "API", note: "Outbound endpoints and webhooks.", state: "2 keys", tone: "mut" as Tone, sync: "—" },
];

// ---- Home / Overview — deeper sections below the KPI row ----

export const NRW_ALERT = {
  body: "Three intake points still need a zone tag before non-revenue water can be computed reliably across every DMA.",
  cta: "Tag intake points",
  href: "/dashboard/supply",
};

export const SHORTCUT_CARDS = [
  { title: "Tariffs", body: "Set water rates, standing charges and pricing tiers by zone.", cta: "Manage tariffs", href: "/dashboard/configurations", icon: "config" as IconKey },
  { title: "Billing", body: "Configure billing pipelines and watch payments land in real time.", cta: "Open billing", href: "/dashboard/billing", icon: "bill" as IconKey },
  { title: "Meter cycles", body: "Manage reading routes and the meter-billing cycle calendar.", cta: "Manage cycles", href: "/dashboard/supply", icon: "task" as IconKey },
];

export const TREND_MONTHS = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

export type Series = { key: string; label: string; tone: Tone; points: number[] };

export const CATEGORY_SERIES: Series[] = [
  { key: "domestic", label: "Domestic", tone: "accent", points: [70, 72, 74, 73, 76, 78, 80, 82, 84, 86, 88, 90] },
  { key: "public", label: "Public", tone: "cyan", points: [18, 17, 19, 20, 19, 21, 22, 21, 23, 24, 23, 25] },
  { key: "kiosks", label: "Water kiosks", tone: "ok", points: [8, 9, 8, 10, 9, 11, 10, 12, 11, 13, 12, 14] },
];

// Values are m³ — the unit lives once in the column header, not repeated per cell.
export const CATEGORY_BY_ZONE = [
  { zone: "Elugulu North", domestic: "620", public: "140", kiosks: "80" },
  { zone: "Bwaliro Central", domestic: "780", public: "210", kiosks: "60" },
  { zone: "Market", domestic: "210", public: "90", kiosks: "140" },
  { zone: "Elugulu South", domestic: "540", public: "120", kiosks: "40" },
  { zone: "Riverside", domestic: "480", public: "70", kiosks: "20" },
  { zone: "Sio Port road", domestic: "190", public: "30", kiosks: "10" },
];

// Kept consistent with ZONE_ROWS: Elugulu North is the same zone flagged
// "Critical" there (44% unaccounted, 1,840 m³ supplied, 1,030 m³ measured).
export const HIGHEST_NRW_ZONE = {
  zone: "Elugulu North",
  totalNrw: "810 m³",
  priorTrend: "+6.2 points on June",
  totalSupply: "1,840 m³",
  supplyTrend: "+3.1% on June",
  totalUsage: "1,030 m³",
  usageTrend: "-2.4% on June",
};

export const NRW_TREND: Series[] = [
  { key: "nrw", label: "Non-revenue water", tone: "bad", points: [22, 24, 26, 29, 31, 33, 35, 34, 36, 38, 40, 44] },
];

export const REVENUE_SUMMARY = {
  expected: "KSh 316,190",
  received: "KSh 241,800",
  efficiency: "76.4%",
  efficiencyTrend: "+3.1 points on June",
};

export const REVENUE_SERIES: Series[] = [
  { key: "gross", label: "Gross revenue", tone: "cyan", points: [210, 225, 240, 250, 265, 270, 280, 290, 300, 305, 310, 316] },
  { key: "net", label: "Net revenue", tone: "accent", points: [160, 168, 178, 185, 196, 202, 208, 214, 222, 228, 236, 242] },
];

// Gross/net are KSh — the currency lives once in the column header, not per cell.
export const REVENUE_BY_ZONE = [
  { zone: "Elugulu North", gross: "78,400", net: "58,200", efficiency: "74.2%" },
  { zone: "Bwaliro Central", gross: "92,100", net: "71,900", efficiency: "78.1%" },
  { zone: "Market", gross: "41,300", net: "33,800", efficiency: "81.8%" },
  { zone: "Elugulu South", gross: "52,600", net: "42,100", efficiency: "80.0%" },
  { zone: "Riverside", gross: "38,900", net: "30,400", efficiency: "78.2%" },
  { zone: "Sio Port road", gross: "12,890", net: "5,600", efficiency: "43.4%" },
];

export const EXPLAINER_CARDS = [
  {
    title: "WASREB billing compliance",
    question: "What are WASREB's billing requirements?",
    body: "Kenya's Water Services Regulatory Board sets conditions utilities must meet for an accurate, transparent billing system. Emita's reports are structured to match them.",
    cta: "View reports",
    href: "/dashboard/reports",
  },
  {
    title: "Inventory Mapper",
    question: "What is the Inventory Mapper?",
    body: "An offline-first field app for capturing new customers and new infrastructure — pipelines, tanks, valves — with exact coordinates. Every capture lands here as a draft for review before it merges into the real register.",
    cta: "Open Inventory Mapper",
    href: "/dashboard/mapper",
  },
  {
    title: "Billing pipelines",
    question: "What is a billing pipeline?",
    body: "A configurable pipeline that segments customers into groups — domestic, public, commercial — so each can run its own tariff and billing cycle.",
    cta: "Configure billing",
    href: "/dashboard/billing",
  },
];

// Notifications' templates and provider selection: a utility's own template overrides the
// platform default for that (event, channel) pair; the provider is chosen per channel, since a
// utility in a different country will use a different local SMS gateway. See Blueprint §03.7.

export type TemplateRow = {
  eventType: string;
  channel: "sms" | "email";
  body: string;
  custom: boolean;
};

export const TEMPLATES: TemplateRow[] = [
  { eventType: "bill.generated", channel: "sms", body: "Your {{utilityName}} bill for this period is {{currency}} {{total}}. Due {{dueDate}}.", custom: true },
  { eventType: "payment.received", channel: "sms", body: "We received your payment of {{currency}} {{amount}} to {{utilityName}}. Thank you.", custom: false },
  { eventType: "payment.unmatched", channel: "sms", body: "A payment could not be matched to an account — please contact {{utilityName}} with your reference.", custom: false },
  { eventType: "customer.defaulted", channel: "sms", body: "A defaulting fee of {{currency}} {{fee}} has been applied to your {{utilityName}} account for late payment.", custom: false },
  { eventType: "billing_cycle.completed", channel: "sms", body: "Billing for this cycle is complete.", custom: false },
];

export type ProviderRow = { channel: "sms" | "email"; provider: string; status: "connected" | "not configured" };

export const PROVIDERS: ProviderRow[] = [
  { channel: "sms", provider: "Africa's Talking", status: "connected" },
  { channel: "email", provider: "—", status: "not configured" },
];

// Zone/DMA configuration (Network & Assets). Naming and hierarchy live here; the boundary
// itself is drawn on the Network Map or captured via Inventory Mapper — this is deliberately
// not a second place to redraw geometry.
export type ZoneConfig = { id: string; name: string; parentZone: string | null; dmaCode: string };

export const ZONES: ZoneConfig[] = [
  { id: "z1", name: "Elugulu North", parentZone: null, dmaCode: "DMA-01" },
  { id: "z2", name: "Bwaliro Central", parentZone: null, dmaCode: "DMA-02" },
  { id: "z3", name: "Market", parentZone: null, dmaCode: "DMA-03" },
  { id: "z4", name: "Elugulu South", parentZone: null, dmaCode: "DMA-04" },
  { id: "z5", name: "Riverside", parentZone: null, dmaCode: "DMA-05" },
  { id: "z6", name: "Sio Port road", parentZone: null, dmaCode: "DMA-06" },
];

// "Other services" — one-off charges outside the regular tariff/consumption cycle (connection,
// reconnection, deposits). Carried over from the old system's config menu; the new billing
// engine doesn't yet have a place to attach an ad-hoc charge to a specific bill — see README.
export type ServiceFee = { id: string; name: string; amount: number; kind: "one-off" | "recurring" };

export const SERVICE_FEES: ServiceFee[] = [
  { id: "sf1", name: "New connection fee", amount: 3500, kind: "one-off" },
  { id: "sf2", name: "Reconnection fee", amount: 800, kind: "one-off" },
  { id: "sf3", name: "Meter replacement", amount: 2200, kind: "one-off" },
  { id: "sf4", name: "Security deposit", amount: 1500, kind: "one-off" },
];

// Invoice categories: named, priced line-item types. "Water Bill" is dynamic (computed from the
// tariff at billing time); one-off charges like Disconnection are fixed. Disconnection and
// Defaulting below don't hold their own fee amounts — they reference a category here, so the
// number lives in exactly one place.
export type InvoiceCategoryMode = "fixed" | "dynamic";
export type InvoiceCategory = { id: string; name: string; mode: InvoiceCategoryMode; amount?: number };

export const INVOICE_CATEGORIES: InvoiceCategory[] = [
  { id: "water-bill", name: "Water Bill", mode: "dynamic" },
  { id: "disconnection", name: "Disconnection", mode: "fixed", amount: 500 },
  { id: "reconnection", name: "Reconnection", mode: "fixed", amount: 800 },
];

// Disconnection is a manual action today — there's no automated policy in the backend yet.
// Shown here, off, rather than hidden, so it's clear the capability is planned, not silently
// missing. thresholdDays/thresholdAmount decide *eligibility* (when a customer qualifies);
// feeCategoryId points at the Invoice Category that prices the fee actually charged.
export const DISCONNECTION_POLICY = {
  automated: false,
  thresholdDays: 45,
  thresholdAmount: 3000,
  chargeFeeOnDisconnect: true,
  feeCategoryId: "disconnection",
};

// Mirrors emita.defaulting.percentage on Payments & Ledger — currently an app-wide setting, not
// yet per-utility configurable from here. Grace period is per invoice category, since a
// disconnection fee and a water bill don't need to default on the same clock.
export const DEFAULTING_POLICY = {
  percentage: 5,
  graceDaysByCategory: [
    { categoryId: "water-bill", days: 14 },
    { categoryId: "disconnection", days: 7 },
  ],
};

// M-Pesa payment pipelines (Safaricom Daraja) — a shortcode can be scoped to one DMA or all of
// them, matching how a utility might run one paybill per zone. The passkey is what the platform
// uses server-side to initiate Lipa Na M-Pesa Online (STK Push) against this shortcode — without
// it we can only receive payments a customer sends manually, never prompt their phone to pay.
export type ShortcodeType = "paybill" | "till";
export type PaymentPipeline = {
  id: string;
  shortCode: string;
  type: ShortcodeType;
  dma: string; // zone name, or "All DMAs"
  consumerKey: string;
  consumerSecret: string;
  passkey: string;
  registered: boolean;
};

export const PAYMENT_PIPELINES: PaymentPipeline[] = [
  {
    id: "pp1",
    shortCode: "400200",
    type: "paybill",
    dma: "All DMAs",
    consumerKey: "qzR7...m4Lp",
    consumerSecret: "••••••••••••",
    passkey: "••••••••••••",
    registered: true,
  },
];

// Scheduled automation — none of this exists in the backend yet (every cycle/task run today is
// triggered by an explicit API call). See README.
export type RecurringTask = { name: string; frequency: string; nextRun: string; enabled: boolean };

export const RECURRING_TASKS: RecurringTask[] = [
  { name: "Open the monthly billing cycle", frequency: "Monthly, 1st", nextRun: "1 Sep 2026", enabled: false },
  { name: "Generate meter read tasks for the open cycle", frequency: "Monthly, 5th", nextRun: "5 Sep 2026", enabled: false },
  { name: "Generate daily supply-point read tasks", frequency: "Daily, 06:00", nextRun: "Tomorrow, 06:00", enabled: false },
];

// Billing & Tariff Engine, as modeled server-side: a tariff is an ordered list of composable
// charge components (fixed / volume / derived / discount) — never a fixed "block or flat"
// shape — and is immutable once published; a customer group carries the tariff, so moving a
// group's tariff pointer re-rates every member at once. A billing cycle's "run" is idempotent
// by construction (one bill per meter per cycle), which is why a completed cycle can be
// re-run safely and simply does nothing on the meters it already billed.

import type { Tone } from "./console";
import { BILLING_CYCLE_CONFIG, recentCycles, formatCyclePeriod, cycleStatus as computeCycleStatus } from "./billingCycle";

export type CycleStatus = "pending" | "running" | "review" | "completed" | "failed";

export const CYCLE_STATUS_META: Record<CycleStatus, { label: string; tone: Tone }> = {
  pending: { label: "Pending", tone: "mut" },
  running: { label: "Reading", tone: "accent" },
  review: { label: "In review", tone: "warn" },
  completed: { label: "Completed", tone: "ok" },
  failed: { label: "Failed", tone: "bad" },
};

export type CycleRow = {
  id: string;
  period: string;
  billIssueDate: string;
  status: CycleStatus;
  bills: number;
  total: string;
  runAt: string;
};

const RECENT = recentCycles(BILLING_CYCLE_CONFIG, 4);
const HISTORICAL_TOTALS = [
  { bills: 0, total: "—", runAt: "Not yet run" },
  { bills: 286, total: "KSh 316,190", runAt: "12 Jul, 06:04" },
  { bills: 281, total: "KSh 298,760", runAt: "12 Jun, 06:11" },
  { bills: 277, total: "KSh 289,410", runAt: "12 May, 06:02" },
];

export const CYCLES: CycleRow[] = RECENT.map((c, i) => {
  const status = computeCycleStatus(c);
  const isCurrent = i === 0;
  return {
    id: c.readingStart.toISOString().slice(0, 10),
    period: formatCyclePeriod(c),
    billIssueDate: c.billIssueDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    status: isCurrent ? status : "completed",
    bills: isCurrent && status !== "completed" ? 0 : HISTORICAL_TOTALS[i].bills,
    total: isCurrent && status !== "completed" ? "—" : HISTORICAL_TOTALS[i].total,
    runAt: isCurrent && status !== "completed" ? "Not yet run" : HISTORICAL_TOTALS[i].runAt,
  };
});

export const CYCLE_STATS = {
  currentPeriod: CYCLES[0].period,
  billsThisYear: 4,
  awaitingSnapshots: "Consumption still arriving from 41 connected meters",
};

export type ComponentType = "fixed" | "volume" | "derived" | "discount";

export type TariffComponent = {
  label: string;
  type: ComponentType;
  summary: string; // human-readable rendering of the config JSON
};

export type TariffRow = {
  id: string;
  name: string;
  status: "draft" | "published" | "superseded";
  currency: string;
  effectiveFrom: string;
  groupsUsing: number;
  components: TariffComponent[];
};

export const TARIFF_STATUS_META: Record<TariffRow["status"], { label: string; tone: Tone }> = {
  draft: { label: "Draft", tone: "mut" },
  published: { label: "Published", tone: "ok" },
  superseded: { label: "Superseded", tone: "warn" },
};

export const TARIFFS: TariffRow[] = [
  {
    id: "t-domestic-2026b",
    name: "Domestic — 2026B",
    status: "published",
    currency: "KES",
    effectiveFrom: "1 Jun 2026",
    groupsUsing: 1,
    components: [
      { label: "standing_charge", type: "fixed", summary: "KSh 150 fixed, every cycle" },
      { label: "volume_charge", type: "volume", summary: "Block-marginal: 0–6 m³ @ 30 · 6–20 m³ @ 45 · 20+ m³ @ 60" },
      { label: "sewer_charge", type: "derived", summary: "30% of volume_charge" },
      { label: "vat", type: "derived", summary: "16% of subtotal" },
    ],
  },
  {
    id: "t-commercial-2026a",
    name: "Commercial — 2026A",
    status: "published",
    currency: "KES",
    effectiveFrom: "1 Jan 2026",
    groupsUsing: 1,
    components: [
      { label: "standing_charge", type: "fixed", summary: "KSh 450 fixed, every cycle" },
      { label: "volume_charge", type: "volume", summary: "Flat rate: KSh 68 per m³" },
      { label: "vat", type: "derived", summary: "16% of subtotal" },
    ],
  },
  {
    id: "t-kiosk-2026a",
    name: "Water kiosks — 2026A",
    status: "published",
    currency: "KES",
    effectiveFrom: "1 Jan 2026",
    groupsUsing: 1,
    components: [
      { label: "volume_charge", type: "volume", summary: "Block-step: whole quantity billed at KSh 25/m³ up to 40 m³, else KSh 40/m³" },
      { label: "loyalty_discount", type: "discount", summary: "10% of subtotal, on-time-payment accounts only" },
    ],
  },
  {
    id: "t-domestic-2026c-draft",
    name: "Domestic — 2026C (draft)",
    status: "draft",
    currency: "KES",
    effectiveFrom: "1 Sep 2026",
    groupsUsing: 0,
    components: [
      { label: "standing_charge", type: "fixed", summary: "KSh 180 fixed, every cycle" },
      { label: "volume_charge", type: "volume", summary: "Block-marginal: 0–6 m³ @ 32 · 6–20 m³ @ 48 · 20+ m³ @ 64" },
      { label: "sewer_charge", type: "derived", summary: "30% of volume_charge" },
      { label: "vat", type: "derived", summary: "16% of subtotal" },
    ],
  },
];

export type GroupRow = { id: string; name: string; tariffId: string; members: number };

export const GROUPS: GroupRow[] = [
  { id: "g-domestic", name: "Domestic", tariffId: "t-domestic-2026b", members: 224 },
  { id: "g-commercial", name: "Commercial", tariffId: "t-commercial-2026a", members: 34 },
  { id: "g-public", name: "Public", tariffId: "t-kiosk-2026a", members: 12 },
  { id: "g-kiosks", name: "Water kiosks", tariffId: "t-kiosk-2026a", members: 16 },
];

export const UNMATCHED_PAYMENTS = {
  count: 12,
  amount: "KSh 18,640",
  note: "M-Pesa reference didn't match an account number on this utility.",
};

// One row per generated Bill — the old system's "Invoices" screen. Status is derived from the
// ledger (paid = fully offset by payments), not a field stored on the bill itself.
export type InvoiceStatus = "paid" | "partial" | "unpaid";

export const INVOICE_STATUS_META: Record<InvoiceStatus, { label: string; tone: Tone }> = {
  paid: { label: "Paid", tone: "ok" },
  partial: { label: "Partially paid", tone: "warn" },
  unpaid: { label: "Unpaid", tone: "bad" },
};

export type InvoiceRow = {
  id: string;
  customer: string;
  accountNumber: string;
  period: string;
  total: string;
  status: InvoiceStatus;
  issuedAt: string;
};

export const INVOICES: InvoiceRow[] = [
  { id: "b-8841", customer: "Riverside Apartments Ltd", accountNumber: "BW-000181", period: "Jul 2026", total: "KSh 4,820", status: "unpaid", issuedAt: "12 Jul" },
  { id: "b-8839", customer: "A. Nakhumicha", accountNumber: "BW-000174", period: "Jul 2026", total: "KSh 1,240", status: "paid", issuedAt: "12 Jul" },
  { id: "b-8834", customer: "Market Kiosk 4", accountNumber: "BW-000163", period: "Jul 2026", total: "KSh 2,010", status: "partial", issuedAt: "12 Jul" },
  { id: "b-8829", customer: "J. Barasa", accountNumber: "BW-000158", period: "Jul 2026", total: "KSh 1,980", status: "unpaid", issuedAt: "12 Jul" },
  { id: "b-8822", customer: "Elugulu Primary School", accountNumber: "BW-000152", period: "Jul 2026", total: "KSh 6,400", status: "paid", issuedAt: "12 Jul" },
  { id: "b-8818", customer: "P. Wafula", accountNumber: "BW-000149", period: "Jul 2026", total: "KSh 620", status: "unpaid", issuedAt: "12 Jul" },
  { id: "b-8811", customer: "Sio Bakery & Stores", accountNumber: "BW-000141", period: "Jul 2026", total: "KSh 3,140", status: "paid", issuedAt: "12 Jul" },
];

// — Payments: the actual M-Pesa/bank transaction feed, distinct from Invoices. A payment can
// arrive without matching any account (wrong/garbled reference) — those sit in "Issues" until a
// staff member reconciles them by hand. —
export type PaymentMatch = { accountNumber: string; customer: string } | null;

export type PaymentRow = {
  id: string;
  transactionId: string;
  shortCode: string;
  amount: number;
  msisdn: string;
  paidAt: string;
  match: PaymentMatch;
};

function mulberry32b(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generatePayments(count: number): PaymentRow[] {
  const rand = mulberry32b(90210);
  const names = ["Riverside Apartments Ltd", "A. Nakhumicha", "Market Kiosk 4", "J. Barasa", "Elugulu Primary School", "P. Wafula", "Sio Bakery & Stores", "G. Nafula", "Riverside Clinic"];
  const accounts = ["BW-000181", "BW-000174", "BW-000163", "BW-000158", "BW-000152", "BW-000149", "BW-000141", "BW-000137", "BW-000129"];
  const rows: PaymentRow[] = [];
  for (let i = 0; i < count; i++) {
    const matched = rand() > 0.22;
    const idx = Math.floor(rand() * names.length);
    const day = Math.floor(rand() * 27) + 1;
    rows.push({
      id: `pay-${i}`,
      transactionId: `Q${Math.floor(rand() * 90000000 + 10000000)}`,
      shortCode: "400200",
      amount: Math.round((rand() * 4500 + 200) / 10) * 10,
      msisdn: `2547${Math.floor(rand() * 90000000 + 10000000)}`,
      paidAt: new Date(2026, 7, day).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      match: matched ? { accountNumber: accounts[idx], customer: names[idx] } : null,
    });
  }
  return rows.sort((a, b) => (a.paidAt < b.paidAt ? 1 : -1));
}

export const PAYMENTS: PaymentRow[] = generatePayments(60);
export const PAYMENT_STATS = {
  total: PAYMENTS.length,
  matched: PAYMENTS.filter((p) => p.match).length,
  issues: PAYMENTS.filter((p) => !p.match).length,
  issuesAmount: PAYMENTS.filter((p) => !p.match).reduce((s, p) => s + p.amount, 0),
};

// — Histories: a log of bulk-notification batches (bill delivery, payment reminders) — separate
// from the per-customer notification log on a customer's own profile. —
export type HistoryEntry = {
  id: string;
  date: string;
  kind: "Bills Delivery" | "Reminders";
  prepared: number;
  delivered: number;
  failed: number;
};

export const HISTORIES: HistoryEntry[] = [
  { id: "h-1", date: "27 Aug 2026", kind: "Bills Delivery", prepared: 286, delivered: 284, failed: 2 },
  { id: "h-2", date: "1 Aug 2026", kind: "Reminders", prepared: 231, delivered: 231, failed: 0 },
  { id: "h-3", date: "12 Jul 2026", kind: "Bills Delivery", prepared: 281, delivered: 279, failed: 2 },
  { id: "h-4", date: "4 Jul 2026", kind: "Reminders", prepared: 198, delivered: 195, failed: 3 },
  { id: "h-5", date: "12 Jun 2026", kind: "Bills Delivery", prepared: 277, delivered: 277, failed: 0 },
  { id: "h-6", date: "4 Jun 2026", kind: "Reminders", prepared: 204, delivered: 201, failed: 3 },
];

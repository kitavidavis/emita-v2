// Billing & Tariff Engine, as modeled server-side: a tariff is an ordered list of composable
// charge components (fixed / volume / derived / discount) — never a fixed "block or flat"
// shape — and is immutable once published; a customer group carries the tariff, so moving a
// group's tariff pointer re-rates every member at once. A billing cycle's "run" is idempotent
// by construction (one bill per meter per cycle), which is why a completed cycle can be
// re-run safely and simply does nothing on the meters it already billed.

import type { Tone } from "./console";

export type CycleStatus = "pending" | "running" | "completed" | "failed";

export const CYCLE_STATUS_META: Record<CycleStatus, { label: string; tone: Tone }> = {
  pending: { label: "Pending", tone: "mut" },
  running: { label: "Running", tone: "accent" },
  completed: { label: "Completed", tone: "ok" },
  failed: { label: "Failed", tone: "bad" },
};

export type CycleRow = {
  id: string;
  period: string;
  status: CycleStatus;
  bills: number;
  total: string;
  runAt: string;
};

export const CYCLES: CycleRow[] = [
  { id: "2026-08", period: "1–31 Aug 2026", status: "pending", bills: 0, total: "—", runAt: "Not yet run" },
  { id: "2026-07", period: "1–31 Jul 2026", status: "completed", bills: 286, total: "KSh 316,190", runAt: "12 Jul, 06:04" },
  { id: "2026-06", period: "1–30 Jun 2026", status: "completed", bills: 281, total: "KSh 298,760", runAt: "12 Jun, 06:11" },
  { id: "2026-05", period: "1–31 May 2026", status: "completed", bills: 277, total: "KSh 289,410", runAt: "12 May, 06:02" },
];

export const CYCLE_STATS = {
  currentPeriod: "August 2026",
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

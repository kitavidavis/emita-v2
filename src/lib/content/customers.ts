// Customer & Meter Registry, as modeled server-side: a customer's status is one enum with
// defined transitions (connected → disconnected → archived → deleted, deleted terminal), not
// three independent booleans — and a customer belongs to exactly one tariff group, which is
// what actually determines their rate (not a raw per-customer tariff pointer). "Deleted"
// customers are tombstoned and excluded from every normal view here, same as the API.
//
// Everything below is dummy data generated deterministically (a seeded PRNG, not Math.random())
// so server and client render identically and there is no hydration mismatch.

import type { Tone } from "./console";

export type CustomerStatus = "connected" | "disconnected" | "archived";
export type BillingType = "postpaid" | "prepaid";
export type NotificationChannel = "sms" | "email" | "whatsapp" | "in-app";

export const STATUS_META: Record<CustomerStatus, { label: string; tone: Tone }> = {
  connected: { label: "Connected", tone: "ok" },
  disconnected: { label: "Disconnected", tone: "warn" },
  archived: { label: "Archived", tone: "mut" },
};

export const BILLING_TYPE_META: Record<BillingType, { label: string }> = {
  postpaid: { label: "Postpaid" },
  prepaid: { label: "Prepaid" },
};

export const CHANNEL_META: Record<NotificationChannel, { label: string; icon: string }> = {
  sms: { label: "SMS", icon: "M2 4h12v8H2zM5 14h6" },
  email: { label: "Email", icon: "M2 4h12v8H2zM2 4l6 5 6-5" },
  whatsapp: { label: "WhatsApp", icon: "M8 1.5A6.5 6.5 0 002.4 11.4L1.5 14.5l3.2-.9A6.5 6.5 0 108 1.5z" },
  "in-app": { label: "In-app", icon: "M4 6.5a4 4 0 018 0c0 3 1 4 1 4H3s1-1 1-4M6.4 13a1.7 1.7 0 003.2 0" },
};

export type CustomerRow = {
  id: string;
  accountNumber: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  zone: string;
  dma: string;
  group: string;
  tariff: string;
  billingType: BillingType;
  meterNumber: string;
  status: CustomerStatus;
  balance: number; // KSh, positive = owed to the utility
  location: boolean; // has a mapped lat/lng
  lat: number | null;
  lng: number | null;
  connectedSince: string;
  lastReadingDate: string;
  lastReadingValue: number;
  currentReadingValue: number;
  modifiedAt: string;
};

// — deterministic PRNG (mulberry32) so the same "random" data renders on server and client —
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ZONES = ["Riverside", "Elugulu North", "Elugulu South", "Market", "Bwaliro Central", "Sio Port road"];
const MAP_CENTER: [number, number] = [0.4798, 34.1218];
const ZONE_OFFSETS: Record<string, [number, number]> = {
  Riverside: [0.006, -0.004],
  "Elugulu North": [0.014, 0.01],
  "Elugulu South": [-0.012, 0.008],
  Market: [-0.002, -0.012],
  "Bwaliro Central": [0, 0],
  "Sio Port road": [-0.018, -0.006],
};
const DMAS = ["DMA 01", "DMA 02", "DMA 03", "DMA 04", "DMA 05", "DMA 06"];
const GROUP_POOL = ["Domestic", "Commercial", "Public", "Water kiosks"];
const TARIFFS: Record<string, string[]> = {
  Domestic: ["Domestic Tier 1 (0–6m³)", "Domestic Tier 2 (7–20m³)", "Domestic Tier 3 (21m³+)"],
  Commercial: ["Commercial Standard", "Commercial High-Volume"],
  Public: ["Public Institution"],
  "Water kiosks": ["Kiosk Bulk Rate"],
};
const FIRST_NAMES = ["A.", "J.", "P.", "G.", "F.", "M.", "S.", "D.", "L.", "R.", "N.", "C.", "B.", "T.", "W."];
const LAST_NAMES = [
  "Nakhumicha", "Barasa", "Wafula", "Nafula", "Simiyu", "Okoth", "Wanjala", "Otieno", "Mudavadi", "Khisa",
  "Namisi", "Wekesa", "Situma", "Nekesa", "Juma", "Achieng", "Odhiambo", "Kiplagat", "Mwangi", "Cheruiyot",
];
const BUSINESS_NAMES = [
  "Riverside Apartments Ltd", "Market Kiosk", "Sio Bakery & Stores", "Riverside Clinic", "Bwaliro Water Kiosk",
  "Elugulu Primary School", "Sunrise Traders", "Lakeview Guesthouse", "Central Butchery", "Green Acres Farm",
  "St. Mary's Dispensary", "Highway Fuel Stop", "Elugulu Cereals Store", "Bwaliro Timber Yard", "Unity Hardware",
];

function pick<T>(arr: T[], rand: () => number) {
  return arr[Math.floor(rand() * arr.length)];
}

function generateCustomers(count: number): CustomerRow[] {
  const rand = mulberry32(20260830);
  const rows: CustomerRow[] = [];
  for (let i = 0; i < count; i++) {
    const num = 200 - i;
    const accountNumber = `BW-${String(Math.max(num, 1)).padStart(6, "0")}`;
    const group = pick(GROUP_POOL, rand);
    const isBusiness = group !== "Domestic";
    const name = isBusiness
      ? `${pick(BUSINESS_NAMES, rand)}${rand() > 0.7 ? ` ${Math.floor(rand() * 9) + 1}` : ""}`
      : `${pick(FIRST_NAMES, rand)} ${pick(LAST_NAMES, rand)}`;
    const statusRoll = rand();
    const status: CustomerStatus = statusRoll > 0.92 ? "archived" : statusRoll > 0.78 ? "disconnected" : "connected";
    const balance = status === "connected" && rand() > 0.55 ? 0 : Math.round(rand() * 6000);
    const zone = pick(ZONES, rand);
    const monthsAgo = Math.floor(rand() * 40) + 1;
    const connDate = new Date(2026, 7 - monthsAgo, 1);
    const lastReadDate = new Date(2026, 7, Math.floor(rand() * 27) + 1);
    const currentReading = 400 + Math.floor(rand() * 5000);
    const modMonthsAgo = Math.floor(rand() * 6);
    const modDate = new Date(2026, 7 - modMonthsAgo, Math.floor(rand() * 27) + 1);
    const hasLocation = rand() > 0.15;
    const zoneOffset = ZONE_OFFSETS[zone] ?? [0, 0];
    rows.push({
      id: String(i + 1),
      accountNumber,
      name,
      phone: `+2547${Math.floor(rand() * 90000000 + 10000000)}`,
      email: `${name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "")}@example.com`,
      address: `${zone}, Plot ${Math.floor(rand() * 400) + 1}`,
      zone,
      dma: pick(DMAS, rand),
      group,
      tariff: pick(TARIFFS[group], rand),
      billingType: rand() > 0.85 ? "prepaid" : "postpaid",
      meterNumber: `MTR-${String(Math.floor(rand() * 900000) + 100000)}`,
      status,
      balance,
      location: hasLocation,
      lat: hasLocation ? MAP_CENTER[0] + zoneOffset[0] + (rand() - 0.5) * 0.006 : null,
      lng: hasLocation ? MAP_CENTER[1] + zoneOffset[1] + (rand() - 0.5) * 0.006 : null,
      connectedSince: connDate.toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
      lastReadingDate: lastReadDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      lastReadingValue: Math.max(currentReading - Math.floor(rand() * 30) - 5, 0),
      currentReadingValue: currentReading,
      modifiedAt: modDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    });
  }
  return rows;
}

export const CUSTOMERS: CustomerRow[] = generateCustomers(286);

export const STATUS_FILTERS: { key: CustomerStatus | "all"; label: string }[] = [
  { key: "all", label: "All active" },
  { key: "connected", label: "Connected" },
  { key: "disconnected", label: "Disconnected" },
  { key: "archived", label: "Archived" },
];

export const GROUPS = GROUP_POOL;
export const ZONE_OPTIONS = ZONES;
export const DMA_OPTIONS = DMAS;

export const CUSTOMER_STATS = {
  total: CUSTOMERS.length,
  connected: CUSTOMERS.filter((c) => c.status === "connected").length,
  disconnected: CUSTOMERS.filter((c) => c.status === "disconnected").length,
  archived: CUSTOMERS.filter((c) => c.status === "archived").length,
  unmapped: CUSTOMERS.filter((c) => !c.location).length,
};

// Transitions allowed from each status — mirrors the server-side state machine exactly, so the
// status menu in the UI never offers a move the API would reject.
export const ALLOWED_NEXT: Record<CustomerStatus, CustomerStatus[]> = {
  connected: ["disconnected"],
  disconnected: ["connected", "archived"],
  archived: ["connected"],
};

// — per-customer detail: consumption, invoices, payments, notification history — generated
// lazily from the customer row so the base list above stays lightweight. —

export type ConsumptionRecord = { period: string; reading: number; consumption: number; billed: number };
export type InvoiceStatus = "paid" | "unpaid" | "overdue" | "void";
export type Invoice = {
  id: string;
  number: string;
  period: string;
  issuedDate: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
  paidDate?: string;
};
export type PaymentMethod = "M-Pesa" | "Cash" | "Bank transfer" | "Card";
export type Payment = { id: string; date: string; amount: number; method: PaymentMethod; reference: string; appliedTo: string };
export type NotificationLogEntry = {
  id: string;
  channel: NotificationChannel;
  subject?: string;
  message: string;
  sentAt: string;
  status: "delivered" | "failed" | "pending";
};

export const INVOICE_STATUS_META: Record<InvoiceStatus, { label: string; tone: Tone }> = {
  paid: { label: "Paid", tone: "ok" },
  unpaid: { label: "Unpaid", tone: "warn" },
  overdue: { label: "Overdue", tone: "bad" },
  void: { label: "Void", tone: "mut" },
};

const MONTHS = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];

export type CustomerDetail = {
  consumption: ConsumptionRecord[];
  invoices: Invoice[];
  payments: Payment[];
  notifications: NotificationLogEntry[];
};

export function getCustomerDetail(c: CustomerRow): CustomerDetail {
  const rand = mulberry32(Number(c.id) * 7919 + 13);
  const rate = 120; // KSh per m³, illustrative

  const consumption: ConsumptionRecord[] = MONTHS.map((period, i) => {
    const base = 8 + Math.round(rand() * 14);
    const consumptionM3 = c.group === "Domestic" ? base : base * 4;
    return {
      period: `${period} 2026`,
      reading: c.lastReadingValue - (MONTHS.length - 1 - i) * consumptionM3,
      consumption: consumptionM3,
      billed: consumptionM3 * rate,
    };
  });

  const invoices: Invoice[] = MONTHS.map((period, i) => {
    const isLast = i === MONTHS.length - 1;
    const isSecondLast = i === MONTHS.length - 2;
    const amount = consumption[i].billed;
    let status: InvoiceStatus = "paid";
    if (c.balance > 0 && isLast) status = "overdue";
    else if (c.balance > 0 && isSecondLast) status = "unpaid";
    const issued = new Date(2026, 1 + i, 28);
    const due = new Date(2026, 2 + i, 14);
    return {
      id: `${c.id}-inv-${i}`,
      number: `INV-${c.accountNumber.replace("BW-", "")}-${String(i + 1).padStart(2, "0")}`,
      period: `${period} 2026`,
      issuedDate: issued.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      dueDate: due.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      amount,
      status,
      paidDate: status === "paid" ? due.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : undefined,
    };
  });

  const methods: PaymentMethod[] = ["M-Pesa", "Cash", "Bank transfer", "Card"];
  const payments: Payment[] = invoices
    .filter((inv) => inv.status === "paid")
    .map((inv, i) => ({
      id: `${c.id}-pay-${i}`,
      date: inv.paidDate!,
      amount: inv.amount,
      method: pick(methods, rand),
      reference: `${pick(methods, rand) === "M-Pesa" ? "QK" : "RC"}${Math.floor(rand() * 9000000 + 1000000)}`,
      appliedTo: inv.number,
    }));

  const channels: NotificationChannel[] = ["sms", "email", "sms", "in-app"];
  const notifications: NotificationLogEntry[] = invoices.slice(-4).map((inv, i) => ({
    id: `${c.id}-notif-${i}`,
    channel: channels[i % channels.length],
    subject: channels[i % channels.length] === "email" ? `Invoice ${inv.number} issued` : undefined,
    message:
      inv.status === "overdue"
        ? `Your account ${c.accountNumber} has an overdue balance of KSh ${c.balance.toLocaleString()}. Please settle to avoid disconnection.`
        : `Invoice ${inv.number} for KSh ${inv.amount.toLocaleString()} has been issued for ${inv.period}.`,
    sentAt: inv.issuedDate,
    status: rand() > 0.08 ? "delivered" : "failed",
  }));

  return { consumption, invoices, payments, notifications };
}

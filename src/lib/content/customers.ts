// Customer & Meter Registry, as modeled server-side: a customer's status is one enum with
// defined transitions (connected → disconnected → archived → deleted, deleted terminal), not
// three independent booleans — and a customer belongs to exactly one tariff group, which is
// what actually determines their rate (not a raw per-customer tariff pointer). "Deleted"
// customers are tombstoned and excluded from every normal view here, same as the API.

import type { Tone } from "./console";

export type CustomerStatus = "connected" | "disconnected" | "archived";

export const STATUS_META: Record<CustomerStatus, { label: string; tone: Tone }> = {
  connected: { label: "Connected", tone: "ok" },
  disconnected: { label: "Disconnected", tone: "warn" },
  archived: { label: "Archived", tone: "mut" },
};

export type CustomerRow = {
  id: string;
  accountNumber: string;
  name: string;
  phone: string;
  zone: string;
  group: string;
  status: CustomerStatus;
  balance: number; // KSh, positive = owed to the utility
  location: boolean; // has a mapped lat/lng
  connectedSince: string;
};

export const CUSTOMERS: CustomerRow[] = [
  { id: "1", accountNumber: "BW-000181", name: "Riverside Apartments Ltd", phone: "+254712 340 181", zone: "Riverside", group: "Commercial", status: "connected", balance: 4820, location: true, connectedSince: "Jul 2026" },
  { id: "2", accountNumber: "BW-000174", name: "A. Nakhumicha", phone: "+254701 552 019", zone: "Elugulu North", group: "Domestic", status: "connected", balance: 0, location: true, connectedSince: "Jun 2026" },
  { id: "3", accountNumber: "BW-000163", name: "Market Kiosk 4", phone: "+254733 118 402", zone: "Market", group: "Water kiosks", status: "connected", balance: 1240, location: false, connectedSince: "May 2026" },
  { id: "4", accountNumber: "BW-000158", name: "J. Barasa", phone: "+254720 904 771", zone: "Bwaliro Central", group: "Domestic", status: "disconnected", balance: 3960, location: true, connectedSince: "Feb 2025" },
  { id: "5", accountNumber: "BW-000152", name: "Elugulu Primary School", phone: "+254798 220 013", zone: "Elugulu South", group: "Public", status: "connected", balance: 0, location: true, connectedSince: "Nov 2023" },
  { id: "6", accountNumber: "BW-000149", name: "P. Wafula", phone: "+254711 004 552", zone: "Bwaliro Central", group: "Domestic", status: "connected", balance: 620, location: false, connectedSince: "Jan 2024" },
  { id: "7", accountNumber: "BW-000141", name: "Sio Bakery & Stores", phone: "+254706 771 340", zone: "Sio Port road", group: "Commercial", status: "connected", balance: 0, location: true, connectedSince: "Aug 2024" },
  { id: "8", accountNumber: "BW-000137", name: "G. Nafula", phone: "+254715 883 291", zone: "Elugulu North", group: "Domestic", status: "disconnected", balance: 5410, location: false, connectedSince: "Mar 2024" },
  { id: "9", accountNumber: "BW-000129", name: "Riverside Clinic", phone: "+254722 660 187", zone: "Riverside", group: "Public", status: "connected", balance: 0, location: true, connectedSince: "Nov 2023" },
  { id: "10", accountNumber: "BW-000118", name: "M. Simiyu", phone: "+254733 402 916", zone: "Market", group: "Domestic", status: "archived", balance: 0, location: false, connectedSince: "Dec 2023 – vacated Apr 2026" },
  { id: "11", accountNumber: "BW-000104", name: "Bwaliro Water Kiosk 1", phone: "+254701 229 004", zone: "Bwaliro Central", group: "Water kiosks", status: "connected", balance: 340, location: true, connectedSince: "Nov 2023" },
  { id: "12", accountNumber: "BW-000098", name: "F. Okoth", phone: "+254712 558 003", zone: "Elugulu South", group: "Domestic", status: "connected", balance: 0, location: true, connectedSince: "Nov 2023" },
];

export const STATUS_FILTERS: { key: CustomerStatus | "all"; label: string }[] = [
  { key: "all", label: "All active" },
  { key: "connected", label: "Connected" },
  { key: "disconnected", label: "Disconnected" },
  { key: "archived", label: "Archived" },
];

export const GROUPS = ["Domestic", "Commercial", "Public", "Water kiosks"];

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

// Identity & Access's API keys: scoped, utility-issued, revocable — the generalized replacement
// for a central "grant this county/regulator access" table. The utility decides what's shared
// and with whom; nothing is granted on its behalf.

export type ScopeKey = "reports:read" | "billing:read" | "customers:read";

export const SCOPES: { key: ScopeKey; label: string; note: string; sensitive?: boolean }[] = [
  { key: "reports:read", label: "Reports", note: "Aggregate dashboards — NRW, revenue, collection efficiency. What a regulator or county usually needs." },
  { key: "billing:read", label: "Billing", note: "Bill and payment history, still aggregate rather than individual customer records." },
  { key: "customers:read", label: "Customers", note: "Full customer records, including contact details.", sensitive: true },
];

export type ApiKeyRow = {
  id: string;
  name: string;
  prefix: string;
  scopes: ScopeKey[];
  createdBy: string;
  createdAt: string;
  expiresAt: string | null;
  lastUsed: string | null;
  revoked: boolean;
};

export const API_KEYS: ApiKeyRow[] = [
  { id: "k1", name: "WASREB quarterly reporting", prefix: "emk_7f2a9c1e", scopes: ["reports:read"], createdBy: "N. Wanjala", createdAt: "3 Feb 2026", expiresAt: "3 Feb 2027", lastUsed: "2 days ago", revoked: false },
  { id: "k2", name: "County revenue office dashboard", prefix: "emk_1b6d40aa", scopes: ["reports:read", "billing:read"], createdBy: "N. Wanjala", createdAt: "18 Nov 2025", expiresAt: null, lastUsed: "6 hours ago", revoked: false },
  { id: "k3", name: "Old finance export (unused)", prefix: "emk_9932e01f", scopes: ["billing:read"], createdBy: "D. Kitavi", createdAt: "2 May 2024", expiresAt: "2 May 2025", lastUsed: "14 Jul 2025", revoked: true },
];

export const ACCESS_STATS = {
  active: API_KEYS.filter((k) => !k.revoked).length,
  sensitiveGrants: API_KEYS.filter((k) => !k.revoked && k.scopes.includes("customers:read")).length,
  usedThisWeek: 2,
};

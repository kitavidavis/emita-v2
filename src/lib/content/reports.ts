export type ReportKind = { id: string; name: string; body: string; source: string };

export const REPORT_KINDS: ReportKind[] = [
  { id: "revenue", name: "Revenue summary", body: "Billed vs. collected by period, drawn from the ledger.", source: "Reporting · revenue_totals" },
  { id: "wasreb", name: "WASREB quarterly return", body: "The regulator's standard template — customers, billing and NRW.", source: "Compiled from all services" },
  { id: "custom", name: "Custom report", body: "Pick fields, filters and a schedule.", source: "Reporting" },
];

export type GeneratedReport = { name: string; period: string; generatedAt: string; format: "PDF" | "CSV" };

export const RECENT_REPORTS: GeneratedReport[] = [
  { name: "Revenue summary", period: "Jul 2026", generatedAt: "1 Aug, 07:00", format: "PDF" },
  { name: "WASREB quarterly return", period: "Q2 2026", generatedAt: "5 Jul, 09:12", format: "PDF" },
  { name: "Revenue summary", period: "Jun 2026", generatedAt: "1 Jul, 07:00", format: "PDF" },
  { name: "Customer register export", period: "As of 15 Jun", generatedAt: "15 Jun, 14:20", format: "CSV" },
];

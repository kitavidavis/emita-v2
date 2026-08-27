// Identity & Access's accounts table. access_status and lifecycle_stage are deliberately shown
// read-only here — both are Emita's own decision (a suspension for unpaid invoices; lifecycle
// stage is Emita's internal view of the relationship), not something a utility's own staff,
// including its owner, can set for themselves.

export const ACCOUNT = {
  name: "Malanga Elugulu / Bwaliro Water Project",
  slug: "bwaliro-water",
  defaultCountry: "KE",
  currency: "KES",
  accessStatus: "active" as const,
  lifecycleStage: "active_customer" as const,
};

export const LIFECYCLE_LABEL: Record<string, string> = {
  poc: "Proof of concept",
  trial: "Trial",
  active_customer: "Active customer",
  pivot: "Under renegotiation",
  churned: "Churned",
};

export const RETENTION = {
  months: 24,
  since: "18 Nov 2023",
};

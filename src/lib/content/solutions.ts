export type Solution = {
  slug: string;
  title: string;
  menuBlurb: string;
  headline: string;
  description: string;
  stuck: string[];
  changes: string[];
  productSlugs: string[];
};

export const solutions: Solution[] = [
  {
    slug: "reduce-non-revenue-water",
    title: "Reduce Non-Revenue Water",
    menuBlurb: "Narrow the gap between water supplied and water billed.",
    headline: "Narrow the gap between water supplied and water billed.",
    description:
      "Non-revenue water is rarely one problem. It is leakage, metering error and unbilled consumption arriving together in the same number. Emita separates them so each can be worked by the team that can fix it.",
    stuck: [
      "The loss figure is annual, so nobody can act on it",
      "Zone boundaries in GIS do not match the billing register",
      "Field crews are sent out on the strength of a complaint",
      "Meter faults look identical to genuine drops in usage",
    ],
    changes: [
      "Zone balance recomputed daily from live reads",
      "One shared model of zones, assets and accounts",
      "A ranked investigation list with the evidence attached",
      "Device health separated from consumption behaviour",
    ],
    productSlugs: ["nrw-intelligence", "smart-metering", "gis-intelligence", "device-intelligence"],
  },
  {
    slug: "improve-revenue-collection",
    title: "Improve Revenue Collection",
    menuBlurb: "Bill on measured consumption, not estimates.",
    headline: "Bill on measured consumption, not estimates.",
    description:
      "Revenue leaks quietly through estimation, unbilled consumption and accounts nobody is watching. Emita reads the difference between what is used and what is billed, and tells revenue teams exactly where to look first.",
    stuck: [
      "Estimated bills drift further from reality every cycle",
      "High-consumption accounts get the same attention as everyone else",
      "Meter-to-billing mismatches surface only at audit",
      "Collections work from a list with no sense of priority",
    ],
    changes: [
      "Billed volume checked against measured consumption continuously",
      "Accounts ranked by revenue risk, not alphabetically",
      "Estimation exposure flagged before it compounds",
      "A shared record between metering, billing and collections",
    ],
    productSlugs: ["revenue-intelligence", "smart-metering", "data-analytics", "utility-ai"],
  },
  {
    slug: "digitize-metering-operations",
    title: "Digitize Metering Operations",
    menuBlurb: "Move field routines off paper and onto the network.",
    headline: "Move field routines off paper and onto the network.",
    description:
      "Paper routes and manual reconciliation slow every downstream decision. Emita moves reading, installation and fault handling onto one connected record the whole operation can see.",
    stuck: [
      "Field routes are still run and reconciled on paper",
      "Install and swap records live in a different system to the readings",
      "Faulty meters aren't identified until a customer complains",
      "There is no single record of what is deployed where",
    ],
    changes: [
      "Reads, installs and swaps captured on one digital record",
      "Field crews coordinated from a live route, not a printed one",
      "Device faults flagged before they reach the customer",
      "One register that billing, field and operations all trust",
    ],
    productSlugs: ["smart-metering", "device-intelligence", "gis-intelligence", "data-analytics"],
  },
  {
    slug: "connect-fragmented-systems",
    title: "Connect Fragmented Systems",
    menuBlurb: "One record of the network across billing, GIS and field.",
    headline: "One record of the network across billing, GIS and field.",
    description:
      "Billing, GIS, ERP and field tools each hold a partial view of the network. Emita resolves them against one model, so a reading, an asset and a customer account describe the same place.",
    stuck: [
      "Billing, GIS and field systems disagree about the same asset",
      "Every cross-system question needs a manual export",
      "Zone definitions differ depending on who you ask",
      "No one owns the record when systems conflict",
    ],
    changes: [
      "One model of zones, assets and accounts across every system",
      "Cross-system queries without an export in between",
      "A single source of truth for what the network looks like",
      "Integrations that keep systems in sync, not just connected",
    ],
    productSlugs: ["data-analytics", "gis-intelligence", "infrastructure-intelligence", "revenue-intelligence"],
  },
  {
    slug: "modernize-utility-operations",
    title: "Modernize Utility Operations",
    menuBlurb: "Run the utility on evidence instead of anecdote.",
    headline: "Run the utility on evidence instead of anecdote.",
    description:
      "Most utility decisions are still made on anecdote and aggregate reports. Emita puts ranked, evidenced intelligence in front of the teams who act on it, every day.",
    stuck: [
      "Decisions are made on the loudest complaint, not the biggest risk",
      "Reports arrive monthly, long after the moment to act has passed",
      "Every team has its own spreadsheet version of the truth",
      "Good judgement isn't backed by the data to support it",
    ],
    changes: [
      "A ranked, evidenced view of what needs attention today",
      "Intelligence refreshed continuously, not once a month",
      "One connected record every team reads from",
      "Decisions made on evidence instead of anecdote",
    ],
    productSlugs: ["utility-ai", "infrastructure-intelligence", "data-analytics", "nrw-intelligence"],
  },
];

export function getSolution(slug: string): Solution | undefined {
  return solutions.find((s) => s.slug === slug);
}

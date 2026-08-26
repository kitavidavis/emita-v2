export type StatRow = { name: string; value: string; percent: number; tone: "accent" | "neutral" };

export type ProductStep = { n: string; title: string; body: string };

export type Product = {
  slug: string;
  title: string;
  /** Short mega-menu blurb, verbatim from the design. */
  menuBlurb: string;
  /** Fuller capability-picker body copy, verbatim from the design. */
  body: string;
  /** "What it covers" bullet list, verbatim from the design's capability picker. */
  covers: string[];
  /** Hero tagline — short, in the brand's established headline voice. */
  headline: string;
  /** Optional exact 4-step "how it works" sequence (only fully designed for NRW). */
  howItWorks?: ProductStep[];
  statPanel: {
    label: string;
    period: string;
    rows: StatRow[];
  };
  relatedSolution?: string;
};

export const products: Product[] = [
  {
    slug: "smart-metering",
    title: "Smart Metering",
    menuBlurb: "Connect and monitor metering infrastructure.",
    body: "Connect, monitor and understand your metering infrastructure — from bulk meters at the zone boundary down to the individual customer point.",
    covers: [
      "Continuous read collection",
      "Bulk and district metering",
      "Read quality scoring",
      "Install and swap records",
      "Route and field coordination",
      "Register reconciliation",
    ],
    headline: "Continuous reads, from the bulk meter to the tap.",
    statPanel: {
      label: "Read success rate",
      period: "Last 30 days",
      rows: [
        { name: "DMA 04", value: "98%", percent: 98, tone: "accent" },
        { name: "DMA 11", value: "94%", percent: 94, tone: "accent" },
        { name: "DMA 07", value: "89%", percent: 89, tone: "neutral" },
        { name: "DMA 02", value: "82%", percent: 82, tone: "neutral" },
      ],
    },
    relatedSolution: "digitize-metering-operations",
  },
  {
    slug: "nrw-intelligence",
    title: "NRW Intelligence",
    menuBlurb: "Find the patterns behind operational loss.",
    body: "Identify the anomalies and patterns behind operational and commercial losses, and rank them by how much they are worth investigating.",
    covers: [
      "Zone water balance",
      "Night-flow analysis",
      "Loss attribution",
      "Ranked investigation list",
      "Evidence trail per case",
      "Post-repair verification",
    ],
    headline: "Find the losses hiding in your network.",
    howItWorks: [
      { n: "01", title: "Measure the inflow", body: "Bulk and district meters read continuously at zone boundaries." },
      { n: "02", title: "Reconcile consumption", body: "Customer meters and billing records matched to the same zone." },
      { n: "03", title: "Separate the causes", body: "Physical loss, metering error and commercial loss read differently." },
      { n: "04", title: "Rank the work", body: "Zones ordered by size of gap and confidence in the signal." },
    ],
    statPanel: {
      label: "Zone balance",
      period: "Last 30 days",
      rows: [
        { name: "DMA 04", value: "72%", percent: 72, tone: "accent" },
        { name: "DMA 11", value: "48%", percent: 48, tone: "accent" },
        { name: "DMA 07", value: "31%", percent: 31, tone: "neutral" },
        { name: "DMA 02", value: "19%", percent: 19, tone: "neutral" },
      ],
    },
    relatedSolution: "reduce-non-revenue-water",
  },
  {
    slug: "revenue-intelligence",
    title: "Revenue Intelligence",
    menuBlurb: "Protect billed volume end to end.",
    body: "Turn consumption and operational data into insights that support revenue protection and growth.",
    covers: [
      "Billed vs measured volume",
      "Estimation exposure",
      "Account risk scoring",
      "Tariff band analysis",
      "Collection performance",
      "Unbilled consumption signals",
    ],
    headline: "Protect billed volume end to end.",
    statPanel: {
      label: "Billed vs measured volume",
      period: "Last 30 days",
      rows: [
        { name: "Cluster 04", value: "97%", percent: 97, tone: "accent" },
        { name: "Cluster 11", value: "91%", percent: 91, tone: "accent" },
        { name: "Cluster 07", value: "84%", percent: 84, tone: "neutral" },
        { name: "Cluster 02", value: "76%", percent: 76, tone: "neutral" },
      ],
    },
    relatedSolution: "improve-revenue-collection",
  },
  {
    slug: "infrastructure-intelligence",
    title: "Infrastructure Intelligence",
    menuBlurb: "Performance and condition of the network.",
    body: "Understand the performance and condition of connected infrastructure across the network.",
    covers: [
      "Pressure and flow profiles",
      "Pump station behaviour",
      "Asset condition indicators",
      "Network model context",
      "Maintenance prioritisation",
      "Performance over time",
    ],
    headline: "See the condition of the network as it runs.",
    statPanel: {
      label: "Pressure stability",
      period: "Last 30 days",
      rows: [
        { name: "Pump station A", value: "99%", percent: 99, tone: "accent" },
        { name: "Pump station B", value: "93%", percent: 93, tone: "accent" },
        { name: "Pump station C", value: "87%", percent: 87, tone: "neutral" },
        { name: "Pump station D", value: "80%", percent: 80, tone: "neutral" },
      ],
    },
    relatedSolution: "modernize-utility-operations",
  },
  {
    slug: "gis-intelligence",
    title: "GIS Intelligence",
    menuBlurb: "Operational data in geographic context.",
    body: "See operational data in its real-world geographic context — zones, mains, assets and customers on the map they belong to.",
    covers: [
      "Zone and DMA boundaries",
      "Asset and network layers",
      "Spatial anomaly view",
      "Customer-to-asset linkage",
      "Field navigation",
      "Map-based investigation",
    ],
    headline: "See your data where it matters.",
    statPanel: {
      label: "Assets located",
      period: "Last 30 days",
      rows: [
        { name: "DMA 04", value: "96%", percent: 96, tone: "accent" },
        { name: "DMA 11", value: "90%", percent: 90, tone: "accent" },
        { name: "DMA 07", value: "83%", percent: 83, tone: "neutral" },
        { name: "DMA 02", value: "74%", percent: 74, tone: "neutral" },
      ],
    },
    relatedSolution: "connect-fragmented-systems",
  },
  {
    slug: "device-intelligence",
    title: "Device Intelligence",
    menuBlurb: "Connectivity, health and behaviour of devices.",
    body: "Monitor the connectivity, health and behaviour of every connected device in the estate.",
    covers: [
      "Communication status",
      "Battery and signal health",
      "Drift and fault detection",
      "Firmware and config state",
      "Device lifecycle view",
      "Fleet-level reporting",
    ],
    headline: "Know the health of every device in the estate.",
    statPanel: {
      label: "Devices online",
      period: "Last 30 days",
      rows: [
        { name: "Gateway NRB-01", value: "99%", percent: 99, tone: "accent" },
        { name: "Gateway NRB-04", value: "95%", percent: 95, tone: "accent" },
        { name: "Gateway NRB-07", value: "88%", percent: 88, tone: "neutral" },
        { name: "Batch F-22", value: "79%", percent: 79, tone: "neutral" },
      ],
    },
    relatedSolution: "digitize-metering-operations",
  },
  {
    slug: "utility-ai",
    title: "Utility AI",
    menuBlurb: "Pattern detection and risk prioritisation.",
    body: "Use advanced intelligence to detect patterns, prioritize risks and support day-to-day decision-making.",
    covers: [
      "Adaptive baselining",
      "Risk prioritisation",
      "Demand forecasting",
      "Pattern discovery",
      "Explainable signals",
      "Feedback from outcomes",
    ],
    headline: "Turn utility data into decisions.",
    statPanel: {
      label: "Cases prioritised correctly",
      period: "Last 30 days",
      rows: [
        { name: "High priority", value: "94%", percent: 94, tone: "accent" },
        { name: "Medium priority", value: "88%", percent: 88, tone: "accent" },
        { name: "Low priority", value: "81%", percent: 81, tone: "neutral" },
        { name: "Backlog", value: "68%", percent: 68, tone: "neutral" },
      ],
    },
    relatedSolution: "modernize-utility-operations",
  },
  {
    slug: "data-analytics",
    title: "Data & Analytics",
    menuBlurb: "Dashboards, trends and contextual reporting.",
    body: "Explore utility data through dashboards, trends, reports and contextual analytics built on one foundation.",
    covers: [
      "Operational dashboards",
      "Trend and cohort analysis",
      "Scheduled reporting",
      "Cross-system queries",
      "Exports and APIs",
      "Role-based views",
    ],
    headline: "Every team, reading from the same data.",
    statPanel: {
      label: "Cross-system queries",
      period: "Last 30 days",
      rows: [
        { name: "Billing ↔ GIS", value: "92%", percent: 92, tone: "accent" },
        { name: "Billing ↔ Field", value: "87%", percent: 87, tone: "accent" },
        { name: "GIS ↔ ERP", value: "79%", percent: 79, tone: "neutral" },
        { name: "Field ↔ ERP", value: "71%", percent: 71, tone: "neutral" },
      ],
    },
    relatedSolution: "connect-fragmented-systems",
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

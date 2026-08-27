import type { Tone } from "./console";

export type IncidentStatus = "open" | "in_progress" | "resolved";

export const STATUS_META: Record<IncidentStatus, { label: string; tone: Tone }> = {
  open: { label: "Open", tone: "bad" },
  in_progress: { label: "In progress", tone: "warn" },
  resolved: { label: "Resolved", tone: "ok" },
};

export type Incident = {
  id: string;
  title: string;
  zone: string;
  linkedAsset?: string;
  status: IncidentStatus;
  reportedAt: string;
  responseTime: string;
  breaching: boolean;
};

export const INCIDENTS: Incident[] = [
  { id: "INC-214", title: "Burst main", zone: "Market", linkedAsset: "Main MN-04", status: "in_progress", reportedAt: "9 Jul, 08:12", responseTime: "1h 40m", breaching: true },
  { id: "INC-211", title: "Pump failure", zone: "Elugulu North", linkedAsset: "Pump 2", status: "open", reportedAt: "11 Jul, 06:30", responseTime: "—", breaching: true },
  { id: "INC-207", title: "Service line leak", zone: "Bwaliro Central", status: "open", reportedAt: "22 Jul, 14:02", responseTime: "40m", breaching: false },
  { id: "INC-198", title: "Scheduled outage — valve replacement", zone: "Riverside", linkedAsset: "Valve V-07", status: "resolved", reportedAt: "20 Jun, 09:00", responseTime: "Planned", breaching: false },
  { id: "INC-192", title: "Burst service line", zone: "Market", status: "resolved", reportedAt: "11 Jul, 07:20", responseTime: "55m", breaching: false },
];

export const INCIDENT_STATS = {
  open: INCIDENTS.filter((i) => i.status !== "resolved").length,
  breaching: INCIDENTS.filter((i) => i.breaching).length,
  resolvedThisMonth: 6,
};

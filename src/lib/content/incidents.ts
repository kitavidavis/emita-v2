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

// Customer complaints — distinct from the infrastructure incidents above. A burst main is
// something the utility discovers; a complaint is something a customer reports, and it may or
// may not turn out to be tied to one. The legacy system calls this whole module "Incidents" and
// means only this; ours keeps both, since a real utility needs both.
export type ComplaintCategory = "No water supply" | "Low pressure" | "Billing dispute" | "Water quality" | "Meter issue" | "Other";

export const COMPLAINT_CATEGORIES: ComplaintCategory[] = ["No water supply", "Low pressure", "Billing dispute", "Water quality", "Meter issue", "Other"];

export type Complaint = {
  id: string;
  customerName: string;
  accountNumber: string;
  phone: string;
  category: ComplaintCategory;
  description: string;
  zone: string;
  status: IncidentStatus;
  assignedTo?: string;
  reportedAt: string;
};

export const COMPLAINTS: Complaint[] = [
  { id: "CMP-441", customerName: "J. Barasa", accountNumber: "BW-000158", phone: "+254720904771", category: "No water supply", description: "No water since Tuesday morning, whole street affected.", zone: "Bwaliro Central", status: "open", reportedAt: "27 Aug, 09:14" },
  { id: "CMP-438", customerName: "Riverside Clinic", accountNumber: "BW-000129", phone: "+254722660187", category: "Low pressure", description: "Pressure has dropped noticeably over the last week.", zone: "Riverside", status: "in_progress", assignedTo: "P. Wekesa", reportedAt: "25 Aug, 14:02" },
  { id: "CMP-430", customerName: "A. Nakhumicha", accountNumber: "BW-000174", phone: "+254701552019", category: "Billing dispute", description: "Bill is much higher than usual consumption pattern.", zone: "Elugulu North", status: "in_progress", assignedTo: "C. Mutua", reportedAt: "22 Aug, 11:30" },
  { id: "CMP-421", customerName: "Market Kiosk 4", accountNumber: "BW-000163", phone: "+254733118402", category: "Meter issue", description: "Meter display is blank, cannot confirm reading.", zone: "Market", status: "resolved", assignedTo: "G. Atieno", reportedAt: "14 Aug, 08:45" },
  { id: "CMP-417", customerName: "P. Wafula", accountNumber: "BW-000149", phone: "+254711004552", category: "Water quality", description: "Water has a slight discoloration since yesterday.", zone: "Bwaliro Central", status: "resolved", assignedTo: "J. Odhiambo", reportedAt: "10 Aug, 16:20" },
];

export const COMPLAINT_STATS = {
  open: COMPLAINTS.filter((c) => c.status === "open").length,
  inProgress: COMPLAINTS.filter((c) => c.status === "in_progress").length,
  resolvedThisMonth: COMPLAINTS.filter((c) => c.status === "resolved").length,
};

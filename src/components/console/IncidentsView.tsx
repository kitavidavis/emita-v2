"use client";

import { useMemo, useState } from "react";
import styles from "./console.module.css";
import {
  INCIDENTS,
  STATUS_META,
  COMPLAINTS,
  COMPLAINT_STATS,
  type Incident,
  type IncidentStatus,
  type Complaint,
} from "@/lib/content/incidents";
import { type Tone } from "@/lib/content/console";
import { LogIncidentModal } from "./incidents/LogIncidentModal";
import { LogComplaintModal } from "./incidents/LogComplaintModal";
import { ActionMenu, type MenuAction } from "./shared/ActionMenu";
import { useToast, ToastStack } from "./shared/Toast";

function toneVar(t: Tone) {
  return `var(--d-${t === "ink" ? "ink" : t})`;
}

const TABS = ["Infrastructure incidents", "Customer complaints"] as const;
const TECHNICIANS = ["P. Wekesa", "G. Atieno", "J. Odhiambo", "C. Mutua"];

let incidentSeq = 220;
let complaintSeq = 450;

export function IncidentsView() {
  const { toasts, show } = useToast();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Infrastructure incidents");

  const [incidents, setIncidents] = useState<Incident[]>(INCIDENTS);
  const [complaints, setComplaints] = useState<Complaint[]>(COMPLAINTS);
  const [incidentModalOpen, setIncidentModalOpen] = useState(false);
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);

  const incidentStats = useMemo(
    () => ({
      open: incidents.filter((i) => i.status !== "resolved").length,
      breaching: incidents.filter((i) => i.breaching).length,
      resolvedThisMonth: 6,
    }),
    [incidents]
  );

  const complaintStats = useMemo(
    () => ({
      open: complaints.filter((c) => c.status === "open").length,
      inProgress: complaints.filter((c) => c.status === "in_progress").length,
      resolvedThisMonth: complaints.filter((c) => c.status === "resolved").length,
    }),
    [complaints]
  );

  const advanceStatus = (current: IncidentStatus): IncidentStatus =>
    current === "open" ? "in_progress" : current === "in_progress" ? "resolved" : "resolved";

  const incidentActions = (i: Incident): MenuAction[] => {
    const actions: MenuAction[] = [];
    if (i.status !== "resolved") {
      actions.push({
        label: i.status === "open" ? "Mark in progress" : "Mark resolved",
        onSelect: () => {
          const next = advanceStatus(i.status);
          setIncidents((list) => list.map((x) => (x.id === i.id ? { ...x, status: next, responseTime: next === "resolved" ? x.responseTime : x.responseTime } : x)));
          show(`${i.id} marked ${STATUS_META[next].label.toLowerCase()}.`);
        },
      });
    }
    actions.push({ label: "View details", onSelect: () => show(`No extended incident log for ${i.id} in this preview.`) });
    return actions;
  };

  const complaintActions = (c: Complaint): MenuAction[] => {
    const actions: MenuAction[] = [];
    if (c.status !== "resolved") {
      actions.push({
        label: c.status === "open" ? "Mark in progress" : "Mark resolved",
        onSelect: () => {
          const next = advanceStatus(c.status);
          setComplaints((list) => list.map((x) => (x.id === c.id ? { ...x, status: next } : x)));
          show(`${c.id} marked ${STATUS_META[next].label.toLowerCase()}.`);
        },
      });
    }
    TECHNICIANS.filter((t) => t !== c.assignedTo).forEach((t) => {
      actions.push({
        label: `Assign to ${t}`,
        onSelect: () => {
          setComplaints((list) => list.map((x) => (x.id === c.id ? { ...x, assignedTo: t } : x)));
          show(`${c.id} assigned to ${t}.`);
        },
      });
    });
    actions.push({ label: "Send update to customer", onSelect: () => show(`Update sent to ${c.customerName} via SMS.`) });
    return actions;
  };

  return (
    <>
      <div className={styles.filterRow}>
        {TABS.map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`${styles.filterBtn} ${tab === t ? styles.filterBtnActive : ""}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Infrastructure incidents" && (
        <>
          <div className={styles.statGrid3}>
            <div className={styles.statCell}>
              <div className={styles.statLabel}>Open</div>
              <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue} style={{ color: toneVar("bad") }}>{incidentStats.open}</span></div>
              <div className={styles.statNote}>Across all zones</div>
            </div>
            <div className={styles.statCell}>
              <div className={styles.statLabel}>Breaching response time</div>
              <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue} style={{ color: toneVar("warn") }}>{incidentStats.breaching}</span></div>
              <div className={styles.statNote}>Past target for their severity</div>
            </div>
            <div className={styles.statCell}>
              <div className={styles.statLabel}>Resolved this month</div>
              <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue}>{incidentStats.resolvedThisMonth}</span></div>
              <div className={styles.statNote}>Median 52 minutes to close</div>
            </div>
          </div>

          <div className={styles.filterRow}>
            <span style={{ fontSize: 12, color: "var(--d-ink-3)" }}>An incident tied to a registered asset also appears on that asset&apos;s service history</span>
            <span style={{ marginLeft: "auto" }}>
              <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} onClick={() => setIncidentModalOpen(true)}>+ Log incident</button>
            </span>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.dTable}>
              <thead>
                <tr><th>Incident</th><th>Zone</th><th>Linked asset</th><th>Status</th><th>Response time</th><th>Reported</th><th></th></tr>
              </thead>
              <tbody>
                {incidents.map((i) => {
                  const meta = STATUS_META[i.status];
                  return (
                    <tr key={i.id}>
                      <td>
                        <span className={styles.mono} style={{ color: "var(--d-ink-3)", fontSize: 11.5, display: "block" }}>{i.id}</span>
                        <span style={{ color: "var(--d-ink)", fontWeight: 600 }}>{i.title}</span>
                      </td>
                      <td style={{ color: "var(--d-ink-2)" }}>{i.zone}</td>
                      <td style={{ color: "var(--d-ink-2)" }}>{i.linkedAsset ?? "—"}</td>
                      <td><span className={styles.statusPill} style={{ color: toneVar(meta.tone) }}>{meta.label}</span></td>
                      <td className={styles.mono} style={{ color: i.breaching ? toneVar("warn") : "var(--d-ink-2)" }}>{i.responseTime}</td>
                      <td style={{ color: "var(--d-ink-3)", fontSize: 12.5 }}>{i.reportedAt}</td>
                      <td style={{ textAlign: "right" }}><ActionMenu actions={incidentActions(i)} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "Customer complaints" && (
        <>
          <div className={styles.statGrid3}>
            <div className={styles.statCell}>
              <div className={styles.statLabel}>Open</div>
              <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue} style={{ color: toneVar("bad") }}>{complaintStats.open}</span></div>
              <div className={styles.statNote}>Not yet picked up</div>
            </div>
            <div className={styles.statCell}>
              <div className={styles.statLabel}>In progress</div>
              <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue} style={{ color: toneVar("warn") }}>{complaintStats.inProgress}</span></div>
              <div className={styles.statNote}>Assigned and being worked</div>
            </div>
            <div className={styles.statCell}>
              <div className={styles.statLabel}>Resolved this month</div>
              <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue}>{complaintStats.resolvedThisMonth}</span></div>
              <div className={styles.statNote}>Closed with the customer notified</div>
            </div>
          </div>

          <div className={styles.filterRow}>
            <span style={{ fontSize: 12, color: "var(--d-ink-3)" }}>What a customer reports — distinct from infrastructure incidents the utility discovers itself</span>
            <span style={{ marginLeft: "auto" }}>
              <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} onClick={() => setComplaintModalOpen(true)}>+ Log complaint</button>
            </span>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.dTable}>
              <thead>
                <tr><th>Complaint</th><th>Customer</th><th>Category</th><th>Zone</th><th>Status</th><th>Assigned to</th><th>Reported</th><th></th></tr>
              </thead>
              <tbody>
                {complaints.map((c) => {
                  const meta = STATUS_META[c.status];
                  return (
                    <tr key={c.id}>
                      <td>
                        <span className={styles.mono} style={{ color: "var(--d-ink-3)", fontSize: 11.5, display: "block" }}>{c.id}</span>
                        <span style={{ color: "var(--d-ink-2)", fontSize: 12.5 }}>{c.description}</span>
                      </td>
                      <td>
                        <span style={{ display: "block", color: "var(--d-ink)", fontWeight: 600 }}>{c.customerName}</span>
                        <span style={{ display: "block", fontSize: 11.5, color: "var(--d-ink-3)" }}>{c.accountNumber}</span>
                      </td>
                      <td style={{ color: "var(--d-ink-2)" }}>{c.category}</td>
                      <td style={{ color: "var(--d-ink-2)" }}>{c.zone}</td>
                      <td><span className={styles.statusPill} style={{ color: toneVar(meta.tone) }}>{meta.label}</span></td>
                      <td style={{ color: "var(--d-ink-2)" }}>{c.assignedTo ?? "—"}</td>
                      <td style={{ color: "var(--d-ink-3)", fontSize: 12.5 }}>{c.reportedAt}</td>
                      <td style={{ textAlign: "right" }}><ActionMenu actions={complaintActions(c)} /></td>
                    </tr>
                  );
                })}
                {complaints.length === 0 && (
                  <tr><td colSpan={8} style={{ textAlign: "center", color: "var(--d-ink-3)", padding: "26px 18px" }}>No complaints logged yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      <LogIncidentModal
        open={incidentModalOpen}
        onClose={() => setIncidentModalOpen(false)}
        onCreate={({ title, zone, linkedAsset }) => {
          const id = `INC-${++incidentSeq}`;
          setIncidents((list) => [
            { id, title, zone, linkedAsset: linkedAsset || undefined, status: "open", reportedAt: "Just now", responseTime: "—", breaching: false },
            ...list,
          ]);
          show(`${id} logged.`);
        }}
      />
      <LogComplaintModal
        open={complaintModalOpen}
        onClose={() => setComplaintModalOpen(false)}
        onCreate={({ customer, category, description }) => {
          const id = `CMP-${++complaintSeq}`;
          setComplaints((list) => [
            { id, customerName: customer.name, accountNumber: customer.accountNumber, phone: customer.phone, category, description, zone: customer.zone, status: "open", reportedAt: "Just now" },
            ...list,
          ]);
          show(`${id} logged for ${customer.name}.`);
        }}
      />

      <ToastStack toasts={toasts} />
    </>
  );
}

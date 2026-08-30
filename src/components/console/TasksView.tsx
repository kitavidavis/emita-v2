"use client";

import { useMemo, useState } from "react";
import styles from "./console.module.css";
import {
  METER_TASKS,
  SUPPLY_TASKS,
  ZONE_ASSIGNMENTS,
  METER_CYCLE,
  TASK_STATUS_META,
  AD_HOC_TASK_TYPE_META,
  TECHNICIANS,
  type TaskStatus,
  type MeterTask,
  type SupplyTask,
  type ZoneAssignment,
} from "@/lib/content/tasks";
import { type Tone } from "@/lib/content/console";
import { AssignRouteModal } from "./tasks/AssignRouteModal";
import { AdHocTaskModal, type AdHocTaskPayload, AUTO_ASSIGN } from "./tasks/AdHocTaskModal";
import { ZoneAssignmentsPanel } from "./tasks/ZoneAssignmentsPanel";
import { ActionMenu, type MenuAction } from "./shared/ActionMenu";
import { useToast, ToastStack } from "./shared/Toast";

function toneVar(t: Tone) {
  return `var(--d-${t === "ink" ? "ink" : t})`;
}

const WORKFLOWS = ["Meter reads", "Supply point reads"] as const;
const STATUS_FILTERS: { key: TaskStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "read", label: "Read" },
  { key: "could_not_read", label: "Could not read" },
];
const PAGE_SIZES = [25, 50, 100];

let routeSeq = 1000;

export function TasksView() {
  const { toasts, show } = useToast();
  const [workflow, setWorkflow] = useState<(typeof WORKFLOWS)[number]>("Meter reads");
  const isMeter = workflow === "Meter reads";

  const [meterTasks, setMeterTasks] = useState<MeterTask[]>(METER_TASKS);
  const [supplyTasks, setSupplyTasks] = useState<SupplyTask[]>(SUPPLY_TASKS);
  const [zoneAssignments, setZoneAssignments] = useState<ZoneAssignment[]>(ZONE_ASSIGNMENTS);
  const tasks = isMeter ? meterTasks : supplyTasks;

  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [zoneFilter, setZoneFilter] = useState<string | "all">("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [assignOpen, setAssignOpen] = useState(false);

  const resetPaging = () => { setPage(1); setSelected(new Set()); };

  const stats = useMemo(
    () => ({
      unread: tasks.filter((t) => t.status === "unread").length,
      read: tasks.filter((t) => t.status === "read").length,
      couldNotRead: tasks.filter((t) => t.status === "could_not_read").length,
    }),
    [tasks]
  );

  const rows = useMemo(() => {
    let list: (MeterTask | SupplyTask)[] = tasks;
    if (statusFilter !== "all") list = list.filter((t) => t.status === statusFilter);
    if (zoneFilter !== "all") list = list.filter((t) => t.zone === zoneFilter);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((t) =>
        isMeter
          ? (t as MeterTask).meter.toLowerCase().includes(q) || (t as MeterTask).customer.toLowerCase().includes(q) || t.zone.toLowerCase().includes(q)
          : (t as SupplyTask).point.toLowerCase().includes(q) || t.zone.toLowerCase().includes(q)
      );
    }
    return list;
  }, [tasks, statusFilter, zoneFilter, query, isMeter]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const workload = useMemo(() => {
    return TECHNICIANS.map((name) => {
      const mine = tasks.filter((t) => t.assignedTo === name);
      const done = mine.filter((t) => t.status !== "unread").length;
      return { name, total: mine.length, done };
    });
  }, [tasks]);

  const setTasks = isMeter ? setMeterTasks : setSupplyTasks;

  const updateStatus = (id: string, status: TaskStatus, reason?: string) => {
    setTasks((list: any) => list.map((t: any) => (t.id === id ? { ...t, status, reason } : t)));
  };

  const reassign = (ids: string[], assignedTo: string) => {
    setTasks((list: any) => list.map((t: any) => (ids.includes(t.id) ? { ...t, assignedTo } : t)));
    show(`${ids.length} task${ids.length === 1 ? "" : "s"} reassigned to ${assignedTo}.`);
    setSelected(new Set());
  };

  const reassignZone = (zone: string, technician: string) => {
    setZoneAssignments((list) => list.map((z) => (z.zone === zone ? { ...z, technician } : z)));
    setMeterTasks((list) => list.map((t) => (t.zone === zone ? { ...t, assignedTo: technician } : t)));
    show(`${zone} route (and every unassigned task in it) reassigned to ${technician}.`);
  };

  const toggleOne = (id: string) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const pageAllSelected = pageRows.length > 0 && pageRows.every((t) => selected.has(t.id));
  const allMatchingSelected = rows.length > 0 && rows.every((t) => selected.has(t.id));

  const toggleAllOnPage = () => {
    setSelected((s) => {
      const next = new Set(s);
      pageRows.forEach((t) => (pageAllSelected ? next.delete(t.id) : next.add(t.id)));
      return next;
    });
  };

  const rowActions = (t: MeterTask | SupplyTask): MenuAction[] => {
    const actions: MenuAction[] = [];
    if (t.status !== "read") actions.push({ label: "Mark as read", onSelect: () => { updateStatus(t.id, "read", undefined); show(`${t.id} marked as read.`); } });
    if (t.status !== "could_not_read") {
      actions.push({
        label: "Mark could not read",
        onSelect: () => {
          const reason = window.prompt("Reason the reading could not be taken?") ?? "";
          updateStatus(t.id, "could_not_read", reason || "No reason given");
          show(`${t.id} marked could not read.`);
        },
      });
    }
    TECHNICIANS.filter((tech) => tech !== t.assignedTo).forEach((tech) => {
      actions.push({ label: `Reassign to ${tech}`, onSelect: () => reassign([t.id], tech) });
    });
    actions.push({ label: "View evidence", onSelect: () => show(`No photo evidence attached to ${t.id} in this preview.`) });
    return actions;
  };

  return (
    <>
      <div className={styles.filterRow}>
        <div className={styles.rangeGroup}>
          {WORKFLOWS.map((w) => (
            <button key={w} type="button" onClick={() => { setWorkflow(w); resetPaging(); setStatusFilter("all"); setZoneFilter("all"); setQuery(""); }} className={`${styles.rangeBtn} ${workflow === w ? styles.rangeBtnActive : ""}`} style={{ fontFamily: "var(--font-body)", padding: "9px 16px" }}>
              {w}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 12, color: "var(--d-ink-3)" }}>
          {isMeter ? `${METER_CYCLE.period} cycle · ${METER_CYCLE.totalMeters} tasks generated from ${zoneAssignments.length} zone routes` : "Calendar-scheduled · a handful of physical points, assigned individually"}
        </span>
        <span style={{ marginLeft: "auto" }}>
          <button type="button" className={styles.dBtn} onClick={() => setAssignOpen(true)}>
            {isMeter ? "+ Add ad-hoc task" : "Assign route"}
          </button>
        </span>
      </div>

      {isMeter && <ZoneAssignmentsPanel assignments={zoneAssignments} onReassign={reassignZone} />}

      <div className={styles.statGrid4}>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Unread</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue} style={{ color: toneVar("mut") }}>{stats.unread}</span></div>
          <div className={styles.statNote}>Not yet visited</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Read</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue} style={{ color: toneVar("ok") }}>{stats.read}</span></div>
          <div className={styles.statNote}>Reading captured, with evidence</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Could not read</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue} style={{ color: toneVar("bad") }}>{stats.couldNotRead}</span></div>
          <div className={styles.statNote}>Logged with a reason, not blank</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Completion</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}>
            <span className={styles.statValue}>{tasks.length ? Math.round(((stats.read + stats.couldNotRead) / tasks.length) * 100) : 0}</span>
            <span className={styles.statUnit}>%</span>
          </div>
          <div className={styles.statNote}>Of this {isMeter ? "cycle's" : "day's"} route</div>
        </div>
      </div>

      <div className={styles.cardGrid3}>
        {workload.map((w) => (
          <div key={w.name} className={styles.actionCard}>
            <span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span className={styles.actionTitle}>{w.name}</span>
              <span className={styles.mono} style={{ color: "var(--d-ink-3)", fontSize: 12 }}>{w.done}/{w.total}</span>
            </span>
            <span style={{ display: "block", height: 6, background: "var(--d-chip)" }}>
              <span style={{ display: "block", height: 6, width: w.total ? `${(w.done / w.total) * 100}%` : "0%", background: "var(--d-accent)" }} />
            </span>
            <span className={styles.actionBody}>{w.total - w.done} stop{w.total - w.done === 1 ? "" : "s"} remaining on this route.</span>
          </div>
        ))}
      </div>

      {selected.size > 0 ? (
        <div className={styles.bulkBar}>
          <span className={styles.bulkCount}>
            {selected.size} selected
            {allMatchingSelected && rows.length > pageRows.length ? "" : pageAllSelected && rows.length > pageRows.length ? (
              <button type="button" className={styles.bulkClear} style={{ marginLeft: 10 }} onClick={() => setSelected(new Set(rows.map((t) => t.id)))}>
                Select all {rows.length} matching this filter
              </button>
            ) : null}
          </span>
          <button type="button" className={styles.bulkClear} onClick={() => setSelected(new Set())}>Clear</button>
          <span style={{ marginLeft: "auto", display: "flex", gap: 9, flexWrap: "wrap" }}>
            {TECHNICIANS.map((tech) => (
              <button key={tech} type="button" className={styles.dBtn} onClick={() => reassign(Array.from(selected), tech)}>
                Reassign to {tech}
              </button>
            ))}
          </span>
        </div>
      ) : (
        <div className={styles.filterRow}>
          {STATUS_FILTERS.map((f) => (
            <button key={f.key} type="button" className={`${styles.filterBtn} ${statusFilter === f.key ? styles.filterBtnActive : ""}`} onClick={() => { setStatusFilter(f.key); resetPaging(); }}>
              {f.label}
            </button>
          ))}
          <select
            value={zoneFilter}
            onChange={(e) => { setZoneFilter(e.target.value); resetPaging(); }}
            style={{ background: "var(--d-panel-2)", border: "1px solid var(--d-line)", color: "var(--d-ink)", padding: "8px 10px", fontSize: 12.5 }}
          >
            <option value="all">All zones</option>
            {Array.from(new Set(tasks.map((t) => t.zone))).map((z) => (<option key={z} value={z}>{z}</option>))}
          </select>
          <div className={styles.searchBox} style={{ maxWidth: 240, background: "var(--d-panel)" }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="var(--d-ink-3)" strokeWidth="1.8"><circle cx="7" cy="7" r="4.6" /><path d="M10.4 10.4L14 14" /></svg>
            <input type="text" placeholder={isMeter ? "Meter, customer or zone" : "Supply point or zone"} value={query} onChange={(e) => { setQuery(e.target.value); resetPaging(); }} />
          </div>
        </div>
      )}

      <div style={{ fontSize: 12, color: "var(--d-ink-3)" }}>
        Viewing {rows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, rows.length)} of {rows.length} tasks
        {rows.length !== tasks.length ? ` (filtered from ${tasks.length})` : ""}
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.dTable}>
          <thead>
            {isMeter ? (
              <tr><th className={styles.checkCell}><input type="checkbox" className={styles.checkbox} checked={pageAllSelected} onChange={toggleAllOnPage} /></th><th>Task</th><th>Type</th><th>Meter</th><th>Customer</th><th>Zone</th><th>Assigned to</th><th>Status</th><th></th></tr>
            ) : (
              <tr><th className={styles.checkCell}><input type="checkbox" className={styles.checkbox} checked={pageAllSelected} onChange={toggleAllOnPage} /></th><th>Task</th><th>Supply point</th><th>Cadence</th><th>Zone</th><th>Scheduled</th><th>Assigned to</th><th>Status</th><th></th></tr>
            )}
          </thead>
          <tbody>
            {pageRows.length === 0 && (
              <tr><td colSpan={9} style={{ textAlign: "center", color: "var(--d-ink-3)", padding: "26px 18px" }}>No tasks match this filter.</td></tr>
            )}
            {isMeter
              ? (pageRows as MeterTask[]).map((t) => (
                  <MeterTaskRow key={t.id} t={t} selected={selected.has(t.id)} onToggle={() => toggleOne(t.id)} actions={rowActions(t)} />
                ))
              : (pageRows as SupplyTask[]).map((t) => (
                  <SupplyTaskRow key={t.id} t={t} selected={selected.has(t.id)} onToggle={() => toggleOne(t.id)} actions={rowActions(t)} />
                ))}
          </tbody>
        </table>
      </div>

      <div className={styles.filterRow}>
        <span style={{ fontSize: 12, color: "var(--d-ink-3)" }}>Rows per page</span>
        <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} style={{ background: "var(--d-panel-2)", border: "1px solid var(--d-line)", color: "var(--d-ink)", padding: "6px 10px", fontSize: 12.5 }}>
          {PAGE_SIZES.map((n) => (<option key={n} value={n}>{n}</option>))}
        </select>
        <span style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <button type="button" className={styles.dBtn} disabled={currentPage <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <span style={{ fontSize: 12.5, color: "var(--d-ink-3)" }}>Page {currentPage} of {totalPages}</span>
          <button type="button" className={styles.dBtn} disabled={currentPage >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
        </span>
      </div>

      {isMeter ? (
        <AdHocTaskModal
          open={assignOpen}
          onClose={() => setAssignOpen(false)}
          zoneAssignments={zoneAssignments}
          onCreate={(payload) => {
            if (payload.mode === "single") {
              const id = `RT-${++routeSeq}`;
              setMeterTasks((list) => [
                {
                  id,
                  meter: payload.customer.meterNumber,
                  customer: `${payload.customer.name} · ${payload.customer.accountNumber}`,
                  zone: payload.customer.zone,
                  assignedTo: payload.assignedTo,
                  status: "unread",
                  taskType: payload.taskType,
                  customerId: payload.customer.id,
                },
                ...list,
              ]);
              show(`${AD_HOC_TASK_TYPE_META[payload.taskType].label} task created for ${payload.customer.name}.`);
            } else {
              const zoneByName = new Map(zoneAssignments.map((z) => [z.zone, z.technician]));
              const isAuto = payload.assignedTo === AUTO_ASSIGN;
              const created = payload.customers.map((c) => ({
                id: `RT-${++routeSeq}`,
                meter: c.meterNumber,
                customer: `${c.name} · ${c.accountNumber}`,
                zone: c.zone,
                assignedTo: isAuto ? zoneByName.get(c.zone) ?? TECHNICIANS[0] : payload.assignedTo,
                status: "unread" as TaskStatus,
                taskType: payload.taskType,
                customerId: c.id,
              }));
              setMeterTasks((list) => [...created, ...list]);
              show(
                isAuto
                  ? `${created.length} ${AD_HOC_TASK_TYPE_META[payload.taskType].label.toLowerCase()} tasks created, split across technicians by zone route.`
                  : `${created.length} ${AD_HOC_TASK_TYPE_META[payload.taskType].label.toLowerCase()} task${created.length === 1 ? "" : "s"} created, assigned to ${payload.assignedTo}.`
              );
            }
          }}
        />
      ) : (
        <AssignRouteModal
          open={assignOpen}
          onClose={() => setAssignOpen(false)}
          onCreate={({ assignedTo, zone, label, scheduledDate }) => {
            const id = `SRT-${++routeSeq}`;
            setSupplyTasks((list) => [{ id, point: label, kind: "Manual · daily", zone, scheduledDate, assignedTo, status: "unread" }, ...list]);
            show(`${id} assigned to ${assignedTo}.`);
          }}
        />
      )}

      <ToastStack toasts={toasts} />
    </>
  );
}

function StatusCell({ status, reason }: { status: TaskStatus; reason?: string }) {
  const meta = TASK_STATUS_META[status];
  return (
    <td>
      <span className={styles.statusPill} style={{ color: toneVar(meta.tone) }}>{meta.label}</span>
      {reason && <span style={{ display: "block", fontSize: 11, color: "var(--d-ink-3)", marginTop: 4 }}>{reason}</span>}
    </td>
  );
}

function MeterTaskRow({ t, selected, onToggle, actions }: { t: MeterTask; selected: boolean; onToggle: () => void; actions: MenuAction[] }) {
  return (
    <tr>
      <td className={styles.checkCell}><input type="checkbox" className={styles.checkbox} checked={selected} onChange={onToggle} /></td>
      <td className={styles.mono} style={{ color: "var(--d-ink)" }}>{t.id}</td>
      <td>
        {t.taskType && t.taskType !== "meter_reading" ? (
          <span className={styles.statusPill} style={{ color: toneVar("cyan") }}>{AD_HOC_TASK_TYPE_META[t.taskType].label}</span>
        ) : (
          <span style={{ color: "var(--d-ink-3)", fontSize: 12 }}>Meter reading</span>
        )}
      </td>
      <td className={styles.mono}>{t.meter}</td>
      <td style={{ color: "var(--d-ink-2)" }}>{t.customer}</td>
      <td style={{ color: "var(--d-ink-2)" }}>{t.zone}</td>
      <td style={{ color: "var(--d-ink-2)" }}>{t.assignedTo}</td>
      <StatusCell status={t.status} reason={t.reason} />
      <td style={{ textAlign: "right" }}><ActionMenu actions={actions} /></td>
    </tr>
  );
}

function SupplyTaskRow({ t, selected, onToggle, actions }: { t: SupplyTask; selected: boolean; onToggle: () => void; actions: MenuAction[] }) {
  return (
    <tr>
      <td className={styles.checkCell}><input type="checkbox" className={styles.checkbox} checked={selected} onChange={onToggle} /></td>
      <td className={styles.mono} style={{ color: "var(--d-ink)" }}>{t.id}</td>
      <td style={{ color: "var(--d-ink)", fontWeight: 600 }}>{t.point}</td>
      <td style={{ color: "var(--d-ink-2)" }}>{t.kind}</td>
      <td style={{ color: "var(--d-ink-2)" }}>{t.zone}</td>
      <td className={styles.mono}>{t.scheduledDate}</td>
      <td style={{ color: "var(--d-ink-2)" }}>{t.assignedTo}</td>
      <StatusCell status={t.status} reason={t.reason} />
      <td style={{ textAlign: "right" }}><ActionMenu actions={actions} /></td>
    </tr>
  );
}

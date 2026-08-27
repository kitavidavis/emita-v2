"use client";

import { useMemo, useState } from "react";
import styles from "./console.module.css";
import {
  METER_TASKS,
  METER_TASK_STATS,
  SUPPLY_TASKS,
  SUPPLY_TASK_STATS,
  TASK_STATUS_META,
  TECHNICIANS,
  type TaskStatus,
} from "@/lib/content/tasks";
import { type Tone } from "@/lib/content/console";

function toneVar(t: Tone) {
  return `var(--d-${t === "ink" ? "ink" : t})`;
}

const WORKFLOWS = ["Meter reads", "Supply point reads"] as const;

export function TasksView() {
  const [workflow, setWorkflow] = useState<(typeof WORKFLOWS)[number]>("Meter reads");
  const isMeter = workflow === "Meter reads";
  const tasks = isMeter ? METER_TASKS : SUPPLY_TASKS;
  const stats = isMeter ? METER_TASK_STATS : SUPPLY_TASK_STATS;

  const workload = useMemo(() => {
    return TECHNICIANS.map((name) => {
      const mine = tasks.filter((t) => t.assignedTo === name);
      const done = mine.filter((t) => t.status !== "unread").length;
      return { name, total: mine.length, done };
    });
  }, [tasks]);

  return (
    <>
      <div className={styles.filterRow}>
        <div className={styles.rangeGroup}>
          {WORKFLOWS.map((w) => (
            <button key={w} type="button" onClick={() => setWorkflow(w)} className={`${styles.rangeBtn} ${workflow === w ? styles.rangeBtnActive : ""}`} style={{ fontFamily: "var(--font-body)", padding: "9px 16px" }}>
              {w}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 12, color: "var(--d-ink-3)" }}>
          {isMeter ? `Cycle-bound · ${METER_TASK_STATS.cycle}` : `Calendar-scheduled · ${SUPPLY_TASK_STATS.telemetryPoints} points on telemetry, no task generated`}
        </span>
        <span style={{ marginLeft: "auto" }}>
          <button type="button" className={styles.dBtn}>Assign route</button>
        </span>
      </div>

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
            <span className={styles.statValue}>{Math.round(((stats.read + stats.couldNotRead) / tasks.length) * 100)}</span>
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

      <div className={styles.tableWrap}>
        <table className={styles.dTable}>
          <thead>
            {isMeter ? (
              <tr><th>Task</th><th>Meter</th><th>Customer</th><th>Zone</th><th>Assigned to</th><th>Status</th></tr>
            ) : (
              <tr><th>Task</th><th>Supply point</th><th>Cadence</th><th>Zone</th><th>Scheduled</th><th>Assigned to</th><th>Status</th></tr>
            )}
          </thead>
          <tbody>
            {isMeter
              ? METER_TASKS.map((t) => <MeterTaskRow key={t.id} t={t} />)
              : SUPPLY_TASKS.map((t) => <SupplyTaskRow key={t.id} t={t} />)}
          </tbody>
        </table>
      </div>
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

function MeterTaskRow({ t }: { t: (typeof METER_TASKS)[number] }) {
  return (
    <tr>
      <td className={styles.mono} style={{ color: "var(--d-ink)" }}>{t.id}</td>
      <td className={styles.mono}>{t.meter}</td>
      <td style={{ color: "var(--d-ink-2)" }}>{t.customer}</td>
      <td style={{ color: "var(--d-ink-2)" }}>{t.zone}</td>
      <td style={{ color: "var(--d-ink-2)" }}>{t.assignedTo}</td>
      <StatusCell status={t.status} reason={t.reason} />
    </tr>
  );
}

function SupplyTaskRow({ t }: { t: (typeof SUPPLY_TASKS)[number] }) {
  return (
    <tr>
      <td className={styles.mono} style={{ color: "var(--d-ink)" }}>{t.id}</td>
      <td style={{ color: "var(--d-ink)", fontWeight: 600 }}>{t.point}</td>
      <td style={{ color: "var(--d-ink-2)" }}>{t.kind}</td>
      <td style={{ color: "var(--d-ink-2)" }}>{t.zone}</td>
      <td className={styles.mono}>{t.scheduledDate}</td>
      <td style={{ color: "var(--d-ink-2)" }}>{t.assignedTo}</td>
      <StatusCell status={t.status} reason={t.reason} />
    </tr>
  );
}

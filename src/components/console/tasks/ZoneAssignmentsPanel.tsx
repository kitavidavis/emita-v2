"use client";

import styles from "../console.module.css";
import { TECHNICIANS, type ZoneAssignment } from "@/lib/content/tasks";
import { ActionMenu, type MenuAction } from "../shared/ActionMenu";

export function ZoneAssignmentsPanel({
  assignments,
  onReassign,
}: {
  assignments: ZoneAssignment[];
  onReassign: (zone: string, technician: string) => void;
}) {
  return (
    <div className={styles.panel}>
      <div className={styles.panelHead}>
        <span className={styles.panelTitle}>Zone routes</span>
        <span style={{ fontSize: 12, color: "var(--d-ink-3)" }}>
          Reading tasks are generated in bulk from these standing routes — reassign the whole zone, not meter by meter.
        </span>
      </div>
      <div className={styles.tableWrap} style={{ border: 0 }}>
        <table className={`${styles.dTable} ${styles.dTableCompact}`}>
          <thead><tr><th>Zone</th><th>DMA</th><th>Meters</th><th>Technician</th><th></th></tr></thead>
          <tbody>
            {assignments.map((za) => {
              const actions: MenuAction[] = TECHNICIANS.filter((t) => t !== za.technician).map((t) => ({
                label: `Reassign zone to ${t}`,
                onSelect: () => onReassign(za.zone, t),
              }));
              return (
                <tr key={za.zone}>
                  <td style={{ color: "var(--d-ink)", fontWeight: 600 }}>{za.zone}</td>
                  <td className={styles.mono}>{za.dma}</td>
                  <td className={styles.mono}>{za.meterCount}</td>
                  <td style={{ color: "var(--d-ink-2)" }}>{za.technician}</td>
                  <td style={{ textAlign: "right" }}><ActionMenu actions={actions} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

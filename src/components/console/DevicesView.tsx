"use client";

import styles from "./console.module.css";
import { DEVICES, DEVICE_STATS, DEVICE_TYPE_META } from "@/lib/content/devices";
import { type Tone } from "@/lib/content/console";

function toneVar(t: Tone) {
  return `var(--d-${t === "ink" ? "ink" : t})`;
}

export function DevicesView() {
  return (
    <>
      <div className={styles.statGrid4}>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Connected meters</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}>
            <span className={styles.statValue}>{DEVICE_STATS.connectedMeters}</span>
            <span className={styles.statUnit}>/ {DEVICE_STATS.totalMeters}</span>
          </div>
          <div className={styles.statNote}>Rest are read manually</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Silent 24h+</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue} style={{ color: toneVar("bad") }}>{DEVICE_STATS.silent}</span></div>
          <div className={styles.statNote}>No payload received</div>
        </div>
        {DEVICE_STATS.byType.slice(0, 2).map((b) => {
          const meta = DEVICE_TYPE_META[b.type];
          return (
            <div key={b.type} className={styles.statCell}>
              <div className={styles.statLabel}>{meta.label} devices</div>
              <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue} style={{ color: toneVar(meta.tone) }}>{b.count}</span></div>
              <div className={styles.statNote}>Of {DEVICE_STATS.total} paired</div>
            </div>
          );
        })}
      </div>

      <div className={styles.filterRow}>
        <span style={{ fontSize: 12, color: "var(--d-ink-3)" }}>Most recently active devices — connectivity is by device, not by meter; most meters have none at all</span>
        <span style={{ marginLeft: "auto" }}>
          <button type="button" className={styles.dBtn}>Pair device</button>
        </span>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.dTable}>
          <thead>
            <tr><th>Device</th><th>Type</th><th>Meter</th><th>Customer</th><th>Last payload</th><th>Status</th></tr>
          </thead>
          <tbody>
            {DEVICES.map((d) => {
              const type = DEVICE_TYPE_META[d.type];
              return (
                <tr key={d.id}>
                  <td className={styles.mono} style={{ color: "var(--d-ink)" }}>{d.externalId}</td>
                  <td><span className={styles.statusPill} style={{ color: toneVar(type.tone) }}>{type.label}</span></td>
                  <td className={styles.mono}>{d.meter}</td>
                  <td style={{ color: "var(--d-ink-2)" }}>{d.customer}</td>
                  <td style={{ color: d.silent ? "var(--d-bad)" : "var(--d-ink-3)", fontSize: 12.5 }}>{d.lastPayload}</td>
                  <td>
                    <span className={styles.statusPill} style={{ color: toneVar(d.silent ? "bad" : "ok") }}>{d.silent ? "Silent" : "Reporting"}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

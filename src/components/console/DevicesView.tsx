"use client";

import { useMemo, useState } from "react";
import styles from "./console.module.css";
import { DEVICES, DEVICE_TYPE_META, type DeviceRow, type DeviceType } from "@/lib/content/devices";
import { type Tone } from "@/lib/content/console";
import { PairDeviceModal } from "./devices/PairDeviceModal";
import { ActionMenu, type MenuAction } from "./shared/ActionMenu";
import { useToast, ToastStack } from "./shared/Toast";
import { downloadCSV } from "./shared/download";

function toneVar(t: Tone) {
  return `var(--d-${t === "ink" ? "ink" : t})`;
}

let deviceSeq = 100;

export function DevicesView() {
  const { toasts, show } = useToast();
  const [devices, setDevices] = useState<DeviceRow[]>(DEVICES);
  const [typeFilter, setTypeFilter] = useState<DeviceType | "all">("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pairOpen, setPairOpen] = useState(false);

  const stats = useMemo(() => {
    const byType = (["gsm", "sigfox", "lora", "other"] as DeviceType[])
      .map((t) => ({ type: t, count: devices.filter((d) => d.type === t).length }))
      .filter((x) => x.count > 0);
    return {
      total: devices.length,
      byType,
      silent: devices.filter((d) => d.silent).length,
      connectedMeters: 41,
      totalMeters: 312,
    };
  }, [devices]);

  const rows = useMemo(() => {
    let list = typeFilter === "all" ? devices : devices.filter((d) => d.type === typeFilter);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((d) => d.externalId.toLowerCase().includes(q) || d.meter.toLowerCase().includes(q) || d.customer.toLowerCase().includes(q));
    return list;
  }, [devices, typeFilter, query]);

  const toggleOne = (id: string) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const unpair = (ids: string[]) => {
    setDevices((list) => list.filter((d) => !ids.includes(d.id)));
    show(`${ids.length} device${ids.length === 1 ? "" : "s"} unpaired.`);
    setSelected(new Set());
  };

  const rowActions = (d: DeviceRow): MenuAction[] => [
    { label: "Ping device", onSelect: () => show(d.silent ? `${d.externalId} did not respond to ping.` : `${d.externalId} responded — link is healthy.`) },
    { label: "View payload history", onSelect: () => show(`No stored payload history for ${d.externalId} in this preview.`) },
    { label: "Unpair device", danger: true, onSelect: () => unpair([d.id]) },
  ];

  return (
    <>
      <div className={styles.statGrid4}>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Connected meters</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}>
            <span className={styles.statValue}>{stats.connectedMeters}</span>
            <span className={styles.statUnit}>/ {stats.totalMeters}</span>
          </div>
          <div className={styles.statNote}>Rest are read manually</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Silent 24h+</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue} style={{ color: toneVar("bad") }}>{stats.silent}</span></div>
          <div className={styles.statNote}>No payload received</div>
        </div>
        {stats.byType.slice(0, 2).map((b) => {
          const meta = DEVICE_TYPE_META[b.type];
          return (
            <div key={b.type} className={styles.statCell}>
              <div className={styles.statLabel}>{meta.label} devices</div>
              <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue} style={{ color: toneVar(meta.tone) }}>{b.count}</span></div>
              <div className={styles.statNote}>Of {stats.total} paired</div>
            </div>
          );
        })}
      </div>

      {selected.size > 0 ? (
        <div className={styles.bulkBar}>
          <span className={styles.bulkCount}>{selected.size} selected</span>
          <button type="button" className={styles.bulkClear} onClick={() => setSelected(new Set())}>Clear</button>
          <span style={{ marginLeft: "auto", display: "flex", gap: 9 }}>
            <button type="button" className={styles.dBtn} onClick={() => downloadCSV(
              `devices-${new Date().toISOString().slice(0, 10)}.csv`,
              ["Device ID", "Type", "Meter", "Customer", "Last payload", "Status"],
              devices.filter((d) => selected.has(d.id)).map((d) => [d.externalId, DEVICE_TYPE_META[d.type].label, d.meter, d.customer, d.lastPayload, d.silent ? "Silent" : "Reporting"])
            )}>
              Export selected
            </button>
            <button type="button" className={styles.dBtn} onClick={() => unpair(Array.from(selected))}>Unpair</button>
          </span>
        </div>
      ) : (
        <div className={styles.filterRow}>
          <button type="button" className={`${styles.filterBtn} ${typeFilter === "all" ? styles.filterBtnActive : ""}`} onClick={() => setTypeFilter("all")}>All types</button>
          {(["gsm", "sigfox", "lora", "other"] as DeviceType[]).map((t) => (
            <button key={t} type="button" className={`${styles.filterBtn} ${typeFilter === t ? styles.filterBtnActive : ""}`} onClick={() => setTypeFilter(t)}>
              {DEVICE_TYPE_META[t].label}
            </button>
          ))}
          <div className={styles.searchBox} style={{ maxWidth: 240, background: "var(--d-panel)" }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="var(--d-ink-3)" strokeWidth="1.8"><circle cx="7" cy="7" r="4.6" /><path d="M10.4 10.4L14 14" /></svg>
            <input type="text" placeholder="Device, meter or customer" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <span style={{ marginLeft: "auto" }}>
            <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} onClick={() => setPairOpen(true)}>Pair device</button>
          </span>
        </div>
      )}

      <div className={styles.tableWrap}>
        <table className={styles.dTable}>
          <thead>
            <tr>
              <th className={styles.checkCell}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={rows.length > 0 && rows.every((d) => selected.has(d.id))}
                  onChange={() => {
                    setSelected((s) => {
                      const next = new Set(s);
                      const allSel = rows.every((d) => next.has(d.id));
                      rows.forEach((d) => (allSel ? next.delete(d.id) : next.add(d.id)));
                      return next;
                    });
                  }}
                />
              </th>
              <th>Device</th><th>Type</th><th>Meter</th><th>Customer</th><th>Last payload</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => {
              const type = DEVICE_TYPE_META[d.type];
              return (
                <tr key={d.id}>
                  <td className={styles.checkCell}><input type="checkbox" className={styles.checkbox} checked={selected.has(d.id)} onChange={() => toggleOne(d.id)} /></td>
                  <td className={styles.mono} style={{ color: "var(--d-ink)" }}>{d.externalId}</td>
                  <td><span className={styles.statusPill} style={{ color: toneVar(type.tone) }}>{type.label}</span></td>
                  <td className={styles.mono}>{d.meter}</td>
                  <td style={{ color: "var(--d-ink-2)" }}>{d.customer}</td>
                  <td style={{ color: d.silent ? "var(--d-bad)" : "var(--d-ink-3)", fontSize: 12.5 }}>{d.lastPayload}</td>
                  <td><span className={styles.statusPill} style={{ color: toneVar(d.silent ? "bad" : "ok") }}>{d.silent ? "Silent" : "Reporting"}</span></td>
                  <td style={{ textAlign: "right" }}><ActionMenu actions={rowActions(d)} /></td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: "center", color: "var(--d-ink-3)", padding: "26px 18px" }}>No devices match this filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <PairDeviceModal
        open={pairOpen}
        onClose={() => setPairOpen(false)}
        onPair={({ externalId, type, customer }) => {
          setDevices((list) => [
            { id: `d-${++deviceSeq}`, externalId, type, meter: customer.meterNumber, customer: customer.name, lastPayload: "Just now", silent: false },
            ...list,
          ]);
          show(`${externalId} paired to ${customer.name}'s meter.`);
        }}
      />

      <ToastStack toasts={toasts} />
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import styles from "./console.module.css";
import { LOG_ENTRIES, DOMAINS, domainOf } from "@/lib/content/logs";
import { downloadCSV } from "./shared/download";

export function LogsView() {
  const [domain, setDomain] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    let list = domain === "all" ? LOG_ENTRIES : LOG_ENTRIES.filter((e) => domainOf(e.subject) === domain);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (e) => e.subject.toLowerCase().includes(q) || Object.entries(e.payload).some(([k, v]) => k.toLowerCase().includes(q) || v.toLowerCase().includes(q))
      );
    }
    return list;
  }, [domain, query]);

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const e of LOG_ENTRIES) m[domainOf(e.subject)] = (m[domainOf(e.subject)] ?? 0) + 1;
    return m;
  }, []);

  return (
    <>
      <div className={styles.filterRow}>
        <button type="button" onClick={() => setDomain("all")} className={`${styles.filterBtn} ${domain === "all" ? styles.filterBtnActive : ""}`}>
          All services · {LOG_ENTRIES.length}
        </button>
        {DOMAINS.map((d) => (
          <button key={d} type="button" onClick={() => setDomain(d)} className={`${styles.filterBtn} ${domain === d ? styles.filterBtnActive : ""}`}>
            {d} · {counts[d] ?? 0}
          </button>
        ))}
        <div className={styles.searchBox} style={{ maxWidth: 260, background: "var(--d-panel)" }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="var(--d-ink-3)" strokeWidth="1.8"><circle cx="7" cy="7" r="4.6" /><path d="M10.4 10.4L14 14" /></svg>
          <input type="text" placeholder="Subject or payload value" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <span style={{ marginLeft: "auto" }}>
          <button
            type="button"
            className={styles.dBtn}
            onClick={() => downloadCSV(
              `activity-log-${new Date().toISOString().slice(0, 10)}.csv`,
              ["Subject", "Received at", "Payload"],
              rows.map((e) => [e.subject, e.receivedAt, JSON.stringify(e.payload)])
            )}
          >
            Export
          </button>
        </span>
      </div>

      <div className={styles.panel}>
        {rows.map((e) => {
          const open = openId === e.id;
          return (
            <div key={e.id} className={styles.logRow}>
              <button type="button" className={styles.logRowHead} onClick={() => setOpenId(open ? null : e.id)}>
                <svg className={`${styles.logChevron} ${open ? styles.logChevronOpen : ""}`} width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 2l7 6-7 6" />
                </svg>
                <span className={styles.mono} style={{ color: "var(--d-ink)", fontSize: 12.5, flex: "none" }}>{e.subject}</span>
                <span style={{ flex: 1 }} />
                <span style={{ color: "var(--d-ink-3)", fontSize: 12, flex: "none" }}>{e.receivedAt}</span>
              </button>
              {open && (
                <div className={styles.logPayload}>
                  {Object.entries(e.payload).map(([k, v]) => (
                    <span key={k}>
                      <span className={styles.logPayloadKey}>{k}</span>
                      <span className={styles.logPayloadVal}>{v}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {rows.length === 0 && (
          <div style={{ padding: "26px 20px", textAlign: "center", color: "var(--d-ink-3)", fontSize: 13 }}>No events for this service yet.</div>
        )}
      </div>
    </>
  );
}

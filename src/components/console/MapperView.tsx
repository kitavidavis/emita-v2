"use client";

import { useState } from "react";
import styles from "./console.module.css";
import { DRAFT_CUSTOMERS, DRAFT_ASSETS, MAPPER_STATS } from "@/lib/content/mapper";

const TABS = ["Draft customers", "Draft assets"] as const;

export function MapperView() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Draft customers");

  return (
    <>
      <div className={styles.alertBanner}>
        <span className={styles.alertBody}>
          Captured in the field, offline-first — nothing below is live in the customer or asset register until a reviewer merges it.
        </span>
      </div>

      <div className={styles.statGrid4}>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Draft customers</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue}>{MAPPER_STATS.pendingCustomers}</span></div>
          <div className={styles.statNote}>Awaiting review</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Draft assets</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue}>{MAPPER_STATS.pendingAssets}</span></div>
          <div className={styles.statNote}>Pipelines, tanks, valves</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Possible duplicates</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue} style={{ color: "var(--d-warn)" }}>{MAPPER_STATS.possibleDuplicates}</span></div>
          <div className={styles.statNote}>Matches an existing account</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Missing coordinates</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue} style={{ color: "var(--d-bad)" }}>{MAPPER_STATS.missingCoordinates}</span></div>
          <div className={styles.statNote}>Needs a field revisit</div>
        </div>
      </div>

      <div className={styles.filterRow}>
        {TABS.map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`${styles.filterBtn} ${tab === t ? styles.filterBtnActive : ""}`}>
            {t}
          </button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--d-ink-3)" }}>Synced from the field app when back in signal</span>
      </div>

      {tab === "Draft customers" ? (
        <div className={styles.tableWrap}>
          <table className={styles.dTable}>
            <thead>
              <tr><th>Name</th><th>Phone</th><th>Zone (guessed)</th><th>Location</th><th>Captured</th><th>Flags</th><th></th></tr>
            </thead>
            <tbody>
              {DRAFT_CUSTOMERS.map((c) => (
                <tr key={c.id}>
                  <td style={{ color: "var(--d-ink)", fontWeight: 600 }}>{c.name}</td>
                  <td className={styles.mono}>{c.phone}</td>
                  <td style={{ color: "var(--d-ink-2)" }}>{c.zoneGuess}</td>
                  <td>
                    {c.hasCoordinates
                      ? <span style={{ color: "var(--d-ok)", fontSize: 12 }}>Captured</span>
                      : <span style={{ color: "var(--d-bad)", fontSize: 12 }}>Missing</span>}
                  </td>
                  <td style={{ color: "var(--d-ink-3)", fontSize: 12.5 }}>{c.capturedBy} · {c.capturedAt}</td>
                  <td>
                    {c.possibleDuplicateOf && (
                      <span className={styles.statusPill} style={{ color: "var(--d-warn)" }}>May be {c.possibleDuplicateOf}</span>
                    )}
                    {c.notes && <span style={{ display: "block", fontSize: 11, color: "var(--d-ink-3)", marginTop: c.possibleDuplicateOf ? 4 : 0 }}>{c.notes}</span>}
                  </td>
                  <td>
                    <span style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <button type="button" className={styles.dBtn} style={{ padding: "5px 10px", fontSize: 11.5 }}>Reject</button>
                      <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} style={{ padding: "5px 10px", fontSize: 11.5 }}>
                        {c.possibleDuplicateOf ? "Review match" : "Merge"}
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.dTable}>
            <thead>
              <tr><th>Asset</th><th>Kind</th><th>Geometry</th><th>Zone (guessed)</th><th>Captured</th><th></th></tr>
            </thead>
            <tbody>
              {DRAFT_ASSETS.map((a) => (
                <tr key={a.id}>
                  <td>
                    <span style={{ color: "var(--d-ink)", fontWeight: 600 }}>{a.name}</span>
                    {a.notes && <span style={{ display: "block", fontSize: 11.5, color: "var(--d-ink-3)", marginTop: 2 }}>{a.notes}</span>}
                  </td>
                  <td style={{ color: "var(--d-ink-2)" }}>{a.kind}</td>
                  <td><span className={styles.statusPill} style={{ color: a.geometryType === "line" ? "var(--d-cyan)" : "var(--d-accent)" }}>{a.geometryType}</span></td>
                  <td style={{ color: "var(--d-ink-2)" }}>{a.zoneGuess}</td>
                  <td style={{ color: "var(--d-ink-3)", fontSize: 12.5 }}>{a.capturedBy} · {a.capturedAt}</td>
                  <td>
                    <span style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <button type="button" className={styles.dBtn} style={{ padding: "5px 10px", fontSize: 11.5 }}>Reject</button>
                      <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} style={{ padding: "5px 10px", fontSize: 11.5 }}>Merge</button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

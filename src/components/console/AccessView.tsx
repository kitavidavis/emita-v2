"use client";

import { useState } from "react";
import styles from "./console.module.css";
import { SCOPES, API_KEYS, ACCESS_STATS, type ScopeKey } from "@/lib/content/access";

export function AccessView() {
  const [checked, setChecked] = useState<Record<ScopeKey, boolean>>({ "reports:read": true, "billing:read": false, "customers:read": false });

  return (
    <>
      <div className={styles.statGrid3}>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Active keys</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue}>{ACCESS_STATS.active}</span></div>
          <div className={styles.statNote}>Issued by this utility, to external parties</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Grant customer records</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue} style={{ color: "var(--d-warn)" }}>{ACCESS_STATS.sensitiveGrants}</span></div>
          <div className={styles.statNote}>Worth a periodic review</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Used this week</div>
          <div className={styles.statValueRow} style={{ marginTop: 10 }}><span className={styles.statValue}>{ACCESS_STATS.usedThisWeek}</span></div>
          <div className={styles.statNote}>Of the active keys</div>
        </div>
      </div>

      <div className={styles.twoCol} style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,0.85fr)" }}>
        <div className={styles.panel}>
          <div className={styles.panelHead}><span className={styles.panelTitle}>Issue a new key</span></div>
          <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
            <label style={{ display: "block" }}>
              <span style={{ display: "block", fontSize: 11.5, color: "var(--d-ink-3)", marginBottom: 6 }}>Name — what is this for?</span>
              <input
                type="text"
                placeholder="e.g. County revenue office dashboard"
                style={{ width: "100%", background: "var(--d-panel-2)", border: "1px solid var(--d-line)", color: "var(--d-ink)", fontFamily: "var(--font-body)", fontSize: 13, padding: "9px 12px" }}
              />
            </label>

            <div>
              <span style={{ display: "block", fontSize: 11.5, color: "var(--d-ink-3)", marginBottom: 8 }}>Scopes — only grant what this party actually needs</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {SCOPES.map((s) => (
                  <label key={s.key} style={{ display: "flex", gap: 11, padding: "10px 0", borderTop: "1px solid var(--d-line)", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={checked[s.key]}
                      onChange={(e) => setChecked((c) => ({ ...c, [s.key]: e.target.checked }))}
                      style={{ marginTop: 3, accentColor: "var(--d-accent)", flex: "none" }}
                    />
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--d-ink)" }}>{s.label}</span>
                        {s.sensitive && <span className={styles.statusPill} style={{ fontSize: 9.5, padding: "0 5px", color: "var(--d-warn)" }}>Sensitive</span>}
                      </span>
                      <span style={{ display: "block", fontSize: 12, color: "var(--d-ink-3)", marginTop: 2, lineHeight: 1.45 }}>{s.note}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <label style={{ display: "block" }}>
              <span style={{ display: "block", fontSize: 11.5, color: "var(--d-ink-3)", marginBottom: 6 }}>Expiry</span>
              <select style={{ background: "var(--d-panel-2)", border: "1px solid var(--d-line)", color: "var(--d-ink)", fontFamily: "var(--font-body)", fontSize: 13, padding: "9px 12px" }}>
                <option>90 days</option>
                <option>1 year</option>
                <option>Never — review reminder every 6 months</option>
              </select>
            </label>

            <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} style={{ alignSelf: "flex-start", padding: "10px 18px" }}>Generate key</button>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHead}><span className={styles.panelTitle}>Why scoped keys, not a shared login</span></div>
          <div style={{ padding: "6px 20px 18px" }}>
            <div className={styles.lockedFeature} style={{ borderTop: 0 }}>
              <span style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--d-ink-2)" }}>
                A county office or WASREB never gets a staff login — they get a key scoped to exactly the data they need, issued by you.
              </span>
            </div>
            <div className={styles.lockedFeature}>
              <span style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--d-ink-2)" }}>
                Revoke a key any time — the party loses access immediately, with nothing to unwind on Emita&apos;s side.
              </span>
            </div>
            <div className={styles.lockedFeature}>
              <span style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--d-ink-2)" }}>
                Every request made with a key is attributed back to it, not to a shared, anonymous credential.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.dTable}>
          <thead>
            <tr><th>Name</th><th>Key</th><th>Scopes</th><th>Issued by</th><th>Expires</th><th>Last used</th><th></th></tr>
          </thead>
          <tbody>
            {API_KEYS.map((k) => (
              <tr key={k.id} style={k.revoked ? { opacity: 0.55 } : undefined}>
                <td style={{ color: "var(--d-ink)", fontWeight: 600 }}>{k.name}</td>
                <td className={styles.mono}>{k.prefix}…</td>
                <td>
                  <span style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {k.scopes.map((s) => (
                      <span key={s} className={styles.statusPill} style={{ fontSize: 10, padding: "1px 6px", color: "var(--d-ink-2)" }}>{s}</span>
                    ))}
                  </span>
                </td>
                <td style={{ color: "var(--d-ink-3)", fontSize: 12.5 }}>{k.createdBy} · {k.createdAt}</td>
                <td style={{ color: "var(--d-ink-3)", fontSize: 12.5 }}>{k.expiresAt ?? "Never"}</td>
                <td style={{ color: "var(--d-ink-3)", fontSize: 12.5 }}>{k.lastUsed ?? "Never"}</td>
                <td>
                  {k.revoked
                    ? <span style={{ fontSize: 11.5, color: "var(--d-bad)" }}>Revoked</span>
                    : <button type="button" style={{ appearance: "none", background: "transparent", border: 0, cursor: "pointer", color: "var(--d-ink-3)", fontSize: 12 }}>Revoke</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

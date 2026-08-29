"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import styles from "./console.module.css";

type Method = "totp" | "email";
type Status = { enabled: boolean; method: Method | null };
type Pending = { method: Method; provisioningUri: string | null };

function extractSecret(uri: string): string | null {
  const match = uri.match(/[?&]secret=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

const METHOD_LABEL: Record<Method, string> = { totp: "Authenticator app", email: "Email codes" };

export function MfaSetup() {
  const [status, setStatus] = useState<Status | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const loadStatus = async () => {
    const res = await fetch("/api/mfa/status");
    if (res.ok) setStatus(await res.json());
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const startEnroll = async (method: Method) => {
    setError(null);
    setBusy(true);
    const res = await fetch("/api/mfa/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.message ?? "Could not start enrollment.");
      return;
    }
    setPending({ method: data.method, provisioningUri: data.provisioningUri });
    setCode(Array(6).fill(""));
  };

  const confirmEnroll = async () => {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/mfa/enroll/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.join("") }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.message ?? "That code isn't right.");
      return;
    }
    setPending(null);
    loadStatus();
  };

  const disable = async () => {
    setBusy(true);
    await fetch("/api/mfa/disable", { method: "POST" });
    setBusy(false);
    loadStatus();
  };

  const handleDigit = (i: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[i] = digit;
    setCode(next);
    if (digit && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const codeInputRow = (
    <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
      {code.map((v, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={v}
          onChange={(e) => handleDigit(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          style={{
            width: 38, height: 44, textAlign: "center", fontFamily: "var(--font-heading)", fontWeight: 700,
            fontSize: 18, color: "var(--d-ink)", background: "var(--d-panel-2)",
            border: `1px solid ${v ? "var(--d-accent)" : "var(--d-line)"}`,
          }}
        />
      ))}
    </div>
  );

  if (!status) {
    return (
      <div className={styles.panel}>
        <div className={styles.panelHead}><span className={styles.panelTitle}>Your two-factor authentication</span></div>
        <div style={{ padding: "16px 20px", fontSize: 12.5, color: "var(--d-ink-3)" }}>Loading…</div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.panelHead}><span className={styles.panelTitle}>Your two-factor authentication</span></div>
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
        {error && (
          <div style={{ fontSize: 12.5, color: "var(--d-bad)", background: "rgba(241,112,123,0.1)", border: "1px solid var(--d-bad)", padding: "9px 12px" }}>
            {error}
          </div>
        )}

        {status.enabled && !pending && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "var(--d-ink)" }}>
                Two-factor is on via <strong>{METHOD_LABEL[status.method!]}</strong>
              </span>
              <span className={styles.statusPill} style={{ color: "var(--d-ok)" }}>Enabled</span>
            </div>
            <button type="button" className={styles.dBtn} disabled={busy} onClick={disable} style={{ alignSelf: "flex-start" }}>
              {busy ? "Turning off…" : "Turn off two-factor"}
            </button>
          </>
        )}

        {!status.enabled && !pending && (
          <>
            <p style={{ margin: 0, fontSize: 12.5, color: "var(--d-ink-3)", lineHeight: 1.55 }}>
              Add a second step to your sign-in with an authenticator app or a code emailed to you.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} disabled={busy} onClick={() => startEnroll("totp")}>
                Set up authenticator app
              </button>
              <button type="button" className={styles.dBtn} disabled={busy} onClick={() => startEnroll("email")}>
                Set up email codes
              </button>
            </div>
          </>
        )}

        {pending?.method === "totp" && pending.provisioningUri && (
          <>
            <p style={{ margin: 0, fontSize: 12.5, color: "var(--d-ink-3)", lineHeight: 1.55 }}>
              Scan this with Google Authenticator, Authy or similar, then enter the 6-digit code it shows.
            </p>
            <div style={{ background: "#fff", padding: 14, width: "fit-content" }}>
              <QRCode value={pending.provisioningUri} size={150} />
            </div>
            <p style={{ margin: 0, fontSize: 11.5, color: "var(--d-ink-3)" }}>
              Can&rsquo;t scan? Enter this key manually: <code style={{ color: "var(--d-ink)" }}>{extractSecret(pending.provisioningUri)}</code>
            </p>
            {codeInputRow}
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} disabled={busy || code.join("").length < 6} onClick={confirmEnroll}>
                {busy ? "Confirming…" : "Confirm"}
              </button>
              <button type="button" className={styles.dBtn} disabled={busy} onClick={() => setPending(null)}>Cancel</button>
            </div>
          </>
        )}

        {pending?.method === "email" && (
          <>
            <p style={{ margin: 0, fontSize: 12.5, color: "var(--d-ink-3)", lineHeight: 1.55 }}>
              We emailed a 6-digit code to your address on file. It expires in 10 minutes.
            </p>
            {codeInputRow}
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} disabled={busy || code.join("").length < 6} onClick={confirmEnroll}>
                {busy ? "Confirming…" : "Confirm"}
              </button>
              <button type="button" className={styles.dBtn} disabled={busy} onClick={() => setPending(null)}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import styles from "../console.module.css";
import type { ShortcodeType } from "@/lib/content/configurations";

function SecretField({ label, value, onChange, placeholder, hint }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string }) {
  const [show, setShow] = useState(false);
  return (
    <label className={styles.gisField}>
      <span>{label}</span>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          required
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ flex: 1 }}
        />
        <button type="button" className={styles.dBtn} style={{ flex: "none" }} onClick={() => setShow((s) => !s)}>
          {show ? "Hide" : "Show"}
        </button>
      </div>
      {hint && <div style={{ fontSize: 11.5, color: "var(--d-ink-3)", marginTop: 6 }}>{hint}</div>}
    </label>
  );
}

export function PaymentPipelineModal({
  open,
  dmaOptions,
  onClose,
  onCreate,
}: {
  open: boolean;
  dmaOptions: string[];
  onClose: () => void;
  onCreate: (fields: {
    shortCode: string;
    type: ShortcodeType;
    dma: string;
    consumerKey: string;
    consumerSecret: string;
    passkey: string;
  }) => void;
}) {
  const [shortCode, setShortCode] = useState("");
  const [type, setType] = useState<ShortcodeType>("paybill");
  const [dma, setDma] = useState("All DMAs");
  const [consumerKey, setConsumerKey] = useState("");
  const [consumerSecret, setConsumerSecret] = useState("");
  const [passkey, setPasskey] = useState("");

  if (!open) return null;

  const canSubmit = shortCode.trim() && consumerKey.trim() && consumerSecret.trim() && passkey.trim();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onCreate({ shortCode: shortCode.trim(), type, dma, consumerKey: consumerKey.trim(), consumerSecret: consumerSecret.trim(), passkey: passkey.trim() });
    setShortCode("");
    setConsumerKey("");
    setConsumerSecret("");
    setPasskey("");
    setDma("All DMAs");
    setType("paybill");
    onClose();
  };

  return (
    <div className={styles.gisModalOverlay} onClick={onClose}>
      <form className={styles.gisModal} onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className={styles.gisModalHead}>
          New payment pipeline
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8" /></svg>
          </button>
        </div>
        <div className={styles.gisModalBody}>
          <label className={styles.gisField}>
            <span>Shortcode</span>
            <input required value={shortCode} onChange={(e) => setShortCode(e.target.value)} placeholder="400200" />
          </label>
          <label className={styles.gisField}>
            <span>Shortcode type</span>
            <div className={styles.filterChipRow}>
              <button type="button" className={`${styles.filterChip} ${type === "paybill" ? styles.filterChipActive : ""}`} onClick={() => setType("paybill")}>PayBill</button>
              <button type="button" className={`${styles.filterChip} ${type === "till" ? styles.filterChipActive : ""}`} onClick={() => setType("till")}>Till (BuyGoods)</button>
            </div>
          </label>
          <label className={styles.gisField}>
            <span>DMA</span>
            <select value={dma} onChange={(e) => setDma(e.target.value)}>
              <option value="All DMAs">All DMAs</option>
              {dmaOptions.map((d) => (<option key={d} value={d}>{d}</option>))}
            </select>
          </label>

          <SecretField
            label="Consumer key"
            value={consumerKey}
            onChange={setConsumerKey}
            hint="From your Safaricom Daraja app, in production (not sandbox) mode."
          />
          <SecretField label="Consumer secret" value={consumerSecret} onChange={setConsumerSecret} />
          <SecretField
            label="Passkey"
            value={passkey}
            onChange={setPasskey}
            hint="Required to initiate Lipa Na M-Pesa Online (STK Push) from Emita — without it, customers can only pay in on their own, we can't prompt their phone."
          />

          <div style={{ fontSize: 11.5, color: "var(--d-ink-3)" }}>
            Stored encrypted — no one at Emita, including staff, can read these values back once saved.
          </div>
        </div>
        <div className={styles.gisModalFoot}>
          <button type="button" className={styles.dBtn} onClick={onClose}>Cancel</button>
          <button type="submit" className={`${styles.dBtn} ${styles.dBtnPrimary}`} disabled={!canSubmit}>Create pipeline</button>
        </div>
      </form>
    </div>
  );
}

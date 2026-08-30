"use client";

import { useState } from "react";
import styles from "../console.module.css";
import type { ProviderRow } from "@/lib/content/configurations";

export function ProviderModal({
  provider,
  onClose,
  onSave,
}: {
  provider: ProviderRow | null;
  onClose: () => void;
  onSave: (providerName: string) => void;
}) {
  const [name, setName] = useState(provider?.provider !== "—" ? provider?.provider ?? "" : "");

  if (!provider) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim());
    onClose();
  };

  return (
    <div className={styles.gisModalOverlay} onClick={onClose}>
      <form className={styles.gisModal} onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className={styles.gisModalHead}>
          Configure {provider.channel.toUpperCase()} provider
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8" /></svg>
          </button>
        </div>
        <div className={styles.gisModalBody}>
          <label className={styles.gisField}>
            <span>Provider name</span>
            <input required autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder={provider.channel === "email" ? "Resend" : "Africa's Talking"} />
          </label>
          <div style={{ fontSize: 11.5, color: "var(--d-ink-3)" }}>
            API keys and other credentials are configured server-side once this is wired to the backend.
          </div>
        </div>
        <div className={styles.gisModalFoot}>
          <button type="button" className={styles.dBtn} onClick={onClose}>Cancel</button>
          <button type="submit" className={`${styles.dBtn} ${styles.dBtnPrimary}`}>Save</button>
        </div>
      </form>
    </div>
  );
}

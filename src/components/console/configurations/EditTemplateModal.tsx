"use client";

import { useEffect, useState } from "react";
import styles from "../console.module.css";
import type { TemplateRow } from "@/lib/content/configurations";

export function EditTemplateModal({
  template,
  onClose,
  onSave,
}: {
  template: TemplateRow | null;
  onClose: () => void;
  onSave: (body: string) => void;
}) {
  const [body, setBody] = useState(template?.body ?? "");

  useEffect(() => {
    setBody(template?.body ?? "");
  }, [template]);

  if (!template) return null;

  return (
    <div className={styles.gisModalOverlay} onClick={onClose}>
      <div className={styles.gisModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.gisModalHead}>
          Edit template — {template.eventType}
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8" /></svg>
          </button>
        </div>
        <div className={styles.gisModalBody}>
          <label className={styles.gisField}>
            <span>Channel</span>
            <input value={template.channel.toUpperCase()} disabled />
          </label>
          <label className={styles.gisField}>
            <span>Message body</span>
            <textarea rows={5} value={body} onChange={(e) => setBody(e.target.value)} style={{ resize: "vertical" }} autoFocus />
          </label>
          <div style={{ fontSize: 11.5, color: "var(--d-ink-3)" }}>
            Placeholders like <code className={styles.mono}>{"{{utilityName}}"}</code> are filled in per recipient when sent.
          </div>
        </div>
        <div className={styles.gisModalFoot}>
          <button type="button" className={styles.dBtn} onClick={onClose}>Cancel</button>
          <button
            type="button"
            className={`${styles.dBtn} ${styles.dBtnPrimary}`}
            onClick={() => {
              onSave(body);
              onClose();
            }}
          >
            Save template
          </button>
        </div>
      </div>
    </div>
  );
}

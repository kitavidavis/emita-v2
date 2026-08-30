"use client";

import { useState } from "react";
import styles from "../console.module.css";
import { CHANNEL_META, type NotificationChannel } from "@/lib/content/customers";

const CHANNELS: NotificationChannel[] = ["sms", "email", "whatsapp", "in-app"];

const TEMPLATES: Partial<Record<NotificationChannel, string>> = {
  sms: "Dear {{name}}, your account {{account}} has a balance of KSh {{balance}}. Pay via Paybill 000000 to avoid disconnection.",
  email: "Dear {{name}},\n\nThis is a reminder that your account {{account}} currently has an outstanding balance of KSh {{balance}}.\n\nThank you,\nEmita",
  whatsapp: "Hi {{name}}, your Emita account {{account}} has a balance of KSh {{balance}} due. Reply PAY for payment options.",
  "in-app": "Your account balance is KSh {{balance}}. Tap to view your latest invoice.",
};

export function NotificationPanel({
  open,
  onClose,
  recipientCount,
  recipientLabel,
  onSend,
}: {
  open: boolean;
  onClose: () => void;
  recipientCount: number;
  recipientLabel: string;
  onSend: (channel: NotificationChannel, message: string) => void;
}) {
  const [channel, setChannel] = useState<NotificationChannel>("sms");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState(TEMPLATES.sms ?? "");

  if (!open) return null;

  const selectChannel = (c: NotificationChannel) => {
    setChannel(c);
    setMessage(TEMPLATES[c] ?? "");
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.drawerHead}>
          <span className={styles.drawerTitle}>Send notification</span>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--d-line)", fontSize: 12.5, color: "var(--d-ink-2)" }}>
          Sending to <strong style={{ color: "var(--d-ink)" }}>{recipientCount}</strong> {recipientLabel}
        </div>

        <div className={styles.filterGroup}>
          <div className={styles.filterGroupLabel}>Channel</div>
          <div className={styles.filterChipRow}>
            {CHANNELS.map((c) => (
              <button
                key={c}
                type="button"
                className={`${styles.filterChip} ${channel === c ? styles.filterChipActive : ""}`}
                onClick={() => selectChannel(c)}
              >
                {CHANNEL_META[c].label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
          {channel === "email" && (
            <label className={styles.gisField}>
              <span>Subject</span>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Balance reminder" />
            </label>
          )}
          <label className={styles.gisField} style={{ flex: 1 }}>
            <span>Message</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={7}
              style={{ resize: "vertical" }}
            />
          </label>
          <div style={{ fontSize: 11.5, color: "var(--d-ink-3)" }}>
            Placeholders <code className={styles.mono}>{"{{name}}"}</code>, <code className={styles.mono}>{"{{account}}"}</code> and{" "}
            <code className={styles.mono}>{"{{balance}}"}</code> are filled in per recipient when sent.
          </div>
        </div>

        <div className={styles.gisModalFoot}>
          <button type="button" className={styles.dBtn} onClick={onClose}>Cancel</button>
          <button
            type="button"
            className={`${styles.dBtn} ${styles.dBtnPrimary}`}
            disabled={!message.trim()}
            onClick={() => {
              onSend(channel, message);
              onClose();
            }}
          >
            Send to {recipientCount} {recipientCount === 1 ? "recipient" : "recipients"}
          </button>
        </div>
      </div>
    </div>
  );
}

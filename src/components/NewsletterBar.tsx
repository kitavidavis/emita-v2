"use client";

import { useState } from "react";
import styles from "./NewsletterBar.module.css";

export function NewsletterBar() {
  const [sent, setSent] = useState(false);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div>
          <div className={styles.title}>The Emita brief</div>
          <p className={styles.body}>One email a month on utility data, metering and loss reduction. No product news unless it is genuinely useful.</p>
        </div>
        {sent ? (
          <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--color-accent-700)" }}>Thanks — check your inbox to confirm.</div>
        ) : (
          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <input className={`input ${styles.input}`} type="email" required placeholder="Work email" />
            <button type="submit" className="btn btn-primary" style={{ padding: "13px 24px" }}>Subscribe</button>
          </form>
        )}
      </div>
    </section>
  );
}

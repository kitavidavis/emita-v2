"use client";

import { useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { BackLink } from "@/components/auth/BackLink";
import { resetTargetEmail } from "@/lib/content/auth";
import styles from "@/components/auth/authForm.module.css";

export default function ForgotPasswordSentPage() {
  const [resent, setResent] = useState(false);

  return (
    <AuthShell screen="sent">
      <BackLink href="/login">Back to sign in</BackLink>

      <div className={styles.iconBox}>
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="#FFFFFF" strokeWidth="1.8">
          <path d="M2 4h12v8H2z" />
          <path d="M2.5 4.5L8 9l5.5-4.5" />
        </svg>
      </div>

      <div className={styles.kicker}>Account recovery</div>
      <h1 className={styles.h1}>Check your inbox.</h1>
      <p className={styles.subtitle}>
        If <strong style={{ fontWeight: 600, color: "var(--color-text)" }}>{resetTargetEmail}</strong> matches a user on this utility, we&rsquo;ve sent a link to reset the password.
      </p>

      <div className={styles.infoBox}>
        <p className={styles.infoText}>
          The link is valid for one hour and can only be used once. If it doesn&rsquo;t arrive within a few minutes, check the spam folder before requesting another.
        </p>
      </div>

      <button
        type="button"
        className="btn btn-secondary btn-block"
        onClick={() => setResent(true)}
        disabled={resent}
      >
        {resent ? "Link sent again" : "Resend the link"}
      </button>

      <p className={styles.footRowCenter}>
        Wrong address? <a href="/forgot-password" style={{ color: "var(--color-accent)" }}>Try a different email</a>.
      </p>
    </AuthShell>
  );
}

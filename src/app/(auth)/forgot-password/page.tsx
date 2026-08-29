"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { BackLink } from "@/components/auth/BackLink";
import styles from "@/components/auth/authForm.module.css";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [accountSlug, setAccountSlug] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    await fetch("/api/auth/password-reset/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountSlug: accountSlug.trim().toLowerCase(), email }),
    }).catch(() => {});

    const params = new URLSearchParams({ accountSlug: accountSlug.trim().toLowerCase(), email });
    router.push(`/forgot-password/sent?${params.toString()}`);
  };

  return (
    <AuthShell screen="forgot">
      <BackLink href="/login">Back to sign in</BackLink>
      <div className={styles.kicker}>Password reset</div>
      <h1 className={styles.h1}>Reset your password.</h1>
      <p className={styles.subtitle}>
        Enter your workspace and email address. If they match a user, we will send a reset link valid for 30 minutes.
      </p>
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>Workspace</label>
          <input
            type="text"
            required
            placeholder="bwaliro-water"
            className={styles.inputBox}
            value={accountSlug}
            onChange={(e) => setAccountSlug(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Work email</label>
          <input
            type="email"
            required
            placeholder="name@utility.co.ke"
            className={styles.inputBox}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? "Sending…" : "Send reset link"}
        </button>
      </form>
    </AuthShell>
  );
}

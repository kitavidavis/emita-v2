"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { PasswordField } from "@/components/auth/PasswordField";
import styles from "@/components/auth/authForm.module.css";

export default function BackofficeLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/backoffice/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "That email or password is incorrect.");
        setSubmitting(false);
        return;
      }

      router.push("/backoffice");
    } catch {
      setError("Could not reach the authentication service. Try again in a moment.");
      setSubmitting(false);
    }
  };

  return (
    <AuthShell screen="backoffice">
      <div className={styles.kicker}>Platform admin</div>
      <h1 className={styles.h1}>Emita backoffice.</h1>
      <p className={styles.subtitle}>Sign in with your Emita admin account.</p>

      {error && (
        <div className={styles.errorBanner}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="var(--color-bad)" strokeWidth="1.8" style={{ flex: "none", marginTop: 1 }}>
            <circle cx="8" cy="8" r="6.2" />
            <path d="M8 5v3.4M8 10.6v.4" />
          </svg>
          <span className={styles.errorText}>
            <strong style={{ display: "block", fontWeight: 600 }}>{error}</strong>
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>Admin email</label>
          <input
            type="email"
            required
            placeholder="admin@emita.co.ke"
            className={styles.inputBox}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Password</label>
          <PasswordField name="password" wrap={false} onChange={setPassword} />
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className={styles.footRow}>This area is for Emita staff only. Utility staff should use the regular console login.</p>
    </AuthShell>
  );
}

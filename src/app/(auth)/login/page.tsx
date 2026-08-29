"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { PasswordField } from "@/components/auth/PasswordField";
import { demoAccount } from "@/lib/content/auth";
import styles from "@/components/auth/authForm.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [accountSlug, setAccountSlug] = useState(demoAccount.accountSlug);
  const [email, setEmail] = useState(demoAccount.email);
  const [password, setPassword] = useState(demoAccount.password);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountSlug: accountSlug.trim().toLowerCase(), email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "That workspace, email or password is incorrect.");
        setSubmitting(false);
        return;
      }

      if (data.mfaRequired) {
        sessionStorage.setItem("emita_mfa_challenge", data.mfaChallengeToken);
        sessionStorage.setItem("emita_mfa_method", data.mfaMethod ?? "");
        router.push("/verify");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Could not reach the authentication service. Try again in a moment.");
      setSubmitting(false);
    }
  };

  return (
    <AuthShell screen="signin">
      <div className={styles.kicker}>Sign in</div>
      <h1 className={styles.h1}>Welcome back.</h1>
      <p className={styles.subtitle}>Sign in to your Emita console.</p>

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
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label className={styles.label} style={{ marginBottom: 0 }}>Password</label>
            <Link href="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
          </div>
          <PasswordField name="password" wrap={false} defaultValue={password} onChange={setPassword} />
        </div>
        <label className={styles.checkboxRow}>
          <input type="checkbox" defaultChecked className={styles.checkbox} />
          Keep me signed in on this device
        </label>
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className={styles.divider} style={{ marginTop: 8 }}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerText}>or</span>
        <span className={styles.dividerLine} />
      </div>

      <button type="button" className="btn btn-secondary btn-block" style={{ marginTop: 0 }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" style={{ flex: "none" }}>
          <path d="M4 7V5a4 4 0 018 0v2M3 7h10v7H3z" />
        </svg>
        Sign in with your organisation (SSO)
      </button>

      <p className={styles.footRow}>
        Need an account? Ask your utility administrator for an invitation, or <Link href="/help">contact Emita support</Link>.
      </p>
    </AuthShell>
  );
}

"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { PasswordField } from "@/components/auth/PasswordField";
import styles from "@/components/auth/authForm.module.css";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => router.push("/login"), 1500);
      return () => clearTimeout(t);
    }
  }, [done, router]);

  const longEnough = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const passwordsMatch = password.length > 0 && password === confirm;

  if (!token) {
    return (
      <AuthShell screen="reset">
        <div className={styles.kickerBad}>Invalid link</div>
        <h1 className={styles.h1}>This reset link is incomplete.</h1>
        <p className={styles.subtitle}>
          The link is missing its token. Request a fresh one from the sign-in page.
        </p>
        <a href="/forgot-password" className="btn btn-primary btn-block">Request a new link</a>
      </AuthShell>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!longEnough || !hasNumber || !passwordsMatch) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "That reset link is invalid or has expired.");
        setSubmitting(false);
        return;
      }

      setDone(true);
    } catch {
      setError("Could not reach the authentication service. Try again in a moment.");
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <AuthShell screen="reset">
        <div className={styles.kicker}>Account recovery</div>
        <h1 className={styles.h1}>Password updated.</h1>
        <p className={styles.subtitle}>Taking you to sign in…</p>
      </AuthShell>
    );
  }

  return (
    <AuthShell screen="reset">
      <div className={styles.kicker}>Account recovery</div>
      <h1 className={styles.h1}>Choose something you will keep.</h1>
      <p className={styles.subtitle}>A strong password protects the customer register, the billing run and the audit trail behind it.</p>

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
          <label className={styles.label}>New password</label>
          <PasswordField name="password" wrap={false} onChange={setPassword} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Confirm password</label>
          <PasswordField name="confirmPassword" wrap={false} onChange={setConfirm} />
        </div>

        <div className={styles.rulesBox}>
          <div className={styles.ruleRow} style={{ color: longEnough ? "var(--color-ok)" : "var(--color-neutral-600)" }}>
            <RuleIcon met={longEnough} /> At least 8 characters
          </div>
          <div className={styles.ruleRow} style={{ color: hasNumber ? "var(--color-ok)" : "var(--color-neutral-600)" }}>
            <RuleIcon met={hasNumber} /> Contains a number
          </div>
          <div className={styles.ruleRow} style={{ color: passwordsMatch ? "var(--color-ok)" : "var(--color-neutral-600)" }}>
            <RuleIcon met={passwordsMatch} /> Passwords match
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={submitting || !longEnough || !hasNumber || !passwordsMatch}
        >
          {submitting ? "Updating…" : "Update password"}
        </button>
      </form>
    </AuthShell>
  );
}

function RuleIcon({ met }: { met: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ flex: "none" }}>
      {met ? <path d="M3.5 8.5l3 3 6-7" /> : <circle cx="8" cy="8" r="5.5" />}
    </svg>
  );
}

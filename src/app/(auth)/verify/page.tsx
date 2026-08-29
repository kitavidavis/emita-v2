"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { BackLink } from "@/components/auth/BackLink";
import { OtpInput } from "@/components/auth/OtpInput";
import styles from "@/components/auth/authForm.module.css";

export default function VerifyPage() {
  const router = useRouter();
  const [method, setMethod] = useState<"email" | "totp" | null>(null);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("emita_mfa_challenge")) {
      router.replace("/login");
      return;
    }
    const stored = sessionStorage.getItem("emita_mfa_method");
    setMethod(stored === "totp" ? "totp" : "email");
  }, [router]);

  useEffect(() => {
    if (!verified) return;
    const t = setTimeout(() => router.push("/dashboard"), 700);
    return () => clearTimeout(t);
  }, [verified, router]);

  const handleVerify = async () => {
    setSubmitting(true);
    setError(null);

    const mfaChallengeToken = sessionStorage.getItem("emita_mfa_challenge");
    if (!mfaChallengeToken) {
      router.replace("/login");
      return;
    }

    try {
      const res = await fetch("/api/auth/mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mfaChallengeToken, code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "That code isn't right.");
        setSubmitting(false);
        return;
      }

      sessionStorage.removeItem("emita_mfa_challenge");
      sessionStorage.removeItem("emita_mfa_method");
      setVerified(true);
    } catch {
      setError("Could not reach the authentication service. Try again in a moment.");
      setSubmitting(false);
    }
  };

  return (
    <AuthShell screen="twofa">
      <BackLink href="/login">Back to sign in</BackLink>
      <div className={styles.kicker}>Two-factor authentication</div>
      <h1 className={styles.h1}>Enter your code.</h1>

      {!verified ? (
        <>
          <p className={styles.subtitle}>
            {method === "totp"
              ? "Enter the current 6-digit code from your authenticator app."
              : "We emailed a six-digit code to your address on file. It expires in 10 minutes."}
          </p>

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

          <OtpInput onChange={setCode} />

          <button
            type="button"
            className="btn btn-primary btn-block"
            disabled={code.length < 6 || submitting}
            onClick={handleVerify}
            style={{ marginBottom: 20 }}
          >
            {submitting ? "Verifying…" : "Verify and continue"}
          </button>

          {method === "email" && (
            <p className={styles.footRowCenter} style={{ margin: 0 }}>
              Didn&rsquo;t get it? <a href="/login" style={{ color: "var(--color-accent)" }}>Sign in again</a> to send a new code.
            </p>
          )}
        </>
      ) : (
        <>
          <p className={styles.subtitle}>Verified. Opening your console…</p>
        </>
      )}
    </AuthShell>
  );
}

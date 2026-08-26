"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { BackLink } from "@/components/auth/BackLink";
import { OtpInput } from "@/components/auth/OtpInput";
import { demoOtp } from "@/lib/content/auth";
import styles from "@/components/auth/authForm.module.css";

const START_SECONDS = 5 * 60;

export default function VerifyPage() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(START_SECONDS);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  useEffect(() => {
    if (!verified) return;
    const t = setTimeout(() => router.push("/dashboard"), 700);
    return () => clearTimeout(t);
  }, [verified, router]);

  const mins = Math.floor(seconds / 60);
  const secs = String(seconds % 60).padStart(2, "0");

  const handleVerify = () => {
    setSubmitting(true);
    setError(false);

    // Simulates a round trip to an OTP-verification backend.
    setTimeout(() => {
      if (code === demoOtp) {
        setVerified(true);
        return;
      }
      setSubmitting(false);
      setError(true);
    }, 700);
  };

  return (
    <AuthShell screen="twofa">
      <BackLink href="/login">Back to sign in</BackLink>
      <div className={styles.kicker}>Two-factor authentication</div>
      <h1 className={styles.h1}>Enter your code.</h1>

      {!verified ? (
        <>
          <p className={styles.subtitle}>
            We sent a six-digit code to <strong style={{ fontWeight: 600, color: "var(--color-text)" }}>+254 7•• ••• 412</strong>. It expires in {mins}:{secs}.
          </p>

          {error && (
            <div className={styles.errorBanner}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="var(--color-bad)" strokeWidth="1.8" style={{ flex: "none", marginTop: 1 }}>
                <circle cx="8" cy="8" r="6.2" />
                <path d="M8 5v3.4M8 10.6v.4" />
              </svg>
              <span className={styles.errorText}>
                <strong style={{ display: "block", fontWeight: 600 }}>That code isn&rsquo;t right</strong>
                Check the digits and try again.
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

          <div className={styles.infoBox} style={{ marginBottom: 20 }}>
            <p className={styles.infoText}>
              Demo code — <strong style={{ fontWeight: 600 }}>{demoOtp}</strong>.
            </p>
          </div>

          <div className={styles.resendList}>
            <button type="button" className={styles.resendBtn} style={{ color: "var(--color-accent)" }}>Resend the code by SMS</button>
            <button type="button" className={styles.resendBtn} style={{ color: "var(--color-neutral-700)" }}>Use an authenticator app instead</button>
            <button type="button" className={styles.resendBtn} style={{ color: "var(--color-neutral-700)" }}>Enter a recovery code</button>
          </div>
        </>
      ) : (
        <>
          <p className={styles.subtitle}>Verified. Opening your console…</p>
        </>
      )}
    </AuthShell>
  );
}

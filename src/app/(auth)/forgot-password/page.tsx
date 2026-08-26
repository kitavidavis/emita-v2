"use client";

import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { BackLink } from "@/components/auth/BackLink";
import styles from "@/components/auth/authForm.module.css";

export default function ForgotPasswordPage() {
  const router = useRouter();

  return (
    <AuthShell screen="forgot">
      <BackLink href="/login">Back to sign in</BackLink>
      <div className={styles.kicker}>Password reset</div>
      <h1 className={styles.h1}>Reset your password.</h1>
      <p className={styles.subtitle}>
        Enter the email address on your account. If it matches a user on this utility, we will send a reset link valid for one hour.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/forgot-password/sent");
        }}
      >
        <div className={styles.field}>
          <label className={styles.label}>Work email</label>
          <input type="email" required placeholder="name@utility.co.ke" className={styles.inputBox} />
        </div>
        <button type="submit" className="btn btn-primary btn-block">Send reset link</button>
      </form>
    </AuthShell>
  );
}

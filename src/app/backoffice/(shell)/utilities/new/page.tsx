"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/components/console/console.module.css";

export default function NewUtilityPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    slug: "",
    name: "",
    defaultCountry: "KE",
    currency: "KES",
    ownerEmail: "",
    ownerFullName: "",
    ownerPhoneNumber: "",
    ownerPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/backoffice/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        slug: form.slug.trim().toLowerCase(),
        defaultCountry: form.defaultCountry.trim().toUpperCase(),
        currency: form.currency.trim().toUpperCase(),
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.message ?? "Could not create that utility. Check the fields and try again.");
      setSubmitting(false);
      return;
    }

    const account = await res.json();
    router.push(`/backoffice/utilities/${account.id}`);
  };

  return (
    <>
      <h1 style={{ margin: 0, fontSize: 19, letterSpacing: "-0.02em", color: "var(--d-ink)", fontFamily: "var(--font-heading)", fontWeight: 700 }}>
        Add utility
      </h1>
      <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--d-ink-3)" }}>
        Creates the utility's account and its first (owner) staff login together.
      </p>

      <div className={styles.panel} style={{ maxWidth: 560 }}>
        <form onSubmit={handleSubmit} style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
          {error && <div style={{ color: "var(--d-bad)", fontSize: 13 }}>{error}</div>}

          <label className={styles.gisField}>
            <span>Utility name</span>
            <input required value={form.name} onChange={set("name")} placeholder="Bwaliro Water Project" />
          </label>
          <label className={styles.gisField}>
            <span>Slug (workspace URL)</span>
            <input required pattern="[a-z0-9-]{3,64}" value={form.slug} onChange={set("slug")} placeholder="bwaliro-water" />
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <label className={styles.gisField}>
              <span>Country (ISO alpha-2)</span>
              <input required pattern="[A-Za-z]{2}" maxLength={2} value={form.defaultCountry} onChange={set("defaultCountry")} />
            </label>
            <label className={styles.gisField}>
              <span>Currency (ISO 4217)</span>
              <input required pattern="[A-Za-z]{3}" maxLength={3} value={form.currency} onChange={set("currency")} />
            </label>
          </div>

          <div style={{ borderTop: "1px solid var(--d-line)", paddingTop: 14, marginTop: 4 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--d-ink-3)", marginBottom: 12 }}>
              Owner staff account
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <label className={styles.gisField}>
                <span>Full name</span>
                <input required value={form.ownerFullName} onChange={set("ownerFullName")} placeholder="Nelly Wanjala" />
              </label>
              <label className={styles.gisField}>
                <span>Work email</span>
                <input required type="email" value={form.ownerEmail} onChange={set("ownerEmail")} placeholder="n.wanjala@bwaliro.co.ke" />
              </label>
              <label className={styles.gisField}>
                <span>Phone number (optional)</span>
                <input value={form.ownerPhoneNumber} onChange={set("ownerPhoneNumber")} placeholder="+254700000000" />
              </label>
              <label className={styles.gisField}>
                <span>Temporary password</span>
                <input required type="password" minLength={8} value={form.ownerPassword} onChange={set("ownerPassword")} />
              </label>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button type="submit" className={`${styles.dBtn} ${styles.dBtnPrimary}`} disabled={submitting}>
              {submitting ? "Creating…" : "Create utility"}
            </button>
            <button type="button" className={styles.dBtn} onClick={() => router.push("/backoffice")}>Cancel</button>
          </div>
        </form>
      </div>
    </>
  );
}

import styles from "./authForm.module.css";

const RULES = [
  { key: "len", label: "At least 12 characters", test: (pw: string) => pw.length >= 12 },
  { key: "case", label: "Upper and lower case letters", test: (pw: string) => /[a-z]/.test(pw) && /[A-Z]/.test(pw) },
  { key: "num", label: "At least one number", test: (pw: string) => /\d/.test(pw) },
  { key: "sym", label: "One symbol, for maximum strength", test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
];

export function PasswordStrength({ password }: { password: string }) {
  const met = RULES.map((r) => r.test(password));
  const count = met.filter(Boolean).length;

  const label =
    count === 0 ? "Too weak" : count === 1 ? "Weak" : count === 2 ? "Fair" : count === 3 ? "Strong — add one more character class for maximum strength." : "Maximum strength.";
  const labelColor = count <= 1 ? "var(--color-bad)" : count === 2 ? "var(--color-warn)" : "var(--color-ok)";

  return (
    <>
      <div className={styles.strengthBars}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={styles.strengthBar} style={{ background: i < count ? "var(--color-ok)" : "var(--color-line)" }} />
        ))}
      </div>
      <div className={styles.strengthLabel} style={{ color: labelColor }}>{label}</div>
      <div className={styles.rulesBox}>
        {RULES.map((r, i) => (
          <div key={r.key} className={styles.ruleRow} style={{ color: met[i] ? "var(--color-ok)" : "var(--color-neutral-600)" }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" style={{ flex: "none" }}>
              <path d={met[i] ? "M3 8.5L6.2 12 13 4.5" : "M8 3v10M3 8h10"} />
            </svg>
            {r.label}
          </div>
        ))}
      </div>
    </>
  );
}

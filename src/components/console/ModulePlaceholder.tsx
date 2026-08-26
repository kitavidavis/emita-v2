import styles from "./console.module.css";
import { MODULE_COPY } from "@/lib/content/console";

export function ModulePlaceholder({ moduleKey }: { moduleKey: string }) {
  const copy = MODULE_COPY[moduleKey];
  if (!copy) return null;

  return (
    <div className={styles.placeholderCard}>
      <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--d-ink-3)", marginBottom: 14 }}>
        Preview
      </div>
      <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6, color: "var(--d-ink-2)", maxWidth: "58ch" }}>{copy.body}</p>
      <ul className={styles.placeholderCover}>
        {copy.covers.map((c) => (
          <li key={c}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="var(--d-cyan)" strokeWidth="2" style={{ flex: "none", marginTop: 3 }}>
              <path d="M3 8.5L6.2 12 13 4.5" />
            </svg>
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}

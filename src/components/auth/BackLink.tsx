import Link from "next/link";
import styles from "./authForm.module.css";

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={styles.backLink}>
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 3L5 8l5 5" />
      </svg>
      {children}
    </Link>
  );
}

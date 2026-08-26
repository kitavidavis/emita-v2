import Link from "next/link";
import styles from "./ClosingCta.module.css";

export function ClosingCta() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div>
          <h2 className={styles.heading}>See what your own network looks like with context attached.</h2>
          <p className={styles.body}>Bring one zone and one month of reads. We will show you what Emita makes of it.</p>
        </div>
        <div className={styles.actions}>
          <Link href="/demo" className={`btn ${styles.btnLight}`}>Request a Demo</Link>
          <Link href="/resources" className={`btn ${styles.btnOutline}`}>Browse resources</Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { CheckIcon } from "@/components/icons";

export default function DemoPage() {
  const [sent, setSent] = useState(false);

  return (
    <main>
      <section style={{ borderBottom: "2px solid var(--color-divider)" }}>
        <div style={{ maxWidth: "var(--content-max)", margin: "0 auto", padding: "0 40px" }} className={styles.split}>
          <div className={styles.left}>
            <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 24 }}>Request a demo</div>
            <h1 style={{ fontSize: "clamp(32px,5.5vw,60px)", lineHeight: 0.99, letterSpacing: "-0.035em", margin: "0 0 22px", maxWidth: "16ch" }}>
              See Emita on your own network.
            </h1>
            <p style={{ fontSize: 17, color: "var(--color-neutral-800)", maxWidth: "48ch" }}>
              Tell us what you run and what you are trying to see. We will walk through the platform against a utility environment like yours.
            </p>
            <div className={styles.list}>
              <div className={styles.row}><span className={styles.num}>01</span><span>A 45-minute walkthrough of the platform</span></div>
              <div className={styles.row}><span className={styles.num}>02</span><span>A look at how your systems would connect</span></div>
              <div className={styles.row} style={{ borderBottom: 0 }}><span className={styles.num}>03</span><span>A written summary of what a deployment involves</span></div>
            </div>
          </div>
          <div className={styles.right}>
            {!sent ? (
              <form
                className={styles.form}
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div className={styles.grid}>
                  <div className="field"><label>First name</label><input className="input" type="text" required /></div>
                  <div className="field"><label>Last name</label><input className="input" type="text" required /></div>
                  <div className={`field ${styles.span2}`}><label>Work email</label><input className="input" type="email" required placeholder="name@utility.co" /></div>
                  <div className={`field ${styles.span2}`}><label>Utility or organisation</label><input className="input" type="text" required /></div>
                  <div className={`field ${styles.span2}`}><label>Country</label><input className="input" type="text" required /></div>
                  <div className={styles.span2}>
                    <div className={styles.topicLabel}>What are you looking at first?</div>
                    <div className={styles.radios}>
                      <label className="radio"><input type="radio" name="topic" defaultChecked /><span className="dot" />Non-revenue water</label>
                      <label className="radio"><input type="radio" name="topic" /><span className="dot" />Revenue collection</label>
                      <label className="radio"><input type="radio" name="topic" /><span className="dot" />Smart metering</label>
                      <label className="radio"><input type="radio" name="topic" /><span className="dot" />Something else</label>
                    </div>
                  </div>
                  <div className={`field ${styles.span2}`}><label>Anything we should know</label><textarea className="input" rows={3} /></div>
                  <div className={styles.formFoot}>
                    <span className={styles.formNote}>We will only use these details to arrange the demo.</span>
                    <button type="submit" className="btn btn-primary" style={{ padding: "14px 26px", fontSize: 15 }}>Request a Demo</button>
                  </div>
                </div>
              </form>
            ) : (
              <div className={styles.success}>
                <div className={styles.checkBox}><CheckIcon /></div>
                <h2 className={styles.successTitle}>Request received.</h2>
                <p className={styles.successBody}>
                  A member of the team will be in touch within one working day to arrange a time. If it is urgent, reply to the confirmation email and it will be picked up sooner.
                </p>
                <div className={styles.successActions}>
                  <Link href="/resources" className="btn btn-secondary" style={{ padding: "13px 22px" }}>Read the 2026 report</Link>
                  <Link href="/customers" className="btn btn-ghost">See a deployment →</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

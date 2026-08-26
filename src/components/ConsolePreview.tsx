"use client";

import { useState } from "react";
import styles from "./ConsolePreview.module.css";
import { consoleTabs } from "@/lib/content/tabs";

export function ConsolePreview() {
  const [active, setActive] = useState(0);
  const tab = consoleTabs[active];

  return (
    <div className={styles.panel}>
      <div className={styles.tabRow}>
        {consoleTabs.map((t, i) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActive(i)}
            className={`${styles.tabBtn} ${i === active ? styles.tabBtnActive : ""}`}
          >
            {t.label}
            {i === active && <span className={styles.tabUnderline} />}
          </button>
        ))}
        <span className={styles.live}>LIVE · 04:12 EAT</span>
      </div>
      <div className={styles.body}>
        <div className={styles.chartSide}>
          <div className={styles.chartTitle}>{tab.title}</div>
          <div className={styles.chartNote}>{tab.note}</div>
          <svg viewBox="0 0 620 240" style={{ width: "100%", height: "auto" }}>
            <g stroke="#FFFFFF" strokeWidth="1" opacity="0.14">
              <path d="M0 60H620M0 120H620M0 180H620" />
            </g>
            <path d={tab.path} fill="none" stroke="#00D4FF" strokeWidth="2.5" />
            <path
              d="M10 214L70 206L130 210L190 200L250 206L310 198L370 190L430 186L490 190L550 182L610 186"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.6"
              opacity="0.45"
              strokeDasharray="5 5"
            />
            <path d="M370 20V240" stroke="#2F80ED" strokeWidth="2" />
            <g fontFamily="var(--font-heading)" fontSize="10" letterSpacing="1.2" fill="#FFFFFF" opacity="0.8">
              <text x="10" y="26">{tab.chart}</text>
              <text x="382" y="42" fill="#00D4FF">{tab.flag}</text>
            </g>
          </svg>
        </div>
        <div className={styles.statsSide}>
          <div className={styles.statsGrid}>
            {tab.stats.map((s) => (
              <div key={s.label} className={styles.statCell}>
                <div className={styles.statLabel}>{s.label}</div>
                <div className={styles.statValue} style={{ color: s.flagged ? "var(--color-accent-2)" : "#FFFFFF" }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div className={styles.queueLabel}>Priority queue</div>
          {tab.rows.map((r) => (
            <div key={r.label} className={styles.queueRow}>
              <span>{r.label}</span>
              <span className={styles.queueState} style={{ color: r.flagged ? "var(--color-accent-2)" : "rgba(255,255,255,0.7)" }}>{r.state}</span>
            </div>
          ))}
          <div className={styles.queueFoot} />
        </div>
      </div>
    </div>
  );
}

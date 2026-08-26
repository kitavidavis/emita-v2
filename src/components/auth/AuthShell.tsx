import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./AuthShell.module.css";
import { BRAND_COPY, type AuthScreen } from "@/lib/content/auth";

export function AuthShell({ screen, children }: { screen: AuthScreen; children: ReactNode }) {
  const brand = BRAND_COPY[screen];

  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        <div className={styles.brandCol}>

          <div className={styles.brandBody}>
            <div className={styles.brandKicker}>{brand.kicker}</div>
            <h2 className={styles.brandTitle}>{brand.title}</h2>
            <p className={styles.brandText}>{brand.body}</p>

            <svg viewBox="0 0 460 240" style={{ width: "100%", maxWidth: 460, height: "auto" }}>
              <g stroke="#FFFFFF" strokeWidth="1" opacity="0.12">
                <path d="M0 60H460M0 120H460M0 180H460" />
                <path d="M60 0V240M160 0V240M260 0V240M360 0V240" />
              </g>
              <g stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.55">
                <path d="M40 180L160 120H260L360 60" />
                <path d="M160 120V40" />
                <path d="M260 120V200H400" />
              </g>
              <path d="M40 180L160 120H260L360 60" stroke="#00D4FF" strokeWidth="2" fill="none" strokeDasharray="16 224" style={{ animation: "emita-dash 3.6s linear infinite" }} />
              <g fill="none" stroke="#FFFFFF" strokeWidth="2">
                <rect x="30" y="170" width="20" height="20" />
                <rect x="150" y="110" width="20" height="20" />
                <rect x="250" y="110" width="20" height="20" />
                <rect x="150" y="30" width="20" height="20" />
              </g>
              <rect x="350" y="50" width="20" height="20" fill="#00D4FF" />
              <rect x="350" y="50" width="20" height="20" fill="#00D4FF" style={{ animation: "emita-pulse 2.6s ease-in-out infinite" }} />
              <g fontFamily="Space Grotesk, sans-serif" fontSize="9.5" letterSpacing="1.2" fill="#FFFFFF" opacity="0.6">
                <text x="30" y="206">INTAKE</text>
                <text x="146" y="146">ZONE</text>
                <text x="246" y="146">MAINS</text>
                <text x="374" y="66">ANOMALY</text>
              </g>
            </svg>
          </div>

          <div className={styles.brandFoot}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>© 2026 Emita</span>
            <span style={{ display: "flex", gap: 18, fontSize: 12 }}>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/help">Support</Link>
            </span>
          </div>
        </div>

        <div className={styles.formCol}>
          <div className={styles.formInner}>{children}</div>
        </div>
      </div>
    </div>
  );
}

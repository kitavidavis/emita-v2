"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import styles from "@/components/console/console.module.css";

const NAV_ITEMS = [
  { key: "utilities", label: "Utilities", href: "/backoffice", icon: "M2 6l6-4 6 4v8H2z M6 14V9h4v5" },
  { key: "invoices", label: "Invoices", href: "/backoffice/invoices", icon: "M4 1.5h8v13H4zM6 5h4M6 8h4M6 11h2" },
];

function findActiveKey(pathname: string): string {
  if (pathname === "/backoffice" || pathname.startsWith("/backoffice/utilities")) return "utilities";
  if (pathname.startsWith("/backoffice/invoices")) return "invoices";
  return "utilities";
}

export function BackofficeShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const activeKey = findActiveKey(pathname);

  return (
    <div className={styles.shell} data-theme="dark">
      <aside className={styles.sidebar} style={{ width: 232 }}>
        <div className={styles.sidebarHead}>
          <Image src="/emita-logo.png" alt="Emita" width={22} height={22} style={{ flex: "none", filter: "brightness(0) invert(1)" }} priority />
          <span className={styles.brandText}>
            <span className={styles.brandName}>Emita Backoffice</span>
          </span>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((it) => {
            const active = activeKey === it.key;
            return (
              <Link key={it.key} href={it.href} title={it.label} className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" className={styles.navIcon}>
                  <path d={it.icon} />
                </svg>
                <span className={styles.navLabel}>{it.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFoot}>
          <button
            type="button"
            className={styles.signOutBtn}
            onClick={async () => {
              await fetch("/api/backoffice/auth/logout", { method: "POST" });
              router.push("/backoffice/login");
            }}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" className={styles.navIcon}>
              <path d="M11 11l3-3-3-3M14 8H6M9 2H4a2 2 0 00-2 2v8a2 2 0 002 2h5" />
            </svg>
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <div className={styles.main}>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}

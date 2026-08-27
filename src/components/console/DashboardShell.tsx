"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import styles from "./console.module.css";
import { useConsole } from "./ConsoleContext";
import {
  ICONS,
  NAV_ITEMS,
  PREMIUM_NAV_ITEMS,
  TITLES,
  PREMIUM_TITLES,
  NOTIFICATIONS,
  HELP_RESOURCES,
  UTILITY,
} from "@/lib/content/console";

function findActiveKey(pathname: string): { key: string; premium: boolean } {
  const all = [...PREMIUM_NAV_ITEMS.map((n) => ({ ...n, premium: true })), ...NAV_ITEMS.map((n) => ({ ...n, premium: false }))];
  // "/dashboard" itself (Home) only ever matches exactly — as a prefix it would swallow every
  // other route. Everything else needs a real path-segment boundary: "/dashboard/map" must not
  // match "/dashboard/mapper" just because one string happens to start with the other.
  const hit = all.find((n) => (n.href === "/dashboard" ? pathname === "/dashboard" : pathname === n.href || pathname.startsWith(`${n.href}/`)));
  return hit ? { key: hit.key, premium: hit.premium } : { key: "home", premium: false };
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useConsole();
  const [wide, setWide] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const { key: activeKey, premium: activeIsPremium } = findActiveKey(pathname);
  const titleSource = activeIsPremium ? PREMIUM_TITLES : TITLES;
  const [viewTitle, viewNote] = titleSource[activeKey] ?? TITLES.home;

  return (
    <div className={styles.shell} data-theme={theme}>
      <aside className={styles.sidebar} style={{ width: wide ? 232 : 62 }}>
        <div className={styles.sidebarHead}>
          <Image
            src="/emita-logo.png"
            alt="Emita"
            width={22}
            height={22}
            style={{ flex: "none", filter: theme === "dark" ? "brightness(0) invert(1)" : "none" }}
            priority
          />
          {wide && (
            <span className={styles.brandText}>
              <span className={styles.brandName}>{UTILITY.short}</span>
            </span>
          )}
          <button type="button" onClick={() => setWide((w) => !w)} aria-label="Collapse" className={styles.railBtn}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={wide ? "M10 3L5 8l5 5" : "M6 3l5 5-5 5"} />
            </svg>
          </button>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((it) => {
            const active = activeKey === it.key && !activeIsPremium;
            return (
              <Link
                key={it.key}
                href={it.href}
                title={it.label}
                className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" className={styles.navIcon}>
                  <path d={ICONS[it.icon]} />
                </svg>
                {wide && (
                  <>
                    <span className={styles.navLabel}>{it.label}</span>
                    {it.tag && (
                      <span className={styles.navTag} style={{ color: it.tagAccent ? "var(--d-cyan)" : "var(--d-mut)" }}>
                        {it.tag}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}

          {wide && (
            <div className={styles.navGroupLabel}>
              <span>Intelligence</span>
            </div>
          )}
          {PREMIUM_NAV_ITEMS.map((it) => {
            const active = activeKey === it.key && activeIsPremium;
            return (
              <Link
                key={it.key}
                href={it.href}
                title={it.label}
                className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" className={styles.navIcon}>
                  <path d={ICONS[it.icon]} />
                </svg>
                {wide && <span className={styles.navLabel}>{it.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFoot}>
          <Link href="/login" className={styles.signOutBtn}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" className={styles.navIcon}>
              <path d="M11 11l3-3-3-3M14 8H6M9 2H4a2 2 0 00-2 2v8a2 2 0 002 2h5" />
            </svg>
            {wide && <span>Sign out</span>}
          </Link>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.header} style={{ position: "relative" }}>
          <div className={styles.headerRow}>
            <div className={styles.searchBox}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="var(--d-ink-3)" strokeWidth="1.8">
                <circle cx="7" cy="7" r="4.6" />
                <path d="M10.4 10.4L14 14" />
              </svg>
              <input type="text" placeholder="Navigate to a customer, bill, meter or zone" />
              <span className={styles.searchKbd}>⌘K</span>
            </div>

            <div className={styles.headerActions}>
              <button type="button" onClick={toggleTheme} className={styles.chipBtn}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d={theme === "dark" ? "M13 9.5A5.5 5.5 0 016.5 3a5.5 5.5 0 106.5 6.5z" : "M8 2v1.5M8 12.5V14M2 8h1.5M12.5 8H14M3.8 3.8l1 1M11.2 11.2l1 1M12.2 3.8l-1 1M4.8 11.2l-1 1M8 5.4a2.6 2.6 0 100 5.2 2.6 2.6 0 000-5.2z"} />
                </svg>
                {theme === "dark" ? "Dark" : "Light"}
              </button>
              <button type="button" className={styles.chipBtn}>
                English
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3.5 6L8 10.5 12.5 6" />
                </svg>
              </button>
              <button type="button" onClick={() => setHelpOpen(true)} className={styles.chipBtn}>Apps &amp; resources</button>
              <button type="button" onClick={() => setNotifOpen((v) => !v)} aria-label="Notifications" className={styles.iconBtn}>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M4 6.5a4 4 0 018 0c0 3 1 4 1 4H3s1-1 1-4M6.4 13a1.7 1.7 0 003.2 0" />
                </svg>
                <span className={styles.notifBadge}>{NOTIFICATIONS.length}</span>
              </button>
              <Link href="/dashboard/settings" className={styles.userChip}>
                <span className={styles.userAvatar}>NW</span>
                <span className={styles.userName}>Nelly Wanjala</span>
              </Link>
            </div>
          </div>

          {notifOpen && (
            <div className={styles.notifPanel}>
              <div className={styles.drawerHead}>
                <span className={styles.drawerTitle}>Notifications</span>
                <button type="button" onClick={() => setNotifOpen(false)} className={styles.dismissBtn} style={{ fontSize: 12 }}>Close</button>
              </div>
              {NOTIFICATIONS.map((n) => (
                <div key={n.title} className={styles.notifItem}>
                  <span className={styles.notifDot} style={{ background: `var(--d-${n.tone === "accent" ? "accent" : n.tone})` }} />
                  <span style={{ fontSize: 13, lineHeight: 1.45 }}>
                    <strong style={{ display: "block", fontWeight: 600, color: "var(--d-ink)" }}>{n.title}</strong>
                    <span style={{ color: "var(--d-ink-3)" }}>{n.meta}</span>
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className={styles.titleRow}>
            <h1>{viewTitle}</h1>
            <span className={styles.titleNote}>{viewNote}</span>
          </div>
        </header>

        <main className={styles.content}>{children}</main>
      </div>

      {helpOpen && (
        <div className={styles.overlay} onClick={() => setHelpOpen(false)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHead}>
              <span className={styles.drawerTitle}>Apps &amp; resources</span>
              <button type="button" onClick={() => setHelpOpen(false)} aria-label="Close" className={styles.closeBtn}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>
            {HELP_RESOURCES.map((r) => (
              <div key={r.name} className={styles.resourceItem}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 5 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--d-ink)" }}>{r.name}</span>
                  <span style={{ fontSize: 10, letterSpacing: "0.1em", color: "var(--d-ink-3)", border: "1px solid var(--d-line)", padding: "1px 6px", flex: "none" }}>{r.kind}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--d-ink-3)", lineHeight: 1.5 }}>{r.note}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

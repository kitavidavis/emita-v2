"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./SiteHeader.module.css";
import { HamburgerIcon, CloseIcon } from "@/components/icons";
import {
  platformMenu,
  productsMenu,
  solutionsMenu,
  customersMenu,
  resourcesMenu,
  companyMenu,
} from "@/lib/content/nav";

type MenuKey = "platform" | "products" | "solutions" | "customers" | "resources" | "company";

export function SiteHeader() {
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const d = document.documentElement;
      const max = d.scrollHeight - d.clientHeight || 1;
      const pct = Math.min(1, Math.max(0, d.scrollTop / max));
      if (barRef.current) barRef.current.style.width = (pct * 100).toFixed(2) + "%";
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const close = () => setOpenMenu(null);

  return (
    <>
      <div className={styles.announce}>
        <div className={styles.announceInner}>
          <div className={styles.announceLeft}>
            <span className={styles.newBadge}>
              <span className={styles.dot} />
              New
            </span>
            <span className={styles.announceText}>The State of Utility Intelligence in Africa — 2026 report is out.</span>
            <Link href="/resources" className={styles.announceLink}>Read it</Link>
          </div>
          <div className={styles.announceRight}>
            <span>Nairobi · Kampala · Lagos</span>
            <Link href="/demo">Talk to sales →</Link>
          </div>
        </div>
      </div>

      <header className={styles.header} onMouseLeave={close}>
        <div className={styles.progressTrack}>
          <div ref={barRef} className={styles.progressBar} style={{ width: 0 }} />
        </div>
        <div className={styles.navRow}>
          <Link href="/" className={styles.brand} onClick={close}>
            <Image src="/emita-logo.png" alt="Emita" width={26} height={26} priority />
            <span className={styles.brandText}>EMITA</span>
          </Link>

          <nav className={styles.nav}>
            <Link
              href="/platform"
              className={styles.navBtn}
              onMouseEnter={() => setOpenMenu("platform")}
              onClick={close}
            >
              Platform
            </Link>
            <button
              type="button"
              className={styles.navBtn}
              onMouseEnter={() => setOpenMenu("products")}
            >
              Products
            </button>
            <button
              type="button"
              className={styles.navBtn}
              onMouseEnter={() => setOpenMenu("solutions")}
            >
              Solutions
            </button>
            <button
              type="button"
              className={styles.navBtn}
              onMouseEnter={() => setOpenMenu("customers")}
            >
              Customers
            </button>
            <Link
              href="/resources"
              className={styles.navBtn}
              onMouseEnter={() => setOpenMenu("resources")}
              onClick={close}
            >
              Resources
            </Link>
            <button
              type="button"
              className={styles.navBtn}
              onMouseEnter={() => setOpenMenu("company")}
            >
              Company
            </button>
          </nav>

          <div className={styles.navRight}>
            <Link href="/login" className={`${styles.signInLink} desktopOnly`} onClick={close}>
              Sign In
            </Link>

            <Link href="/demo" className="btn btn-primary desktopOnly" style={{ padding: "11px 20px" }} onClick={close}>
              Request a Demo
            </Link>
            <button type="button" className={styles.mobileToggle} onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <HamburgerIcon />
            </button>
          </div>
        </div>

        {openMenu === "platform" && (
          <div className={styles.megaPanel}>
            <div className={styles.megaInner} style={{ gridTemplateColumns: "1.1fr 1fr 1fr 1fr" }}>
              <div className={styles.megaFeature}>
                <div className={styles.megaFeatureKicker}>{platformMenu.featured.kicker}</div>
                <div className={styles.megaFeatureTitle}>{platformMenu.featured.title}</div>
                <Link href={platformMenu.featured.href} className="btn btn-ghost" style={{ paddingLeft: 0 }} onClick={close}>
                  {platformMenu.featured.cta} →
                </Link>
              </div>
              <div className={styles.megaCol}>
                <div className={styles.megaKicker}>Core</div>
                {platformMenu.core.map((item) => (
                  <Link key={item.title} href={item.href} className={styles.megaLink} onClick={close}>{item.title}</Link>
                ))}
              </div>
              <div className={styles.megaCol}>
                <div className={styles.megaKicker}>Foundations</div>
                {platformMenu.foundations.map((item) => (
                  <Link key={item.title} href={item.href} className={styles.megaLink} onClick={close}>{item.title}</Link>
                ))}
              </div>
              <div className={styles.megaCol}>
                <div className={styles.megaKicker}>Start here</div>
                {platformMenu.startHere.map((item) => (
                  <Link key={item.title} href={item.href} className={styles.megaLink} onClick={close}>{item.title}</Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {openMenu === "products" && (
          <div className={styles.megaPanel}>
            <div className={styles.megaInner} style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
              {productsMenu.map((item) => (
                <Link key={item.title} href={item.href} className={styles.gridLink} style={{ padding: "16px 28px" }} onClick={close}>
                  <div className={styles.gridLinkTitle}>{item.title}</div>
                  <div className={styles.gridLinkBody}>{item.body}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {openMenu === "solutions" && (
          <div className={styles.megaPanel}>
            <div className={styles.megaInner} style={{ gridTemplateColumns: "repeat(5,1fr)" }}>
              {solutionsMenu.map((item) => (
                <Link key={item.title} href={item.href} className={styles.gridLink} style={{ padding: "0 28px" }} onClick={close}>
                  <div className={styles.gridLinkTitle}>{item.title}</div>
                  <div className={styles.gridLinkBody}>{item.body}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {openMenu === "customers" && (
          <div className={styles.megaPanel}>
            <div className={styles.megaInner} style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
              {customersMenu.map((item) => (
                <Link key={item.title} href={item.href} className={styles.gridLink} style={{ padding: "0 32px" }} onClick={close}>
                  <div className={styles.gridLinkTitle}>{item.title}</div>
                  <div className={styles.gridLinkBody}>{item.body}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {openMenu === "resources" && (
          <div className={styles.megaPanel}>
            <div className={styles.megaInner} style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
              {resourcesMenu.map((item) => (
                <Link key={item.title} href={item.href} className={styles.gridLinkTitleOnly} style={{ padding: "0 32px" }} onClick={close}>
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {openMenu === "company" && (
          <div className={styles.megaPanel}>
            <div className={styles.megaInner} style={{ gridTemplateColumns: "repeat(5,1fr)" }}>
              {companyMenu.map((item) => (
                <Link key={item.title} href={item.href} className={styles.gridLinkTitleOnly} style={{ padding: "0 28px" }} onClick={close}>
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {mobileOpen && (
        <div className={styles.mobileNav}>
          <div className={styles.mobileNavHead}>
            <Link href="/" className={styles.brand} onClick={() => setMobileOpen(false)}>
              <Image src="/emita-logo.png" alt="Emita" width={22} height={22} />
              <span className={styles.brandText} style={{ fontSize: 17 }}>EMITA</span>
            </Link>
            <button type="button" className={styles.mobileToggle} style={{ display: "flex" }} onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <CloseIcon />
            </button>
          </div>
          <MobileSection title="Platform" links={[platformMenu.featured, ...platformMenu.core, ...platformMenu.foundations]} onNavigate={() => setMobileOpen(false)} />
          <MobileSection title="Products" links={productsMenu} onNavigate={() => setMobileOpen(false)} />
          <MobileSection title="Solutions" links={solutionsMenu} onNavigate={() => setMobileOpen(false)} />
          <MobileSection title="Customers" links={customersMenu} onNavigate={() => setMobileOpen(false)} />
          <MobileSection title="Resources" links={resourcesMenu} onNavigate={() => setMobileOpen(false)} />
          <MobileSection title="Company" links={companyMenu} onNavigate={() => setMobileOpen(false)} />
          <div style={{ padding: "18px 2px", display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/signup" className="btn btn-secondary btn-block" onClick={() => setMobileOpen(false)}>Sign Up</Link>
            <Link href="/login" className="btn btn-secondary btn-block" onClick={() => setMobileOpen(false)}>Sign In</Link>
            <Link href="/demo" className="btn btn-primary btn-block" onClick={() => setMobileOpen(false)}>Request a Demo</Link>
          </div>
        </div>
      )}
    </>
  );
}

function MobileSection({
  title,
  links,
  onNavigate,
}: {
  title: string;
  links: { title: string; href: string }[];
  onNavigate: () => void;
}) {
  return (
    <div className={styles.mobileSection}>
      <div className={styles.mobileSectionTitle}>{title}</div>
      {links.map((item) => (
        <Link key={item.title + item.href} href={item.href} className={styles.mobileLink} onClick={onNavigate}>
          {item.title}
        </Link>
      ))}
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./SiteHeader.module.css";
import { HamburgerIcon, CloseIcon, ChevronDownIcon, SearchIcon } from "@/components/icons";
import {
  platformMenu,
  productsMenu,
  solutionsMenu,
  customersMenu,
  resourcesMenu,
  companyMenu,
  type MegaMenu,
} from "@/lib/content/nav";

type MenuKey = "platform" | "products" | "solutions" | "customers" | "resources" | "company";

const SECTION_PATHS: Record<MenuKey, string[]> = {
  platform: ["/platform"],
  products: ["/products"],
  solutions: ["/solutions"],
  customers: ["/customers"],
  resources: ["/resources"],
  company: ["/about", "/leadership", "/careers", "/partners"],
};

function isSectionActive(pathname: string, key: MenuKey): boolean {
  return SECTION_PATHS[key].some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function SiteHeader() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const close = () => setOpenMenu(null);

  return (
    <>
      <header className={styles.header} onMouseLeave={close}>
        <div className={styles.navRow}>
          <Link href="/" className={styles.brand} onClick={close}>
            <Image src="/emita-logo.png" alt="Emita" width={26} height={26} priority />
            <span className={styles.brandText}>EMITA</span>
          </Link>

          <nav className={styles.nav}>
            <Link
              href="/platform"
              className={`${styles.navBtn} ${isSectionActive(pathname, "platform") ? styles.navBtnActive : ""}`}
              onMouseEnter={() => setOpenMenu("platform")}
              onClick={close}
            >
              Platform
              <ChevronDownIcon size={9} className={`${styles.navChevron} ${openMenu === "platform" ? styles.navChevronOpen : ""}`} />
            </Link>
            <button
              type="button"
              className={`${styles.navBtn} ${isSectionActive(pathname, "products") ? styles.navBtnActive : ""}`}
              onMouseEnter={() => setOpenMenu("products")}
            >
              Products
              <ChevronDownIcon size={9} className={`${styles.navChevron} ${openMenu === "products" ? styles.navChevronOpen : ""}`} />
            </button>
            <button
              type="button"
              className={`${styles.navBtn} ${isSectionActive(pathname, "solutions") ? styles.navBtnActive : ""}`}
              onMouseEnter={() => setOpenMenu("solutions")}
            >
              Solutions
              <ChevronDownIcon size={9} className={`${styles.navChevron} ${openMenu === "solutions" ? styles.navChevronOpen : ""}`} />
            </button>
            <button
              type="button"
              className={`${styles.navBtn} ${isSectionActive(pathname, "customers") ? styles.navBtnActive : ""}`}
              onMouseEnter={() => setOpenMenu("customers")}
            >
              Customers
              <ChevronDownIcon size={9} className={`${styles.navChevron} ${openMenu === "customers" ? styles.navChevronOpen : ""}`} />
            </button>
            <Link
              href="/resources"
              className={`${styles.navBtn} ${isSectionActive(pathname, "resources") ? styles.navBtnActive : ""}`}
              onMouseEnter={() => setOpenMenu("resources")}
              onClick={close}
            >
              Resources
              <ChevronDownIcon size={9} className={`${styles.navChevron} ${openMenu === "resources" ? styles.navChevronOpen : ""}`} />
            </Link>
            <button
              type="button"
              className={`${styles.navBtn} ${isSectionActive(pathname, "company") ? styles.navBtnActive : ""}`}
              onMouseEnter={() => setOpenMenu("company")}
            >
              Company
              <ChevronDownIcon size={9} className={`${styles.navChevron} ${openMenu === "company" ? styles.navChevronOpen : ""}`} />
            </button>
          </nav>

          <div className={styles.navRight}>
            <Link href="/login" className={`${styles.signInLink} desktopOnly`} onClick={close}>
              Sign In
            </Link>

            <button type="button" className={`${styles.searchToggle} desktopOnly`} aria-label="Search">
              <SearchIcon size={15} />
            </button>

            <Link href="/demo" className="btn btn-primary desktopOnly" style={{ padding: "11px 20px" }} onClick={close}>
              Try it free
            </Link>
            <button type="button" className={styles.mobileToggle} onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <HamburgerIcon />
            </button>
          </div>
        </div>

        {openMenu === "platform" && <MegaPanel menu={platformMenu} onNavigate={close} />}
        {openMenu === "products" && <MegaPanel menu={productsMenu} onNavigate={close} />}
        {openMenu === "solutions" && <MegaPanel menu={solutionsMenu} onNavigate={close} />}
        {openMenu === "customers" && <MegaPanel menu={customersMenu} onNavigate={close} />}
        {openMenu === "resources" && <MegaPanel menu={resourcesMenu} onNavigate={close} />}
        {openMenu === "company" && <MegaPanel menu={companyMenu} onNavigate={close} />}
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
          <MobileSection title="Platform" menu={platformMenu} onNavigate={() => setMobileOpen(false)} />
          <MobileSection title="Products" menu={productsMenu} onNavigate={() => setMobileOpen(false)} />
          <MobileSection title="Solutions" menu={solutionsMenu} onNavigate={() => setMobileOpen(false)} />
          <MobileSection title="Customers" menu={customersMenu} onNavigate={() => setMobileOpen(false)} />
          <MobileSection title="Resources" menu={resourcesMenu} onNavigate={() => setMobileOpen(false)} />
          <MobileSection title="Company" menu={companyMenu} onNavigate={() => setMobileOpen(false)} />
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
  menu,
  onNavigate,
}: {
  title: string;
  menu: MegaMenu;
  onNavigate: () => void;
}) {
  const links = menu.sections.flatMap((section) => section.links);
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

function MegaPanel({ menu, onNavigate }: { menu: MegaMenu; onNavigate: () => void }) {
  const { intro, sections } = menu;
  return (
    <div className={styles.megaPanel}>
      <div className={styles.megaInner}>
        <div className={styles.megaSidebar}>
          <div>
            <div className={styles.megaSidebarKicker}>{intro.kicker}</div>
            <div className={styles.megaSidebarTitle}>{intro.title}</div>
            <p className={styles.megaSidebarBody}>{intro.body}</p>
            <Link href={intro.ctaHref} className={`btn btn-secondary ${styles.megaSidebarCta}`} onClick={onNavigate}>
              {intro.ctaLabel}
            </Link>
          </div>
          <div className={styles.megaSidebarLinks}>
            {intro.links.map((link) => (
              <Link key={link.label} href={link.href} className={styles.megaArrowLink} onClick={onNavigate}>
                {link.label} →
              </Link>
            ))}
          </div>
        </div>
        <div className={styles.megaContent}>
          {sections.map((section) => (
            <div key={section.kicker} className={styles.megaSection}>
              <div className={styles.megaSectionKicker}>{section.kicker}</div>
              <div className={styles.megaSectionGrid}>
                {section.links.map((item) => (
                  <Link key={item.title} href={item.href} className={styles.megaBoldLink} onClick={onNavigate}>
                    <div className={styles.megaBoldLinkTitle}>{item.title}</div>
                    {item.body && <div className={styles.megaBoldLinkBody}>{item.body}</div>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

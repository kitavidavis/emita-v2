import Link from "next/link";
import Image from "next/image";
import styles from "./SiteFooter.module.css";
import { LinkedInIcon, XIcon } from "@/components/icons";
import { footerLinks } from "@/lib/content/nav";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div>
          <div className={styles.brandCol}>
            <Image src="/emita-logo.png" alt="Emita" width={20} height={20} />
            <span className={styles.brandText}>EMITA</span>
          </div>
          <p className={styles.blurb}>
            Emita connects the physical world of utility infrastructure to the digital intelligence needed to operate it.
          </p>
        </div>
        <FooterCol title="Platform" links={footerLinks.platform} />
        <FooterCol title="Products" links={footerLinks.products} />
        <FooterCol title="Customers" links={footerLinks.customers} />
        <FooterCol title="Company" links={footerLinks.company} />
      </div>
      <div className={styles.legalWrap}>
        <div className={styles.legal}>
          <span>© 2026 Emita. Concept mockup — not a live site.</span>
          <div className={styles.legalLinks}>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/security">Security</Link>
            <span className={styles.legalDivider} />
            <a href="#" aria-label="LinkedIn" className={styles.socialLink}><LinkedInIcon /></a>
            <a href="#" aria-label="X" className={styles.socialLink}><XIcon /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { title: string; href: string }[] }) {
  return (
    <div>
      <div className={styles.colTitle}>{title}</div>
      {links.map((item) => (
        <Link key={item.title} href={item.href} className={styles.colLink}>{item.title}</Link>
      ))}
    </div>
  );
}

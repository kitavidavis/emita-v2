import { Bricolage_Grotesque } from "next/font/google";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { NewsletterBar } from "@/components/NewsletterBar";
import { BackToTop } from "@/components/BackToTop";
import { CookieConsent } from "@/components/CookieConsent";
import styles from "./marketing.module.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${bricolage.variable} ${styles.marketingType}`}>
      <SiteHeader />
      {children}
      <NewsletterBar />
      <SiteFooter />
      <BackToTop />
      <CookieConsent />
    </div>
  );
}

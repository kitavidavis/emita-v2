import { SiteHeader } from "@/components/site-header/SiteHeader";
import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { NewsletterBar } from "@/components/NewsletterBar";
import { BackToTop } from "@/components/BackToTop";
import { CookieConsent } from "@/components/CookieConsent";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <NewsletterBar />
      <SiteFooter />
      <BackToTop />
      <CookieConsent />
    </>
  );
}

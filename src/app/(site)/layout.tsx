import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { PageViewTracker } from "@/components/layout/page-view-tracker";
import { DemoBanner } from "@/components/layout/demo-banner";
import { JsonLd } from "@/components/layout/json-ld";
import { getEstablishments, getSettings, isDemoMode } from "@/lib/content";
import { restaurantJsonLd } from "@/lib/seo";

export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, establishments] = await Promise.all([getSettings(), getEstablishments()]);
  return (
    <>
      <JsonLd data={restaurantJsonLd(settings, establishments)} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} establishments={establishments} />
      <WhatsAppButton number={settings.whatsappNumber} />
      <PageViewTracker />
      {isDemoMode() && <DemoBanner />}
    </>
  );
}

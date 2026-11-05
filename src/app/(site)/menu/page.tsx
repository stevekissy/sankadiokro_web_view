import Link from "next/link";
import { Smartphone } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";
import { MenuView } from "./menu-view";
import { getMenu, getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/layout/json-ld";
import { env } from "@/lib/env";
import { StoreButtons } from "@/components/ui/store-buttons";

export const metadata = pageMetadata(
  "Notre menu — grillades, kédjénou, soupes et accompagnements",
  "La carte du Restaurant Sankadiokro à Abidjan : poulet braisé, pintade, carpe, capitaine, mâchoiron, lapin, kédjénou, soupes traditionnelles, attiéké, alloco, foutou. Commandez dans l'application.",
  "/menu",
);

export default async function MenuPage() {
  const [{ categories, dishes }, settings] = await Promise.all([getMenu(), getSettings()]);
  const menuJsonLd = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "Menu Restaurant Sankadiokro",
    url: `${env.siteUrl}/menu`,
    hasMenuSection: categories.map((c) => ({
      "@type": "MenuSection",
      name: c.name,
      hasMenuItem: dishes
        .filter((d) => d.categoryId === c.id)
        .map((d) => ({
          "@type": "MenuItem",
          name: d.name,
          ...(d.description ? { description: d.description } : {}),
          ...(d.priceFcfa ? { offers: { "@type": "Offer", price: d.priceFcfa, priceCurrency: "XOF" } } : {}),
        })),
    })),
  };
  return (
    <>
      <JsonLd data={menuJsonLd} />
      <PageHero eyebrow="Notre menu" title="Une carte 100 % ivoirienne" description="Grillades au feu de bois, soupes mijotées, kédjénou et accompagnements faits maison. Les prix affichés sont ceux renseignés par le restaurant ; les prix à jour sont disponibles dans l'application." />
      <div className="bg-cream pb-16">
        <Container>
          <MenuView categories={categories} dishes={dishes} />
          <div className="mt-8 overflow-hidden rounded-[2rem] bg-forest p-8 text-white md:flex md:items-center md:justify-between md:p-10">
            <div>
              <h2 className="font-display text-2xl font-semibold md:text-3xl">Commander dans l&apos;application</h2>
              <p className="mt-2 max-w-xl text-white/80">Retrouvez les prix à jour, commandez en quelques secondes et cumulez des points de fidélité à chaque commande.</p>
              <StoreButtons appStoreUrl={settings.appStoreUrl} playStoreUrl={settings.playStoreUrl} className="mt-5" />
            </div>
            <Link href="/application" className={buttonClasses("gold", "lg", "mt-6 md:mt-0")}>
              <Smartphone className="h-5 w-5" aria-hidden /> Commander dans l&apos;application
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
}

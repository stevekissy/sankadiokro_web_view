import { Gift, ShoppingBag, Truck, History, Coins, UtensilsCrossed } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem, Reveal } from "@/components/ui/reveal";
import { PhoneMockup } from "@/components/ui/phone-mockup";
import { StoreButtons } from "@/components/ui/store-buttons";
import { AppPromo } from "@/components/sections/app-promo";
import { getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Application mobile Sankadiokro — commande, livraison et fidélité",
  "Téléchargez l'application Sankadiokro : consultez les plats et les prix, commandez depuis votre téléphone, demandez une livraison et cumulez des points de fidélité. Plus tu manges, plus tu économises.",
  "/application",
);

const FEATURES = [
  { icon: UtensilsCrossed, title: "Consulter les plats et les prix", text: "Toute la carte, à jour, avec les prix et les disponibilités du jour." },
  { icon: ShoppingBag, title: "Commander depuis son téléphone", text: "Choisissez vos plats, vos accompagnements et validez en quelques secondes." },
  { icon: Truck, title: "Demander une livraison", text: "Faites-vous livrer à domicile ou au bureau, à Abidjan." },
  { icon: Gift, title: "Programme de fidélité", text: "Plus tu manges, plus tu économises : des avantages réservés aux utilisateurs de l'application." },
  { icon: Coins, title: "Cumuler des points", text: "Chaque commande vous rapporte des points à transformer en réductions." },
  { icon: History, title: "Retrouver ses commandes", text: "Votre historique et vos plats favoris, toujours à portée de main." },
];

export default async function AppPage() {
  const settings = await getSettings();
  const shots = settings.appScreenshots;
  return (
    <>
      <PageHero eyebrow="Application mobile" title="Sankadiokro dans votre poche" description={`« ${settings.sloganLoyalty} » — Commandez, faites-vous livrer et cumulez des points de fidélité.`} />

      <Section className="bg-cream">
        <Container>
          <Reveal className="flex flex-col items-center gap-8 text-center">
            <StoreButtons appStoreUrl={settings.appStoreUrl} playStoreUrl={settings.playStoreUrl} className="items-center" />
          </Reveal>
          <div className="mt-12 flex flex-wrap items-end justify-center gap-6">
            {(shots.length ? shots : [null, null, null]).slice(0, 3).map((s, i) => (
              <PhoneMockup key={s?.id ?? i} src={s?.imageUrl} alt={s?.caption ?? `Écran ${i + 1} de l'application Sankadiokro`} caption={s?.caption} className={i === 1 ? "" : "sm:translate-y-6"} />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <SectionHeading eyebrow="Fonctionnalités" title="Tout ce que vous pouvez faire avec l'application" />
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <StaggerItem key={f.title}>
                <div className="h-full rounded-3xl bg-cream p-6 transition hover:shadow-card">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-forest text-gold">
                    <f.icon className="h-6 w-6" aria-hidden />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold text-forest">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <AppPromo settings={settings} full />
    </>
  );
}

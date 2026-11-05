import Link from "next/link";
import { Check } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { PhoneMockup } from "@/components/ui/phone-mockup";
import { StoreButtons } from "@/components/ui/store-buttons";
import { buttonClasses } from "@/components/ui/button";
import type { SiteSettings } from "@/lib/types";

export const APP_FEATURES = [
  "Consulter les plats et les prix",
  "Commander directement depuis son téléphone",
  "Demander une livraison à domicile",
  "Profiter du programme de fidélité",
  "Cumuler des points grâce aux commandes",
  "Retrouver ses commandes",
];

export function AppPromo({ settings, full }: { settings: SiteSettings; full?: boolean }) {
  const shots = settings.appScreenshots;
  return (
    <Section id="application" className="relative overflow-hidden bg-cream-dark">
      <div className="absolute inset-0 pattern-dots" aria-hidden />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">L&apos;application Sankadiokro</span>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-forest text-balance md:text-4xl lg:text-5xl">
              Commandez, cumulez, économisez.
            </h2>
            <p className="mt-3 font-display text-xl italic text-gold-dark">« {settings.sloganLoyalty} »</p>
            <p className="mt-5 text-base leading-relaxed text-ink-soft md:text-lg">
              Toute la carte dans votre poche : commandez vos plats préférés, faites-vous livrer et gagnez des points de fidélité à chaque commande.
            </p>
            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {APP_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm font-medium">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest text-white">
                    <Check className="h-3 w-3" aria-hidden />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <StoreButtons appStoreUrl={settings.appStoreUrl} playStoreUrl={settings.playStoreUrl} className="mt-8" />
            {!full && (
              <Link href="/application" className={buttonClasses("ghost", "sm", "mt-4")}>
                En savoir plus sur l&apos;application →
              </Link>
            )}
          </Reveal>

          <Reveal delay={0.15} className="relative flex justify-center">
            <div className="absolute inset-x-10 top-10 -z-0 h-72 rounded-full bg-gold/30 blur-3xl" aria-hidden />
            <div className="relative flex items-end gap-4">
              <PhoneMockup src={shots[1]?.imageUrl} alt={shots[1]?.caption ?? "Écran de l'application Sankadiokro"} className="hidden sm:block sm:w-[200px] translate-y-8 opacity-90" />
              <PhoneMockup src={shots[0]?.imageUrl} alt={shots[0]?.caption ?? "Écran d'accueil de l'application Sankadiokro"} />
              <PhoneMockup src={shots[2]?.imageUrl} alt={shots[2]?.caption ?? "Écran de commande de l'application Sankadiokro"} className="hidden md:block sm:w-[200px] translate-y-8 opacity-90" />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

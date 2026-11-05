import Image from "next/image";
import Link from "next/link";
import { Heart, Leaf, Users, Award } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { DemoImage } from "@/components/ui/demo-image";
import { buttonClasses } from "@/components/ui/button";
import { Advantages } from "@/components/sections/advantages";
import { CtaBanner } from "@/components/sections/cta-banner";
import { getGallery, getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Notre restaurant",
  "Découvrez l'histoire et les valeurs de Restaurant Sankadiokro, spécialiste de la cuisine ivoirienne à Abidjan : produits frais, recettes authentiques et accueil chaleureux.",
  "/notre-restaurant",
);

const VALUES = [
  { icon: Heart, title: "Convivialité", text: "Un accueil chaleureux, des tablées généreuses et une ambiance qui donne envie de revenir." },
  { icon: Leaf, title: "Fraîcheur", text: "Poissons, volailles et légumes sélectionnés chaque jour auprès de nos fournisseurs." },
  { icon: Award, title: "Authenticité", text: "Des recettes ivoiriennes respectées, sans raccourci, cuisinées comme à la maison." },
  { icon: Users, title: "Partage", text: "Des plats pensés pour être partagés, en famille, entre amis ou entre collègues." },
];

export default async function AboutPage() {
  const [settings, gallery] = await Promise.all([getSettings(), getGallery()]);
  const ambiance = gallery.filter((g) => g.category === "ambiance" || g.category === "equipe").slice(0, 4);
  return (
    <>
      <PageHero eyebrow="Notre restaurant" title="L'histoire d'une passion pour la cuisine ivoirienne" description={settings.sloganMain} />

      <Section className="bg-cream">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">Qui sommes-nous</span>
              <h2 className="mt-3 font-display text-3xl font-semibold text-forest md:text-4xl">Le goût authentique de chez nous</h2>
              <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-ink-soft md:text-lg">{settings.aboutText}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/menu" className={buttonClasses("primary")}>
                  Découvrir notre menu
                </Link>
                <Link href="/etablissements" className={buttonClasses("outline")}>
                  Nos établissements
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="relative">
              <div className="grid grid-cols-2 gap-4">
                <DemoImage src={ambiance[0]?.imageUrl} alt="Ambiance du restaurant Sankadiokro" className="aspect-[3/4] rounded-3xl" label="Ambiance" />
                <DemoImage src={ambiance[1]?.imageUrl} alt="Nos cuisines" className="mt-8 aspect-[3/4] rounded-3xl" label="Cuisines" tone="gold" />
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-2xl bg-white p-3 shadow-soft">
                <Image src="/images/logo-sankadiokro.png" alt="" width={72} height={72} className="rounded-xl" />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <SectionHeading eyebrow="Nos valeurs" title="Ce qui nous guide chaque jour" />
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <StaggerItem key={v.title}>
                <div className="h-full rounded-3xl bg-cream p-6 text-center">
                  <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-forest text-gold">
                    <v.icon className="h-7 w-7" aria-hidden />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold text-forest">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{v.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <Advantages />
      <CtaBanner />
    </>
  );
}

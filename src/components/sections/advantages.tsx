import { Flame, Gift, Truck, Users, ShieldCheck, Clock } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/ui/reveal";

const ITEMS = [
  { icon: Flame, title: "Grillades au feu de bois", text: "Poulet, pintade, capitaine, carpe, mâchoiron ou lapin : marinés et braisés devant vous, à la demande." },
  { icon: Users, title: "Deux adresses à Abidjan", text: "Yopougon Millionnaire et Cocody Saint-Jean : la même qualité, près de chez vous." },
  { icon: Gift, title: "Programme de fidélité", text: "Plus tu manges, plus tu économises : cumulez des points à chaque commande dans l'application." },
  { icon: Truck, title: "Commande et livraison", text: "Commandez depuis votre téléphone et faites-vous livrer à domicile ou au bureau." },
  { icon: Clock, title: "Salles pour vos événements", text: "Anniversaires, réunions, cérémonies : des espaces privatisables avec service traiteur." },
  { icon: ShieldCheck, title: "Produits frais, recettes authentiques", text: "Des ingrédients sélectionnés chaque jour et des recettes transmises de génération en génération." },
];

export function Advantages() {
  return (
    <Section className="relative overflow-hidden bg-forest text-white">
      <div className="absolute inset-0 pattern-kente opacity-30" aria-hidden />
      <Container className="relative">
        <SectionHeading light eyebrow="Pourquoi Sankadiokro" title="Bien plus qu'un restaurant" description="Une expérience complète : la cuisine, l'accueil, l'application et des espaces pour célébrer vos moments importants." />
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((it) => (
            <StaggerItem key={it.title}>
              <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-gold/50 hover:bg-white/10">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gold text-ink">
                  <it.icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">{it.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{it.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

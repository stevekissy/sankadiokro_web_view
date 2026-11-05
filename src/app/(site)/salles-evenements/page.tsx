import { Suspense } from "react";
import { Cake, Briefcase, Utensils, Heart, PartyPopper, Sparkles, ShieldAlert } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { RoomCard } from "@/components/sections/room-card";
import { ReservationForm } from "@/components/forms/reservation-form";
import { getEstablishments, getRooms } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Nos salles et événements — location de salle à Abidjan",
  "Louez une salle chez Sankadiokro à Yopougon Millionnaire ou Cocody Saint-Jean pour vos anniversaires, réunions professionnelles, repas d'entreprise, cérémonies familiales et réceptions privées. Demande de réservation en ligne.",
  "/salles-evenements",
);

const EVENTS = [
  { icon: Cake, title: "Anniversaires", text: "Une salle décorée, un menu de fête et une équipe aux petits soins." },
  { icon: Briefcase, title: "Réunions professionnelles", text: "Un espace calme et équipé pour vos réunions et séminaires." },
  { icon: Utensils, title: "Repas d'entreprise", text: "Fédérez vos équipes autour d'un repas ivoirien convivial." },
  { icon: Heart, title: "Cérémonies familiales", text: "Baptêmes, fiançailles, retrouvailles : célébrez en famille." },
  { icon: PartyPopper, title: "Réceptions privées", text: "Un cadre privatisé pour vos grandes occasions." },
  { icon: Sparkles, title: "Autres événements", text: "Lancements, after-works, tournages : parlons de votre projet." },
];

export default async function RoomsPage() {
  const [rooms, establishments] = await Promise.all([getRooms(), getEstablishments()]);
  return (
    <>
      <PageHero eyebrow="Location de salles" title="Nos salles et événements" description="Des espaces chaleureux, privatisables, avec le service traiteur Sankadiokro, pour tous vos moments importants." />

      <Section className="bg-cream">
        <Container>
          <SectionHeading eyebrow="Vos événements" title="Célébrez chez Sankadiokro" />
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {EVENTS.map((e) => (
              <StaggerItem key={e.title}>
                <div className="flex h-full gap-4 rounded-3xl bg-white p-5 shadow-card">
                  <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold/15 text-gold-dark">
                    <e.icon className="h-6 w-6" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-forest">{e.title}</h3>
                    <p className="mt-1 text-sm text-ink-soft">{e.text}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <Section className="bg-white" id="salles">
        <Container>
          <SectionHeading eyebrow="Nos salles" title="Galerie des salles" description="Capacité, équipements, conditions et tarifs sont indiqués lorsqu'ils sont renseignés par le restaurant." />
          <Stagger className="grid gap-8 md:grid-cols-2">
            {rooms.map((r) => (
              <StaggerItem key={r.id}>
                <RoomCard room={r} establishmentName={establishments.find((e) => e.id === r.establishmentId)?.district} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <Section className="bg-cream" id="reservation">
        <Container className="max-w-4xl">
          <SectionHeading eyebrow="Demande de réservation" title="Réservez votre salle" description="Remplissez ce formulaire : vous recevrez un numéro de référence et notre équipe vous recontactera pour confirmer." />
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <p>Une demande ne constitue pas une réservation définitive avant validation par le restaurant. Vous serez informé(e) par e-mail ou téléphone.</p>
          </div>
          <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-white" />}>
            <ReservationForm rooms={rooms} establishments={establishments} />
          </Suspense>
        </Container>
      </Section>
    </>
  );
}

import { PageHero } from "@/components/ui/page-hero";
import { Container, Section } from "@/components/ui/container";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { EstablishmentCard } from "@/components/sections/establishment-card";
import { CtaBanner } from "@/components/sections/cta-banner";
import { getEstablishments } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Nos établissements — Yopougon Millionnaire et Cocody Saint-Jean",
  "Retrouvez Restaurant Sankadiokro à Yopougon Millionnaire et à Cocody Saint-Jean, Abidjan : adresses, horaires, téléphone et itinéraires.",
  "/etablissements",
);

export default async function EstablishmentsPage() {
  const establishments = await getEstablishments();
  return (
    <>
      <PageHero eyebrow="Nos établissements" title="Deux adresses à Abidjan" description="Le même goût authentique, à Yopougon Millionnaire et à Cocody Saint-Jean." />
      <Section className="bg-cream">
        <Container>
          <Stagger className="grid gap-8 md:grid-cols-2">
            {establishments.map((e) => (
              <StaggerItem key={e.id}>
                <EstablishmentCard e={e} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>
      <CtaBanner />
    </>
  );
}

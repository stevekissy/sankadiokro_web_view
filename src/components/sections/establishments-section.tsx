import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { EstablishmentCard } from "./establishment-card";
import type { Establishment } from "@/lib/types";

export function EstablishmentsSection({ establishments }: { establishments: Establishment[] }) {
  return (
    <Section id="etablissements" className="bg-white">
      <Container>
        <SectionHeading eyebrow="Nos établissements" title="Deux adresses pour vous accueillir à Abidjan" description="Retrouvez Sankadiokro à Yopougon Millionnaire et à Cocody Saint-Jean." />
        <Stagger className="grid gap-6 md:grid-cols-2">
          {establishments.map((e) => (
            <StaggerItem key={e.id}>
              <EstablishmentCard e={e} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

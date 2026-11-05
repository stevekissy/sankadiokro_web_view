import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { buttonClasses } from "@/components/ui/button";
import { DishCard } from "./dish-card";
import type { Dish } from "@/lib/types";

export function Specialties({ dishes }: { dishes: Dish[] }) {
  return (
    <Section id="specialites" className="bg-cream">
      <Container>
        <SectionHeading eyebrow="Nos spécialités" title="Des plats préparés comme à la maison" description="Grillades au feu de bois, kédjénou mijoté et accompagnements frais : voici les incontournables qui font la réputation de Sankadiokro." />
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((d) => (
            <StaggerItem key={d.id}>
              <DishCard dish={d} compact />
            </StaggerItem>
          ))}
        </Stagger>
        <div className="mt-12 text-center">
          <Link href="/menu" className={buttonClasses("primary", "lg")}>
            Voir tout le menu
          </Link>
        </div>
      </Container>
    </Section>
  );
}

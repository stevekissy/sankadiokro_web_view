import { MessageSquareHeart } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { TestimonialCard } from "./testimonial-card";
import type { Testimonial } from "@/lib/types";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <Section className="bg-cream">
      <Container>
        <SectionHeading eyebrow="Avis clients" title="Ils ont goûté, ils en parlent" description="Des avis authentiques de nos clients, publiés avec leur accord." />
        {testimonials.length ? (
          <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 6).map((t) => (
              <StaggerItem key={t.id}>
                <TestimonialCard t={t} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-gold/60 bg-white p-8 text-center">
            <MessageSquareHeart className="mx-auto h-10 w-10 text-gold" aria-hidden />
            <p className="mt-3 font-display text-xl font-semibold text-forest">Les avis arrivent bientôt</p>
            <p className="mt-2 text-sm text-ink-soft">
              Nous publions uniquement de véritables avis de clients ayant donné leur accord. Aucun témoignage fictif n&apos;est affiché. Vous êtes venu chez nous ? Partagez votre expérience sur la page contact.
            </p>
          </div>
        )}
      </Container>
    </Section>
  );
}

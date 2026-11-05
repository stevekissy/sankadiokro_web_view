import Link from "next/link";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function CtaBanner() {
  return (
    <section className="bg-cream py-16 md:py-20">
      <Container>
        <Reveal className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-forest via-forest-light to-forest-dark px-6 py-14 text-center text-white shadow-soft md:px-16">
          <div className="absolute inset-0 pattern-kente opacity-30" aria-hidden />
          <div className="relative">
            <h2 className="font-display text-3xl font-semibold text-balance md:text-4xl">Un événement à célébrer ? Une envie de grillades ?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/80">Réservez l&apos;une de nos salles pour vos moments importants, ou commandez vos plats préférés en quelques secondes depuis l&apos;application.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/salles-evenements#reservation" className={buttonClasses("gold", "lg")}>
                Demander une réservation
              </Link>
              <Link href="/application" className={buttonClasses("white", "lg")}>
                Télécharger l&apos;application
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

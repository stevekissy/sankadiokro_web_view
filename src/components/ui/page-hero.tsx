import { Container } from "./container";
import { cn } from "@/lib/utils";

export function PageHero({ eyebrow, title, description, className }: { eyebrow?: string; title: string; description?: string; className?: string }) {
  return (
    <section className={cn("relative overflow-hidden bg-forest pb-16 pt-32 text-white md:pb-20 md:pt-40", className)}>
      <div className="absolute inset-0 pattern-kente opacity-30" aria-hidden />
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/20 blur-3xl" aria-hidden />
      <Container className="relative text-center">
        {eyebrow && <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-light">{eyebrow}</span>}
        <h1 className="mt-3 font-display text-4xl font-semibold text-balance md:text-5xl lg:text-6xl">{title}</h1>
        {description && <p className="mx-auto mt-5 max-w-2xl text-base text-white/80 md:text-lg">{description}</p>}
      </Container>
    </section>
  );
}

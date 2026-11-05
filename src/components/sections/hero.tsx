"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronDown, Smartphone, UtensilsCrossed, CalendarCheck } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import type { SiteSettings } from "@/lib/types";

export function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-forest-dark text-white lg:min-h-[min(100svh,960px)]">
      {/* Image immersive ou visuel de démonstration */}
      {settings.heroImageUrl ? (
        <Image src={settings.heroImageUrl} alt="Plat ivoirien signature du restaurant Sankadiokro" fill priority sizes="100vw" className="object-cover" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(213,165,71,0.35),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(31,98,71,0.9),transparent_60%)]">
          <div className="absolute inset-0 pattern-kente opacity-40" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-forest-dark via-forest-dark/70 to-forest-dark/30" />

      {/* Lueurs décoratives */}
      <motion.div
        aria-hidden
        className="absolute -right-24 top-24 h-80 w-80 rounded-full bg-gold/20 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8 lg:pt-36">
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-light backdrop-blur">
                Yopougon Millionnaire · Cocody Saint-Jean
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6 font-display text-4xl font-semibold leading-[1.1] text-balance sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              {settings.heroTitle}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg"
            >
              {settings.heroSubtitle}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-4 font-display text-lg italic text-gold-light"
            >
              « {settings.sloganMain} »
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <Link href="/menu" className={buttonClasses("gold", "lg")}>
                <UtensilsCrossed className="h-5 w-5" aria-hidden /> Découvrir notre menu
              </Link>
              <Link href="/application" className={buttonClasses("white", "lg")}>
                <Smartphone className="h-5 w-5" aria-hidden /> Télécharger l&apos;application
              </Link>
              <Link href="/salles-evenements#reservation" className={buttonClasses("outline", "lg", "border-white text-white hover:bg-white hover:text-forest")}>
                <CalendarCheck className="h-5 w-5" aria-hidden /> Réserver une salle
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden justify-center lg:flex"
          >
            <div className="animate-float relative">
              <div className="absolute inset-0 -z-10 scale-110 rounded-[3rem] bg-gold/30 blur-3xl" />
              <Image src="/images/logo-sankadiokro.png" alt="Logo officiel Restaurant Sankadiokro" width={340} height={340} priority className="rounded-[3rem] shadow-2xl shadow-black/40 ring-4 ring-white/20" />
            </div>
          </motion.div>
        </div>
      </div>

      <a href="#specialites" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 transition hover:text-gold" aria-label="Faire défiler vers les spécialités">
        <ChevronDown className="h-8 w-8 animate-bounce" />
      </a>
    </section>
  );
}

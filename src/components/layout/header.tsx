"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { buttonClasses } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/nav";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const solid = scrolled || !isHome || open;

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", solid ? "bg-white/90 shadow-card backdrop-blur-md" : "bg-transparent")}>
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Restaurant Sankadiokro — Accueil">
          <Image src="/images/logo-sankadiokro.png" alt="Logo Restaurant Sankadiokro" width={44} height={44} className="h-11 w-11 rounded-xl shadow-sm" priority />
          <span className={cn("font-display text-lg font-semibold leading-tight sm:text-xl", solid ? "text-forest" : "text-white")}>
            Sankadiokro
            <span className={cn("block font-sans text-[10px] font-medium uppercase tracking-[0.2em]", solid ? "text-gold-dark" : "text-gold-light")}>Restaurant</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {NAV_LINKS.slice(1).map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition",
                  solid ? "text-ink hover:bg-forest/10 hover:text-forest" : "text-white/90 hover:bg-white/15 hover:text-white",
                  active && (solid ? "bg-forest/10 text-forest" : "bg-white/20 text-white"),
                )}
              >
                {l.label}
              </Link>
            );
          })}
          <Link href="/salles-evenements#reservation" className={buttonClasses("gold", "sm", "ml-3")}>
            Réserver une salle
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn("inline-flex h-11 w-11 items-center justify-center rounded-full lg:hidden", solid ? "text-forest hover:bg-forest/10" : "text-white hover:bg-white/15")}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-ink/5 bg-white lg:hidden"
            aria-label="Navigation mobile"
          >
            <ul className="flex flex-col px-4 py-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={cn("block rounded-xl px-4 py-3 text-base font-medium text-ink hover:bg-forest/5", pathname === l.href && "bg-forest/10 text-forest")}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 flex flex-col gap-2 px-2 pb-2">
                <Link href="/salles-evenements#reservation" className={buttonClasses("gold", "md")}>
                  Réserver une salle
                </Link>
                <Link href="/application" className={buttonClasses("outline", "md")}>
                  Télécharger l&apos;application
                </Link>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

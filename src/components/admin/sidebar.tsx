"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, CalendarCheck, Mail, UtensilsCrossed, DoorOpen, MapPin, Images, Star, Megaphone, Settings, Users, ScrollText, LogOut, Menu, X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Profile } from "@/lib/types";
import { logoutAction } from "@/app/actions/admin";

const LINKS = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/reservations", label: "Réservations", icon: CalendarCheck },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/menu", label: "Menu & plats", icon: UtensilsCrossed },
  { href: "/admin/salles", label: "Salles", icon: DoorOpen },
  { href: "/admin/etablissements", label: "Établissements", icon: MapPin },
  { href: "/admin/galerie", label: "Galerie", icon: Images },
  { href: "/admin/avis", label: "Avis clients", icon: Star },
  { href: "/admin/actualites", label: "Promos & actualités", icon: Megaphone },
  { href: "/admin/parametres", label: "Paramètres du site", icon: Settings },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users, admin: true },
  { href: "/admin/journal", label: "Journal des actions", icon: ScrollText, admin: true },
];

export function AdminSidebar({ profile, badges }: { profile: Profile; badges: Record<string, number> }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = LINKS.filter((l) => !l.admin || profile.role === "admin");

  const nav = (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Administration">
      {links.map((l) => {
        const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        const badge = badges[l.href];
        return (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition", active ? "bg-gold text-ink" : "text-white/80 hover:bg-white/10 hover:text-white")}>
            <l.icon className="h-4.5 w-4.5 shrink-0" aria-hidden />
            <span className="flex-1">{l.label}</span>
            {badge ? <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-bold", active ? "bg-ink text-white" : "bg-gold text-ink")}>{badge}</span> : null}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <div className="flex items-center justify-between bg-forest px-4 py-3 text-white lg:hidden">
        <Link href="/admin" className="flex items-center gap-2 font-display text-lg font-semibold">
          <Image src="/images/logo-sankadiokro.png" alt="" width={32} height={32} className="rounded-lg" /> Administration
        </Link>
        <button type="button" onClick={() => setOpen((v) => !v)} className="rounded-lg p-2 hover:bg-white/10" aria-label="Menu d'administration" aria-expanded={open}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-forest p-4 text-white transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0", open ? "translate-x-0 pt-16" : "-translate-x-full")}>
        <Link href="/admin" className="mb-6 hidden items-center gap-3 px-2 lg:flex">
          <Image src="/images/logo-sankadiokro.png" alt="" width={40} height={40} className="rounded-xl" />
          <span>
            <span className="block font-display text-lg font-semibold leading-tight">Sankadiokro</span>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-gold-light">Administration</span>
          </span>
        </Link>
        {nav}
        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="truncate px-2 text-sm font-semibold">{profile.fullName || profile.email}</p>
          <p className="px-2 text-xs text-white/60">{profile.role === "admin" ? "Administrateur" : "Gestionnaire"} · {profile.email}</p>
          <div className="mt-3 flex gap-2 px-2">
            <Link href="/" target="_blank" className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium hover:bg-white/20">
              <ExternalLink className="h-3.5 w-3.5" /> Voir le site
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium hover:bg-red-500/80">
                <LogOut className="h-3.5 w-3.5" /> Quitter
              </button>
            </form>
          </div>
        </div>
      </aside>
      {open && <button type="button" className="fixed inset-0 z-30 bg-black/40 lg:hidden" aria-label="Fermer le menu" onClick={() => setOpen(false)} />}
    </>
  );
}

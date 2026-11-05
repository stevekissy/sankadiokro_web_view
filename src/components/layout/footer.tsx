import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/ui/social-icons";
import { Container } from "@/components/ui/container";
import { NAV_LINKS } from "@/lib/nav";
import type { Establishment, SiteSettings } from "@/lib/types";

export function Footer({ settings, establishments }: { settings: SiteSettings; establishments: Establishment[] }) {
  return (
    <footer className="relative mt-auto bg-forest text-white">
      <div className="h-1.5 w-full bg-gradient-to-r from-gold-dark via-gold to-gold-light" />
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <Image src="/images/logo-sankadiokro.png" alt="Logo Restaurant Sankadiokro" width={56} height={56} className="rounded-2xl" />
              <div>
                <p className="font-display text-xl font-semibold">Restaurant Sankadiokro</p>
                <p className="text-xs uppercase tracking-[0.2em] text-gold-light">Abidjan, Côte d&apos;Ivoire</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-white/75">{settings.sloganMain}</p>
            <p className="mt-2 text-sm font-semibold text-gold">{settings.sloganLoyalty}</p>
            <div className="mt-5 flex gap-3">
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="rounded-full bg-white/10 p-2.5 hover:bg-gold hover:text-ink">
                  <FacebookIcon className="h-5 w-5" />
                </a>
              )}
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="rounded-full bg-white/10 p-2.5 hover:bg-gold hover:text-ink">
                  <InstagramIcon className="h-5 w-5" />
                </a>
              )}
              {settings.tiktokUrl && (
                <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="rounded-full bg-white/10 p-2.5 hover:bg-gold hover:text-ink">
                  <TikTokIcon className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-gold-light">Navigation</h3>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/80 transition hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-gold-light">Nos établissements</h3>
            <ul className="mt-4 space-y-4">
              {establishments.map((e) => (
                <li key={e.id} className="text-sm">
                  <Link href={`/etablissements/${e.slug}`} className="font-semibold text-white hover:text-gold">
                    {e.name.replace("Sankadiokro — ", "")}
                  </Link>
                  <p className="mt-1 flex items-start gap-1.5 text-white/70">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                    {e.address ?? e.district}
                  </p>
                  {e.phone && (
                    <a href={`tel:${e.phone.replace(/\s/g, "")}`} className="mt-1 flex items-center gap-1.5 text-white/70 hover:text-gold">
                      <Phone className="h-3.5 w-3.5" aria-hidden /> {e.phone}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-gold-light">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              {settings.contactPhone && (
                <li>
                  <a href={`tel:${settings.contactPhone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-gold">
                    <Phone className="h-4 w-4" aria-hidden /> {settings.contactPhone}
                  </a>
                </li>
              )}
              {settings.contactEmail && (
                <li>
                  <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-2 hover:text-gold">
                    <Mail className="h-4 w-4" aria-hidden /> {settings.contactEmail}
                  </a>
                </li>
              )}
              {!settings.contactPhone && !settings.contactEmail && <li className="text-white/60">Coordonnées officielles à renseigner dans l&apos;administration.</li>}
              <li>
                <Link href="/contact" className="font-semibold text-gold hover:text-gold-light">
                  Formulaire de contact →
                </Link>
              </li>
              <li>
                <Link href="/application" className="font-semibold text-gold hover:text-gold-light">
                  Télécharger l&apos;application →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/60 md:flex-row">
          <p>© {new Date().getFullYear()} Restaurant Sankadiokro. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link href="/confidentialite" className="hover:text-gold">
              Politique de confidentialité
            </Link>
            <Link href="/admin" className="hover:text-gold">
              Administration
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

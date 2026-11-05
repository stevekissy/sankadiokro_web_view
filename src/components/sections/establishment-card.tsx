import Link from "next/link";
import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { DemoImage } from "@/components/ui/demo-image";
import { DemoBadge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import type { Establishment } from "@/lib/types";

export function hoursSummary(e: Establishment): string | null {
  const open = e.hours.filter((h) => h.open && h.close);
  if (!open.length) return null;
  const first = open[0];
  const allSame = open.every((h) => h.open === first.open && h.close === first.close);
  if (allSame && open.length === 7) return `Tous les jours, ${first.open} – ${first.close}`;
  return `${open[0].day} – ${open[open.length - 1].day}, ${first.open} – ${first.close}`;
}

export function EstablishmentCard({ e }: { e: Establishment }) {
  const hours = hoursSummary(e);
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card">
      <DemoImage src={e.photos[0]} alt={e.name} className="aspect-[16/9]" label="Photo de l'établissement à ajouter" />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-semibold text-forest">{e.name}</h3>
        <ul className="mt-4 space-y-2.5 text-sm">
          <li className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" aria-hidden />
            <span>
              {e.address ?? e.district}
              {!e.address && <DemoBadge label="Adresse exacte à renseigner" className="ml-2" />}
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" aria-hidden />
            <span>{hours ?? <span className="text-ink-soft">Horaires à confirmer</span>}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" aria-hidden />
            {e.phone ? (
              <a href={`tel:${e.phone.replace(/\s/g, "")}`} className="font-medium text-forest hover:underline">
                {e.phone}
              </a>
            ) : (
              <span className="text-ink-soft">Téléphone à renseigner</span>
            )}
          </li>
        </ul>
        <div className="mt-6 flex flex-wrap gap-2">
          {e.mapsUrl ? (
            <a href={e.mapsUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses("primary", "sm")}>
              <Navigation className="h-4 w-4" aria-hidden /> Itinéraire
            </a>
          ) : (
            <span className={buttonClasses("primary", "sm", "opacity-50")} aria-disabled title="Lien Google Maps à configurer">
              <Navigation className="h-4 w-4" aria-hidden /> Itinéraire
            </span>
          )}
          <Link href={`/contact?etablissement=${e.slug}`} className={buttonClasses("outline", "sm")}>
            Nous contacter
          </Link>
          <Link href={`/etablissements/${e.slug}`} className={buttonClasses("ghost", "sm")}>
            Voir la fiche →
          </Link>
        </div>
      </div>
    </article>
  );
}

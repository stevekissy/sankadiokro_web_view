import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Mail, MapPin, Navigation, Phone, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container, Section } from "@/components/ui/container";
import { DemoImage } from "@/components/ui/demo-image";
import { DemoBadge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { getEstablishmentBySlug, getEstablishments, getRooms } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { whatsappLink } from "@/lib/utils";
import { RoomCard } from "@/components/sections/room-card";

export async function generateStaticParams() {
  const list = await getEstablishments();
  return list.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = await getEstablishmentBySlug(slug);
  if (!e) return {};
  return pageMetadata(e.name, `${e.name} : cuisine ivoirienne authentique à ${e.district}. Adresse, horaires, téléphone et itinéraire.`, `/etablissements/${e.slug}`, e.photos[0]);
}

export default async function EstablishmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = await getEstablishmentBySlug(slug);
  if (!e) notFound();
  const rooms = (await getRooms()).filter((r) => r.establishmentId === e.id);
  const phoneHref = e.phone ? `tel:${e.phone.replace(/\s/g, "")}` : null;
  const wa = e.whatsapp ?? null;

  return (
    <>
      <PageHero eyebrow={e.district} title={e.name} description={e.description ?? undefined} />
      <Section className="bg-cream">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal>
              <div className="grid grid-cols-2 gap-4">
                <DemoImage src={e.photos[0]} alt={`${e.name} — façade`} className="col-span-2 aspect-[16/9] rounded-3xl" label="Photo de l'établissement" />
                <DemoImage src={e.photos[1]} alt={`${e.name} — salle`} className="aspect-[4/3] rounded-3xl" label="Intérieur" tone="gold" />
                <DemoImage src={e.photos[2]} alt={`${e.name} — terrasse`} className="aspect-[4/3] rounded-3xl" label="Extérieur" tone="cream" />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-3xl bg-white p-6 shadow-card md:p-8">
                <h2 className="font-display text-2xl font-semibold text-forest">Informations pratiques</h2>
                {e.isDemo && <DemoBadge label="Informations à valider par le restaurant" className="mt-2" />}
                <dl className="mt-6 space-y-5">
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" aria-hidden />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Adresse</dt>
                      <dd className="mt-0.5 font-medium">{e.address ?? `${e.district} (adresse exacte à renseigner)`}</dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" aria-hidden />
                    <div className="flex-1">
                      <dt className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Horaires</dt>
                      <dd className="mt-1">
                        {e.hours.some((h) => h.open) ? (
                          <table className="w-full text-sm">
                            <tbody>
                              {e.hours.map((h) => (
                                <tr key={h.day} className="border-b border-ink/5 last:border-0">
                                  <td className="py-1 pr-4 font-medium">{h.day}</td>
                                  <td className="py-1 text-right text-ink-soft">{h.open && h.close ? `${h.open} – ${h.close}` : "Fermé"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <span className="text-sm text-ink-soft">Horaires à confirmer dans l&apos;administration.</span>
                        )}
                      </dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" aria-hidden />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Téléphone</dt>
                      <dd className="mt-0.5 font-medium">{phoneHref ? <a href={phoneHref} className="text-forest hover:underline">{e.phone}</a> : <span className="text-ink-soft">À renseigner</span>}</dd>
                    </div>
                  </div>
                  {e.email && (
                    <div className="flex gap-3">
                      <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" aria-hidden />
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wider text-ink-soft">E-mail</dt>
                        <dd className="mt-0.5 font-medium">
                          <a href={`mailto:${e.email}`} className="text-forest hover:underline">{e.email}</a>
                        </dd>
                      </div>
                    </div>
                  )}
                </dl>
                <div className="mt-8 flex flex-wrap gap-2">
                  {e.mapsUrl ? (
                    <a href={e.mapsUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses("primary")}>
                      <Navigation className="h-4 w-4" aria-hidden /> Itinéraire
                    </a>
                  ) : (
                    <span className={buttonClasses("primary", "md", "opacity-50")} aria-disabled title="Lien Google Maps à configurer">
                      <Navigation className="h-4 w-4" aria-hidden /> Itinéraire
                    </span>
                  )}
                  <Link href={`/contact?etablissement=${e.slug}`} className={buttonClasses("outline")}>
                    Nous contacter
                  </Link>
                  {wa && (
                    <a href={whatsappLink(wa, `Bonjour ${e.name} 👋, je souhaite obtenir des renseignements.`)} target="_blank" rel="noopener noreferrer" className={buttonClasses("gold")}>
                      <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
                    </a>
                  )}
                </div>
                {e.mapsUrl && (
                  <div className="mt-6 overflow-hidden rounded-2xl">
                    <iframe title={`Carte ${e.name}`} src={e.mapsUrl.includes("/embed") ? e.mapsUrl : `https://www.google.com/maps?q=${encodeURIComponent(e.address ?? e.name)}&output=embed`} className="h-64 w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
                  </div>
                )}
              </div>
            </Reveal>
          </div>

          {rooms.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display text-2xl font-semibold text-forest md:text-3xl">Salles disponibles dans cet établissement</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {rooms.map((r) => (
                  <RoomCard key={r.id} room={r} />
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}

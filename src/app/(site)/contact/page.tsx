import { Suspense } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container, Section } from "@/components/ui/container";
import { ContactForm } from "@/components/forms/contact-form";
import { buttonClasses } from "@/components/ui/button";
import { hoursSummary } from "@/components/sections/establishment-card";
import { getEstablishments, getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { whatsappLink } from "@/lib/utils";

export const metadata = pageMetadata(
  "Contact",
  "Contactez Restaurant Sankadiokro à Abidjan : formulaire, téléphone, WhatsApp, horaires et accès à nos établissements de Yopougon Millionnaire et Cocody Saint-Jean.",
  "/contact",
);

export default async function ContactPage() {
  const [settings, establishments] = await Promise.all([getSettings(), getEstablishments()]);
  const names = Object.fromEntries(establishments.map((e) => [e.slug, e.name]));
  return (
    <>
      <PageHero eyebrow="Contact" title="Parlons de votre prochain repas" description="Une question, une commande, un événement ? Nous sommes à votre écoute." />
      <Section className="bg-cream">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-card">
                <h2 className="font-display text-2xl font-semibold text-forest">Coordonnées officielles</h2>
                <ul className="mt-4 space-y-3 text-sm">
                  <li className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gold-dark" aria-hidden />
                    {settings.contactPhone ? <a href={`tel:${settings.contactPhone.replace(/\s/g, "")}`} className="font-medium text-forest hover:underline">{settings.contactPhone}</a> : <span className="text-ink-soft">Téléphone à renseigner dans l&apos;administration</span>}
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gold-dark" aria-hidden />
                    {settings.contactEmail ? <a href={`mailto:${settings.contactEmail}`} className="font-medium text-forest hover:underline">{settings.contactEmail}</a> : <span className="text-ink-soft">E-mail à renseigner dans l&apos;administration</span>}
                  </li>
                </ul>
                {settings.whatsappNumber ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    <a href={whatsappLink(settings.whatsappNumber, "Bonjour Sankadiokro 👋, je souhaite obtenir des renseignements.")} target="_blank" rel="noopener noreferrer" className={buttonClasses("gold", "sm")}>
                      <MessageCircle className="h-4 w-4" aria-hidden /> Renseignements
                    </a>
                    <a href={whatsappLink(settings.whatsappNumber, "Bonjour Sankadiokro 👋, je souhaite réserver une salle pour un événement.")} target="_blank" rel="noopener noreferrer" className={buttonClasses("outline", "sm")}>
                      Réservation de salle
                    </a>
                    <a href={whatsappLink(settings.whatsappNumber, "Bonjour Sankadiokro 👋, je souhaite passer une commande.")} target="_blank" rel="noopener noreferrer" className={buttonClasses("outline", "sm")}>
                      Commande
                    </a>
                  </div>
                ) : (
                  <p className="mt-4 text-xs text-ink-soft">Le bouton WhatsApp sera activé dès que le numéro officiel sera configuré.</p>
                )}
              </div>

              {establishments.map((e) => (
                <div key={e.id} className="rounded-3xl bg-white p-6 shadow-card">
                  <h3 className="font-display text-xl font-semibold text-forest">{e.name}</h3>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" aria-hidden />{e.address ?? `${e.district} — adresse exacte à renseigner`}</li>
                    <li className="flex items-start gap-2.5"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" aria-hidden />{hoursSummary(e) ?? "Horaires à confirmer"}</li>
                    <li className="flex items-start gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" aria-hidden />{e.phone ? <a href={`tel:${e.phone.replace(/\s/g, "")}`} className="text-forest hover:underline">{e.phone}</a> : "Téléphone à renseigner"}</li>
                  </ul>
                  {e.mapsUrl && (
                    <a href={e.mapsUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses("ghost", "sm", "mt-3 -ml-3")}>
                      Itinéraire →
                    </a>
                  )}
                </div>
              ))}
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-card md:p-10">
              <h2 className="font-display text-2xl font-semibold text-forest">Envoyez-nous un message</h2>
              <p className="mt-1 text-sm text-ink-soft">Nous vous répondons rapidement par e-mail ou téléphone.</p>
              <div className="mt-6">
                <Suspense fallback={<div className="h-80 animate-pulse rounded-2xl bg-cream" />}>
                  <ContactForm establishmentNames={names} />
                </Suspense>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

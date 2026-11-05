import type { Metadata } from "next";
import { env } from "./env";
import type { Establishment, SiteSettings } from "./types";

export const SITE_NAME = "Restaurant Sankadiokro";
export const SITE_DESCRIPTION =
  "Restaurant ivoirien à Abidjan : grillades (poulet braisé, pintade, capitaine, carpe), kédjénou, soupes traditionnelles, attiéké et alloco. Deux établissements à Yopougon Millionnaire et Cocody Saint-Jean. Location de salles pour vos événements et application mobile avec programme de fidélité.";

export const KEYWORDS = [
  "Restaurant Sankadiokro",
  "restaurant ivoirien à Abidjan",
  "restaurant à Yopougon Millionnaire",
  "restaurant à Cocody Saint-Jean",
  "cuisine ivoirienne à Abidjan",
  "location de salle à Abidjan",
  "poulet braisé Abidjan",
  "kédjénou",
  "attiéké",
  "grillades Abidjan",
];

export function pageMetadata(title: string, description: string, path = "/", image?: string | null): Metadata {
  const url = new URL(path, env.siteUrl).toString();
  const ogImage = image ?? "/images/logo-sankadiokro.png";
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      locale: "fr_CI",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 1200, alt: SITE_NAME }],
    },
    twitter: { card: "summary_large_image", title: `${title} | ${SITE_NAME}`, description, images: [ogImage] },
  };
}

export function restaurantJsonLd(settings: SiteSettings, establishments: Establishment[]) {
  const base = env.siteUrl;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: base,
      logo: `${base}/images/logo-sankadiokro.png`,
      slogan: settings.sloganMain,
      sameAs: [settings.facebookUrl, settings.instagramUrl, settings.tiktokUrl].filter(Boolean),
    },
    ...establishments.map((e) => ({
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "@id": `${base}/etablissements/${e.slug}`,
      name: e.name,
      url: `${base}/etablissements/${e.slug}`,
      image: e.photos[0] ?? `${base}/images/logo-sankadiokro.png`,
      servesCuisine: "Cuisine ivoirienne",
      priceRange: "$$",
      ...(e.phone ? { telephone: e.phone } : {}),
      address: {
        "@type": "PostalAddress",
        ...(e.address ? { streetAddress: e.address } : {}),
        addressLocality: "Abidjan",
        addressRegion: e.district,
        addressCountry: "CI",
      },
      ...(e.mapsUrl ? { hasMap: e.mapsUrl } : {}),
      openingHoursSpecification: e.hours
        .filter((h) => h.open && h.close)
        .map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: dayToSchema(h.day), opens: h.open, closes: h.close })),
      menu: `${base}/menu`,
      acceptsReservations: "True",
    })),
  ];
}

function dayToSchema(day: string) {
  const map: Record<string, string> = {
    Lundi: "Monday", Mardi: "Tuesday", Mercredi: "Wednesday", Jeudi: "Thursday", Vendredi: "Friday", Samedi: "Saturday", Dimanche: "Sunday",
  };
  return map[day] ?? day;
}

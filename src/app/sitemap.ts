import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { getEstablishments } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.siteUrl;
  const now = new Date();
  const staticPages = ["", "/notre-restaurant", "/menu", "/application", "/salles-evenements", "/galerie", "/etablissements", "/contact", "/confidentialite"];
  const establishments = await getEstablishments();
  return [
    ...staticPages.map((p) => ({ url: `${base}${p}`, lastModified: now, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8 })),
    ...establishments.map((e) => ({ url: `${base}/etablissements/${e.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}

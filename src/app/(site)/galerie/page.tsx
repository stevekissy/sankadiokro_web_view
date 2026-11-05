import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { GalleryView } from "./gallery-view";
import { getGallery } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Galerie photos",
  "Les plats, les salles de réception, les événements et l'ambiance du Restaurant Sankadiokro à Abidjan en images.",
  "/galerie",
);

export default async function GalleryPage() {
  const items = await getGallery();
  return (
    <>
      <PageHero eyebrow="Galerie" title="Sankadiokro en images" description="Nos plats, nos salles, nos événements et l'ambiance de nos établissements." />
      <div className="bg-cream py-12 md:py-16">
        <Container>
          <GalleryView items={items} />
        </Container>
      </div>
    </>
  );
}

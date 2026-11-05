import { Hero } from "@/components/sections/hero";
import { Specialties } from "@/components/sections/specialties";
import { Advantages } from "@/components/sections/advantages";
import { AppPromo } from "@/components/sections/app-promo";
import { EstablishmentsSection } from "@/components/sections/establishments-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { PostsSection } from "@/components/sections/posts-section";
import { CtaBanner } from "@/components/sections/cta-banner";
import { getActivePosts, getEstablishments, getFeaturedDishes, getSettings, getTestimonials } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Restaurant ivoirien à Abidjan — Yopougon & Cocody",
  "Sankadiokro, le goût authentique de chez nous : grillades, kédjénou, soupes traditionnelles et attiéké à Yopougon Millionnaire et Cocody Saint-Jean. Application mobile, fidélité et location de salles.",
  "/",
);

export default async function HomePage() {
  const [settings, dishes, establishments, testimonials, posts] = await Promise.all([
    getSettings(),
    getFeaturedDishes(6),
    getEstablishments(),
    getTestimonials(),
    getActivePosts(),
  ]);
  return (
    <>
      <Hero settings={settings} />
      <PostsSection posts={posts} />
      <Specialties dishes={dishes} />
      <Advantages />
      <AppPromo settings={settings} />
      <EstablishmentsSection establishments={establishments} />
      <TestimonialsSection testimonials={testimonials} />
      <CtaBanner />
    </>
  );
}

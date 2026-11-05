import "server-only";
import { isSupabaseConfigured } from "./env";
import { createSupabasePublicClient } from "./supabase/admin";
import {
  demoCategories,
  demoDishes,
  demoEstablishments,
  demoGallery,
  demoPosts,
  demoRooms,
  demoSettings,
  demoTestimonials,
} from "./demo-data";
import {
  mapCategory,
  mapDish,
  mapEstablishment,
  mapGallery,
  mapPost,
  mapRoom,
  mapScreenshot,
  mapSettings,
  mapTestimonial,
} from "./mappers";
import type { Dish, Establishment, GalleryItem, MenuCategory, Post, Room, SiteSettings, Testimonial } from "./types";

/** Vrai si le site tourne avec les contenus de démonstration. */
export function isDemoMode(): boolean {
  return !isSupabaseConfigured();
}

export async function getSettings(): Promise<SiteSettings> {
  const sb = createSupabasePublicClient();
  if (!sb) return demoSettings;
  const [{ data: s }, { data: shots }] = await Promise.all([
    sb.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    sb.from("app_screenshots").select("*").order("sort_order"),
  ]);
  return mapSettings(s, (shots ?? []).map(mapScreenshot));
}

export async function getEstablishments(): Promise<Establishment[]> {
  const sb = createSupabasePublicClient();
  if (!sb) return demoEstablishments;
  const { data } = await sb.from("establishments").select("*").order("sort_order");
  const rows = (data ?? []).map(mapEstablishment);
  return rows.length ? rows : demoEstablishments;
}

export async function getEstablishmentBySlug(slug: string): Promise<Establishment | null> {
  const list = await getEstablishments();
  return list.find((e) => e.slug === slug) ?? null;
}

export async function getMenu(): Promise<{ categories: MenuCategory[]; dishes: Dish[] }> {
  const sb = createSupabasePublicClient();
  if (!sb) return { categories: demoCategories, dishes: demoDishes };
  const [{ data: cats }, { data: dishes }] = await Promise.all([
    sb.from("menu_categories").select("*").order("sort_order"),
    sb.from("dishes").select("*").order("sort_order"),
  ]);
  const categories = (cats ?? []).map(mapCategory);
  const mapped = (dishes ?? []).map(mapDish);
  if (!categories.length) return { categories: demoCategories, dishes: demoDishes };
  return { categories, dishes: mapped };
}

export async function getFeaturedDishes(limit = 6): Promise<Dish[]> {
  const { dishes } = await getMenu();
  const featured = dishes.filter((d) => d.featured && d.available);
  return (featured.length ? featured : dishes.filter((d) => d.available)).slice(0, limit);
}

export async function getRooms(): Promise<Room[]> {
  const sb = createSupabasePublicClient();
  if (!sb) return demoRooms;
  const { data } = await sb.from("rooms").select("*").eq("active", true).order("sort_order");
  const rows = (data ?? []).map(mapRoom);
  return rows.length ? rows : demoRooms;
}

export async function getAllRooms(): Promise<Room[]> {
  const sb = createSupabasePublicClient();
  if (!sb) return demoRooms;
  const { data } = await sb.from("rooms").select("*").order("sort_order");
  return (data ?? []).map(mapRoom);
}

export async function getGallery(): Promise<GalleryItem[]> {
  const sb = createSupabasePublicClient();
  if (!sb) return demoGallery;
  const { data } = await sb.from("gallery_items").select("*").order("sort_order");
  return (data ?? []).map(mapGallery);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const sb = createSupabasePublicClient();
  if (!sb) return demoTestimonials;
  const { data } = await sb
    .from("testimonials")
    .select("*")
    .eq("published", true)
    .eq("consent", true)
    .order("review_date", { ascending: false });
  return (data ?? []).map(mapTestimonial);
}

export async function getActivePosts(): Promise<Post[]> {
  const sb = createSupabasePublicClient();
  if (!sb) return demoPosts;
  const now = new Date().toISOString();
  const { data } = await sb.from("posts").select("*").eq("active", true).order("created_at", { ascending: false });
  return (data ?? [])
    .map(mapPost)
    .filter((p) => (!p.startsAt || p.startsAt <= now) && (!p.endsAt || p.endsAt >= now));
}

import "server-only";
import { createSupabaseAdminClient } from "./supabase/admin";
import { demoCategories, demoDishes, demoEstablishments, demoGallery, demoPosts, demoReservations, demoRooms, demoSettings, demoTestimonials } from "./demo-data";
import { mapAudit, mapCategory, mapContact, mapDish, mapEstablishment, mapGallery, mapPost, mapProfile, mapReservation, mapRoom, mapScreenshot, mapSettings, mapTestimonial } from "./mappers";
import { DEMO_PROFILE } from "./auth";
import type { AuditLog, ContactMessage, Dish, Establishment, GalleryItem, MenuCategory, Post, Profile, ReservationRequest, ReservationStatus, Room, SiteSettings, SiteStats, Testimonial } from "./types";

const db = () => createSupabaseAdminClient();

export async function adminGetReservations(status?: ReservationStatus | "all"): Promise<ReservationRequest[]> {
  const sb = db();
  if (!sb) return status && status !== "all" ? demoReservations.filter((r) => r.status === status) : demoReservations;
  let q = sb.from("reservation_requests").select("*").order("created_at", { ascending: false }).limit(300);
  if (status && status !== "all") q = q.eq("status", status);
  const { data } = await q;
  return (data ?? []).map(mapReservation);
}

export async function adminGetReservation(id: string): Promise<ReservationRequest | null> {
  const sb = db();
  if (!sb) return demoReservations.find((r) => r.id === id) ?? null;
  const { data } = await sb.from("reservation_requests").select("*").eq("id", id).maybeSingle();
  return data ? mapReservation(data) : null;
}

/** Réservations confirmées qui chevauchent le créneau demandé dans la même salle. */
export async function findConflicts(roomId: string | null, date: string, start: string, end: string, excludeId?: string): Promise<ReservationRequest[]> {
  const sb = db();
  if (!sb || !roomId) return [];
  const { data } = await sb
    .from("reservation_requests")
    .select("*")
    .eq("room_id", roomId)
    .eq("event_date", date)
    .eq("status", "confirmed")
    .lt("start_time", end)
    .gt("end_time", start);
  return (data ?? []).map(mapReservation).filter((r) => r.id !== excludeId);
}

export async function adminGetMessages(): Promise<ContactMessage[]> {
  const sb = db();
  if (!sb) return [];
  const { data } = await sb.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(300);
  return (data ?? []).map(mapContact);
}

export async function adminGetMenu(): Promise<{ categories: MenuCategory[]; dishes: Dish[] }> {
  const sb = db();
  if (!sb) return { categories: demoCategories, dishes: demoDishes };
  const [{ data: c }, { data: d }] = await Promise.all([sb.from("menu_categories").select("*").order("sort_order"), sb.from("dishes").select("*").order("sort_order")]);
  return { categories: (c ?? []).map(mapCategory), dishes: (d ?? []).map(mapDish) };
}

export async function adminGetRooms(): Promise<Room[]> {
  const sb = db();
  if (!sb) return demoRooms;
  const { data } = await sb.from("rooms").select("*").order("sort_order");
  return (data ?? []).map(mapRoom);
}

export async function adminGetEstablishments(): Promise<Establishment[]> {
  const sb = db();
  if (!sb) return demoEstablishments;
  const { data } = await sb.from("establishments").select("*").order("sort_order");
  return (data ?? []).map(mapEstablishment);
}

export async function adminGetGallery(): Promise<GalleryItem[]> {
  const sb = db();
  if (!sb) return demoGallery;
  const { data } = await sb.from("gallery_items").select("*").order("sort_order");
  return (data ?? []).map(mapGallery);
}

export async function adminGetTestimonials(): Promise<Testimonial[]> {
  const sb = db();
  if (!sb) return demoTestimonials;
  const { data } = await sb.from("testimonials").select("*").order("review_date", { ascending: false });
  return (data ?? []).map(mapTestimonial);
}

export async function adminGetPosts(): Promise<Post[]> {
  const sb = db();
  if (!sb) return demoPosts;
  const { data } = await sb.from("posts").select("*").order("created_at", { ascending: false });
  return (data ?? []).map(mapPost);
}

export async function adminGetSettings(): Promise<SiteSettings> {
  const sb = db();
  if (!sb) return demoSettings;
  const [{ data: s }, { data: shots }] = await Promise.all([sb.from("site_settings").select("*").eq("id", 1).maybeSingle(), sb.from("app_screenshots").select("*").order("sort_order")]);
  return mapSettings(s, (shots ?? []).map(mapScreenshot));
}

export async function adminGetProfiles(): Promise<Profile[]> {
  const sb = db();
  if (!sb) return [DEMO_PROFILE];
  const { data } = await sb.from("profiles").select("*").order("created_at");
  return (data ?? []).map(mapProfile);
}

export async function adminGetAuditLogs(limit = 200): Promise<AuditLog[]> {
  const sb = db();
  if (!sb) return [];
  const { data } = await sb.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(limit);
  return (data ?? []).map(mapAudit);
}

export async function adminGetStats(): Promise<SiteStats> {
  const sb = db();
  const empty: SiteStats = { viewsLast30Days: 0, viewsLast7Days: 0, viewsToday: 0, topPages: [], dailySeries: [], pendingReservations: 0, unreadMessages: 0 };
  if (!sb) return { ...empty, pendingReservations: demoReservations.filter((r) => r.status === "pending").length };

  const since30 = new Date(Date.now() - 30 * 86400000).toISOString();
  const [{ data: views }, { count: pending }, { count: unread }] = await Promise.all([
    sb.from("page_views").select("path, created_at").gte("created_at", since30).limit(50000),
    sb.from("reservation_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
    sb.from("contact_messages").select("*", { count: "exact", head: true }).eq("handled", false),
  ]);
  const rows = (views ?? []) as { path: string; created_at: string }[];
  const today = new Date().toISOString().slice(0, 10);
  const since7 = new Date(Date.now() - 7 * 86400000).toISOString();
  const byPath = new Map<string, number>();
  const byDay = new Map<string, number>();
  for (let i = 29; i >= 0; i--) byDay.set(new Date(Date.now() - i * 86400000).toISOString().slice(0, 10), 0);
  for (const r of rows) {
    byPath.set(r.path, (byPath.get(r.path) ?? 0) + 1);
    const day = r.created_at.slice(0, 10);
    if (byDay.has(day)) byDay.set(day, (byDay.get(day) ?? 0) + 1);
  }
  return {
    viewsLast30Days: rows.length,
    viewsLast7Days: rows.filter((r) => r.created_at >= since7).length,
    viewsToday: rows.filter((r) => r.created_at.slice(0, 10) === today).length,
    topPages: [...byPath.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([path, views]) => ({ path, views })),
    dailySeries: [...byDay.entries()].map(([date, views]) => ({ date, views })),
    pendingReservations: pending ?? 0,
    unreadMessages: unread ?? 0,
  };
}

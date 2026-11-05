"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { assertProfile, logAction } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { findConflicts, adminGetReservation } from "@/lib/admin-data";
import { adminEmail, kv, layout, sendEmail, escapeHtml } from "@/lib/email";
import { formatDateFr, slugify } from "@/lib/utils";
import { RESERVATION_STATUS_LABELS, type Role } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Utilitaires                                                        */
/* ------------------------------------------------------------------ */
const ALL_PUBLIC_PATHS = ["/", "/notre-restaurant", "/menu", "/application", "/salles-evenements", "/galerie", "/etablissements", "/contact", "/confidentialite"];

function revalidateSite(extra: string[] = []) {
  for (const p of [...ALL_PUBLIC_PATHS, ...extra]) revalidatePath(p);
  revalidatePath("/etablissements/[slug]", "page");
}

function back(path: string, msg: string, ok = true): never {
  const u = new URL(path, "http://x");
  u.searchParams.set(ok ? "ok" : "err", msg);
  redirect(u.pathname + u.search);
}

async function ctx(path: string, minRole: Role = "manager") {
  let profile;
  try {
    profile = await assertProfile(minRole);
  } catch (e) {
    back(path, (e as Error).message, false);
  }
  const sb = createSupabaseAdminClient();
  if (!sb) back(path, "Mode démonstration : connectez Supabase (variables d'environnement) pour enregistrer des modifications.", false);
  return { profile: profile!, sb: sb! };
}

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const strOrNull = (fd: FormData, k: string) => str(fd, k) || null;
const intOrNull = (fd: FormData, k: string) => {
  const v = str(fd, k);
  if (!v) return null;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
};
const bool = (fd: FormData, k: string) => fd.get(k) === "on" || fd.get(k) === "true";
const list = (fd: FormData, k: string) => str(fd, k).split(/\r?\n|,/).map((s) => s.trim()).filter(Boolean);
const urlOrNull = (fd: FormData, k: string) => {
  const v = str(fd, k);
  if (!v) return null;
  const ok = z.string().url().safeParse(v);
  return ok.success ? v : null;
};

/* ------------------------------------------------------------------ */
/*  Authentification                                                   */
/* ------------------------------------------------------------------ */
export async function loginAction(_prev: { error?: string }, fd: FormData): Promise<{ error?: string }> {
  const sb = await createSupabaseServerClient();
  if (!sb) return { error: "Supabase n'est pas configuré. Renseignez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY." };
  const email = str(fd, "email");
  const password = String(fd.get("password") ?? "");
  if (!email || !password) return { error: "E-mail et mot de passe requis." };
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return { error: "Identifiants incorrects." };
  const next = str(fd, "next") || "/admin";
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  const sb = await createSupabaseServerClient();
  if (sb) await sb.auth.signOut();
  redirect("/admin/login");
}

/* ------------------------------------------------------------------ */
/*  Réservations                                                       */
/* ------------------------------------------------------------------ */
export async function updateReservationStatus(fd: FormData) {
  const path = "/admin/reservations";
  const { profile, sb } = await ctx(path);
  const id = str(fd, "id");
  const action = str(fd, "action") as "confirm" | "refuse" | "propose" | "cancel" | "pending";
  const note = strOrNull(fd, "adminNote");
  const existing = await adminGetReservation(id);
  if (!existing) back(path, "Demande introuvable.", false);

  const update: Record<string, unknown> = { admin_note: note };
  let statusLabel = "";
  let proposed: { date: string; start: string; end: string } | null = null;

  if (action === "confirm") {
    // Si une contre-proposition a été acceptée, on confirme sur la date proposée.
    const date = existing.proposedDate && str(fd, "useProposed") === "on" ? existing.proposedDate : existing.eventDate;
    const start = existing.proposedDate && str(fd, "useProposed") === "on" ? existing.proposedStartTime ?? existing.startTime : existing.startTime;
    const end = existing.proposedDate && str(fd, "useProposed") === "on" ? existing.proposedEndTime ?? existing.endTime : existing.endTime;
    const conflicts = await findConflicts(existing.roomId, date, start, end, id);
    if (conflicts.length) back(path + `?id=${id}`, `Impossible de confirmer : la salle est déjà confirmée pour ${conflicts[0].reference} (${conflicts[0].startTime}–${conflicts[0].endTime}).`, false);
    Object.assign(update, { status: "confirmed", event_date: date, start_time: start, end_time: end });
    statusLabel = RESERVATION_STATUS_LABELS.confirmed;
  } else if (action === "refuse") {
    update.status = "refused";
    statusLabel = RESERVATION_STATUS_LABELS.refused;
  } else if (action === "cancel") {
    update.status = "cancelled";
    statusLabel = RESERVATION_STATUS_LABELS.cancelled;
  } else if (action === "pending") {
    update.status = "pending";
    statusLabel = RESERVATION_STATUS_LABELS.pending;
  } else if (action === "propose") {
    const date = str(fd, "proposedDate");
    const start = str(fd, "proposedStartTime");
    const end = str(fd, "proposedEndTime");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !start || !end || end <= start) back(path + `?id=${id}`, "Date ou horaires proposés invalides.", false);
    proposed = { date, start, end };
    Object.assign(update, { status: "counter_proposed", proposed_date: date, proposed_start_time: start, proposed_end_time: end });
    statusLabel = RESERVATION_STATUS_LABELS.counter_proposed;
  } else {
    back(path, "Action inconnue.", false);
  }

  const { error } = await sb.from("reservation_requests").update(update).eq("id", id);
  if (error) {
    const msg = error.code === "23P01" ? "Conflit : une autre réservation confirmée occupe déjà ce créneau dans cette salle." : error.message;
    back(path + `?id=${id}`, msg, false);
  }
  await logAction(profile, `reservation.${action}`, "reservation_requests", id, { reference: existing.reference, note });

  // Notification au client
  const body =
    action === "propose" && proposed
      ? `<p>Bonjour ${escapeHtml(existing.fullName)},</p><p>Concernant votre demande <strong>${existing.reference}</strong>, le créneau souhaité n'est pas disponible. Nous vous proposons : <strong>${formatDateFr(proposed.date + "T00:00:00")} de ${proposed.start} à ${proposed.end}</strong>.</p><p>Merci de nous répondre par e-mail ou téléphone pour accepter cette proposition.</p>`
      : `<p>Bonjour ${escapeHtml(existing.fullName)},</p><p>Le statut de votre demande <strong>${existing.reference}</strong> est maintenant : <strong>${statusLabel}</strong>.</p>`;
  await sendEmail({
    to: existing.email,
    subject: `Votre demande ${existing.reference} : ${statusLabel} — Sankadiokro`,
    replyTo: adminEmail() ?? undefined,
    html: layout(`Demande ${existing.reference} — ${statusLabel}`, body + (note ? `<p><em>Message du restaurant :</em><br>${escapeHtml(note)}</p>` : "") + kv([["Événement", existing.eventType], ["Salle", existing.roomName], ["Date initiale", formatDateFr(existing.eventDate + "T00:00:00")], ["Invités", existing.guests]])),
  });

  revalidatePath(path);
  back(path, `Demande ${existing.reference} : ${statusLabel}.`);
}

/* ------------------------------------------------------------------ */
/*  Messages de contact                                                */
/* ------------------------------------------------------------------ */
export async function toggleMessageHandled(fd: FormData) {
  const path = "/admin/messages";
  const { profile, sb } = await ctx(path);
  const id = str(fd, "id");
  const handled = bool(fd, "handled");
  await sb.from("contact_messages").update({ handled }).eq("id", id);
  await logAction(profile, handled ? "message.handled" : "message.reopened", "contact_messages", id);
  revalidatePath(path);
  back(path, handled ? "Message marqué comme traité." : "Message rouvert.");
}

/* ------------------------------------------------------------------ */
/*  Paramètres du site                                                 */
/* ------------------------------------------------------------------ */
export async function saveSettings(fd: FormData) {
  const path = "/admin/parametres";
  const { profile, sb } = await ctx(path);
  const appStore = urlOrNull(fd, "appStoreUrl");
  const playStore = urlOrNull(fd, "playStoreUrl");
  if (appStore && !appStore.includes("apps.apple.com")) back(path, "Le lien App Store doit pointer vers apps.apple.com.", false);
  if (playStore && !playStore.includes("play.google.com")) back(path, "Le lien Google Play doit pointer vers play.google.com.", false);
  const payload = {
    hero_title: strOrNull(fd, "heroTitle"),
    hero_subtitle: strOrNull(fd, "heroSubtitle"),
    hero_image_url: urlOrNull(fd, "heroImageUrl"),
    slogan_main: strOrNull(fd, "sloganMain"),
    slogan_loyalty: strOrNull(fd, "sloganLoyalty"),
    app_store_url: appStore,
    play_store_url: playStore,
    whatsapp_number: strOrNull(fd, "whatsappNumber")?.replace(/[^0-9+ ]/g, "") ?? null,
    contact_email: strOrNull(fd, "contactEmail"),
    contact_phone: strOrNull(fd, "contactPhone"),
    about_text: strOrNull(fd, "aboutText"),
    facebook_url: urlOrNull(fd, "facebookUrl"),
    instagram_url: urlOrNull(fd, "instagramUrl"),
    tiktok_url: urlOrNull(fd, "tiktokUrl"),
    updated_at: new Date().toISOString(),
  };
  const { error } = await sb.from("site_settings").upsert({ id: 1, ...payload });
  if (error) back(path, error.message, false);
  await logAction(profile, "settings.update", "site_settings", "1");
  revalidateSite(["/admin/parametres"]);
  back(path, "Paramètres enregistrés.");
}

export async function saveScreenshot(fd: FormData) {
  const path = "/admin/parametres";
  const { profile, sb } = await ctx(path);
  const id = strOrNull(fd, "id");
  const image = urlOrNull(fd, "imageUrl");
  if (!image) back(path, "Image requise.", false);
  const payload = { image_url: image, caption: strOrNull(fd, "caption"), sort_order: intOrNull(fd, "sortOrder") ?? 0 };
  const { error } = id ? await sb.from("app_screenshots").update(payload).eq("id", id) : await sb.from("app_screenshots").insert(payload);
  if (error) back(path, error.message, false);
  await logAction(profile, id ? "screenshot.update" : "screenshot.create", "app_screenshots", id);
  revalidateSite(["/admin/parametres"]);
  back(path, "Capture d'écran enregistrée.");
}

export async function deleteScreenshot(fd: FormData) {
  const path = "/admin/parametres";
  const { profile, sb } = await ctx(path);
  const id = str(fd, "id");
  await sb.from("app_screenshots").delete().eq("id", id);
  await logAction(profile, "screenshot.delete", "app_screenshots", id);
  revalidateSite(["/admin/parametres"]);
  back(path, "Capture supprimée.");
}

/* ------------------------------------------------------------------ */
/*  Menu                                                               */
/* ------------------------------------------------------------------ */
export async function saveCategory(fd: FormData) {
  const path = "/admin/menu";
  const { profile, sb } = await ctx(path);
  const id = strOrNull(fd, "id");
  const name = str(fd, "name");
  if (!name) back(path, "Nom de catégorie requis.", false);
  const payload = { name, slug: strOrNull(fd, "slug") ?? slugify(name), description: strOrNull(fd, "description"), sort_order: intOrNull(fd, "sortOrder") ?? 0 };
  const { error } = id ? await sb.from("menu_categories").update(payload).eq("id", id) : await sb.from("menu_categories").insert(payload);
  if (error) back(path, error.message, false);
  await logAction(profile, id ? "category.update" : "category.create", "menu_categories", id, { name });
  revalidateSite(["/admin/menu"]);
  back(path, "Catégorie enregistrée.");
}

export async function deleteCategory(fd: FormData) {
  const path = "/admin/menu";
  const { profile, sb } = await ctx(path);
  const id = str(fd, "id");
  const { error } = await sb.from("menu_categories").delete().eq("id", id);
  if (error) back(path, error.message, false);
  await logAction(profile, "category.delete", "menu_categories", id);
  revalidateSite(["/admin/menu"]);
  back(path, "Catégorie supprimée (et ses plats).");
}

export async function saveDish(fd: FormData) {
  const path = "/admin/menu";
  const { profile, sb } = await ctx(path);
  const id = strOrNull(fd, "id");
  const name = str(fd, "name");
  const categoryId = str(fd, "categoryId");
  if (!name || !categoryId) back(path, "Nom et catégorie requis.", false);
  const payload = {
    name,
    category_id: categoryId,
    description: strOrNull(fd, "description"),
    price_fcfa: intOrNull(fd, "priceFcfa"),
    image_url: urlOrNull(fd, "imageUrl"),
    available: bool(fd, "available"),
    featured: bool(fd, "featured"),
    sort_order: intOrNull(fd, "sortOrder") ?? 0,
  };
  const { error } = id ? await sb.from("dishes").update(payload).eq("id", id) : await sb.from("dishes").insert(payload);
  if (error) back(path, error.message, false);
  await logAction(profile, id ? "dish.update" : "dish.create", "dishes", id, { name, price: payload.price_fcfa });
  revalidateSite(["/admin/menu"]);
  back(path, `Plat « ${name} » enregistré.`);
}

export async function deleteDish(fd: FormData) {
  const path = "/admin/menu";
  const { profile, sb } = await ctx(path);
  const id = str(fd, "id");
  await sb.from("dishes").delete().eq("id", id);
  await logAction(profile, "dish.delete", "dishes", id);
  revalidateSite(["/admin/menu"]);
  back(path, "Plat supprimé.");
}

/* ------------------------------------------------------------------ */
/*  Salles                                                             */
/* ------------------------------------------------------------------ */
export async function saveRoom(fd: FormData) {
  const path = "/admin/salles";
  const { profile, sb } = await ctx(path);
  const id = strOrNull(fd, "id");
  const name = str(fd, "name");
  if (!name) back(path, "Nom de la salle requis.", false);
  const payload = {
    name,
    establishment_id: strOrNull(fd, "establishmentId"),
    description: strOrNull(fd, "description"),
    capacity: intOrNull(fd, "capacity"),
    equipment: list(fd, "equipment"),
    conditions: strOrNull(fd, "conditions"),
    price_fcfa: intOrNull(fd, "priceFcfa"),
    price_note: strOrNull(fd, "priceNote"),
    photos: list(fd, "photos").filter((u) => z.string().url().safeParse(u).success),
    active: bool(fd, "active"),
    sort_order: intOrNull(fd, "sortOrder") ?? 0,
  };
  const { error } = id ? await sb.from("rooms").update(payload).eq("id", id) : await sb.from("rooms").insert(payload);
  if (error) back(path, error.message, false);
  await logAction(profile, id ? "room.update" : "room.create", "rooms", id, { name });
  revalidateSite(["/admin/salles"]);
  back(path, `Salle « ${name} » enregistrée.`);
}

export async function deleteRoom(fd: FormData) {
  const path = "/admin/salles";
  const { profile, sb } = await ctx(path);
  const id = str(fd, "id");
  await sb.from("rooms").delete().eq("id", id);
  await logAction(profile, "room.delete", "rooms", id);
  revalidateSite(["/admin/salles"]);
  back(path, "Salle supprimée.");
}

/* ------------------------------------------------------------------ */
/*  Établissements                                                     */
/* ------------------------------------------------------------------ */
const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export async function saveEstablishment(fd: FormData) {
  const path = "/admin/etablissements";
  const { profile, sb } = await ctx(path);
  const id = strOrNull(fd, "id");
  const name = str(fd, "name");
  if (!name) back(path, "Nom requis.", false);
  const hours = DAYS.map((day) => {
    const closed = fd.get(`closed_${day}`) === "on";
    const open = str(fd, `open_${day}`);
    const close = str(fd, `close_${day}`);
    return { day, open: closed || !open ? null : open, close: closed || !close ? null : close };
  });
  const maps = urlOrNull(fd, "mapsUrl");
  if (maps && !/google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps/.test(maps)) back(path, "Le lien doit être un lien Google Maps.", false);
  const payload = {
    name,
    slug: strOrNull(fd, "slug") ?? slugify(name),
    district: strOrNull(fd, "district"),
    address: strOrNull(fd, "address"),
    phone: strOrNull(fd, "phone"),
    whatsapp: strOrNull(fd, "whatsapp"),
    email: strOrNull(fd, "email"),
    maps_url: maps,
    description: strOrNull(fd, "description"),
    hours,
    photos: list(fd, "photos").filter((u) => z.string().url().safeParse(u).success),
    sort_order: intOrNull(fd, "sortOrder") ?? 0,
  };
  const { error } = id ? await sb.from("establishments").update(payload).eq("id", id) : await sb.from("establishments").insert(payload);
  if (error) back(path, error.message, false);
  await logAction(profile, id ? "establishment.update" : "establishment.create", "establishments", id, { name });
  revalidateSite(["/admin/etablissements"]);
  back(path, `Établissement « ${name} » enregistré.`);
}

/* ------------------------------------------------------------------ */
/*  Galerie                                                            */
/* ------------------------------------------------------------------ */
export async function saveGalleryItem(fd: FormData) {
  const path = "/admin/galerie";
  const { profile, sb } = await ctx(path);
  const id = strOrNull(fd, "id");
  const image = urlOrNull(fd, "imageUrl");
  if (!image) back(path, "Image requise (téléversez un fichier ou collez une URL).", false);
  const payload = { image_url: image, caption: strOrNull(fd, "caption"), category: str(fd, "category") || "plats", sort_order: intOrNull(fd, "sortOrder") ?? 0 };
  const { error } = id ? await sb.from("gallery_items").update(payload).eq("id", id) : await sb.from("gallery_items").insert(payload);
  if (error) back(path, error.message, false);
  await logAction(profile, id ? "gallery.update" : "gallery.create", "gallery_items", id);
  revalidateSite(["/admin/galerie"]);
  back(path, "Photo enregistrée.");
}

export async function deleteGalleryItem(fd: FormData) {
  const path = "/admin/galerie";
  const { profile, sb } = await ctx(path);
  const id = str(fd, "id");
  await sb.from("gallery_items").delete().eq("id", id);
  await logAction(profile, "gallery.delete", "gallery_items", id);
  revalidateSite(["/admin/galerie"]);
  back(path, "Photo supprimée.");
}

/* ------------------------------------------------------------------ */
/*  Témoignages                                                        */
/* ------------------------------------------------------------------ */
export async function saveTestimonial(fd: FormData) {
  const path = "/admin/avis";
  const { profile, sb } = await ctx(path);
  const id = strOrNull(fd, "id");
  const author = str(fd, "author");
  const comment = str(fd, "comment");
  const rating = intOrNull(fd, "rating") ?? 5;
  const consent = bool(fd, "consent");
  const published = bool(fd, "published");
  if (!author || !comment) back(path, "Auteur et commentaire requis.", false);
  if (published && !consent) back(path, "Impossible de publier un avis sans l'autorisation du client.", false);
  const payload = { author, comment, rating: Math.min(5, Math.max(1, rating)), review_date: str(fd, "reviewDate") || new Date().toISOString().slice(0, 10), consent, published, source: strOrNull(fd, "source") };
  const { error } = id ? await sb.from("testimonials").update(payload).eq("id", id) : await sb.from("testimonials").insert(payload);
  if (error) back(path, error.message, false);
  await logAction(profile, id ? "testimonial.update" : "testimonial.create", "testimonials", id, { author, published });
  revalidateSite(["/admin/avis"]);
  back(path, "Avis enregistré.");
}

export async function deleteTestimonial(fd: FormData) {
  const path = "/admin/avis";
  const { profile, sb } = await ctx(path);
  const id = str(fd, "id");
  await sb.from("testimonials").delete().eq("id", id);
  await logAction(profile, "testimonial.delete", "testimonials", id);
  revalidateSite(["/admin/avis"]);
  back(path, "Avis supprimé.");
}

/* ------------------------------------------------------------------ */
/*  Promotions & actualités                                            */
/* ------------------------------------------------------------------ */
export async function savePost(fd: FormData) {
  const path = "/admin/actualites";
  const { profile, sb } = await ctx(path);
  const id = strOrNull(fd, "id");
  const title = str(fd, "title");
  const body = str(fd, "body");
  if (!title || !body) back(path, "Titre et contenu requis.", false);
  const payload = {
    title,
    body,
    image_url: urlOrNull(fd, "imageUrl"),
    kind: str(fd, "kind") === "promotion" ? "promotion" : "actualite",
    active: bool(fd, "active"),
    starts_at: strOrNull(fd, "startsAt") ? new Date(str(fd, "startsAt")).toISOString() : null,
    ends_at: strOrNull(fd, "endsAt") ? new Date(str(fd, "endsAt")).toISOString() : null,
  };
  const { error } = id ? await sb.from("posts").update(payload).eq("id", id) : await sb.from("posts").insert(payload);
  if (error) back(path, error.message, false);
  await logAction(profile, id ? "post.update" : "post.create", "posts", id, { title });
  revalidateSite(["/admin/actualites"]);
  back(path, "Publication enregistrée.");
}

export async function deletePost(fd: FormData) {
  const path = "/admin/actualites";
  const { profile, sb } = await ctx(path);
  const id = str(fd, "id");
  await sb.from("posts").delete().eq("id", id);
  await logAction(profile, "post.delete", "posts", id);
  revalidateSite(["/admin/actualites"]);
  back(path, "Publication supprimée.");
}

/* ------------------------------------------------------------------ */
/*  Utilisateurs (admin uniquement)                                    */
/* ------------------------------------------------------------------ */
export async function updateUserRole(fd: FormData) {
  const path = "/admin/utilisateurs";
  const { profile, sb } = await ctx(path, "admin");
  const id = str(fd, "id");
  const role = str(fd, "role") === "admin" ? "admin" : "manager";
  if (id === profile.id && role !== "admin") back(path, "Vous ne pouvez pas retirer votre propre rôle administrateur.", false);
  const { error } = await sb.from("profiles").update({ role }).eq("id", id);
  if (error) back(path, error.message, false);
  await logAction(profile, "user.role", "profiles", id, { role });
  back(path, "Rôle mis à jour.");
}

export async function inviteUser(fd: FormData) {
  const path = "/admin/utilisateurs";
  const { profile, sb } = await ctx(path, "admin");
  const email = str(fd, "email");
  const fullName = strOrNull(fd, "fullName");
  const role = str(fd, "role") === "admin" ? "admin" : "manager";
  if (!z.string().email().safeParse(email).success) back(path, "E-mail invalide.", false);
  const { data, error } = await sb.auth.admin.inviteUserByEmail(email, { data: { full_name: fullName }, redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/admin/login` });
  if (error) back(path, error.message, false);
  if (data.user) await sb.from("profiles").upsert({ id: data.user.id, email, full_name: fullName, role });
  await logAction(profile, "user.invite", "profiles", data.user?.id ?? null, { email, role });
  back(path, `Invitation envoyée à ${email}.`);
}

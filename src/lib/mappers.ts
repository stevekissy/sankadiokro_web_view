/* Conversion des lignes Supabase (snake_case) vers les types du site. */
import type {
  AppScreenshot,
  AuditLog,
  ContactMessage,
  Dish,
  Establishment,
  GalleryItem,
  MenuCategory,
  Post,
  Profile,
  ReservationRequest,
  Room,
  SiteSettings,
  Testimonial,
} from "./types";
import { demoSettings } from "./demo-data";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

export const mapEstablishment = (r: Row): Establishment => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  district: r.district ?? "",
  address: r.address ?? null,
  phone: r.phone ?? null,
  whatsapp: r.whatsapp ?? null,
  email: r.email ?? null,
  mapsUrl: r.maps_url ?? null,
  description: r.description ?? null,
  hours: Array.isArray(r.hours) ? r.hours : [],
  photos: Array.isArray(r.photos) ? r.photos : [],
  isDemo: false,
  sortOrder: r.sort_order ?? 0,
});

export const mapCategory = (r: Row): MenuCategory => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  description: r.description ?? null,
  sortOrder: r.sort_order ?? 0,
});

export const mapDish = (r: Row): Dish => ({
  id: r.id,
  categoryId: r.category_id,
  name: r.name,
  description: r.description ?? null,
  priceFcfa: r.price_fcfa ?? null,
  imageUrl: r.image_url ?? null,
  available: r.available ?? true,
  featured: r.featured ?? false,
  isDemo: false,
  sortOrder: r.sort_order ?? 0,
});

export const mapRoom = (r: Row): Room => ({
  id: r.id,
  establishmentId: r.establishment_id ?? null,
  name: r.name,
  description: r.description ?? null,
  capacity: r.capacity ?? null,
  equipment: Array.isArray(r.equipment) ? r.equipment : [],
  conditions: r.conditions ?? null,
  priceFcfa: r.price_fcfa ?? null,
  priceNote: r.price_note ?? null,
  photos: Array.isArray(r.photos) ? r.photos : [],
  active: r.active ?? true,
  isDemo: false,
  sortOrder: r.sort_order ?? 0,
});

export const mapReservation = (r: Row): ReservationRequest => ({
  id: r.id,
  reference: r.reference,
  status: r.status,
  fullName: r.full_name,
  phone: r.phone,
  email: r.email,
  roomId: r.room_id ?? null,
  roomName: r.room_name ?? r.rooms?.name ?? null,
  eventType: r.event_type,
  eventDate: r.event_date,
  startTime: String(r.start_time).slice(0, 5),
  endTime: String(r.end_time).slice(0, 5),
  guests: r.guests,
  specialNeeds: r.special_needs ?? null,
  message: r.message ?? null,
  proposedDate: r.proposed_date ?? null,
  proposedStartTime: r.proposed_start_time ? String(r.proposed_start_time).slice(0, 5) : null,
  proposedEndTime: r.proposed_end_time ? String(r.proposed_end_time).slice(0, 5) : null,
  adminNote: r.admin_note ?? null,
  createdAt: r.created_at,
  updatedAt: r.updated_at ?? r.created_at,
});

export const mapGallery = (r: Row): GalleryItem => ({
  id: r.id,
  imageUrl: r.image_url,
  caption: r.caption ?? null,
  category: r.category,
  isDemo: false,
  sortOrder: r.sort_order ?? 0,
});

export const mapTestimonial = (r: Row): Testimonial => ({
  id: r.id,
  author: r.author,
  rating: r.rating,
  comment: r.comment,
  date: r.review_date,
  published: r.published ?? false,
  consent: r.consent ?? false,
  source: r.source ?? null,
});

export const mapPost = (r: Row): Post => ({
  id: r.id,
  title: r.title,
  body: r.body,
  imageUrl: r.image_url ?? null,
  kind: r.kind,
  active: r.active ?? false,
  startsAt: r.starts_at ?? null,
  endsAt: r.ends_at ?? null,
  createdAt: r.created_at,
});

export const mapContact = (r: Row): ContactMessage => ({
  id: r.id,
  fullName: r.full_name,
  phone: r.phone ?? null,
  email: r.email,
  subject: r.subject,
  message: r.message,
  handled: r.handled ?? false,
  createdAt: r.created_at,
});

export const mapScreenshot = (r: Row): AppScreenshot => ({
  id: r.id,
  imageUrl: r.image_url,
  caption: r.caption ?? null,
  sortOrder: r.sort_order ?? 0,
});

export const mapSettings = (r: Row | null, screenshots: AppScreenshot[]): SiteSettings => ({
  heroTitle: r?.hero_title ?? demoSettings.heroTitle,
  heroSubtitle: r?.hero_subtitle ?? demoSettings.heroSubtitle,
  heroImageUrl: r?.hero_image_url ?? null,
  sloganMain: r?.slogan_main ?? demoSettings.sloganMain,
  sloganLoyalty: r?.slogan_loyalty ?? demoSettings.sloganLoyalty,
  appStoreUrl: r?.app_store_url || null,
  playStoreUrl: r?.play_store_url || null,
  whatsappNumber: r?.whatsapp_number || null,
  contactEmail: r?.contact_email || null,
  contactPhone: r?.contact_phone || null,
  aboutText: r?.about_text ?? demoSettings.aboutText,
  facebookUrl: r?.facebook_url || null,
  instagramUrl: r?.instagram_url || null,
  tiktokUrl: r?.tiktok_url || null,
  appScreenshots: screenshots,
});

export const mapProfile = (r: Row): Profile => ({
  id: r.id,
  email: r.email,
  fullName: r.full_name ?? null,
  role: r.role,
});

export const mapAudit = (r: Row): AuditLog => ({
  id: r.id,
  actorId: r.actor_id ?? null,
  actorEmail: r.actor_email ?? null,
  action: r.action,
  entity: r.entity,
  entityId: r.entity_id ?? null,
  details: r.details ?? null,
  createdAt: r.created_at,
});

export type Role = "admin" | "manager";

export interface OpeningHour {
  day: string; // "Lundi" ...
  open: string | null; // "10:00"
  close: string | null; // "23:00"
}

export interface Establishment {
  id: string;
  slug: string;
  name: string;
  district: string;
  address: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  mapsUrl: string | null;
  description: string | null;
  hours: OpeningHour[];
  photos: string[];
  isDemo: boolean;
  sortOrder: number;
}

export interface MenuCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sortOrder: number;
}

export interface Dish {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  priceFcfa: number | null;
  imageUrl: string | null;
  available: boolean;
  featured: boolean;
  isDemo: boolean;
  sortOrder: number;
}

export interface Room {
  id: string;
  establishmentId: string | null;
  name: string;
  description: string | null;
  capacity: number | null;
  equipment: string[];
  conditions: string | null;
  priceFcfa: number | null;
  priceNote: string | null;
  photos: string[];
  active: boolean;
  isDemo: boolean;
  sortOrder: number;
}

export type ReservationStatus = "pending" | "confirmed" | "refused" | "counter_proposed" | "cancelled";

export interface ReservationRequest {
  id: string;
  reference: string;
  status: ReservationStatus;
  fullName: string;
  phone: string;
  email: string;
  roomId: string | null;
  roomName: string | null;
  eventType: string;
  eventDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  guests: number;
  specialNeeds: string | null;
  message: string | null;
  proposedDate: string | null;
  proposedStartTime: string | null;
  proposedEndTime: string | null;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export type GalleryCategory = "plats" | "salles" | "evenements" | "ambiance" | "equipe";

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string | null;
  category: GalleryCategory;
  isDemo: boolean;
  sortOrder: number;
}

export interface Testimonial {
  id: string;
  author: string;
  rating: number; // 1..5
  comment: string;
  date: string; // YYYY-MM-DD
  published: boolean;
  consent: boolean;
  source: string | null;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  imageUrl: string | null;
  kind: "promotion" | "actualite";
  active: boolean;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  phone: string | null;
  email: string;
  subject: string;
  message: string;
  handled: boolean;
  createdAt: string;
}

export interface AppScreenshot {
  id: string;
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string | null;
  sloganMain: string;
  sloganLoyalty: string;
  appStoreUrl: string | null;
  playStoreUrl: string | null;
  whatsappNumber: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  aboutText: string;
  facebookUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  appScreenshots: AppScreenshot[];
}

export interface AuditLog {
  id: string;
  actorId: string | null;
  actorEmail: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  details: Record<string, unknown> | null;
  createdAt: string;
}

export interface Profile {
  id: string;
  email: string;
  fullName: string | null;
  role: Role;
}

export interface SiteStats {
  viewsLast30Days: number;
  viewsLast7Days: number;
  viewsToday: number;
  topPages: { path: string; views: number }[];
  dailySeries: { date: string; views: number }[];
  pendingReservations: number;
  unreadMessages: number;
}

export const EVENT_TYPES = [
  "Anniversaire",
  "Réunion professionnelle",
  "Repas d'entreprise",
  "Cérémonie familiale",
  "Réception privée",
  "Autre événement",
] as const;

export const GALLERY_CATEGORIES: { value: GalleryCategory; label: string }[] = [
  { value: "plats", label: "Nos plats" },
  { value: "salles", label: "Salles et espaces" },
  { value: "evenements", label: "Événements" },
  { value: "ambiance", label: "Ambiance" },
  { value: "equipe", label: "Équipe et cuisines" },
];

export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: "En attente de confirmation",
  confirmed: "Confirmée",
  refused: "Refusée",
  counter_proposed: "Autre date proposée",
  cancelled: "Annulée",
};

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFcfa(amount: number | null | undefined): string | null {
  if (amount === null || amount === undefined) return null;
  return `${new Intl.NumberFormat("fr-FR").format(amount)} FCFA`;
}

export function formatDateFr(iso: string | Date, opts?: Intl.DateTimeFormatOptions): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...opts,
  }).format(d);
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Génère un numéro de référence lisible : SKD-20260105-7F3A */
export function generateReference(prefix = "SKD"): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(16).slice(2, 6).toUpperCase();
  return `${prefix}-${ymd}-${rand}`;
}

/** Normalise un numéro de téléphone pour WhatsApp (chiffres uniquement). */
export function toWhatsappNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}

export function whatsappLink(number: string, message: string): string {
  return `https://wa.me/${toWhatsappNumber(number)}?text=${encodeURIComponent(message)}`;
}

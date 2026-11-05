import { z } from "zod";
import { EVENT_TYPES } from "./types";

const phone = z
  .string()
  .trim()
  .min(8, "Numéro de téléphone trop court.")
  .max(20, "Numéro de téléphone trop long.")
  .regex(/^[+0-9 ().-]+$/, "Numéro de téléphone invalide.");

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Heure invalide.");

export const reservationSchema = z
  .object({
    fullName: z.string().trim().min(3, "Veuillez indiquer votre nom et prénom.").max(120),
    phone,
    email: z.string().trim().email("Adresse e-mail invalide.").max(160),
    roomId: z.string().trim().max(80).optional().or(z.literal("")),
    eventType: z.enum(EVENT_TYPES, { message: "Veuillez choisir un type d'événement." }),
    eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide."),
    startTime: time,
    endTime: time,
    guests: z.coerce.number().int().min(1, "Au moins 1 invité.").max(5000, "Nombre d'invités trop élevé."),
    specialNeeds: z.string().trim().max(1000).optional().or(z.literal("")),
    message: z.string().trim().max(2000).optional().or(z.literal("")),
    consent: z.literal("on", { message: "Veuillez accepter la politique de confidentialité." }),
  })
  .refine((d) => d.endTime > d.startTime, { message: "L'heure de fin doit être après l'heure de début.", path: ["endTime"] })
  .refine(
    (d) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(d.eventDate + "T00:00:00") >= today;
    },
    { message: "La date doit être aujourd'hui ou ultérieure.", path: ["eventDate"] },
  );

export const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Veuillez indiquer votre nom.").max(120),
  phone: phone.optional().or(z.literal("")),
  email: z.string().trim().email("Adresse e-mail invalide.").max(160),
  subject: z.string().trim().min(2, "Veuillez indiquer un objet.").max(150),
  message: z.string().trim().min(10, "Votre message est trop court.").max(3000),
  consent: z.literal("on", { message: "Veuillez accepter la politique de confidentialité." }),
});

export type FieldErrors = Record<string, string | undefined>;

export function zodErrors(err: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of err.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

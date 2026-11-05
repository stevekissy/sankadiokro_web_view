"use client";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { AntiSpamFields, Field, FormAlert } from "./form-fields";

const initial: ContactState = { ok: false };

export function ContactForm({ establishmentNames }: { establishmentNames: Record<string, string> }) {
  const [state, action, pending] = useActionState(submitContact, initial);
  const params = useSearchParams();
  const etab = params.get("etablissement");
  const defaultSubject = etab && establishmentNames[etab] ? `Renseignements — ${establishmentNames[etab]}` : "";
  const err = state.errors ?? {};

  if (state.ok) {
    return (
      <FormAlert tone="success">
        <p className="font-semibold">{state.message}</p>
      </FormAlert>
    );
  }

  return (
    <form action={action} className="relative space-y-5" noValidate>
      <AntiSpamFields />
      {state.message && <FormAlert tone="error">{state.message}</FormAlert>}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nom et prénom" name="fullName" required error={err.fullName}>
          <input id="fullName" name="fullName" className="input" autoComplete="name" required />
        </Field>
        <Field label="Téléphone" name="phone" error={err.phone}>
          <input id="phone" name="phone" type="tel" className="input" autoComplete="tel" />
        </Field>
      </div>
      <Field label="Adresse e-mail" name="email" required error={err.email}>
        <input id="email" name="email" type="email" className="input" autoComplete="email" required />
      </Field>
      <Field label="Objet" name="subject" required error={err.subject}>
        <input id="subject" name="subject" className="input" defaultValue={defaultSubject} required list="subjects" />
        <datalist id="subjects">
          <option value="Renseignements" />
          <option value="Réservation de salle" />
          <option value="Commande" />
          <option value="Partenariat" />
          <option value="Avis client" />
        </datalist>
      </Field>
      <Field label="Message" name="message" required error={err.message}>
        <textarea id="message" name="message" className="input min-h-32" rows={5} required />
      </Field>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="consent" className="mt-1 h-4 w-4 accent-forest" required />
        <span>
          J&apos;accepte le traitement de mes données conformément à la{" "}
          <a href="/confidentialite" className="font-semibold text-forest underline" target="_blank">politique de confidentialité</a>.
        </span>
      </label>
      {err.consent && <p className="text-xs font-medium text-red-600" role="alert">{err.consent}</p>}
      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Send className="h-5 w-5" aria-hidden />}
        {pending ? "Envoi…" : "Envoyer le message"}
      </Button>
    </form>
  );
}

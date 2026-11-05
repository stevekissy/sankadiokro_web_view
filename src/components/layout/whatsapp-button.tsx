"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, X } from "lucide-react";
import { whatsappLink } from "@/lib/utils";

const MESSAGES = [
  { key: "info", label: "Demander des renseignements", text: "Bonjour Sankadiokro 👋, je souhaite obtenir des renseignements sur votre restaurant." },
  { key: "salle", label: "Réserver une salle", text: "Bonjour Sankadiokro 👋, je souhaite réserver une salle pour un événement. Pouvez-vous me renseigner sur les disponibilités ?" },
  { key: "commande", label: "Passer une commande", text: "Bonjour Sankadiokro 👋, je souhaite passer une commande. Pouvez-vous m'indiquer les plats disponibles ?" },
];

export function WhatsAppButton({ number }: { number: string | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  if (!number || pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            className="w-72 overflow-hidden rounded-2xl bg-white shadow-2xl"
            role="dialog"
            aria-label="Contacter Sankadiokro sur WhatsApp"
          >
            <div className="bg-[#25D366] px-4 py-3 text-white">
              <p className="font-semibold">Écrivez-nous sur WhatsApp</p>
              <p className="text-xs opacity-90">Réponse rapide pendant nos horaires d&apos;ouverture.</p>
            </div>
            <ul className="p-2">
              {MESSAGES.map((m) => (
                <li key={m.key}>
                  <a
                    href={whatsappLink(number, m.text)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-cream"
                  >
                    {m.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-emerald-900/30 transition hover:scale-105"
        aria-label={open ? "Fermer WhatsApp" : "Contacter sur WhatsApp"}
        aria-expanded={open}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-7 w-7" />}
      </button>
    </div>
  );
}

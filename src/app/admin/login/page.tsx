import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "./login-form";
import { isAdminDemoPreviewAllowed, isSupabaseConfigured } from "@/lib/env";
import { buttonClasses } from "@/components/ui/button";

export const metadata = { title: "Connexion — Administration" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const configured = isSupabaseConfigured();
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-soft">
        <div className="flex flex-col items-center text-center">
          <Image src="/images/logo-sankadiokro.png" alt="Restaurant Sankadiokro" width={72} height={72} className="rounded-2xl" />
          <h1 className="mt-4 font-display text-2xl font-semibold text-forest">Administration</h1>
          <p className="mt-1 text-sm text-ink-soft">Espace réservé au personnel autorisé.</p>
        </div>
        <div className="mt-8">
          {configured ? (
            <LoginForm next={next ?? "/admin"} />
          ) : (
            <div className="space-y-4 text-sm">
              <div className="rounded-xl bg-amber-50 p-4 text-amber-900">
                <p className="font-semibold">Supabase n&apos;est pas encore configuré.</p>
                <p className="mt-1">Copiez <code>.env.example</code> vers <code>.env.local</code>, renseignez vos clés Supabase, exécutez <code>supabase/schema.sql</code> puis redémarrez le serveur.</p>
              </div>
              {isAdminDemoPreviewAllowed() ? (
                <Link href="/admin" className={buttonClasses("primary", "md", "w-full")}>
                  Ouvrir l&apos;aperçu de l&apos;administration (démo)
                </Link>
              ) : (
                <p className="text-ink-soft">L&apos;aperçu de démonstration est désactivé en production.</p>
              )}
            </div>
          )}
        </div>
        <p className="mt-6 text-center text-xs text-ink-soft">
          <Link href="/" className="font-semibold text-forest hover:underline">← Retour au site</Link>
        </p>
      </div>
    </div>
  );
}

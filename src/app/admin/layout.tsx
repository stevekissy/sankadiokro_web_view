import { Suspense } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Flash } from "@/components/admin/flash";
import { getCurrentProfile } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { adminGetStats } from "@/lib/admin-data";

export const metadata = { title: "Administration", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) {
    // Page de connexion (ou accès refusé) : pas de barre latérale.
    return <div className="min-h-screen bg-cream">{children}</div>;
  }
  const stats = await adminGetStats();
  const badges = { "/admin/reservations": stats.pendingReservations, "/admin/messages": stats.unreadMessages };
  return (
    <div className="flex min-h-screen flex-col bg-cream lg:flex-row">
      <AdminSidebar profile={profile} badges={badges} />
      <div className="flex-1 lg:min-h-screen">
        {!isSupabaseConfigured() && (
          <div className="bg-amber-100 px-4 py-2 text-center text-xs font-medium text-amber-900">
            Aperçu en mode démonstration : les modifications ne sont pas enregistrées. Renseignez les variables Supabase dans <code>.env.local</code> et exécutez <code>supabase/schema.sql</code>.
          </div>
        )}
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">
          <Suspense>
            <Flash />
          </Suspense>
          {children}
        </div>
      </div>
    </div>
  );
}

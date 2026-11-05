import Link from "next/link";
import { CalendarCheck, Eye, Mail, TrendingUp, ArrowRight } from "lucide-react";
import { requireProfile } from "@/lib/auth";
import { adminGetReservations, adminGetStats } from "@/lib/admin-data";
import { Card, PageTitle, StatusPill, Empty } from "@/components/admin/ui";
import { StatsChart } from "@/components/admin/stats-chart";
import { formatDateFr } from "@/lib/utils";

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const profile = await requireProfile();
  const { error } = await searchParams;
  const [stats, pending] = await Promise.all([adminGetStats(), adminGetReservations("pending")]);

  const tiles = [
    { label: "Vues aujourd'hui", value: stats.viewsToday, icon: Eye },
    { label: "Vues sur 7 jours", value: stats.viewsLast7Days, icon: TrendingUp },
    { label: "Vues sur 30 jours", value: stats.viewsLast30Days, icon: TrendingUp },
    { label: "Réservations en attente", value: stats.pendingReservations, icon: CalendarCheck, href: "/admin/reservations?status=pending" },
    { label: "Messages non traités", value: stats.unreadMessages, icon: Mail, href: "/admin/messages" },
  ];

  return (
    <>
      <PageTitle title={`Bonjour ${profile.fullName || profile.email}`} description="Vue d'ensemble de l'activité du site." />
      {error === "forbidden" && <p role="alert" className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">Cette section est réservée aux administrateurs.</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {tiles.map((t) => {
          const inner = (
            <>
              <t.icon className="h-5 w-5 text-gold-dark" aria-hidden />
              <p className="mt-3 font-display text-3xl font-semibold text-forest">{t.value}</p>
              <p className="text-xs text-ink-soft">{t.label}</p>
            </>
          );
          return t.href ? (
            <Link key={t.label} href={t.href} className="rounded-2xl border border-ink/5 bg-white p-5 shadow-sm transition hover:border-gold">{inner}</Link>
          ) : (
            <div key={t.label} className="rounded-2xl border border-ink/5 bg-white p-5 shadow-sm">{inner}</div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card title="Fréquentation (30 derniers jours)" description="Vues de pages anonymes, hors administration.">
          {stats.viewsLast30Days ? <StatsChart series={stats.dailySeries} /> : <Empty>Aucune donnée pour le moment. Les statistiques apparaissent dès les premières visites (Supabase requis).</Empty>}
        </Card>
        <Card title="Pages les plus consultées">
          {stats.topPages.length ? (
            <ol className="space-y-2 text-sm">
              {stats.topPages.map((p) => (
                <li key={p.path} className="flex items-center justify-between gap-3 border-b border-ink/5 pb-2 last:border-0">
                  <span className="truncate font-mono text-xs">{p.path}</span>
                  <span className="font-semibold text-forest">{p.views}</span>
                </li>
              ))}
            </ol>
          ) : (
            <Empty>Pas encore de données.</Empty>
          )}
        </Card>
      </div>

      <Card className="mt-6" title="Demandes de réservation en attente" description="À confirmer, refuser ou reprogrammer.">
        {pending.length ? (
          <ul className="divide-y divide-ink/5">
            {pending.slice(0, 6).map((r) => (
              <li key={r.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{r.fullName} <span className="font-mono text-xs text-ink-soft">{r.reference}</span></p>
                  <p className="text-xs text-ink-soft">{r.eventType} · {formatDateFr(r.eventDate + "T00:00:00")} · {r.startTime}–{r.endTime} · {r.guests} invités · {r.roomName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill status={r.status} />
                  <Link href={`/admin/reservations?id=${r.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-forest hover:underline">
                    Traiter <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>Aucune demande en attente.</Empty>
        )}
      </Card>
    </>
  );
}

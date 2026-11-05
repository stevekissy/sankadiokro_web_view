import { requireProfile } from "@/lib/auth";
import { adminGetAuditLogs } from "@/lib/admin-data";
import { Card, PageTitle, Empty } from "@/components/admin/ui";
import { formatDateFr } from "@/lib/utils";

export default async function AuditAdmin() {
  await requireProfile("admin");
  const logs = await adminGetAuditLogs();
  return (
    <>
      <PageTitle title="Journal des actions" description="Historique des actions importantes réalisées dans l'administration." />
      <Card>
        {logs.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-ink/10 text-left text-xs uppercase tracking-wider text-ink-soft"><th className="py-2 pr-4">Date</th><th className="py-2 pr-4">Utilisateur</th><th className="py-2 pr-4">Action</th><th className="py-2 pr-4">Entité</th><th className="py-2">Détails</th></tr></thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id} className="border-b border-ink/5 align-top">
                    <td className="whitespace-nowrap py-2 pr-4 text-xs">{formatDateFr(l.createdAt, { hour: "2-digit", minute: "2-digit" })}</td>
                    <td className="py-2 pr-4 text-xs">{l.actorEmail ?? "—"}</td>
                    <td className="py-2 pr-4 font-mono text-xs">{l.action}</td>
                    <td className="py-2 pr-4 text-xs">{l.entity}{l.entityId ? ` · ${l.entityId.slice(0, 8)}` : ""}</td>
                    <td className="py-2 font-mono text-[11px] text-ink-soft">{l.details ? JSON.stringify(l.details) : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty>Aucune action enregistrée.</Empty>
        )}
      </Card>
    </>
  );
}

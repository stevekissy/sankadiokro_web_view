import { requireProfile } from "@/lib/auth";
import { adminGetMessages } from "@/lib/admin-data";
import { toggleMessageHandled } from "@/app/actions/admin";
import { Card, PageTitle, Empty } from "@/components/admin/ui";
import { formatDateFr, cn } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/env";

export default async function MessagesAdmin() {
  await requireProfile();
  const messages = await adminGetMessages();
  return (
    <>
      <PageTitle title="Messages de contact" description="Demandes reçues via le formulaire de contact." />
      <Card>
        {!isSupabaseConfigured() && <Empty>Les messages seront visibles ici une fois Supabase configuré.</Empty>}
        {isSupabaseConfigured() && !messages.length && <Empty>Aucun message pour le moment.</Empty>}
        <ul className="divide-y divide-ink/5">
          {messages.map((m) => (
            <li key={m.id} className={cn("py-4", m.handled && "opacity-60")}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{m.subject}</p>
                  <p className="text-xs text-ink-soft">
                    {m.fullName} · <a href={`mailto:${m.email}`} className="text-forest hover:underline">{m.email}</a>
                    {m.phone && <> · <a href={`tel:${m.phone}`} className="text-forest hover:underline">{m.phone}</a></>} · {formatDateFr(m.createdAt, { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm">{m.message}</p>
                </div>
                <form action={toggleMessageHandled} className="shrink-0">
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="handled" value={m.handled ? "false" : "true"} />
                  <button type="submit" className={cn("rounded-full px-3.5 py-1.5 text-xs font-semibold", m.handled ? "bg-ink/10" : "bg-forest text-white")}>
                    {m.handled ? "Rouvrir" : "Marquer traité"}
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}

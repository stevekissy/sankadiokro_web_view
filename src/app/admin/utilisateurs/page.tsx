import { requireProfile } from "@/lib/auth";
import { adminGetProfiles } from "@/lib/admin-data";
import { updateUserRole, inviteUser } from "@/app/actions/admin";
import { Card, PageTitle, Input, Select } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";

export default async function UsersAdmin() {
  const me = await requireProfile("admin");
  const profiles = await adminGetProfiles();
  return (
    <>
      <PageTitle title="Utilisateurs & rôles" description="Administrateur : accès complet. Gestionnaire : gestion des contenus et des demandes, sans gestion des utilisateurs ni du journal." />
      <Card title="Inviter un membre du personnel" className="mb-6">
        <form action={inviteUser} className="grid gap-4 md:grid-cols-4">
          <Input label="E-mail" name="email" type="email" required />
          <Input label="Nom complet" name="fullName" />
          <Select label="Rôle" name="role" defaultValue="manager" options={[{ value: "manager", label: "Gestionnaire" }, { value: "admin", label: "Administrateur" }]} />
          <div className="flex items-end"><Button type="submit" size="sm">Envoyer l&apos;invitation</Button></div>
        </form>
      </Card>
      <Card title={`Comptes (${profiles.length})`}>
        <ul className="divide-y divide-ink/5">
          {profiles.map((p) => (
            <li key={p.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">{p.fullName || "—"} {p.id === me.id && <span className="text-xs text-ink-soft">(vous)</span>}</p>
                <p className="text-xs text-ink-soft">{p.email}</p>
              </div>
              <form action={updateUserRole} className="flex items-center gap-2">
                <input type="hidden" name="id" value={p.id} />
                <select name="role" defaultValue={p.role} className="input py-2 text-sm">
                  <option value="manager">Gestionnaire</option>
                  <option value="admin">Administrateur</option>
                </select>
                <Button type="submit" size="sm" variant="outline">Mettre à jour</Button>
              </form>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}

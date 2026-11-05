import { requireProfile } from "@/lib/auth";
import { adminGetRooms, adminGetEstablishments } from "@/lib/admin-data";
import { saveRoom, deleteRoom } from "@/app/actions/admin";
import { Card, PageTitle, Input, Textarea, Select, Checkbox, Details, Empty } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { ImageUpload } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Establishment, Room } from "@/lib/types";

function RoomForm({ room, establishments }: { room?: Room; establishments: Establishment[] }) {
  return (
    <form action={saveRoom} className="grid gap-4 md:grid-cols-2">
      {room && <input type="hidden" name="id" value={room.id} />}
      <Input label="Nom de la salle" name="name" defaultValue={room?.name} required />
      <Select label="Établissement" name="establishmentId" defaultValue={room?.establishmentId ?? ""} options={[{ value: "", label: "— Aucun —" }, ...establishments.map((e) => ({ value: e.id, label: e.name }))]} />
      <Textarea label="Description" name="description" defaultValue={room?.description} className="md:col-span-2" />
      <Input label="Capacité (personnes)" name="capacity" type="number" min={1} defaultValue={room?.capacity} />
      <Input label="Ordre d'affichage" name="sortOrder" type="number" defaultValue={room?.sortOrder ?? 0} />
      <Textarea label="Équipements (un par ligne)" name="equipment" defaultValue={room?.equipment.join("\n")} />
      <Textarea label="Conditions de location" name="conditions" defaultValue={room?.conditions} />
      <Input label="Tarif (FCFA)" name="priceFcfa" type="number" min={0} defaultValue={room?.priceFcfa} hint="Laissez vide pour afficher « Tarif sur devis »." />
      <Input label="Précision tarif" name="priceNote" defaultValue={room?.priceNote} placeholder="Ex. par journée, hors traiteur" />
      <div className="md:col-span-2"><ImageUpload name="photo_upload" label="Téléverser une photo (copiez ensuite l'URL ci-dessous)" folder="salles" hint="Après téléversement, copiez l'URL dans le champ « Photos »." /></div>
      <Textarea label="Photos (une URL par ligne)" name="photos" defaultValue={room?.photos.join("\n")} className="md:col-span-2" />
      <Checkbox label="Salle active (visible sur le site)" name="active" defaultChecked={room?.active ?? true} />
      <div className="md:col-span-2"><Button type="submit" size="sm">{room ? "Enregistrer" : "Ajouter la salle"}</Button></div>
    </form>
  );
}

export default async function RoomsAdmin() {
  await requireProfile();
  const [rooms, establishments] = await Promise.all([adminGetRooms(), adminGetEstablishments()]);
  return (
    <>
      <PageTitle title="Salles & espaces" description="Gérez les salles proposées à la location : capacité, équipements, conditions, tarifs et photos." />
      <Card title="Ajouter une salle" className="mb-6"><RoomForm establishments={establishments} /></Card>
      <Card title={`Salles existantes (${rooms.length})`}>
        {rooms.length ? (
          <ul className="space-y-2">
            {rooms.map((r) => (
              <li key={r.id}>
                <Details summary={<span className="flex items-center gap-2">{r.name}{!r.active && <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[10px] font-bold">Inactive</span>}<span className="ml-auto text-xs text-ink-soft">{establishments.find((e) => e.id === r.establishmentId)?.district ?? ""}</span></span>}>
                  <RoomForm room={r} establishments={establishments} />
                  <form action={deleteRoom} className="mt-3"><input type="hidden" name="id" value={r.id} /><ConfirmButton message={`Supprimer « ${r.name} » ?`}><Trash2 className="h-3.5 w-3.5" /> Supprimer</ConfirmButton></form>
                </Details>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>Aucune salle.</Empty>
        )}
      </Card>
    </>
  );
}

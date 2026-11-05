import { requireProfile } from "@/lib/auth";
import { adminGetEstablishments } from "@/lib/admin-data";
import { saveEstablishment } from "@/app/actions/admin";
import { Card, PageTitle, Input, Textarea, Details } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import type { Establishment } from "@/lib/types";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

function EstablishmentForm({ e }: { e?: Establishment }) {
  return (
    <form action={saveEstablishment} className="grid gap-4 md:grid-cols-2">
      {e && <input type="hidden" name="id" value={e.id} />}
      <Input label="Nom" name="name" defaultValue={e?.name} required placeholder="Sankadiokro — Quartier" />
      <Input label="Slug (URL)" name="slug" defaultValue={e?.slug} hint="Ex. yopougon-millionnaire" />
      <Input label="Quartier / commune" name="district" defaultValue={e?.district} placeholder="Yopougon Millionnaire, Abidjan" />
      <Input label="Adresse exacte" name="address" defaultValue={e?.address} placeholder="Rue, repère, commune" />
      <Input label="Téléphone" name="phone" type="tel" defaultValue={e?.phone} placeholder="+225 …" />
      <Input label="WhatsApp" name="whatsapp" type="tel" defaultValue={e?.whatsapp} placeholder="+225 …" />
      <Input label="E-mail" name="email" type="email" defaultValue={e?.email} />
      <Input label="Lien Google Maps" name="mapsUrl" type="url" defaultValue={e?.mapsUrl} placeholder="https://maps.app.goo.gl/… ou https://www.google.com/maps/…" hint="Collez le lien de partage Google Maps ou un lien « embed »." />
      <Textarea label="Description" name="description" defaultValue={e?.description} className="md:col-span-2" />
      <Input label="Ordre" name="sortOrder" type="number" defaultValue={e?.sortOrder ?? 0} />
      <fieldset className="md:col-span-2 rounded-xl border border-ink/10 p-4">
        <legend className="px-1 text-sm font-semibold">Horaires d&apos;ouverture</legend>
        <div className="grid gap-2">
          {DAYS.map((day) => {
            const h = e?.hours.find((x) => x.day === day);
            return (
              <div key={day} className="grid grid-cols-[90px_1fr_1fr_auto] items-center gap-2 text-sm">
                <span className="font-medium">{day}</span>
                <input type="time" name={`open_${day}`} defaultValue={h?.open ?? ""} className="input py-2" aria-label={`${day} ouverture`} />
                <input type="time" name={`close_${day}`} defaultValue={h?.close ?? ""} className="input py-2" aria-label={`${day} fermeture`} />
                <label className="flex items-center gap-1 text-xs"><input type="checkbox" name={`closed_${day}`} defaultChecked={Boolean(e && h && !h.open)} className="accent-forest" /> Fermé</label>
              </div>
            );
          })}
        </div>
      </fieldset>
      <div className="md:col-span-2"><ImageUpload name="photo_upload" label="Téléverser une photo" folder="etablissements" hint="Copiez ensuite l'URL obtenue dans la liste des photos ci-dessous." /></div>
      <Textarea label="Photos (une URL par ligne, la première est la photo principale)" name="photos" defaultValue={e?.photos.join("\n")} className="md:col-span-2" />
      <div className="md:col-span-2"><Button type="submit" size="sm">{e ? "Enregistrer" : "Ajouter l'établissement"}</Button></div>
    </form>
  );
}

export default async function EstablishmentsAdmin() {
  await requireProfile();
  const list = await adminGetEstablishments();
  return (
    <>
      <PageTitle title="Établissements" description="Adresse exacte, horaires, téléphone, photos et lien Google Maps de chaque établissement. Ces informations alimentent aussi le référencement local." />
      <div className="space-y-4">
        {list.map((e) => (
          <Card key={e.id} title={e.name} description={e.address ?? "Adresse exacte à renseigner"}>
            <Details summary="Modifier la fiche" open={false}><EstablishmentForm e={e} /></Details>
          </Card>
        ))}
      </div>
      <Card title="Ajouter un établissement" className="mt-6"><Details summary="Nouvel établissement"><EstablishmentForm /></Details></Card>
    </>
  );
}

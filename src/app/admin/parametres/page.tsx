import Image from "next/image";
import { requireProfile } from "@/lib/auth";
import { adminGetSettings } from "@/lib/admin-data";
import { saveSettings, saveScreenshot, deleteScreenshot } from "@/app/actions/admin";
import { Card, PageTitle, Input, Textarea, Empty } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/image-upload";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default async function SettingsAdmin() {
  await requireProfile();
  const s = await adminGetSettings();
  return (
    <>
      <PageTitle title="Paramètres du site" description="Textes de la page d'accueil, liens officiels de l'application, WhatsApp, coordonnées et réseaux sociaux." />
      <form action={saveSettings} className="space-y-6">
        <Card title="Page d'accueil">
          <div className="grid gap-4">
            <Input label="Titre principal" name="heroTitle" defaultValue={s.heroTitle} />
            <Textarea label="Sous-titre" name="heroSubtitle" defaultValue={s.heroSubtitle} />
            <ImageUpload name="heroImageUrl" label="Grande photographie d'accueil" defaultValue={s.heroImageUrl} folder="accueil" hint="Photo immersive d'un plat ivoirien (format paysage, 1920 px de large conseillé)." />
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Slogan principal" name="sloganMain" defaultValue={s.sloganMain} />
              <Input label="Slogan de fidélité" name="sloganLoyalty" defaultValue={s.sloganLoyalty} />
            </div>
            <Textarea label="Texte « Notre restaurant »" name="aboutText" defaultValue={s.aboutText} rows={5} />
          </div>
        </Card>
        <Card title="Application mobile" description="Ne renseignez un lien que lorsque l'application est réellement publiée : les boutons restent inactifs tant que le champ est vide.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Lien App Store" name="appStoreUrl" type="url" defaultValue={s.appStoreUrl} placeholder="https://apps.apple.com/…" />
            <Input label="Lien Google Play" name="playStoreUrl" type="url" defaultValue={s.playStoreUrl} placeholder="https://play.google.com/store/apps/details?id=…" />
          </div>
        </Card>
        <Card title="Contact & WhatsApp">
          <div className="grid gap-4 md:grid-cols-3">
            <Input label="Numéro WhatsApp officiel" name="whatsappNumber" type="tel" defaultValue={s.whatsappNumber} placeholder="+225 07 00 00 00 00" hint="Le bouton flottant n'apparaît que si ce numéro est renseigné." />
            <Input label="Téléphone de contact" name="contactPhone" type="tel" defaultValue={s.contactPhone} />
            <Input label="E-mail de contact" name="contactEmail" type="email" defaultValue={s.contactEmail} />
          </div>
        </Card>
        <Card title="Réseaux sociaux">
          <div className="grid gap-4 md:grid-cols-3">
            <Input label="Facebook" name="facebookUrl" type="url" defaultValue={s.facebookUrl} />
            <Input label="Instagram" name="instagramUrl" type="url" defaultValue={s.instagramUrl} />
            <Input label="TikTok" name="tiktokUrl" type="url" defaultValue={s.tiktokUrl} />
          </div>
        </Card>
        <Button type="submit">Enregistrer les paramètres</Button>
      </form>

      <Card title="Captures d'écran de l'application" description="Affichées dans les maquettes de smartphones (format portrait 9:19 conseillé). Les trois premières apparaissent sur l'accueil." className="mt-8">
        <form action={saveScreenshot} className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-3"><ImageUpload name="imageUrl" label="Capture" folder="application" /></div>
          <Input label="Légende" name="caption" placeholder="Ex. Commande en 3 clics" />
          <Input label="Ordre" name="sortOrder" type="number" defaultValue={s.appScreenshots.length + 1} />
          <div className="flex items-end"><Button type="submit" size="sm">Ajouter</Button></div>
        </form>
        {s.appScreenshots.length ? (
          <ul className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {s.appScreenshots.map((sc) => (
              <li key={sc.id} className="rounded-xl border border-ink/10 p-3">
                <div className="relative mx-auto aspect-[9/19] w-28 overflow-hidden rounded-xl bg-cream"><Image src={sc.imageUrl} alt={sc.caption ?? ""} fill sizes="120px" className="object-cover" unoptimized /></div>
                <form action={saveScreenshot} className="mt-2 space-y-2">
                  <input type="hidden" name="id" value={sc.id} />
                  <input type="hidden" name="imageUrl" value={sc.imageUrl} />
                  <Input label="Légende" name="caption" defaultValue={sc.caption} />
                  <Input label="Ordre" name="sortOrder" type="number" defaultValue={sc.sortOrder} />
                  <Button type="submit" size="sm" variant="outline">Enregistrer</Button>
                </form>
                <form action={deleteScreenshot} className="mt-1"><input type="hidden" name="id" value={sc.id} /><ConfirmButton message="Supprimer cette capture ?"><Trash2 className="h-3.5 w-3.5" /> Supprimer</ConfirmButton></form>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>Aucune capture d&apos;écran : les maquettes affichent un visuel de démonstration.</Empty>
        )}
      </Card>
    </>
  );
}

import { PageHero } from "@/components/ui/page-hero";
import { Container, Section } from "@/components/ui/container";
import { pageMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/content";

export const metadata = pageMetadata("Politique de confidentialité", "Comment Restaurant Sankadiokro collecte, utilise et protège vos données personnelles.", "/confidentialite");

export default async function PrivacyPage() {
  const settings = await getSettings();
  const contact = settings.contactEmail ?? "l'adresse de contact indiquée sur la page Contact";
  return (
    <>
      <PageHero eyebrow="Informations légales" title="Politique de confidentialité" />
      <Section className="bg-cream">
        <Container className="max-w-3xl">
          <div className="prose prose-lg max-w-none rounded-3xl bg-white p-8 shadow-card md:p-12 [&_h2]:font-display [&_h2]:text-forest [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:text-ink-soft [&_p]:leading-relaxed [&_li]:text-ink-soft">
            <p>Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long" })}</p>
            <h2>1. Responsable du traitement</h2>
            <p>Les données collectées sur ce site sont traitées par Restaurant Sankadiokro, Abidjan, Côte d&apos;Ivoire. Pour toute question : {contact}.</p>
            <h2>2. Données collectées</h2>
            <ul>
              <li><strong>Demandes de réservation de salle</strong> : nom, prénom, téléphone, e-mail, détails de l&apos;événement.</li>
              <li><strong>Formulaire de contact</strong> : nom, téléphone, e-mail, message.</li>
              <li><strong>Statistiques de fréquentation</strong> : pages consultées et empreinte technique anonymisée (non réversible, renouvelée chaque jour). Aucun cookie publicitaire n&apos;est déposé.</li>
            </ul>
            <h2>3. Finalités</h2>
            <p>Ces données servent uniquement à traiter vos demandes (réservation, renseignement), à vous répondre, et à améliorer le site. Elles ne sont jamais vendues ni cédées à des tiers à des fins commerciales.</p>
            <h2>4. Destinataires et sous-traitants</h2>
            <p>Les données sont hébergées chez notre prestataire de base de données (Supabase) et notre service d&apos;envoi d&apos;e-mails transactionnels. Seul le personnel autorisé du restaurant y accède, via une administration sécurisée.</p>
            <h2>5. Durée de conservation</h2>
            <p>Les demandes de réservation et messages sont conservés au maximum 24 mois après leur traitement. Les statistiques anonymes sont conservées 13 mois.</p>
            <h2>6. Vos droits</h2>
            <p>Conformément à la loi ivoirienne n° 2013-450 relative à la protection des données à caractère personnel, vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;opposition et de suppression de vos données. Pour l&apos;exercer, contactez-nous à {contact}.</p>
            <h2>7. WhatsApp et applications tierces</h2>
            <p>Le bouton WhatsApp ouvre l&apos;application WhatsApp : les échanges y sont soumis à la politique de confidentialité de WhatsApp. Les liens vers l&apos;App Store et Google Play renvoient vers les boutiques d&apos;applications concernées.</p>
            <h2>8. Sécurité</h2>
            <p>Nous appliquons des mesures techniques raisonnables : connexions chiffrées (HTTPS), contrôles d&apos;accès à la base de données, limitation des soumissions abusives et journalisation des actions d&apos;administration.</p>
          </div>
        </Container>
      </Section>
    </>
  );
}

/**
 * Contenu de DÉMONSTRATION utilisé lorsque Supabase n'est pas configuré.
 * Tout ce qui est marqué isDemo / "à renseigner" doit être remplacé par
 * le restaurant depuis l'administration. Aucun prix, adresse exacte, numéro
 * de téléphone ou lien officiel n'est inventé.
 */
import type {
  Dish,
  Establishment,
  GalleryItem,
  MenuCategory,
  Post,
  ReservationRequest,
  Room,
  SiteSettings,
  Testimonial,
} from "./types";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export const demoSettings: SiteSettings = {
  heroTitle: "Découvrez l'authenticité de la cuisine ivoirienne",
  heroSubtitle:
    "Grillades au feu de bois, kédjénou mijoté, attiéké frais et soupes traditionnelles : à Yopougon Millionnaire et à Cocody Saint-Jean, Sankadiokro vous accueille dans une ambiance chaleureuse pour partager le vrai goût de chez nous.",
  heroImageUrl: null,
  sloganMain: "Sankadiokro, le goût authentique de chez nous.",
  sloganLoyalty: "Plus tu manges, plus tu économises.",
  appStoreUrl: null,
  playStoreUrl: null,
  whatsappNumber: null,
  contactEmail: null,
  contactPhone: null,
  aboutText:
    "Restaurant Sankadiokro est né d'une passion : faire découvrir et partager la richesse de la gastronomie ivoirienne, préparée avec des produits frais et des recettes transmises de génération en génération. Nos deux établissements, à Yopougon Millionnaire et à Cocody Saint-Jean, réunissent familles, amis et collègues autour de grillades, de kédjénou, de soupes et d'accompagnements faits maison.",
  facebookUrl: null,
  instagramUrl: null,
  tiktokUrl: null,
  appScreenshots: [],
};

export const demoEstablishments: Establishment[] = [
  {
    id: "demo-yopougon",
    slug: "yopougon-millionnaire",
    name: "Sankadiokro — Yopougon Millionnaire",
    district: "Yopougon Millionnaire, Abidjan",
    address: null,
    phone: null,
    whatsapp: null,
    email: null,
    mapsUrl: null,
    description:
      "Notre établissement historique, au cœur de Yopougon Millionnaire. Grandes tablées, grillades au feu de bois et espace de réception pour vos événements.",
    hours: DAYS.map((day) => ({ day, open: null, close: null })),
    photos: [],
    isDemo: true,
    sortOrder: 1,
  },
  {
    id: "demo-cocody",
    slug: "cocody-saint-jean",
    name: "Sankadiokro — Cocody Saint-Jean",
    district: "Cocody Saint-Jean, Abidjan",
    address: null,
    phone: null,
    whatsapp: null,
    email: null,
    mapsUrl: null,
    description:
      "Notre adresse de Cocody Saint-Jean : la même cuisine authentique dans un cadre moderne et convivial, idéal pour les déjeuners d'affaires et les repas en famille.",
    hours: DAYS.map((day) => ({ day, open: null, close: null })),
    photos: [],
    isDemo: true,
    sortOrder: 2,
  },
];

export const demoCategories: MenuCategory[] = [
  { id: "cat-grillades", slug: "grillades", name: "Grillades", description: "Cuites au feu de bois, marinées aux épices de chez nous.", sortOrder: 1 },
  { id: "cat-soupes", slug: "soupes", name: "Soupes traditionnelles", description: "Mijotées longuement, servies bien chaudes.", sortOrder: 2 },
  { id: "cat-kedjenou", slug: "kedjenou", name: "Kédjénou", description: "Le plat emblématique ivoirien, cuit à l'étouffée dans son jus.", sortOrder: 3 },
  { id: "cat-accompagnements", slug: "accompagnements", name: "Accompagnements", description: "Préparés chaque jour pour accompagner vos plats.", sortOrder: 4 },
  { id: "cat-specialites", slug: "specialites", name: "Spécialités de la maison", description: "Les créations signature de Sankadiokro.", sortOrder: 5 },
];

const dish = (
  id: string,
  categoryId: string,
  name: string,
  description: string,
  extra: Partial<Dish> = {},
): Dish => ({
  id,
  categoryId,
  name,
  description,
  priceFcfa: null,
  imageUrl: null,
  available: true,
  featured: false,
  isDemo: true,
  sortOrder: 0,
  ...extra,
});

export const demoDishes: Dish[] = [
  dish("d-poulet-braise", "cat-grillades", "Poulet braisé", "Poulet entier mariné, braisé lentement au feu de bois, servi avec sa sauce tomate-oignons.", { featured: true, sortOrder: 1 }),
  dish("d-pintade", "cat-grillades", "Pintade braisée", "Pintade fermière grillée, chair tendre et goût prononcé.", { featured: true, sortOrder: 2 }),
  dish("d-carpe", "cat-grillades", "Carpe braisée", "Carpe fraîche farcie aux épices, braisée et servie avec oignons et piment.", { sortOrder: 3 }),
  dish("d-capitaine", "cat-grillades", "Capitaine braisé", "Le roi des poissons de lagune, braisé à la perfection.", { featured: true, sortOrder: 4 }),
  dish("d-machoiron", "cat-grillades", "Mâchoiron braisé", "Poisson-chat de lagune, chair fondante, braisé aux épices.", { sortOrder: 5 }),
  dish("d-lapin", "cat-grillades", "Lapin braisé", "Lapin mariné et grillé, une spécialité appréciée des connaisseurs.", { sortOrder: 6 }),
  dish("d-soupe-poisson", "cat-soupes", "Soupe de poisson", "Bouillon parfumé au poisson frais, tomates et aromates.", { sortOrder: 1 }),
  dish("d-soupe-pintade", "cat-soupes", "Soupe de pintade", "Pintade mijotée dans un bouillon relevé, à savourer avec du foutou.", { sortOrder: 2 }),
  dish("d-sauce-graine", "cat-soupes", "Sauce graine", "Sauce traditionnelle à base de noix de palme, viande ou poisson fumé.", { sortOrder: 3 }),
  dish("d-kedjenou-poulet", "cat-kedjenou", "Kédjénou de poulet", "Poulet cuit à l'étouffée avec légumes et épices, sans ajout d'eau : tout le goût concentré.", { featured: true, sortOrder: 1 }),
  dish("d-kedjenou-pintade", "cat-kedjenou", "Kédjénou de pintade", "La version pintade du plat emblématique, encore plus savoureuse.", { sortOrder: 2 }),
  dish("d-attieke", "cat-accompagnements", "Attiéké", "Semoule de manioc fraîche, l'accompagnement incontournable.", { sortOrder: 1 }),
  dish("d-alloco", "cat-accompagnements", "Alloco", "Bananes plantain mûres frites, dorées et fondantes.", { sortOrder: 2 }),
  dish("d-foutou", "cat-accompagnements", "Foutou", "Foutou banane ou igname pilé à la main.", { sortOrder: 3 }),
  dish("d-riz", "cat-accompagnements", "Riz", "Riz blanc parfumé ou riz gras selon disponibilité.", { sortOrder: 4 }),
  dish("d-frites", "cat-accompagnements", "Frites", "Frites maison croustillantes.", { sortOrder: 5 }),
  dish("d-igname", "cat-accompagnements", "Igname", "Igname bouillie ou frite.", { sortOrder: 6 }),
  dish("d-plateau", "cat-specialites", "Plateau Sankadiokro", "Assortiment de grillades à partager, avec attiéké, alloco et sauces maison.", { featured: true, sortOrder: 1 }),
  dish("d-garba", "cat-specialites", "Garba de la maison", "Attiéké et thon frit, revisités façon Sankadiokro.", { sortOrder: 2 }),
];

export const demoRooms: Room[] = [
  {
    id: "room-yop-reception",
    establishmentId: "demo-yopougon",
    name: "Salle de réception — Yopougon",
    description: "Grande salle climatisée adaptée aux anniversaires, cérémonies familiales et réceptions privées.",
    capacity: null,
    equipment: ["Climatisation", "Sonorisation", "Tables et chaises", "Service traiteur Sankadiokro"],
    conditions: "Conditions, acompte et tarifs communiqués sur devis après validation de la demande.",
    priceFcfa: null,
    priceNote: "Tarif sur devis",
    photos: [],
    active: true,
    isDemo: true,
    sortOrder: 1,
  },
  {
    id: "room-cocody-pro",
    establishmentId: "demo-cocody",
    name: "Espace professionnel — Cocody Saint-Jean",
    description: "Espace privatisable pour réunions, séminaires et repas d'entreprise.",
    capacity: null,
    equipment: ["Climatisation", "Écran de projection", "Wi-Fi", "Pause-café et déjeuner"],
    conditions: "Conditions, acompte et tarifs communiqués sur devis après validation de la demande.",
    priceFcfa: null,
    priceNote: "Tarif sur devis",
    photos: [],
    active: true,
    isDemo: true,
    sortOrder: 2,
  },
];

export const demoGallery: GalleryItem[] = [];

/** Aucun faux témoignage : la liste reste vide tant que de vrais avis autorisés ne sont pas publiés. */
export const demoTestimonials: Testimonial[] = [];

export const demoPosts: Post[] = [];

export const demoReservations: ReservationRequest[] = [
  {
    id: "demo-res-1",
    reference: "SKD-DEMO-0001",
    status: "pending",
    fullName: "Exemple de demande (démonstration)",
    phone: "+225 00 00 00 00 00",
    email: "exemple@demo.local",
    roomId: "room-yop-reception",
    roomName: "Salle de réception — Yopougon",
    eventType: "Anniversaire",
    eventDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    startTime: "18:00",
    endTime: "23:00",
    guests: 60,
    specialNeeds: "Gâteau et décoration",
    message: "Ceci est une demande fictive affichée uniquement en mode démonstration.",
    proposedDate: null,
    proposedStartTime: null,
    proposedEndTime: null,
    adminNote: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

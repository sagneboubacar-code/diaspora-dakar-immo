export type PropertyPurpose = "vente" | "location";
export type PropertyStatus = "disponible" | "reserve" | "vendu";
export type PropertyType = "terrain" | "maison" | "villa" | "appartement" | "projet";

export interface Property {
  slug: string;
  title: string;
  type: PropertyType;
  purpose: PropertyPurpose;
  status: PropertyStatus;
  location: string;
  surfaceM2: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  price: number | null; // en FCFA, null = "prix sur demande"
  description: string;
  features: string[];
  photos: string[]; // chemins vers /public/biens/...
  video?: string; // mp4 hébergé, chemin vers /public/biens/...
}

// Statut du chantier : union plutôt que texte libre, comme PropertyStatus.
// « livre-en-location » distingue les chantiers dont l'agence assure aussi
// la gestion locative après livraison — c'est un argument en soi.
export type RealisationStatus = "livre" | "livre-en-location" | "en-cours";

export interface Realisation {
  slug: string;
  title: string;
  location?: string;
  type?: string;
  startYear?: number; // début des travaux, si le chantier court sur plusieurs années
  year?: number; // année de livraison
  surfaceM2?: number;
  status?: RealisationStatus;
  description?: string;
  photos: string[]; // galerie chronologique : début de chantier → finition
  videos?: string[]; // chemins vers /public/... (mp4 hébergés), même ordre chronologique
  videoUrl?: string; // vidéo unique embarquée (YouTube/Vimeo...), distincte des mp4 ci-dessus
  // Par défaut publié. Passer à false pour garder un chantier dans les
  // données — ses photos peuvent servir ailleurs sur le site — sans
  // l'afficher dans la liste des réalisations tant que l'agence n'a pas
  // fourni ses informations.
  published?: boolean;
}

export interface Partner {
  slug: string;
  name: string;
  emoji?: string;
  logo: string;
  tagline?: string;
  location?: string;
  services?: string[];
  description?: string;
  realisations: string[]; // chemins vers /public/partenaires/...
}

// Un même client peut avoir confié plusieurs projets à l'agence — c'est en
// soi un argument, donc ils sont listés séparément plutôt que fondus en un.
export interface TestimonialProject {
  title: string;
  location?: string;
}

export interface Testimonial {
  name: string;
  country: string; // ville et/ou pays de résidence du client
  flag?: string; // drapeau du pays, affiché à côté du nom
  badge?: string; // « Client diaspora », « Client au Sénégal »...
  headline?: string; // phrase-titre du témoignage, mise en avant
  projects?: TestimonialProject[]; // projets ou services confiés, dans l'ordre
  projectsLabel?: string; // « Service », « Chantier »... par défaut « Projet »
  quote: string[]; // paragraphes du témoignage, dans l'ordre
  photo?: string;
  videoUrl?: string;
}

import type { Property } from "./types";

// À remplir avec les vrais biens de l'agence (photos, prix, superficies).
// Tant que ce tableau est vide, le site affiche partout les messages
// prévus par le cahier des charges ("Informations disponibles sur
// demande") plutôt que d'inventer une annonce.
export const PROPERTIES: Property[] = [
  {
    slug: "appartement-cite-gadaye",
    title: "Appartement 3 chambres — Cité Gadaye",
    type: "appartement",
    purpose: "location",
    status: "disponible",
    location: "Cité Gadaye",
    surfaceM2: null,
    bedrooms: 3,
    bathrooms: 2,
    price: 250000,
    description:
      "Appartement 3 chambres salon dont 2 chambres équipées de salle de bain, situé au 2e étage. Espace familial, cuisine, douche et toilettes externes, balcon.",
    features: [
      "2 chambres avec salle de bain",
      "Espace familial",
      "Cuisine",
      "Douche et toilettes externes",
      "Balcon",
      "2e étage",
    ],
    photos: [],
    video: "/biens/bien-1/video.mp4",
  },
  {
    slug: "terrain-gadaye-1ere-position",
    title: "Terrain 150 m² — Rond-point Gadaye, 1ère position",
    type: "terrain",
    purpose: "vente",
    status: "disponible",
    location: "Rond-point Gadaye",
    surfaceM2: 150,
    bedrooms: null,
    bathrooms: null,
    price: 50000000,
    description:
      "Terrain de 150 m² situé au rond-point Gadaye, face à la VDN et face à la mer, en 1ère position.",
    features: ["Face à la VDN", "Face à la mer", "1ère position", "150 m²"],
    photos: [
      "/biens/terrain-gadaye-1ere-position/photo-01.jpg",
      "/biens/terrain-gadaye-1ere-position/photo-02.jpg",
    ],
  },
  {
    slug: "terrain-gadaye-3eme-position",
    title: "Terrain 150 m² — Rond-point Gadaye, 3è position",
    type: "terrain",
    purpose: "vente",
    status: "disponible",
    location: "Rond-point Gadaye",
    surfaceM2: 150,
    bedrooms: null,
    bathrooms: null,
    price: 45000000,
    description:
      "Terrain de 150 m² situé au rond-point Gadaye, face à la VDN et face à la mer, en 3è position.",
    features: ["Face à la VDN", "Face à la mer", "3è position", "150 m²"],
    photos: ["/biens/terrain-gadaye-3eme-position/photo-01.jpg"],
  },
  {
    slug: "terrain-kounoune-2-manian-seck",
    title: "Terrain 150 m² — Cité Manian Seck, Kounoune 2",
    type: "terrain",
    purpose: "vente",
    status: "disponible",
    location: "Cité Manian Seck, Kounoune 2",
    surfaceM2: 150,
    bedrooms: null,
    bathrooms: null,
    price: 20000000,
    description:
      "Opportunité à saisir : terrain de 150 m² à Cité Manian Seck, Kounoune 2, proche de l'école Amadou Abdoul Sall et de la coopérative d'habitat Air France. Titre foncier (TF) devant notaire. Possibilité d'avoir 2 terrains côte à côte.",
    features: [
      "Titre foncier (TF) devant notaire",
      "Proche école Amadou Abdoul Sall",
      "Proche coopérative d'habitat Air France",
      "Possibilité de 2 terrains côte à côte",
      "150 m²",
    ],
    photos: [
      "/biens/terrain-kounoune-2/photo-01.jpg",
      "/biens/terrain-kounoune-2/photo-02.jpg",
    ],
    video: "/biens/terrain-kounoune-2/video.mp4",
  },
  {
    slug: "duplex-camberene-1",
    title: "Duplex 2 chambres — Cambérène 1",
    type: "appartement",
    purpose: "location",
    status: "disponible",
    location: "Cambérène 1",
    surfaceM2: null,
    bedrooms: 2,
    bathrooms: 1,
    price: 200000,
    description:
      "Duplex de 2 chambres salon avec salle de bain, toilettes et douche extérieures, cuisine et balcon, situé au 3e étage.",
    features: ["Salon", "Cuisine", "Douche et toilettes extérieures", "Balcon", "3e étage"],
    photos: [],
    video: "/biens/duplex-camberene-1/video.mp4",
  },
];

export function getPublishedProperties() {
  return PROPERTIES;
}

export function getPropertyBySlug(slug: string) {
  return PROPERTIES.find((p) => p.slug === slug) ?? null;
}

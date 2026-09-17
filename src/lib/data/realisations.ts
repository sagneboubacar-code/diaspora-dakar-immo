import type { Realisation } from "./types";

// Chantiers réels de l'agence — galerie chronologique de photos
// authentiques (fournies par l'agence), du début du chantier à la
// finition. Localisation, type et description seront ajoutés par
// l'agence quand disponibles (title suffit en attendant).
export const REALISATIONS: Realisation[] = [
  {
    slug: "chantier-1",
    title: "Chantier 1",
    photos: Array.from(
      { length: 27 },
      (_, i) => `/realisations/chantier-1/photo-${String(i + 1).padStart(2, "0")}.jpg`
    ),
  },
  {
    slug: "chantier-2",
    title: "Projet de finitions",
    type: "R+1",
    location: "Mbeye, Lac Rose",
    year: 2022,
    surfaceM2: 300,
    status: "livre",
    photos: Array.from(
      { length: 10 },
      (_, i) => `/realisations/chantier-2/photo-${String(i + 1).padStart(2, "0")}.jpg`
    ),
  },
  {
    slug: "chantier-3",
    title: "Rénovation du RDC et construction du 1er et 2e étage",
    type: "R+2",
    location: "Cité Gadaye, Guédiawaye",
    startYear: 2020,
    year: 2022,
    surfaceM2: 150,
    status: "livre-en-location",
    description:
      "Rénovation du rez-de-chaussée puis construction du 1er et du 2e étage. 2DKR Immo & Construction assure également la gestion locative du bien depuis sa livraison.",
    photos: [],
    videos: [
      "/realisations/chantier-3/01-debut.mp4",
      "/realisations/chantier-3/02-debut-avance.mp4",
      "/realisations/chantier-3/03-finition.mp4",
      "/realisations/chantier-3/04-finition.mp4",
      "/realisations/chantier-3/05-finition.mp4",
      "/realisations/chantier-3/06-finition.mp4",
      "/realisations/chantier-3/07-finition.mp4",
      "/realisations/chantier-3/08-finition.mp4",
    ],
  },
  {
    slug: "chantier-4",
    title: "Projet de finition et rajout d'un 3e étage",
    type: "R+3",
    location: "Asecna, Yeumbeul",
    startYear: 2024,
    year: 2025,
    surfaceM2: 232,
    status: "livre-en-location",
    // La réserve sur la peinture vient de l'agence et porte sur l'étage
    // ajouté en 2025 : elle est maintenue malgré le statut « livré », le
    // site ne surpromet pas.
    description:
      "Finition extérieure de l'immeuble en 2024, puis rajout d'un 3e étage en 2025. 2DKR Immo & Construction a réalisé une partie des travaux de finition et assure la gestion locative du bien ; le dernier étage n'est pas encore terminé en peinture.",
    photos: ["/realisations/chantier-4/photo-01.jpg"],
  },
];

export function getRealisationBySlug(slug: string) {
  return REALISATIONS.find((r) => r.slug === slug) ?? null;
}

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
    title: "Chantier 2",
    photos: Array.from(
      { length: 10 },
      (_, i) => `/realisations/chantier-2/photo-${String(i + 1).padStart(2, "0")}.jpg`
    ),
  },
  {
    slug: "chantier-3",
    title: "Chantier 3",
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
    title: "Chantier 4",
    description:
      "2DKR Immo & Construction a réalisé une partie des travaux de finition de cet immeuble. Le dernier étage n'est pas encore terminé en peinture.",
    photos: ["/realisations/chantier-4/photo-01.jpg"],
  },
];

export function getRealisationBySlug(slug: string) {
  return REALISATIONS.find((r) => r.slug === slug) ?? null;
}

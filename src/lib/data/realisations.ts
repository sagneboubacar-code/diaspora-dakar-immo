import type { Realisation } from "./types";

// Chantiers réels de l'agence — galerie chronologique de photos
// authentiques (fournies par l'agence), du début du chantier à la
// finition. Localisation, type et description seront ajoutés par
// l'agence quand disponibles (title suffit en attendant).
export const REALISATIONS: Realisation[] = [
  {
    slug: "chantier-1",
    title: "Achat d'un terrain et construction clés en main",
    type: "R+1 avec terrasse",
    location: "Cité Apix, Tivaouane Peulh",
    year: 2026,
    durationMonths: 7,
    status: "livre",
    description:
      "2DKR Immo & Construction a accompagné le client de l'achat du terrain jusqu'à la remise des clés : gros œuvre, façade, puis finitions intérieures, en 7 mois de travaux.",
    // Sélection dans l'ordre du chantier, sans doublons d'angle : gros
    // œuvre (01-03), élévation (04-05), façade (07-11), faux plafonds
    // (19-21), salles d'eau (12-37), menuiserie (23-27), pièces terminées
    // (29-36), puis la façade livrée (28). Les 39 photos restent dans
    // public/realisations/chantier-1 (Hero, À propos, services).
    photoFormat: "portrait",
    photos: [
      "/realisations/chantier-1/photo-01.jpg",
      "/realisations/chantier-1/photo-02.jpg",
      "/realisations/chantier-1/photo-03.jpg",
      "/realisations/chantier-1/photo-04.jpg",
      "/realisations/chantier-1/photo-05.jpg",
      "/realisations/chantier-1/photo-07.jpg",
      "/realisations/chantier-1/photo-08.jpg",
      "/realisations/chantier-1/photo-11.jpg",
      "/realisations/chantier-1/photo-19.jpg",
      "/realisations/chantier-1/photo-21.jpg",
      "/realisations/chantier-1/photo-12.jpg",
      "/realisations/chantier-1/photo-14.jpg",
      "/realisations/chantier-1/photo-37.jpg",
      "/realisations/chantier-1/photo-23.jpg",
      "/realisations/chantier-1/photo-27.jpg",
      "/realisations/chantier-1/photo-29.jpg",
      "/realisations/chantier-1/photo-31.jpg",
      "/realisations/chantier-1/photo-32.jpg",
      "/realisations/chantier-1/photo-34.jpg",
      "/realisations/chantier-1/photo-36.jpg",
      "/realisations/chantier-1/photo-28.jpg",
    ],
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
    description:
      "Finition extérieure de l'immeuble en 2024, puis rajout d'un 3e étage en 2025. 2DKR Immo & Construction a réalisé une partie des travaux de finition et assure la gestion locative du bien.",
    photos: ["/realisations/chantier-4/photo-01.jpg"],
  },
];

export function getPublishedRealisations() {
  return REALISATIONS.filter((r) => r.published !== false);
}

export function getRealisationBySlug(slug: string) {
  return REALISATIONS.find((r) => r.slug === slug) ?? null;
}

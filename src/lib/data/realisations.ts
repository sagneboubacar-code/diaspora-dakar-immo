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
    // Une photo par étape plutôt que les 39 du dossier : la fiche se lit
    // comme un déroulé du chantier. Les autres photos restent dans
    // public/realisations/chantier-1 (Hero, À propos, services).
    photos: [],
    steps: [
      { label: "Gros œuvre", photo: "/realisations/chantier-1/photo-02.jpg" },
      { label: "Élévation de l'étage et de la terrasse", photo: "/realisations/chantier-1/photo-05.jpg" },
      { label: "Enduit et peinture de la façade", photo: "/realisations/chantier-1/photo-08.jpg" },
      { label: "Faux plafonds et éclairage", photo: "/realisations/chantier-1/photo-19.jpg" },
      { label: "Carrelage et sanitaires", photo: "/realisations/chantier-1/photo-14.jpg" },
      { label: "Menuiserie intérieure", photo: "/realisations/chantier-1/photo-23.jpg" },
      { label: "Séjour terminé", photo: "/realisations/chantier-1/photo-32.jpg" },
      { label: "Livraison : la façade terminée", photo: "/realisations/chantier-1/photo-28.jpg" },
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

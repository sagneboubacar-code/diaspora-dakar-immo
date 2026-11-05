import type { Realisation } from "./types";

function chantierPhotos(chantier: number, ...numbers: number[]) {
  return numbers.map((n) => `/realisations/chantier-${chantier}/photo-${String(n).padStart(2, "0")}.jpg`);
}

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
    // œuvre (01-03), élévation (04-05), façade (07-11), salle d'eau (37),
    // pièces terminées (29-36), puis la façade livrée (28). Il n'y a pas de
    // photos 12 à 27 : c'était l'intérieur du chantier 3 (mêmes pièces que
    // ses vidéos de finition), rendu au chantier 3 le 2026-11-02. Les autres
    // photos restent dans public/realisations/chantier-1 (À propos, services).
    photoFormat: "portrait",
    photos: chantierPhotos(1, 1, 2, 3, 4, 5, 7, 8, 11, 37, 29, 31, 32, 34, 36, 28),
    // Les deux seules photos prises en largeur : le R+1 en élévation et le
    // crépissage de la façade.
    widePhotos: chantierPhotos(1, 2, 3),
    cover: "/realisations/chantier-1/photo-28.jpg",
    // Un film de 2 min 08 (scripts/build-realisation-films.sh) avec les six
    // vidéos du dossier, dans l'ordre du chantier : fondations (envoyée le
    // 2026-10-31), début du chantier et son avancement (publiées au chantier
    // 3 jusqu'au 2026-11-02, mais c'est cette maison), puis la façade, le
    // séjour et la salle d'eau livrés.
    videos: ["/realisations/chantier-1/montage.mp4"],
  },
  {
    slug: "chantier-2",
    title: "Projet de finitions",
    type: "R+1",
    location: "Mbeye, Lac Rose",
    year: 2022,
    surfaceM2: 300,
    status: "livre",
    // Seules restent les photos sûres : la maison R+1 aux garde-corps orange,
    // en pleine campagne. Supprimées le 2026-11-02, faute de savoir de quel
    // chantier elles venaient : 3 à 5, un immeuble de plusieurs étages à
    // façade carrelée ; 6 à 10, un intérieur dont le balcon donne sur une
    // ville dense, que rien ne relie à cette maison.
    photos: chantierPhotos(2, 1, 2),
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
    // L'intérieur livré, filmé dans les vidéos de finition (escalier sous
    // l'arche, salles d'eau, lustre et bandeaux de couleur). Ces photos
    // étaient publiées au chantier 1 jusqu'au 2026-11-02. 12 vues sur 16 :
    // les autres répètent un angle.
    photoFormat: "portrait",
    photos: chantierPhotos(3, 7, 9, 11, 12, 13, 15, 16, 1, 2, 3, 5, 6),
    cover: "/realisations/chantier-3/photo-09.jpg",
    // Un film de 1 min 44 (scripts/build-realisation-films.sh), tiré des
    // vidéos de finition : l'entrée, le salon, la cuisine, les chambres et la
    // salle d'eau.
    videos: ["/realisations/chantier-3/montage.mp4"],
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
    // Photo prise en hauteur : en vignette 4/3, le 3e étage ajouté était
    // coupé.
    photoFormat: "portrait",
    photos: ["/realisations/chantier-4/photo-01.jpg"],
  },
];

export function getPublishedRealisations() {
  return REALISATIONS.filter((r) => r.published !== false);
}

export function getRealisationBySlug(slug: string) {
  return REALISATIONS.find((r) => r.slug === slug) ?? null;
}

export function coverOf(realisation: Realisation) {
  return realisation.cover ?? realisation.photos[0];
}

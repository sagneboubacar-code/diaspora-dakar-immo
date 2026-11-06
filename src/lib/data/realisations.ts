import type { Realisation } from "./types";

function chantierPhotos(chantier: number, ...numbers: number[]) {
  return numbers.map((n) => `/realisations/chantier-${chantier}/photo-${String(n).padStart(2, "0")}.jpg`);
}

// Les numéros de `first` à `last`.
const span = (first: number, last: number) => Array.from({ length: last - first + 1 }, (_, i) => first + i);

// Chantier 1 : toutes les photos du dossier, en trois parties. Les photos
// 40 à 84 et la plupart des 29 à 39 viennent du client (discussion WhatsApp
// « Issa France », téléchargée le 2026-11-05) : sa maison livrée et chacune
// de ses pièces. Il n'y a pas de photos 12 à 27 : c'était l'intérieur du
// chantier 3, rendu au chantier 3 le 2026-11-02.
const CHANTIER_1_GROUPS = [
  // Le gros œuvre (01-06), puis la façade enduite et peinte (07-11).
  { title: "Pendant les travaux", photos: chantierPhotos(1, ...span(1, 11)) },
  { title: "La maison livrée", photos: chantierPhotos(1, 28, ...span(40, 43)) },
  {
    title: "L'intérieur",
    // Les pièces à lustre, les autres pièces, les couloirs et les portes, les
    // salles d'eau, puis l'escalier.
    photos: chantierPhotos(
      1,
      ...[31, 32, 33, 34, ...span(44, 56)],
      ...[29, 35, 36, ...span(57, 66)],
      ...[30, ...span(67, 77)],
      ...[37, 38, 39, ...span(78, 82)],
      83,
      84
    ),
  },
];

// Chantier 3 : toutes les photos, en deux parties. 17 à 24 : l'album que
// l'agence a renvoyé sur WhatsApp le 2026-11-05 (discussion
// « @Aboubakrsagne »). Ce sont les anciennes photos 3 à 10 du chantier 2,
// retirées le 2026-11-02 faute de savoir d'où elles venaient : l'agence les
// a rendues au chantier 3 le 2026-11-05.
const CHANTIER_3_GROUPS = [
  // La façade de l'immeuble R+2 : les deux vues en largeur d'abord, puis la
  // vue en hauteur. Dans l'autre sens, la photo en hauteur laissait une case
  // vide à côté d'elle, les deux autres prenant chacune deux colonnes.
  { title: "L'immeuble", photos: chantierPhotos(3, 18, 19, 17) },
  {
    title: "L'intérieur",
    // Les pièces (lustres, bandeaux de couleur, porte-fenêtre sur le
    // balcon), les portes, puis les salles d'eau.
    photos: chantierPhotos(
      3,
      ...[7, 8, 9, 10, 11, 20, 21],
      ...[12, 13, 14, 15, 16],
      ...[1, 2, 3, 4, 5, 6, 22, 23, 24]
    ),
  },
];

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
    photoFormat: "portrait",
    photos: CHANTIER_1_GROUPS.flatMap((group) => group.photos),
    photoGroups: CHANTIER_1_GROUPS,
    // Les deux seules photos prises en largeur : le R+1 en élévation et le
    // crépissage de la façade.
    widePhotos: chantierPhotos(1, 2, 3),
    cover: "/realisations/chantier-1/photo-28.jpg",
    // Un film de 2 min 44 (scripts/build-realisation-films.sh), tiré des
    // vidéos du client : les fondations et le début du chantier, la façade
    // livrée au crépuscule et de jour, puis la visite de l'intérieur.
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
    // La maison R+1 aux garde-corps orange, en pleine campagne. Les photos
    // 3 à 10, un immeuble à façade carrelée et son intérieur, retirées le
    // 2026-11-02, étaient celles du chantier 3 : elles y sont depuis le
    // 2026-11-05 (photos 17 à 24).
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
    // L'immeuble, puis l'intérieur livré, filmé dans les vidéos de finition
    // (escalier sous l'arche, salles d'eau, lustre et bandeaux de couleur).
    // Les photos 1 à 16 étaient publiées au chantier 1 jusqu'au 2026-11-02.
    photoFormat: "portrait",
    photos: CHANTIER_3_GROUPS.flatMap((group) => group.photos),
    photoGroups: CHANTIER_3_GROUPS,
    // Les photos prises en largeur : la façade de plus près, une pièce aux
    // bandeaux bleus et la porte-fenêtre sur le balcon.
    widePhotos: chantierPhotos(3, 8, 18, 19, 21),
    // La façade : la carte montre tout l'immeuble.
    cover: "/realisations/chantier-3/photo-17.jpg",
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

export const PROPERTY_TYPES: Record<string, string> = {
  appartement: "Appartement",
  studio: "Studio",
  chambre: "Chambre",
  maison: "Maison",
  villa: "Villa",
  bureau: "Bureau",
  commerce: "Local commercial",
  terrain: "Terrain",
  immeuble: "Immeuble",
  autre: "Autre",
};

export const PAYMENT_METHODS: Record<string, string> = {
  especes: "Espèces",
  wave: "Wave",
  orange_money: "Orange Money",
  free_money: "Free Money",
  virement: "Virement bancaire",
  cheque: "Chèque",
  autre: "Autre",
};

export const EXPENSE_CATEGORIES: Record<string, string> = {
  reparation: "Réparation",
  entretien: "Entretien",
  taxe: "Taxe / impôt",
  facture: "Facture (eau, électricité…)",
  assurance: "Assurance",
  autre: "Autre",
};

export const DUE_STATUS: Record<string, { label: string; tone: Tone }> = {
  paye: { label: "Payé", tone: "green" },
  partiel: { label: "Partiel", tone: "amber" },
  impaye: { label: "Impayé", tone: "red" },
  a_venir: { label: "À venir", tone: "gray" },
};

export const ORG_KINDS: Record<string, string> = {
  agence: "Agence immobilière",
  proprietaire: "Propriétaire",
};

export const ROLES: Record<string, string> = {
  admin: "Administrateur",
  agent: "Agent",
};

export type Tone = "green" | "amber" | "red" | "gray" | "blue";

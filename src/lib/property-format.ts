import type { Property } from "@/lib/data/types";

// Libellés et prix des biens, partagés par la carte, la page du bien et son
// image de partage. Chacune avait sa copie : un type ajouté à l'une seulement
// s'affichait « undefined » sur les autres.
export const TYPE_LABELS: Record<Property["type"], string> = {
  terrain: "Terrain",
  maison: "Maison",
  villa: "Villa",
  appartement: "Appartement",
  magasin: "Magasin",
  projet: "Projet",
};

export function formatPrice(property: Pick<Property, "price">) {
  if (property.price === null) return "Prix sur demande";
  return `${new Intl.NumberFormat("fr-FR").format(property.price)} FCFA`;
}

// « 1 chambre », « 2 chambres ».
export function countLabel(count: number, singular: string, plural: string) {
  return `${count} ${count > 1 ? plural : singular}`;
}

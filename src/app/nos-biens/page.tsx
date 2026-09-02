import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { getPublishedProperties } from "@/lib/data/properties";
import { PropertyBrowser } from "./PropertyBrowser";

export const metadata: Metadata = {
  title: "Nos biens — Terrains, maisons, villas et appartements à Dakar",
  description:
    "Découvrez les terrains, maisons, villas, appartements et projets immobiliers disponibles avec Diaspora Dakar Immo, à Dakar et partout au Sénégal.",
};

export default function PropertiesPage() {
  const properties = getPublishedProperties();

  return (
    <div className="container-site py-16 sm:py-20">
      <SectionHeading
        eyebrow="Vitrine immobilière"
        title="Nos biens"
        subtitle="Terrains, maisons, villas, appartements et projets — sélectionnés et vérifiés par notre équipe au Sénégal."
      />
      <div className="mt-10">
        <PropertyBrowser properties={properties} />
      </div>
    </div>
  );
}

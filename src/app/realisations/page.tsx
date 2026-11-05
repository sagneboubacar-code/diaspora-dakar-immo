import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { SectionHeading } from "@/components/SectionHeading";
import { EmptyState } from "@/components/EmptyState";
import { RealisationCard } from "@/components/RealisationCard";
import { getPublishedRealisations } from "@/lib/data/realisations";

export const metadata: Metadata = pageMetadata({
  path: "/realisations",
  title: "Nos réalisations : chantiers réels à Dakar et au Sénégal",
  description:
    "Découvrez les projets de construction réellement menés par 2DKR Immo & Construction, du début du chantier jusqu'à la finition.",
});

export default function RealisationsPage() {
  const realisations = getPublishedRealisations();

  return (
    <div className="container-site py-16 sm:py-20">
      <SectionHeading
        eyebrow="Nos réalisations"
        title="Nos chantiers au Sénégal"
        subtitle="Les photos et vidéos présentées viennent toutes de nos propres chantiers."
      />

      <div className="mt-12">
        {realisations.length === 0 ? (
          <EmptyState
            title="Nos réalisations sont en cours de mise en ligne."
            description="Les photos de nos chantiers, du début à la finition, seront publiées ici prochainement. Contactez-nous pour en découvrir dès maintenant."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {realisations.map((r) => (
              <RealisationCard key={r.slug} realisation={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { EmptyState } from "@/components/EmptyState";
import { REALISATIONS } from "@/lib/data/realisations";

export const metadata: Metadata = {
  title: "Nos réalisations — Chantiers réels à Dakar et au Sénégal",
  description:
    "Découvrez les projets de construction réellement menés par 2DKR Immo & Construction, du début du chantier jusqu'à la finition.",
};

export default function RealisationsPage() {
  return (
    <div className="container-site py-16 sm:py-20">
      <SectionHeading
        eyebrow="Preuves concrètes"
        title="Des projets réels. Des résultats concrets."
        subtitle="Chaque réalisation présentée ici est un chantier authentique de 2DKR Immo & Construction, du début des travaux jusqu'à la finition."
      />

      <div className="mt-12 space-y-16">
        {REALISATIONS.length === 0 ? (
          <EmptyState
            title="Nos réalisations sont en cours de mise en ligne."
            description="Les photos de nos chantiers, du début à la finition, seront publiées ici prochainement. Contactez-nous pour en découvrir dès maintenant."
          />
        ) : (
          REALISATIONS.map((r) => (
            <article key={r.slug}>
              {r.type && (
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">{r.type}</p>
              )}
              <h2 className="mt-1 font-display text-2xl font-bold text-ink">{r.title}</h2>
              {r.location && <p className="text-sm text-graytext">📍 {r.location}</p>}
              {r.description && (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-graytext">{r.description}</p>
              )}

              {r.photos.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {r.photos.map((photo, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={photo}
                      src={photo}
                      alt={`${r.title} — photo ${i + 1}`}
                      className="aspect-[4/3] w-full rounded-xl object-cover"
                    />
                  ))}
                </div>
              )}

              {r.videos && r.videos.length > 0 && (
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {r.videos.map((video) => (
                    <video
                      key={video}
                      src={video}
                      controls
                      playsInline
                      preload="metadata"
                      className="aspect-video w-full rounded-xl bg-ink/5 object-cover"
                    >
                      Votre navigateur ne prend pas en charge la lecture vidéo.
                    </video>
                  ))}
                </div>
              )}

              {r.videoUrl && (
                <div className="mt-6 aspect-video w-full max-w-2xl overflow-hidden rounded-xl">
                  <iframe
                    src={r.videoUrl}
                    title={`Vidéo — ${r.title}`}
                    className="h-full w-full"
                    allowFullScreen
                  />
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}

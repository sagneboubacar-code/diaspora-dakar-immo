import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { EmptyState } from "@/components/EmptyState";
import { PARTNERS } from "@/lib/data/partners";

export const metadata: Metadata = {
  title: "Nos partenaires — Artisans et professionnels de confiance",
  description:
    "Découvrez les partenaires avec lesquels 2DKR Immo & Construction travaille pour accompagner vos projets au Sénégal.",
};

export default function PartenairesPage() {
  return (
    <div className="container-site py-16 sm:py-20">
      <SectionHeading
        eyebrow="Nos partenaires"
        title="Des professionnels de confiance pour accompagner vos projets"
        subtitle="Pour vous proposer un accompagnement complet, nous nous entourons de professionnels spécialisés dans différents domaines de la construction et de l'habitat."
      />

      <div className="mt-12 space-y-16">
        {PARTNERS.length === 0 ? (
          <EmptyState
            title="Nos partenaires seront présentés ici prochainement."
            description="Contactez-nous pour en savoir plus sur les professionnels avec lesquels nous travaillons."
          />
        ) : (
          PARTNERS.map((p) => (
            <article key={p.slug} className="border-t border-ink/10 pt-10 first:border-0 first:pt-0">
              <div className="flex flex-wrap items-center gap-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.logo}
                  alt={p.name}
                  className="h-16 w-auto max-w-[220px] object-contain"
                />
                <div>
                  <h2 className="font-display text-xl font-bold text-ink">
                    {p.emoji && <span className="mr-2">{p.emoji}</span>}
                    {p.name}
                  </h2>
                  {p.tagline && <p className="mt-1 text-sm text-graytext">{p.tagline}</p>}

                  {(p.location || (p.services && p.services.length > 0)) && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {p.location && (
                        <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ink/70">
                          📍 {p.location}
                        </span>
                      )}
                      {p.services?.map((service) => (
                        <span
                          key={service}
                          className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  )}

                  {p.description && (
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-graytext">{p.description}</p>
                  )}
                </div>
              </div>

              {p.realisations.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {p.realisations.map((photo, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={photo}
                      src={photo}
                      alt={`${p.name} — réalisation ${i + 1}`}
                      className="aspect-[4/3] w-full rounded-xl object-cover"
                    />
                  ))}
                </div>
              )}
            </article>
          ))
        )}
      </div>

      {PARTNERS.length > 0 && (
        <div className="mt-16 rounded-2xl bg-sand/60 p-8 text-center sm:p-10">
          <p className="font-display text-lg font-bold text-ink">
            Ensemble, nous vous accompagnons au-delà de la construction.
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-graytext">
            De la conception aux finitions, notre objectif est de vous proposer un projet cohérent, soigné et
            adapté à vos attentes.
          </p>
        </div>
      )}
    </div>
  );
}

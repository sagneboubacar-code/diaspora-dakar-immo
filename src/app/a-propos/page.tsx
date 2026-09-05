import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "À propos — Diaspora Dakar Immo / 2DKR Immo & Construction",
  description:
    "18 ans d'expérience et de nombreux projets réalisés au Sénégal : découvrez l'histoire, la mission et les valeurs de Diaspora Dakar Immo (2DKR Immo & Construction).",
};

const VALUES = ["Confiance", "Transparence", "Professionnalisme", "Réactivité", "Satisfaction"];

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-20">
      <div className="container-site">
        <SectionHeading
          eyebrow="À propos"
          title={`${SITE.name} — ${SITE.signature}`}
          subtitle={SITE.slogan}
        />

        {/* Deux colonnes jusqu'à 1024 px : au tiers de largeur, « De nombreux »
            ne tient pas sur une ligne. La dernière carte prend toute la largeur
            plutôt que de rester orpheline. */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-ink/10 bg-sand p-8">
            <p className="font-display text-3xl font-bold text-primary">{SITE.experienceYears}+</p>
            <p className="mt-1 text-sm font-medium text-graytext">Années d&apos;expérience</p>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-sand p-8">
            <p className="font-display text-3xl font-bold text-primary">
              {SITE.projectsClaim.value}
            </p>
            <p className="mt-1 text-sm font-medium text-graytext">{SITE.projectsClaim.label}</p>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-sand p-8 sm:col-span-2 lg:col-span-1">
            <p className="font-display text-3xl font-bold text-primary">100%</p>
            <p className="mt-1 text-sm font-medium text-graytext">Titres fonciers contrôlés</p>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-xl font-bold text-ink">Notre mission</h2>
            <p className="mt-3 text-sm leading-relaxed text-graytext">
              Accompagner chaque client, qu&apos;il vive au Sénégal ou à l&apos;étranger, dans la réalisation
              de son projet immobilier — de la recherche du terrain jusqu&apos;à la remise des clés — avec
              rigueur, transparence et une présence constante sur le terrain.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-ink">Notre vision</h2>
            <p className="mt-3 text-sm leading-relaxed text-graytext">
              Devenir le partenaire de confiance de référence pour les Sénégalais de la diaspora qui
              souhaitent investir dans leur pays d&apos;origine, en supprimant la distance comme obstacle à
              un projet immobilier serein.
            </p>
          </div>
        </div>

        <div className="mt-14">
          <h2 className="font-display text-xl font-bold text-ink">Nos valeurs</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {VALUES.map((value) => (
              <span
                key={value}
                className="rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary"
              >
                {value}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 18. Texte personnel du responsable */}
      <div className="container-site mt-16">
        <div className="grid grid-cols-1 items-center gap-10 rounded-2xl border border-ink/10 bg-sand p-8 sm:p-10 lg:grid-cols-[280px_1fr]">
          <div className="mx-auto grid aspect-square w-40 place-items-center rounded-full bg-ink text-4xl font-display font-bold text-white lg:w-full lg:max-w-[220px]">
            2DKR
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              🇫🇷 De la France au Sénégal
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-ink">Nous comprenons votre réalité</h2>
            <p className="mt-4 text-sm leading-relaxed text-graytext">
              &laquo; Étant moi-même venu de France pour m&apos;installer au Sénégal, j&apos;ai vécu cette
              transition et je comprends les difficultés et les inquiétudes que peuvent rencontrer ceux qui
              souhaitent investir dans leur pays d&apos;origine tout en vivant à l&apos;étranger. &raquo;
            </p>
            <p className="mt-4 text-sm leading-relaxed text-graytext">
              Cette expérience nous permet d&apos;aborder chaque projet avec une compréhension concrète des
              attentes, des préoccupations et des réalités de nos clients.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

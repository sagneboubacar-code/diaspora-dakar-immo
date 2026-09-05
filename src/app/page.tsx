import Link from "next/link";
import { ButtonLink } from "@/components/Button";
import { SectionHeading } from "@/components/SectionHeading";
import { KeyStats } from "@/components/KeyStats";
import { PropertyCard } from "@/components/PropertyCard";
import { EmptyState } from "@/components/EmptyState";
import { Reveal } from "@/components/Reveal";
import { HeroShowcase } from "@/components/HeroShowcase";
import { SITE, WHATSAPP_MESSAGES, whatsappHref } from "@/lib/site-config";
import { getPublishedProperties } from "@/lib/data/properties";
import { REALISATIONS } from "@/lib/data/realisations";
import { TESTIMONIALS } from "@/lib/data/testimonials";

// Les quatre étapes de l'accompagnement, illustrées par des photos réelles de
// l'agence. Les étapes 02 à 04 sont le MÊME chantier (villa de la photo
// finale) ; l'étape 01 vient d'un autre terrain, faute de photo du terrain
// d'origine de cette villa — la légende parle donc du parcours proposé, sans
// prétendre qu'il s'agit d'un seul et même projet de bout en bout.
const HERO_PHASES = [
  { n: "01", label: "Achat de terrain", photo: "/biens/terrain-kounoune-2/photo-01.jpg" },
  { n: "02", label: "Gros œuvres", photo: "/realisations/chantier-1/photo-06.jpg" },
  { n: "03", label: "Finitions", photo: "/realisations/chantier-1/photo-08.jpg" },
  { n: "04", label: "Clés en mains", photo: "/hero-villa.jpg" },
];

const DIASPORA_STEPS = [
  { icon: "🌳", title: "Trouver votre terrain", text: "Recherche et vérifications préalables." },
  { icon: "📑", title: "Sécuriser votre acquisition", text: "Contrôles et accompagnement dans les démarches." },
  { icon: "🏗️", title: "Suivre votre construction", text: "Avancement, contrôle et coordination." },
  { icon: "📹", title: "Rester informé à distance", text: "Photos, vidéos et rapports réguliers." },
  { icon: "🔑", title: "Aller jusqu'à la remise des clés", text: "Un accompagnement de bout en bout." },
];

const SERVICES = [
  {
    icon: "🌳",
    title: "Acquisition foncière",
    text: "Vous cherchez un terrain au Sénégal ? Nous vous accompagnons dans la recherche, la visite et les vérifications nécessaires avant votre acquisition.",
    href: "/nos-services",
    cta: "EN SAVOIR PLUS",
  },
  {
    icon: "🏠",
    title: "Construction",
    text: "Vous avez un terrain et souhaitez construire ? Nous vous accompagnons de la conception au suivi du chantier jusqu'à la remise des clés.",
    href: "/nos-services",
    cta: "EN SAVOIR PLUS",
  },
  {
    icon: "🏡",
    title: "Immobilier",
    text: "Maisons, villas, appartements et opportunités d'investissement. Découvrez les biens disponibles.",
    href: "/nos-biens",
    cta: "VOIR NOS BIENS",
  },
  {
    icon: "🔑",
    title: "Gestion immobilière",
    text: "Vous possédez un bien mais vivez à l'étranger ? Nous pouvons vous accompagner dans son suivi et sa gestion.",
    href: "/nos-services",
    cta: "DÉCOUVRIR",
  },
];

const METHOD_STEPS = [
  { n: "01", title: "Échange", text: "Vous nous expliquez votre projet, vos besoins et votre budget." },
  { n: "02", title: "Recherche", text: "Nous identifions les terrains ou biens correspondant à votre projet." },
  { n: "03", title: "Vérification", text: "Nous effectuons les contrôles nécessaires avant votre décision." },
  {
    n: "04",
    title: "Validation",
    text: "Vous recevez les informations et éléments nécessaires pour avancer sereinement.",
  },
  { n: "05", title: "Réalisation", text: "Notre équipe assure le suivi du projet sur le terrain." },
  { n: "06", title: "Remise des clés", text: "Votre projet arrive à son terme. Vous êtes accompagné jusqu'au bout." },
];

const WHY_US = [
  { title: "18 ans d'expérience", text: "Une connaissance concrète du terrain et du marché." },
  { title: "Une équipe présente au Sénégal", text: "Vous n'êtes pas seul face à votre projet." },
  { title: "Un suivi à distance", text: "Photos, vidéos et rapports selon l'avancement." },
  { title: "Une attention particulière au foncier", text: "La sécurisation du terrain doit être une priorité." },
  { title: "Un accompagnement de A à Z", text: "De votre première demande jusqu'à la réalisation du projet." },
];

export default function HomePage() {
  const properties = getPublishedProperties().slice(0, 4);

  return (
    <>
      {/* 6. HERO — le fond défile à travers les trois étapes réelles d'un même
          chantier de l'agence : le visiteur voit la villa se construire, ce qui
          démontre la promesse au lieu de l'affirmer. */}
      <HeroShowcase
        phases={HERO_PHASES}
        caption={
          // Aligné à gauche : le bouton WhatsApp flottant occupe le coin bas
          // droit, un lien collé au bord droit passerait dessous.
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 pr-16 sm:pr-20">
            <p className="text-sm font-semibold text-white sm:text-base">
              De l&apos;achat du terrain à la remise des clés.{" "}
              <span className="font-normal text-white/55">
                Chaque étape suivie par notre équipe sur place.
              </span>
            </p>
            <Link
              href="/realisations"
              className="rounded text-[11px] font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              Voir toutes nos réalisations →
            </Link>
          </div>
        }
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary sm:text-xs">
          {SITE.signature}
          {/* La liste des métiers alourdit l'en-tête sur mobile (3 lignes) —
              réservée aux écrans où elle tient sur une ligne. */}
          <span className="hidden sm:inline"> — Terrain · Construction · Immobilier · Gestion</span>
        </p>
        <h1 className="mt-5 max-w-3xl text-balance font-display text-[2.35rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
          Votre projet immobilier au Sénégal, en toute confiance.
        </h1>
        <p className="mt-5 max-w-2xl text-balance text-base leading-relaxed text-white/80 sm:mt-6 sm:text-lg">
          Vous vivez au Sénégal ou à l&apos;étranger ? Nous vous accompagnons de la recherche du terrain
          jusqu&apos;à la remise des clés, avec une équipe présente sur le terrain à chaque étape.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
          <ButtonLink href={whatsappHref(WHATSAPP_MESSAGES.general)}>💬 PARLER À UN CONSEILLER</ButtonLink>
          <ButtonLink href="/nos-biens" variant="outline-light">
            DÉCOUVRIR NOS BIENS
          </ButtonLink>
        </div>

        <p className="mt-6 text-sm font-medium tracking-wide text-white/60 sm:mt-8">
          {SITE.experienceYears} ans d&apos;expérience · +{SITE.projectsCompleted} chantiers · Titres
          fonciers contrôlés
        </p>
      </HeroShowcase>

      {/* 7. DIASPORA — juste après le Hero. */}
      <section className="bg-sand py-20 sm:py-28">
        <div className="container-site">
          <Reveal>
            <SectionHeading
              eyebrow="Diaspora"
              title="🇸🇳 Votre projet au Sénégal, notre équipe sur place."
              subtitle="Investir à distance ne devrait pas être une source d'inquiétude. Pendant que vous êtes à Paris, Bruxelles, Montréal, New York ou ailleurs, notre équipe est présente au Sénégal pour suivre votre projet."
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {DIASPORA_STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 80}>
                <div className="h-full rounded-2xl border border-ink/10 bg-white p-6 shadow-card">
                  <span className="text-3xl">{step.icon}</span>
                  <p className="mt-4 font-display text-base font-semibold text-ink">{step.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-graytext">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 text-center">
            <ButtonLink href="/diaspora">JE PRÉPARE MON PROJET</ButtonLink>
          </div>
        </div>
      </section>

      {/* 9. CHIFFRES CLÉS */}
      <section className="py-20 sm:py-24">
        <div className="container-site">
          <Reveal>
            <KeyStats />
          </Reveal>
        </div>
      </section>

      {/* Réalisations — preuve concrète, priorité absolue #3. */}
      <section className="bg-ink py-20 text-white sm:py-24">
        <div className="container-site">
          <Reveal>
            <SectionHeading
              eyebrow="Nos réalisations"
              title="Des projets réels. Des résultats concrets."
              subtitle="Chaque réalisation présentée est un chantier authentique de 2DKR Immo & Construction — jamais une photo générique."
              light
            />
          </Reveal>
          <div className="mt-10">
            {REALISATIONS.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-10 text-center">
                <p className="font-display text-lg font-semibold text-white">
                  Nos réalisations sont en cours de mise en ligne.
                </p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/60">
                  Contactez-nous pour découvrir des exemples de chantiers menés par notre équipe.
                </p>
                <ButtonLink href={whatsappHref(WHATSAPP_MESSAGES.general)} className="mt-5">
                  💬 Nous contacter sur WhatsApp
                </ButtonLink>
              </div>
            ) : (
              <div className="text-center">
                <ButtonLink href="/realisations" variant="outline-light">
                  VOIR TOUTES NOS RÉALISATIONS
                </ButtonLink>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 10. NOS OPPORTUNITÉS — max 4 biens. */}
      <section className="py-20 sm:py-24">
        <div className="container-site">
          <Reveal>
            <SectionHeading
              eyebrow="Opportunités"
              title="🏡 Découvrez nos opportunités immobilières"
              subtitle="Des terrains, maisons, appartements et projets sélectionnés pour vous."
            />
          </Reveal>

          <div className="mt-10">
            {properties.length === 0 ? (
              <EmptyState
                title="Nos opportunités sont actuellement en cours de mise à jour."
                description="Contactez-nous pour connaître les disponibilités actuelles."
              />
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {properties.map((property) => (
                  <PropertyCard key={property.slug} property={property} />
                ))}
              </div>
            )}
          </div>

          <div className="mt-10 text-center">
            <ButtonLink href="/nos-biens" variant="outline">
              VOIR TOUS NOS BIENS
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* 12. SERVICES */}
      <section className="bg-sand py-20 sm:py-24">
        <div className="container-site">
          <Reveal>
            <SectionHeading
              eyebrow="Nos services"
              title="🏗️ Un accompagnement complet pour votre projet"
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {SERVICES.map((service, i) => (
              <Reveal key={service.title} delay={i * 80}>
                <div className="h-full rounded-2xl border border-ink/10 bg-white p-7 shadow-card">
                  <span className="text-3xl">{service.icon}</span>
                  <h3 className="mt-4 font-display text-xl font-semibold text-ink">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-graytext">{service.text}</p>
                  <ButtonLink href={service.href} variant="outline" className="mt-5 px-5 py-2 text-xs">
                    {service.cta}
                  </ButtonLink>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 14. MÉTHODE DE TRAVAIL */}
      <section className="py-20 sm:py-24">
        <div className="container-site">
          <Reveal>
            <SectionHeading eyebrow="Notre méthode" title="Comment se déroule votre projet ?" align="center" />
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {METHOD_STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 70}>
                <div className="relative border-l-2 border-primary/30 pl-6">
                  <span className="font-display text-3xl font-bold text-primary/30">{step.n}</span>
                  <p className="mt-2 font-display text-lg font-semibold text-ink">{step.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-graytext">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 16. TÉMOIGNAGES */}
      <section className="bg-sand py-20 sm:py-24">
        <div className="container-site">
          <Reveal>
            <SectionHeading eyebrow="Preuves" title="Ils nous ont fait confiance" align="center" />
          </Reveal>

          <div className="mt-12">
            {TESTIMONIALS.length === 0 ? (
              <EmptyState
                title="Les témoignages de nos clients arrivent bientôt."
                description="Des clients au Sénégal, en France et au Canada partagent déjà leur expérience avec nous — leurs témoignages seront publiés ici."
              />
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {TESTIMONIALS.slice(0, 3).map((t) => (
                  <div key={t.name} className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card">
                    <p className="text-sm leading-relaxed text-graytext">&laquo; {t.quote} &raquo;</p>
                    <p className="mt-4 font-display text-sm font-semibold text-ink">
                      {t.name} <span className="font-normal text-graytext">— {t.country}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 17. POURQUOI NOUS */}
      <section className="py-20 sm:py-24">
        <div className="container-site grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading eyebrow="Pourquoi nous" title="Pourquoi choisir 2DKR Immo & Construction ?" />
          </Reveal>
          <Reveal delay={100}>
            <ul className="space-y-5">
              {WHY_US.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span className="mt-0.5 text-primary">✓</span>
                  <div>
                    <p className="font-display text-base font-semibold text-ink">{item.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-graytext">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 20. GRAND APPEL À L'ACTION FINAL */}
      <section className="bg-ink py-20 text-center sm:py-28">
        <div className="container-site">
          <Reveal>
            <h2 className="text-balance font-display text-3xl font-bold text-white sm:text-4xl">
              🇸🇳 Vous avez un projet immobilier au Sénégal ?
            </h2>
            <p className="mt-3 text-lg font-medium text-primary">Parlons de votre projet.</p>
            <p className="mx-auto mt-4 max-w-xl text-balance text-sm leading-relaxed text-white/70">
              Que vous souhaitiez acheter un terrain, construire, acheter une maison, investir ou gérer un
              bien, notre équipe est à votre écoute.
            </p>
            <div className="mt-8">
              <ButtonLink href={whatsappHref(WHATSAPP_MESSAGES.general)} className="px-8 py-4 text-base">
                🟢 PARLER À UN CONSEILLER SUR WHATSAPP
              </ButtonLink>
            </div>
            <p className="mt-4 text-xs uppercase tracking-wide text-white/40">
              Réponse rapide · Premier échange personnalisé
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}

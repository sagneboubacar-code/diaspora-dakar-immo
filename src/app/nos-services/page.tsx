import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { ButtonLink } from "@/components/Button";
import { WHATSAPP_MESSAGES, whatsappHref } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Nos services — Acquisition, construction, immobilier, gestion",
  description:
    "Acquisition foncière, construction, immobilier et gestion locative au Sénégal : découvrez comment Diaspora Dakar Immo accompagne votre projet de A à Z.",
};

const SERVICES = [
  {
    icon: "🌳",
    photo: "/biens/terrain-kounoune-2/photo-01.jpg" as string | null,
    title: "Acquisition foncière",
    description: "Vous cherchez un terrain au Sénégal ? Nous vous accompagnons dans la recherche, la visite et les vérifications nécessaires avant votre acquisition.",
    advantages: [
      "Recherche ciblée selon votre budget et vos priorités",
      "Visite du terrain, y compris à distance via photos et vidéos",
      "Vérifications préalables avant toute décision",
      "Accompagnement dans les démarches d'acquisition",
    ],
    cta: { href: whatsappHref(WHATSAPP_MESSAGES.project), label: "EN SAVOIR PLUS" },
  },
  {
    icon: "🏠",
    photo: "/realisations/chantier-2/photo-01.jpg",
    title: "Construction",
    description: "Vous avez un terrain et souhaitez construire ? Nous vous accompagnons de la conception au suivi du chantier jusqu'à la remise des clés.",
    advantages: [
      "Conception adaptée à votre projet et à votre budget",
      "Suivi de chantier assuré par une équipe sur place",
      "Points d'avancement réguliers, photos et vidéos",
      "Remise des clés à l'achèvement des travaux",
    ],
    cta: { href: whatsappHref(WHATSAPP_MESSAGES.project), label: "EN SAVOIR PLUS" },
  },
  {
    icon: "🏡",
    photo: "/realisations/chantier-1/photo-20.jpg",
    title: "Immobilier",
    description: "Maisons, villas, appartements et opportunités d'investissement. Découvrez les biens disponibles.",
    advantages: [
      "Sélection de biens vérifiés",
      "Accompagnement lors des visites",
      "Conseils adaptés à votre projet (résidence ou investissement)",
      "Suivi jusqu'à la finalisation de l'acquisition",
    ],
    cta: { href: "/nos-biens", label: "VOIR NOS BIENS" },
  },
  {
    icon: "🔑",
    photo: "/realisations/chantier-1/photo-27.jpg",
    title: "Gestion immobilière",
    description: "Vous possédez un bien mais vivez à l'étranger ? Nous pouvons vous accompagner dans son suivi et sa gestion.",
    advantages: [
      "Suivi régulier de votre bien",
      "Interlocuteur local dédié",
      "Rapports et comptes rendus réguliers",
      "Tranquillité d'esprit à distance",
    ],
    cta: { href: whatsappHref(WHATSAPP_MESSAGES.general), label: "DÉCOUVRIR" },
  },
];

export default function ServicesPage() {
  return (
    <div className="py-16 sm:py-20">
      <div className="container-site">
        <SectionHeading
          eyebrow="Nos services"
          title="Un accompagnement complet pour votre projet"
          subtitle="De la recherche du terrain à la gestion de votre bien, chaque étape est assurée par une équipe présente au Sénégal."
        />
      </div>

      <div className="container-site mt-14 space-y-10">
        {SERVICES.map((service, i) => (
          <div
            key={service.title}
            className={`grid grid-cols-1 items-center gap-8 rounded-2xl border border-ink/10 p-8 shadow-card sm:p-10 lg:grid-cols-2 ${
              i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            {service.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={service.photo}
                alt={service.title}
                className="aspect-[4/3] w-full rounded-xl object-cover"
              />
            ) : (
              <div className="grid aspect-[4/3] place-items-center rounded-xl bg-sand text-6xl">
                {service.icon}
              </div>
            )}
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">{service.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-graytext">{service.description}</p>
              <ul className="mt-5 space-y-2">
                {service.advantages.map((a) => (
                  <li key={a} className="flex gap-2 text-sm text-ink">
                    <span className="text-primary">✓</span> {a}
                  </li>
                ))}
              </ul>
              <ButtonLink href={service.cta.href} className="mt-6">
                {service.cta.label}
              </ButtonLink>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

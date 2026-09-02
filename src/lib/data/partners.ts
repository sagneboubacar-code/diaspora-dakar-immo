import type { Partner } from "./types";

// Partenaires réels de l'agence — textes officiels fournis par 2DKR Immo &
// Construction (ne pas reformuler sans nouvelle validation).
export const PARTNERS: Partner[] = [
  {
    slug: "cvc-pro",
    name: "CVC PRO",
    emoji: "❄️",
    logo: "/partenaires/cvc-pro/logo.jpg",
    tagline: "Climatisation / plomberie / VMC (ventilation mécanique contrôlée)",
    location: "France & Sénégal",
    services: ["VMC", "Plomberie", "Climatisation"],
    description:
      "CVC PRO nous accompagne dans les domaines de la ventilation, de la plomberie et de la climatisation, afin de contribuer au confort et à la qualité technique de nos projets.",
    realisations: [
      "/partenaires/cvc-pro/realisation-01.jpg",
      "/partenaires/cvc-pro/realisation-02.jpg",
      "/partenaires/cvc-pro/realisation-03.jpg",
      "/partenaires/cvc-pro/realisation-04.jpg",
    ],
  },
  {
    slug: "sarah-home-design",
    name: "Sarah Home Design",
    emoji: "✨",
    logo: "/partenaires/sarah-home-design/logo.jpg",
    tagline: "Décoration d'intérieur",
    description:
      "SARAH HOME DESIGN nous accompagne dans l'aménagement et la décoration intérieure, afin de créer des espaces élégants, fonctionnels et personnalisés selon les envies de nos clients.",
    realisations: ["/partenaires/sarah-home-design/realisation-01.jpg"],
  },
];

export function getPartnerBySlug(slug: string) {
  return PARTNERS.find((p) => p.slug === slug) ?? null;
}

// Coordonnées et réglages de l'agence — source unique, consommée par le
// header, le footer, les boutons WhatsApp et les métadonnées SEO.
export const SITE = {
  name: "Diaspora Dakar Immo",
  signature: "2DKR Immo & Construction",
  slogan: "Votre confiance, notre plus grande réussite.",
  url: "https://www.diasporadakarimmo.sn",
  address: "Villa 197, Cité Gadaye, Guédiawaye – Dakar, Sénégal",
  email: "dakardiaspora2@gmail.com",
  phones: [
    { label: "77 410 46 34", href: "tel:+221774104634", whatsapp: "221774104634" },
    { label: "33 845 80 80", href: "tel:+221338458080", whatsapp: "221338458080" },
  ],
  experienceYears: 18,
  projectsCompleted: 150,
} as const;

const DEFAULT_WHATSAPP = SITE.phones[0].whatsapp;

export const WHATSAPP_MESSAGES = {
  general:
    "Bonjour Diaspora Dakar Immo, je souhaite avoir plus d'informations concernant votre accompagnement immobilier. Merci.",
  property: (title: string) =>
    `Bonjour Diaspora Dakar Immo, je suis intéressé(e) par ce bien : "${title}", et souhaiterais avoir plus d'informations. Merci.`,
  project:
    "Bonjour Diaspora Dakar Immo, j'ai un projet immobilier au Sénégal et je souhaiterais être accompagné(e). Merci.",
};

export function whatsappHref(message: string, phone: string = DEFAULT_WHATSAPP) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/nos-biens", label: "Nos biens" },
  { href: "/nos-services", label: "Nos services" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/partenaires", label: "Partenaires" },
  { href: "/diaspora", label: "Diaspora" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
] as const;

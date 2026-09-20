import type { Metadata } from "next";
import { SITE } from "@/lib/site-config";

// Champs Open Graph communs à toutes les pages. Répétés sur chaque page plutôt
// qu'hérités : Next fusionne les métadonnées en surface, une page qui déclare
// son propre `openGraph` remplace donc entièrement celui du layout racine.
const BASE_OPEN_GRAPH = {
  type: "website",
  locale: "fr_FR",
  siteName: SITE.name,
} as const;

/**
 * Métadonnées d'une page. Le chemin alimente l'URL canonique et `og:url`.
 *
 * Sans lui, chaque page héritait de l'URL du layout racine : une fiche bien
 * partagée sur WhatsApp annonçait l'accueil comme adresse, et se déclarait
 * comme un doublon de l'accueil auprès des moteurs de recherche.
 */
export function pageMetadata({
  path,
  title,
  description,
  robots,
  // Par défaut la carte du site. Une page qui a sa propre route
  // `opengraph-image` doit passer son chemin : déclarer `openGraph` écrase
  // l'image héritée, il faut donc toujours la redonner explicitement.
  image = "/opengraph-image",
}: {
  path: string;
  title: string;
  description?: string;
  robots?: Metadata["robots"];
  image?: string;
}): Metadata {
  return {
    title,
    description,
    robots,
    alternates: { canonical: path },
    openGraph: {
      ...BASE_OPEN_GRAPH,
      url: path,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
  };
}

export { BASE_OPEN_GRAPH };

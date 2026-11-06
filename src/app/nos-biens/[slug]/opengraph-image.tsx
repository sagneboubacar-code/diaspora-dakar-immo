import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE, embedPhoto } from "@/lib/og-card";
import { getPropertyBySlug, getPublishedProperties } from "@/lib/data/properties";
import { posterFor } from "@/lib/media";
import { TYPE_LABELS, formatPrice } from "@/lib/property-format";

export const alt = "Bien immobilier — Diaspora Dakar Immo";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getPublishedProperties().map((p) => ({ slug: p.slug }));
}

// Pas d'emoji dans la carte : Satori ne rend pas les emojis sans police
// dédiée, et laisse un blanc à la place.
export default async function Image({ params }: { params: { slug: string } }) {
  const property = getPropertyBySlug(params.slug);
  if (!property) return new ImageResponse(<OgCard title="Bien introuvable" />, size);

  // Faute de photo, la vignette de la vidéo : mieux vaut un vrai visuel du
  // bien qu'un fond uni dans l'aperçu WhatsApp.
  const cover = property.photos[0] ?? (property.video ? posterFor(property.video) : undefined);

  return new ImageResponse(
    (
      <OgCard
        photo={cover ? embedPhoto(cover) : undefined}
        eyebrow={`${TYPE_LABELS[property.type]} · ${property.purpose === "vente" ? "À vendre" : "À louer"}`}
        title={property.title}
        meta={property.location}
        highlight={formatPrice(property)}
      />
    ),
    size
  );
}

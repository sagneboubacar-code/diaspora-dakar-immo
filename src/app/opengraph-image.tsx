import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE, embedPhoto } from "@/lib/og-card";
import { SITE } from "@/lib/site-config";

export const alt = `${SITE.name} — ${SITE.positioning}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        photo={embedPhoto("/hero-villa.jpg")}
        eyebrow="Terrain · Construction · Immobilier · Gestion"
        title={SITE.positioning}
        meta={`${SITE.experienceYears} ans d'expérience · ${SITE.projectsClaim.sentence}`}
      />
    ),
    size
  );
}

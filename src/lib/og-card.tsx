import { readFileSync } from "node:fs";
import { join } from "node:path";
import { SITE } from "@/lib/site-config";

// Format attendu par WhatsApp, Facebook et LinkedIn pour un grand aperçu.
export const OG_SIZE = { width: 1200, height: 630 };

// Les images d'aperçu sont générées au build : le fichier est lu sur le disque
// et embarqué, aucune requête réseau n'est faite pendant le rendu.
export function embedPhoto(publicPath: string) {
  const file = readFileSync(join(process.cwd(), "public", publicPath.replace(/^\//, "")));
  return `data:image/jpeg;base64,${file.toString("base64")}`;
}

// Satori ne gère pas text-transform : les majuscules sont appliquées ici.
const upper = (s: string) => s.toUpperCase();

/**
 * Carte d'aperçu partagée par l'accueil et les fiches biens : photo plein
 * cadre, dégradé sombre et texte en bas — le même langage que le Hero du site,
 * pour qu'un lien partagé sur WhatsApp ressemble au site qu'il ouvre.
 */
export function OgCard({
  photo,
  eyebrow,
  title,
  meta,
  highlight,
}: {
  photo?: string;
  eyebrow?: string;
  title: string;
  meta?: string;
  highlight?: string;
}) {
  return (
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#111111" }}>
      {photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt=""
          style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}

      {/* Satori ne comprend ni le raccourci `inset` ni `background` pour un
          dégradé : positions explicites et `backgroundImage`, sinon le voile
          n'est pas peint et le texte blanc reste illisible sur une photo
          claire. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: OG_SIZE.width,
          height: OG_SIZE.height,
          backgroundImage:
            "linear-gradient(180deg, rgba(17,17,17,0.72) 0%, rgba(17,17,17,0.52) 34%, rgba(17,17,17,0.90) 72%, rgba(17,17,17,0.98) 100%)",
        }}
      />

      <div style={{ position: "absolute", top: 46, left: 64, display: "flex", flexDirection: "column" }}>
        <div style={{ color: "#ffffff", fontSize: 32, fontWeight: 700 }}>{SITE.name}</div>
        <div style={{ color: "#F28C28", fontSize: 19, fontWeight: 600, letterSpacing: 3, marginTop: 4 }}>
          {upper(SITE.signature)}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          bottom: 54,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {eyebrow && (
          <div
            style={{
              color: "#F28C28",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 4,
              marginBottom: 16,
            }}
          >
            {upper(eyebrow)}
          </div>
        )}
        <div style={{ color: "#ffffff", fontSize: 56, fontWeight: 800, lineHeight: 1.12 }}>{title}</div>
        {meta && (
          <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 28, marginTop: 16 }}>{meta}</div>
        )}
        {highlight && (
          <div style={{ color: "#ffffff", fontSize: 40, fontWeight: 700, marginTop: 20 }}>{highlight}</div>
        )}
      </div>
    </div>
  );
}

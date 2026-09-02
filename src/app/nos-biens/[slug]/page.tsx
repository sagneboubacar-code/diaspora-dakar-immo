import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/Button";
import { LeadForm } from "@/components/LeadForm";
import { getPropertyBySlug, getPublishedProperties } from "@/lib/data/properties";
import { WHATSAPP_MESSAGES, whatsappHref } from "@/lib/site-config";

const TYPE_LABELS: Record<string, string> = {
  terrain: "Terrain",
  maison: "Maison",
  villa: "Villa",
  appartement: "Appartement",
  projet: "Projet",
};

function formatPrice(price: number | null) {
  if (price === null) return "Prix sur demande";
  return `${new Intl.NumberFormat("fr-FR").format(price)} FCFA`;
}

export function generateStaticParams() {
  return getPublishedProperties().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const property = getPropertyBySlug(params.slug);
  if (!property) return {};
  return {
    title: `${property.title} — ${property.location}`,
    description: property.description,
  };
}

export default function PropertyDetailPage({ params }: { params: { slug: string } }) {
  const property = getPropertyBySlug(params.slug);
  if (!property) notFound();

  return (
    <div className="container-site py-16 sm:py-20">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {property.video && (
            <video
              src={property.video}
              controls
              playsInline
              preload="metadata"
              className="aspect-video w-full rounded-xl bg-ink/5 object-cover"
            >
              Votre navigateur ne prend pas en charge la lecture vidéo.
            </video>
          )}

          <div className={`grid grid-cols-1 gap-2 sm:grid-cols-2 ${property.video ? "mt-2" : ""}`}>
            {property.photos.length > 0 ? (
              property.photos.map((photo) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={photo}
                  src={photo}
                  alt={property.title}
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                />
              ))
            ) : !property.video ? (
              <div className="col-span-2 grid aspect-[16/9] place-items-center rounded-xl bg-sand text-graytext">
                Photos à venir
              </div>
            ) : null}
          </div>

          <p className="mt-8 text-xs font-semibold uppercase tracking-wide text-primary">
            {TYPE_LABELS[property.type]} · {property.purpose === "vente" ? "À vendre" : "À louer"}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ink">{property.title}</h1>
          <p className="mt-1 text-sm text-graytext">📍 {property.location}</p>

          <div className="mt-6 flex flex-wrap gap-6 border-y border-ink/10 py-5 text-sm text-graytext">
            {property.surfaceM2 && <span>{property.surfaceM2} m²</span>}
            {property.bedrooms !== null && <span>{property.bedrooms} chambres</span>}
            {property.bathrooms !== null && <span>{property.bathrooms} salles de bain</span>}
          </div>

          <p className="mt-6 text-sm leading-relaxed text-graytext">{property.description}</p>

          {property.features.length > 0 && (
            <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {property.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-ink">
                  <span className="text-primary">✓</span> {feature}
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-ink/10 bg-white p-6 shadow-card">
          <p className="font-display text-2xl font-bold text-ink">{formatPrice(property.price)}</p>
          <ButtonLink
            href={whatsappHref(WHATSAPP_MESSAGES.property(property.title))}
            className="mt-5 w-full"
          >
            💬 WhatsApp pour ce bien
          </ButtonLink>
          <div className="mt-6 border-t border-ink/10 pt-6">
            <p className="mb-4 text-sm font-semibold text-ink">Demander plus d&apos;informations</p>
            <LeadForm
              variant="bien"
              propertySlug={property.slug}
              propertyTitle={property.title}
              submitLabel="ENVOYER MA DEMANDE"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

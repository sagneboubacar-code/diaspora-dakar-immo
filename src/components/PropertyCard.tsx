import Link from "next/link";
import type { Property } from "@/lib/data/types";

const TYPE_LABELS: Record<Property["type"], string> = {
  terrain: "Terrain",
  maison: "Maison",
  villa: "Villa",
  appartement: "Appartement",
  projet: "Projet",
};

const STATUS_LABELS: Record<Property["status"], string> = {
  disponible: "Disponible",
  reserve: "Réservé",
  vendu: "Vendu",
};

const STATUS_CLASSES: Record<Property["status"], string> = {
  disponible: "bg-emerald-600",
  reserve: "bg-amber-500",
  vendu: "bg-ink/60",
};

function formatPrice(price: number | null) {
  if (price === null) return "Prix sur demande";
  return `${new Intl.NumberFormat("fr-FR").format(price)} FCFA`;
}

export function PropertyCard({ property }: { property: Property }) {
  const cover = property.photos[0];
  return (
    <Link
      href={`/nos-biens/${property.slug}`}
      className="group overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : property.video ? (
          <div className="grid h-full w-full place-items-center gap-1 text-sm text-graytext">
            <span className="text-2xl">🎬</span>
            Vidéo disponible
          </div>
        ) : (
          <div className="grid h-full w-full place-items-center text-sm text-graytext">Photo à venir</div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white ${STATUS_CLASSES[property.status]}`}
        >
          {STATUS_LABELS[property.status]}
        </span>
      </div>
      <div className="space-y-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          {TYPE_LABELS[property.type]} · {property.purpose === "vente" ? "À vendre" : "À louer"}
        </p>
        <h3 className="font-display text-lg font-semibold text-ink">{property.title}</h3>
        <p className="text-sm text-graytext">📍 {property.location}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-graytext">
          {property.surfaceM2 && <span>{property.surfaceM2} m²</span>}
          {property.bedrooms !== null && <span>{property.bedrooms} chambres</span>}
        </div>
        <div className="flex items-center justify-between pt-2">
          <p className="font-display text-base font-bold text-ink">{formatPrice(property.price)}</p>
          <span className="text-sm font-semibold text-primary group-hover:underline">Voir le bien →</span>
        </div>
      </div>
    </Link>
  );
}

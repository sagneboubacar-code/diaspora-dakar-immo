import Link from "next/link";
import type { Realisation, RealisationStatus } from "@/lib/data/types";
import { coverOf } from "@/lib/data/realisations";
import { PinIcon, PlayIcon } from "@/components/Icon";

const STATUS_LABELS: Record<RealisationStatus, string> = {
  livre: "Livré",
  "livre-en-location": "Livré et mis en location",
  "en-cours": "En cours",
};

const STATUS_CLASSES: Record<RealisationStatus, string> = {
  livre: "bg-emerald-600",
  "livre-en-location": "bg-emerald-600",
  "en-cours": "bg-amber-500",
};

export function RealisationStatusBadge({
  status,
  className = "",
}: {
  status: RealisationStatus;
  className?: string;
}) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${STATUS_CLASSES[status]} ${className}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

// « 2020 – 2022 » pour un chantier sur plusieurs années, sinon l'année de
// livraison seule.
export function realisationPeriod(r: Realisation) {
  if (!r.year) return null;
  return r.startYear ? `${r.startYear} – ${r.year}` : String(r.year);
}

// Une carte par chantier : la maison livrée en couverture, de quoi situer le
// chantier d'un coup d'œil, et la page du chantier au clic. Les photos et le
// film sont sur cette page, plus sur la liste.
export function RealisationCard({ realisation: r }: { realisation: Realisation }) {
  const cover = coverOf(r);
  const facts = [
    realisationPeriod(r),
    r.durationMonths ? `${r.durationMonths} mois de travaux` : null,
    r.surfaceM2 ? `${r.surfaceM2} m²` : null,
  ].filter(Boolean);
  const photoCount = r.photos.length;

  return (
    <Link
      href={`/realisations/${r.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card transition-shadow hover:shadow-lg"
    >
      {/* 4/5 : les photos de chantier sont prises en hauteur, un cadre en
          largeur coupait les étages. */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-sand">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={r.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-sm text-graytext">Photos à venir</div>
        )}
        {r.status && <RealisationStatusBadge status={r.status} className="absolute left-3 top-3" />}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {photoCount > 0 && (
            <span className="rounded-full bg-ink/70 px-3 py-1 text-xs font-semibold text-white">
              {photoCount} photo{photoCount > 1 ? "s" : ""}
            </span>
          )}
          {r.videos && r.videos.length > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/70 px-3 py-1 text-xs font-semibold text-white">
              <PlayIcon className="h-2.5 w-2.5" />
              Vidéo
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {r.type && <p className="text-xs font-semibold uppercase tracking-wide text-primary">{r.type}</p>}
        <h3 className="font-display text-lg font-semibold leading-snug text-ink">{r.title}</h3>
        {r.location && (
          <p className="flex items-center gap-1.5 text-sm text-graytext">
            <PinIcon className="h-4 w-4 shrink-0 text-primary" />
            {r.location}
          </p>
        )}
        {facts.length > 0 && <p className="text-sm text-graytext">{facts.join(" · ")}</p>}
        <span className="mt-auto pt-2 text-sm font-semibold text-primary group-hover:underline">
          Voir le chantier →
        </span>
      </div>
    </Link>
  );
}

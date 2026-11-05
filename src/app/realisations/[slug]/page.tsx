import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/Button";
import { PinIcon, WhatsAppIcon } from "@/components/Icon";
import { RealisationCard, RealisationStatusBadge, realisationPeriod } from "@/components/RealisationCard";
import { RealisationGallery } from "@/components/RealisationGallery";
import { coverOf, getPublishedRealisations, getRealisationBySlug } from "@/lib/data/realisations";
import { pageMetadata } from "@/lib/metadata";
import { posterFor } from "@/lib/media";
import { WHATSAPP_MESSAGES, whatsappHref } from "@/lib/site-config";

function getPublished(slug: string) {
  const realisation = getRealisationBySlug(slug);
  return realisation && realisation.published !== false ? realisation : null;
}

export function generateStaticParams() {
  return getPublishedRealisations().map((r) => ({ slug: r.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const r = getPublished(params.slug);
  if (!r) return {};
  return pageMetadata({
    path: `/realisations/${r.slug}`,
    title: r.location ? `${r.title}, ${r.location}` : r.title,
    // Faute de description, une phrase faite des seules informations du
    // chantier : rien d'inventé.
    description:
      r.description ??
      `${r.title}${r.type ? ` (${r.type})` : ""}${r.location ? ` à ${r.location}` : ""} : un chantier mené par 2DKR Immo & Construction, en photos.`,
    // Partagée sur WhatsApp, la page s'annonce avec la photo de sa carte.
    image: coverOf(r),
  });
}

export default function RealisationPage({ params }: { params: { slug: string } }) {
  const r = getPublished(params.slug);
  if (!r) notFound();

  const video = r.videos?.[0];
  const cover = coverOf(r);
  // Sans film, la photo de couverture prend sa place à côté du texte ; la
  // galerie ne se montre que s'il reste d'autres photos à voir.
  const heroPhoto = !video ? cover : undefined;
  const showGallery = r.photos.length > (heroPhoto ? 1 : 0);
  const others = getPublishedRealisations().filter((other) => other.slug !== r.slug);
  const facts = [
    { label: r.startYear ? "Période" : "Année", value: realisationPeriod(r) },
    { label: "Durée des travaux", value: r.durationMonths ? `${r.durationMonths} mois` : null },
    { label: "Surface", value: r.surfaceM2 ? `${r.surfaceM2} m²` : null },
    { label: "Type", value: r.type ?? null },
  ].filter((fact) => fact.value);

  return (
    <div className="container-site py-12 sm:py-16">
      <Link href="/realisations" className="text-sm font-semibold text-primary hover:underline">
        ← Toutes nos réalisations
      </Link>

      {/* Sur ordinateur, le texte à gauche et le film (ou la photo) à droite.
          Sur téléphone, le film vient juste après la description, avant
          l'encadré WhatsApp : la seconde ligne de la grille (1fr) prend la
          hauteur du film, et l'encadré reste collé au texte. */}
      <div
        className={`mt-6 grid grid-cols-1 gap-10 ${
          video || heroPhoto
            ? "lg:grid-cols-[minmax(0,1fr)_22rem] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-y-8 xl:gap-x-16"
            : ""
        }`}
      >
        <div>
          <h1 className="text-balance font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {r.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            {r.status && <RealisationStatusBadge status={r.status} />}
            {r.location && (
              <p className="flex items-center gap-1.5 text-sm text-graytext">
                <PinIcon className="h-4 w-4 shrink-0 text-primary" />
                {r.location}
              </p>
            )}
          </div>

          {facts.length > 0 && (
            <dl className="mt-8 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-5 border-y border-ink/10 py-6 sm:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-graytext">{fact.label}</dt>
                  <dd className="mt-1 font-display text-lg font-semibold text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {r.description && (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-graytext">{r.description}</p>
          )}
        </div>

        {video && (
          <figure className="mx-auto w-full max-w-sm lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none">
            <video
              src={video}
              poster={posterFor(video)}
              controls
              playsInline
              // Rien n'est téléchargé avant que le visiteur ne lance le film :
              // l'affiche tient la place.
              preload="none"
              className="aspect-[9/16] w-full rounded-2xl bg-ink object-cover shadow-card"
            >
              Votre navigateur ne prend pas en charge la lecture vidéo.
            </video>
            <figcaption className="mt-2 text-center text-xs text-graytext">Le chantier en vidéo</figcaption>
          </figure>
        )}

        {heroPhoto && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroPhoto}
            alt={r.title}
            className={`mx-auto w-full max-w-sm rounded-2xl object-cover shadow-card lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none ${
              r.photoFormat === "portrait" ? "aspect-[3/4]" : "aspect-[4/3]"
            }`}
          />
        )}

        <div className="rounded-2xl bg-sand p-6 sm:max-w-2xl lg:col-start-1">
          {/* Espace insécable : le « ? » passait seul à la ligne sur téléphone. */}
          <p className="font-display text-lg font-semibold text-ink">Un projet de construction au Sénégal&nbsp;?</p>
          <p className="mt-1 text-sm leading-relaxed text-graytext">Écrivez-nous sur WhatsApp pour en parler.</p>
          <ButtonLink href={whatsappHref(WHATSAPP_MESSAGES.realisation(r.title))} className="mt-4">
            <WhatsAppIcon className="h-4 w-4" />
            Parlons de votre projet
          </ButtonLink>
        </div>
      </div>

      {showGallery && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-ink">Photos du chantier</h2>
          <p className="mt-1 text-sm text-graytext">
            {r.photos.length} photo{r.photos.length > 1 ? "s" : ""} · cliquez sur une photo pour l&apos;agrandir
          </p>
          <div className="mt-6">
            <RealisationGallery
              title={r.title}
              photos={r.photos}
              widePhotos={r.widePhotos}
              portrait={r.photoFormat === "portrait"}
            />
          </div>
        </section>
      )}

      {r.videoUrl && (
        <div className="mt-12 aspect-video w-full max-w-2xl overflow-hidden rounded-xl">
          <iframe src={r.videoUrl} title={`Vidéo — ${r.title}`} className="h-full w-full" allowFullScreen />
        </div>
      )}

      {others.length > 0 && (
        <section className="mt-20 border-t border-ink/10 pt-12">
          <h2 className="font-display text-2xl font-bold text-ink">Nos autres chantiers</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((other) => (
              <RealisationCard key={other.slug} realisation={other} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

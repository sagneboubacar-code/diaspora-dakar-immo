"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Galerie d'un chantier : des vignettes, et la photo entière en plein écran au
// clic — flèches, glissé du doigt sur téléphone, Échap pour fermer. Dans une
// vignette la photo est recadrée ; agrandie, on la voit telle qu'elle a été
// prise.
export function RealisationGallery({
  title,
  photos,
  groups,
  widePhotos = [],
  portrait = false,
}: {
  title: string;
  photos: string[];
  // Les mêmes photos en parties titrées ; la photo agrandie passe d'une
  // partie à l'autre sans s'arrêter.
  groups?: { title: string; photos: string[] }[];
  widePhotos?: string[];
  portrait?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const isOpen = open !== null;
  const closeButton = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (delta: number) => setOpen((i) => (i === null ? null : (i + delta + photos.length) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      else if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    // La page ne défile plus sous la photo agrandie.
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const trigger = opener.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      trigger?.focus();
    };
  }, [isOpen, close, step]);

  const label = (i: number) => `${title} — photo ${i + 1} sur ${photos.length}`;

  // Sans parties, une seule grille sans titre. `start` : la place de la
  // première photo de la partie dans la liste complète.
  const sections = (groups ?? [{ title: "", photos }]).map((section, s, all) => ({
    ...section,
    start: all.slice(0, s).reduce((n, previous) => n + previous.photos.length, 0),
  }));

  return (
    <>
      <div className="space-y-10">
        {sections.map((section) => (
          <div key={section.title || "photos"}>
            {section.title && (
              <h3 className="mb-4 font-display text-lg font-semibold text-ink">
                {section.title}
                <span className="ms-2 text-sm font-normal text-graytext">
                  {section.photos.length} photo{section.photos.length > 1 ? "s" : ""}
                </span>
              </h3>
            )}
            {/* `dense` : une photo en largeur qui ne tient pas au bout d'une
                ligne laisse la place à la suivante, sans trou dans la grille. */}
            <div
              className={`grid gap-2 ${
                portrait
                  ? "grid-flow-row-dense grid-cols-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
              }`}
            >
              {section.photos.map((photo, j) => {
                const i = section.start + j;
                return (
                  <button
                    key={photo}
                    type="button"
                    onClick={(event) => {
                      opener.current = event.currentTarget;
                      setOpen(i);
                    }}
                    aria-label={`Agrandir : ${label(i)}`}
                    className={`group relative w-full cursor-zoom-in overflow-hidden rounded-xl bg-sand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      !portrait
                        ? "aspect-[4/3]"
                        : widePhotos.includes(photo)
                          ? // Ces rapports donnent la hauteur de deux vignettes
                            // 3/4 et de l'espace entre elles : 61/40 sur trois
                            // colonnes, 49/32 sur quatre. La ligne reste alignée.
                            "col-span-2 aspect-[3/2] lg:aspect-[61/40] xl:aspect-[49/32]"
                          : "aspect-[3/4]"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Photos — ${title}`}
          className="fixed inset-0 z-[60] flex flex-col bg-black/95"
          onClick={close}
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0].clientX;
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return;
            const dx = event.changedTouches[0].clientX - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-white/80">
            <span aria-live="polite">
              {open + 1} / {photos.length}
            </span>
            <button
              ref={closeButton}
              type="button"
              onClick={close}
              aria-label="Fermer"
              className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-6 sm:px-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={photos[open]}
              src={photos[open]}
              alt={label(open)}
              onClick={(event) => event.stopPropagation()}
              className="max-h-full max-w-full rounded-lg object-contain"
            />

            {photos.length > 1 && (
              <>
                <ArrowButton direction="previous" onClick={() => step(-1)} />
                <ArrowButton direction="next" onClick={() => step(1)} />
                {/* Les deux voisines se chargent pendant qu'on regarde
                    celle-ci : la suivante s'affiche sans attente. */}
                {[open - 1, open + 1].map((i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={photos[(i + photos.length) % photos.length]}
                    alt=""
                    aria-hidden="true"
                    className="hidden"
                  />
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function ArrowButton({ direction, onClick }: { direction: "previous" | "next"; onClick: () => void }) {
  const previous = direction === "previous";
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      aria-label={previous ? "Photo précédente" : "Photo suivante"}
      className={`absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 sm:h-12 sm:w-12 ${
        previous ? "left-2 sm:left-5" : "right-2 sm:right-5"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path d={previous ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

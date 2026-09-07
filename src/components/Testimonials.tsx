"use client";

import { useEffect, useState } from "react";
import type { Testimonial } from "@/lib/data/types";

// « M. Dieng » doit donner « D », pas « MD » : la civilité n'est pas un
// prénom. Les clients qui préfèrent rester discrets sont publiés sous cette
// forme, il faut donc que l'initiale reste juste.
const HONORIFICS = new Set(["m.", "mme", "mlle", "dr", "pr"]);

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .filter((part) => !HONORIFICS.has(part.toLowerCase()))
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function projectsLabel(t: Testimonial) {
  if (!t.projects?.length) return null;
  return t.projects.length > 1 ? `${t.projects.length} projets confiés` : t.projectsLabel ?? "Projet";
}

// Durée d'un tour complet : proportionnelle au nombre de témoignages, pour que
// la vitesse de défilement reste la même quel qu'en soit le nombre.
const SECONDS_PER_CARD = 14;

export function Testimonials({ items }: { items: Testimonial[] }) {
  const [reading, setReading] = useState<Testimonial | null>(null);

  // Un seul témoignage ne peut pas défiler : il s'affiche en pleine largeur.
  if (items.length < 2) {
    return (
      <div className="container-site">
        <div className="mx-auto max-w-3xl">
          {items.map((t) => (
            <article key={t.name} className="rounded-3xl border border-ink/10 bg-white p-7 shadow-card sm:p-10">
              <TestimonialBody testimonial={t} />
            </article>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <Marquee items={items} paused={reading !== null} onRead={setReading} />
      {reading && <TestimonialModal testimonial={reading} onClose={() => setReading(null)} />}
    </>
  );
}

function Marquee({
  items,
  paused,
  onRead,
}: {
  items: Testimonial[];
  paused: boolean;
  onRead: (t: Testimonial) => void;
}) {
  const [held, setHeld] = useState(false);
  const loop = [...items, ...items];

  return (
    <div
      className="testimonials-viewport relative overflow-hidden"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
      // Au doigt, il n'y a pas de survol : une pression met le ruban en pause,
      // la suivante le relance.
      onTouchStart={() => setHeld((v) => !v)}
    >
      <ul
        // Aucun padding horizontal ici : la piste doit mesurer exactement
        // deux fois la largeur d'une série pour que le -50% reboucle pile.
        className="testimonials-track flex w-max"
        style={{
          animationDuration: `${items.length * SECONDS_PER_CARD}s`,
          animationPlayState: paused || held ? "paused" : "running",
        }}
      >
        {loop.map((t, i) => {
          const duplicate = i >= items.length;
          return (
            <li
              key={`${t.name}-${i}`}
              // La seconde moitié n'existe que pour le raccord visuel : elle
              // est retirée de l'arbre d'accessibilité pour ne pas faire lire
              // deux fois les mêmes témoignages.
              aria-hidden={duplicate}
              className="mr-6 w-[300px] shrink-0 sm:w-[360px]"
            >
              <MarqueeCard testimonial={t} onRead={() => onRead(t)} duplicate={duplicate} />
            </li>
          );
        })}
      </ul>

      {/* Fondus sur les bords : les cartes semblent entrer et sortir du ruban
          au lieu d'être coupées net. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-sand to-transparent sm:w-24"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-sand to-transparent sm:w-24"
      />
    </div>
  );
}

function MarqueeCard({
  testimonial: t,
  onRead,
  duplicate,
}: {
  testimonial: Testimonial;
  onRead: () => void;
  duplicate: boolean;
}) {
  const label = projectsLabel(t);

  return (
    <article className="flex h-full flex-col rounded-3xl border border-ink/10 bg-white p-6 text-left shadow-card">
      {t.badge && (
        <p className="inline-flex self-start rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
          {t.badge}
        </p>
      )}

      {t.headline && (
        <p className="mt-4 text-balance font-display text-base font-semibold leading-snug text-ink">
          {t.headline}
        </p>
      )}

      <p className="mt-4 line-clamp-5 border-l-2 border-primary/30 pl-4 text-sm leading-relaxed text-graytext">
        &laquo;&nbsp;{t.quote[0]}
      </p>

      <button
        type="button"
        onClick={onRead}
        // Les cartes du raccord ne sont pas atteignables au clavier : ce sont
        // les mêmes témoignages, déjà présents une fois.
        tabIndex={duplicate ? -1 : undefined}
        className="mt-3 self-start text-xs font-semibold uppercase tracking-wide text-primary underline decoration-primary/40 underline-offset-4 hover:text-primary-dark"
      >
        Lire le témoignage
      </button>

      <div className="mt-auto pt-6">
        {label && t.projects && (
          <div className="rounded-2xl bg-sand p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">{label}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-graytext">
              <span className="font-medium text-ink">{t.projects[0].title}</span>
              {t.projects[0].location && <span className="block">📍 {t.projects[0].location}</span>}
            </p>
          </div>
        )}
        <Signature testimonial={t} />
      </div>
    </article>
  );
}

function TestimonialModal({ testimonial: t, onClose }: { testimonial: Testimonial; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Témoignage de ${t.name}`}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-primary/20 bg-white p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer le témoignage"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
        >
          ✕
        </button>
        <TestimonialBody testimonial={t} />
      </div>
    </div>
  );
}

// Témoignage complet : utilisé dans la fenêtre de lecture, et quand il n'y a
// qu'un seul témoignage à afficher.
function TestimonialBody({ testimonial: t }: { testimonial: Testimonial }) {
  const last = t.quote.length - 1;
  const label = projectsLabel(t);

  return (
    <>
      {t.badge && (
        <p className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
          {t.badge}
        </p>
      )}

      {t.headline && (
        <p className="mt-4 max-w-[90%] text-balance font-display text-xl font-semibold text-ink sm:text-2xl">
          {t.headline}
        </p>
      )}

      <blockquote className="mt-6 space-y-4 border-l-2 border-primary/30 pl-5 text-sm leading-relaxed text-graytext">
        {t.quote.map((paragraph, i) => (
          <p key={i}>
            {i === 0 && <span aria-hidden>&laquo;&nbsp;</span>}
            {paragraph}
            {i === last && <span aria-hidden>&nbsp;&raquo;</span>}
          </p>
        ))}
      </blockquote>

      {label && t.projects && (
        <div className="mt-7 rounded-2xl bg-sand p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{label}</p>
          <ol className="mt-3 space-y-3 text-xs leading-relaxed text-graytext">
            {t.projects.map((project, i) => (
              <li key={project.title} className="flex gap-2.5">
                {t.projects!.length > 1 && (
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white font-display text-[10px] font-bold text-primary">
                    {i + 1}
                  </span>
                )}
                <span>
                  <span className="font-medium text-ink">{project.title}</span>
                  {project.location && <span className="block">📍 {project.location}</span>}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <Signature testimonial={t} />
    </>
  );
}

function Signature({ testimonial: t }: { testimonial: Testimonial }) {
  return (
    <div className="mt-6 flex items-center gap-4 border-t border-ink/10 pt-6">
      {t.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={t.photo} alt={t.name} className="h-12 w-12 shrink-0 rounded-full object-cover" />
      ) : (
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
          {initials(t.name)}
        </span>
      )}
      <div className="min-w-0">
        <p className="font-display text-sm font-semibold text-ink">
          {t.name} {t.flag && <span aria-hidden>{t.flag}</span>}
        </p>
        <p className="text-xs text-graytext">{t.country}</p>
      </div>
    </div>
  );
}

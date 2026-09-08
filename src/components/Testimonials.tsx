"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

// Durée d'affichage d'un témoignage avant de passer au suivant. Court par
// rapport au temps de lecture, mais assumé : qui veut lire arrête le
// défilement d'un survol ou d'une pression, et les commandes restent à portée.
const SLIDE_MS = 10000;

// Au-delà de ce déplacement, le doigt faisait défiler la page : ce n'est pas
// une pression sur le carrousel.
const TAP_TOLERANCE_PX = 10;

export function Testimonials({ items }: { items: Testimonial[] }) {
  const [active, setActive] = useState(0);
  // Trois signaux distincts plutôt qu'un seul booléen : sortir la souris ne
  // doit pas relancer le défilement si la flèche garde le focus clavier.
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const touchOrigin = useRef<{ x: number; y: number } | null>(null);
  const [reduced, setReduced] = useState(false);
  const held = hovered || focused || touched;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  const go = useCallback(
    (step: number) => setActive((current) => (current + step + items.length) % items.length),
    [items.length]
  );

  // Le minuteur est relancé à chaque changement d'index : passer au suivant à
  // la main redonne bien dix secondes pleines, sans saut immédiat.
  useEffect(() => {
    if (reduced || held || items.length < 2) return;
    const id = setTimeout(() => go(1), SLIDE_MS);
    return () => clearTimeout(id);
  }, [active, held, reduced, items.length, go]);

  if (items.length === 0) return null;

  const current = items[active];
  const rotating = items.length > 1 && !reduced;

  return (
    <div className="container-site">
      <div
        className="mx-auto max-w-3xl"
        role="group"
        aria-label="Témoignages de nos clients"
        // Personne ne doit se faire emporter en cours de lecture : le
        // défilement s'arrête dès que le visiteur s'intéresse au bloc, à la
        // souris, au clavier ou au doigt.
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={() => setFocused(false)}
        // Au doigt il n'y a ni survol ni focus à relâcher : c'est une pression
        // franche qui donne la main au visiteur, et elle la lui laisse. Un
        // simple défilement de la page part aussi d'un toucher sur le bloc —
        // le prendre pour une pression arrêtait le carrousel pour de bon.
        onTouchStart={(e) => {
          const touch = e.touches[0];
          touchOrigin.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
        }}
        onTouchEnd={(e) => {
          const origin = touchOrigin.current;
          const touch = e.changedTouches[0];
          touchOrigin.current = null;
          if (!origin || !touch) return;
          const moved =
            Math.abs(touch.clientX - origin.x) > TAP_TOLERANCE_PX ||
            Math.abs(touch.clientY - origin.y) > TAP_TOLERANCE_PX;
          if (!moved) setTouched(true);
        }}
      >
        {/* Toutes les cartes occupent la même cellule de grille : la hauteur
            du bloc est celle du témoignage le plus long, donc la page ne saute
            pas d'un témoignage à l'autre. Les cartes gardent en revanche leur
            hauteur propre : étirées, elles laissaient un grand blanc entre la
            citation et la signature. Ce qui reste sous les plus courtes est du
            fond de section, pas du vide dans la carte. */}
        <div className="relative grid items-start">
          {items.map((t, i) => (
            <div
              key={t.name}
              aria-hidden={i !== active}
              className={`col-start-1 row-start-1 transition-opacity duration-500 motion-reduce:transition-none ${
                i === active ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <article className="rounded-3xl border border-ink/10 bg-white p-7 shadow-card sm:p-10">
                <TestimonialBody testimonial={t} />
              </article>
            </div>
          ))}

          {items.length > 1 && (
            <>
              <SideArrow direction="previous" onClick={() => go(-1)} />
              <SideArrow direction="next" onClick={() => go(1)} />
            </>
          )}
        </div>

        {items.length > 1 && (
          <div>
            {/* Barre de progression : elle rend la durée d'affichage visible. La
                `key` la remet à zéro à chaque témoignage, et la pause la fige
                où elle en est plutôt que de la remplir d'un coup. Inutile
                quand le défilement automatique est désactivé. */}
            {rotating && (
              <div className="mt-6 h-0.5 overflow-hidden rounded-full bg-ink/10">
                <div
                  key={active}
                  className="h-full origin-left bg-primary"
                  style={{
                    animation: `progress-fill ${SLIDE_MS}ms linear forwards`,
                    animationPlayState: held ? "paused" : "running",
                  }}
                />
              </div>
            )}

            <div className="mt-5 flex items-center justify-center">
              <ol className="flex items-center gap-2">
                {items.map((t, i) => (
                  <li key={t.name}>
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      aria-label={`Témoignage de ${t.name}`}
                      aria-current={i === active}
                      className={`h-2 rounded-full transition-all ${
                        i === active ? "w-6 bg-primary" : "w-2 bg-ink/20 hover:bg-ink/40"
                      }`}
                    />
                  </li>
                ))}
              </ol>
            </div>

            <p className="mt-4 text-center text-xs text-graytext">
              {active + 1} / {items.length} — {current.name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Les flèches longent toute la hauteur de la carte et restent collées au
// milieu de l'écran : sur un téléphone, un témoignage fait plus de 1400 px de
// haut, une flèche centrée sur la carte serait hors de vue la plupart du
// temps. Sur mobile elles mordent sur la marge intérieure de la carte, jamais
// sur le texte ; sur grand écran elles se placent à l'extérieur.
function SideArrow({ direction, onClick }: { direction: "previous" | "next"; onClick: () => void }) {
  const previous = direction === "previous";
  return (
    <div
      className={`pointer-events-none absolute inset-y-0 z-10 ${previous ? "-left-4 lg:-left-16" : "-right-4 lg:-right-16"}`}
    >
      <Arrow
        direction={direction}
        onClick={onClick}
        className="pointer-events-auto sticky top-[calc(50vh-22px)] grid"
      />
    </div>
  );
}

function Arrow({
  direction,
  onClick,
  className = "",
}: {
  direction: "previous" | "next";
  onClick: () => void;
  className?: string;
}) {
  const previous = direction === "previous";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={previous ? "Témoignage précédent" : "Témoignage suivant"}
      className={`h-11 w-11 shrink-0 place-items-center rounded-full border border-primary/30 bg-white text-primary shadow-lg transition-colors hover:border-primary hover:bg-primary hover:text-white ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-6 w-6">
        <path
          d={previous ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

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
        <p className="mt-4 text-balance font-display text-xl font-semibold text-ink sm:text-2xl">
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

      <div className="mt-7">
        {label && t.projects && (
          <div className="rounded-2xl bg-sand p-5">
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
      </div>
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

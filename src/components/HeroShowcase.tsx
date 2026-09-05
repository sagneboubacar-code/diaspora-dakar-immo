"use client";

import { useEffect, useState } from "react";

export interface HeroPhase {
  n: string;
  label: string;
  photo: string;
  /** Durée d'affichage de cette étape. Par défaut : CYCLE_MS. */
  durationMs?: number;
}

// Durée d'affichage de chaque étape. Assez longue pour lire le titre et
// comprendre l'étape en cours, assez courte pour atteindre la dernière étape
// sans faire attendre le visiteur.
const CYCLE_MS = 3500;

// Le fond du Hero défile à travers les étapes du parcours (achat du terrain →
// gros œuvres → finitions → clés en mains), illustrées par des chantiers
// réels : le visiteur voit la maison se construire au lieu de lire qu'elle
// l'a été. Les étapes sont aussi cliquables pour revenir sur l'une d'elles.
export function HeroShowcase({
  phases,
  caption,
  children,
}: {
  phases: HeroPhase[];
  caption: React.ReactNode;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(0);
  // On suppose "mouvement réduit" tant que le client n'a pas répondu : aucun
  // défilement automatique ne démarre avant de savoir.
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReduced(query.matches);
      // Sans animation, on montre directement le résultat final plutôt que de
      // figer le visiteur sur une photo de gros œuvre.
      if (query.matches) setActive(phases.length - 1);
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [phases.length]);

  const currentMs = phases[active]?.durationMs ?? CYCLE_MS;

  useEffect(() => {
    if (reduced) return;
    // Chaîné sur `active` : un clic manuel relance aussi le compte à rebours.
    const id = setTimeout(() => setActive((current) => (current + 1) % phases.length), currentMs);
    return () => clearTimeout(id);
  }, [active, reduced, phases.length, currentMs]);

  return (
    <section className="relative flex min-h-[82vh] flex-col justify-end overflow-hidden bg-ink sm:min-h-[92vh]">
      {phases.map((phase, i) => (
        <div
          key={phase.n}
          aria-hidden
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url('${phase.photo}')` }}
        />
      ))}

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(17,17,17,0.30) 0%, rgba(17,17,17,0.60) 50%, rgba(17,17,17,0.95) 100%)",
        }}
      />

      <div className="container-site relative z-10 pb-8 pt-28 sm:pb-10 sm:pt-40">{children}</div>

      <div className="relative z-10 border-t border-white/15 bg-ink/50 backdrop-blur-sm">
        <div className="container-site py-5 sm:py-6">
          {caption}

          <ol className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-4 sm:gap-4">
            {phases.map((phase, i) => {
              const isActive = i === active;
              return (
                <li key={phase.n}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-current={isActive ? "step" : undefined}
                    className="group w-full rounded text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                  >
                    <span className="relative block h-0.5 w-full overflow-hidden rounded-full bg-white/20">
                      {isActive && (
                        <span
                          // `key` sur l'index : remonte l'élément à chaque
                          // changement d'étape pour rejouer l'animation.
                          key={active}
                          className="absolute inset-0 origin-left bg-primary"
                          style={{
                            animation: reduced
                              ? undefined
                              : `hero-progress ${currentMs}ms linear forwards`,
                            transform: reduced ? "scaleX(1)" : undefined,
                          }}
                        />
                      )}
                    </span>
                    <span
                      className={`mt-2.5 flex items-baseline gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors sm:text-xs ${
                        isActive ? "text-white" : "text-white/45 group-hover:text-white/75"
                      }`}
                    >
                      <span className={isActive ? "text-primary" : undefined}>{phase.n}</span>
                      {phase.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

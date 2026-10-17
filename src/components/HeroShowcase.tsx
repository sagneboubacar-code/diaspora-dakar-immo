"use client";

import { useEffect, useRef, useState } from "react";

export interface HeroPhase {
  n: string;
  label: string;
  /** Photo de l'étape : diaporama de secours, et image affichée avant la vidéo. */
  photo: string;
  /** Durée de l'étape dans le diaporama de secours. Par défaut : CYCLE_MS. */
  durationMs?: number;
  /** Instant (s) où l'étape commence dans la vidéo — voir scripts/build-hero-video.sh. */
  videoStartS?: number;
}

export interface HeroVideo {
  /** Montage 9:16, pour les écrans en hauteur (téléphones). */
  portrait: string;
  /** Montage 16:9, pour les écrans en largeur. */
  landscape: string;
}

// Durée d'une étape dans le diaporama de secours.
const CYCLE_MS = 3500;

// - video : le montage tourne, les étapes suivent son temps de lecture ;
// - slideshow : secours quand la vidéo ne peut pas démarrer (lecture
//   automatique bloquée, mode économie de données, erreur de chargement) ;
// - still : mouvement réduit demandé, on montre directement la villa livrée ;
// - pending : avant de savoir, la première photo (= première image du film).
type Mode = "pending" | "video" | "slideshow" | "still";

type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean } };

// Le fond du Hero montre un chantier réel, du terrain à la remise des clés.
// Les quatre étapes sous le texte se remplissent au rythme de la vidéo et
// restent pleines une fois passées : à la fin du film, la barre complète
// accompagne la villa livrée — le parcours se lit d'un bout à l'autre. Une
// étape cliquée ramène la vidéo à son début.
export function HeroShowcase({
  phases,
  video,
  caption,
  children,
}: {
  phases: HeroPhase[];
  video?: HeroVideo;
  caption: React.ReactNode;
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<Mode>("pending");
  const [active, setActive] = useState(0);
  const [videoShown, setVideoShown] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Barres de progression des deux emplacements (haut sur téléphone, bas
  // ailleurs), indexées par étape.
  const barsRef = useRef(new Map<string, { index: number; el: HTMLSpanElement }>());
  const activeRef = useRef(0);
  const slideStartRef = useRef(0);

  const showPhase = (index: number) => {
    activeRef.current = index;
    setActive(index);
  };

  // Choix du mode, revu si la préférence de mouvement change.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => {
      if (reduced.matches) return setMode("still");
      const saveData = (navigator as NavigatorWithConnection).connection?.saveData;
      setMode(video && !saveData ? "video" : "slideshow");
    };
    decide();
    reduced.addEventListener("change", decide);
    return () => reduced.removeEventListener("change", decide);
  }, [video]);

  // Lecture de la vidéo : cadrage selon l'orientation de l'écran, pause quand
  // le Hero sort de l'écran, et repli sur le diaporama si elle ne démarre pas.
  useEffect(() => {
    const el = videoRef.current;
    const section = sectionRef.current;
    if (mode !== "video" || !video || !el || !section) return;

    const portrait = window.matchMedia("(orientation: portrait)");
    const source = () => (portrait.matches ? video.portrait : video.landscape);
    // AbortError = lecture interrompue par une pause ou un changement de
    // source, pas un refus : seul un vrai refus déclenche le repli.
    const play = () =>
      el.play().catch((error: DOMException) => {
        if (error.name !== "AbortError") setMode("slideshow");
      });

    const onPlaying = () => setVideoShown(true);
    const onError = () => setMode("slideshow");
    el.addEventListener("playing", onPlaying);
    el.addEventListener("error", onError);

    el.muted = true;
    el.src = source();
    play();

    // Téléphone tourné : on change de cadrage sans repartir de zéro.
    const onOrientation = () => {
      const resumeAt = el.currentTime;
      el.src = source();
      el.addEventListener("loadedmetadata", () => (el.currentTime = resumeAt), { once: true });
      play();
    };
    portrait.addEventListener("change", onOrientation);

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) play();
      else el.pause();
    });
    observer.observe(section);

    return () => {
      observer.disconnect();
      portrait.removeEventListener("change", onOrientation);
      el.removeEventListener("playing", onPlaying);
      el.removeEventListener("error", onError);
      el.pause();
      el.removeAttribute("src");
      el.load();
      setVideoShown(false);
    };
  }, [mode, video]);

  // Étape courante et remplissage des barres, image par image. Les barres sont
  // écrites directement dans le DOM : un rendu React par image serait inutile.
  useEffect(() => {
    if (mode === "pending") return;

    const setBars = (current: number, fraction: number) => {
      barsRef.current.forEach(({ index, el }) => {
        const fill = index < current ? 1 : index > current ? 0 : Math.min(Math.max(fraction, 0), 1);
        el.style.transform = `scaleX(${fill})`;
      });
    };

    if (mode === "still") {
      showPhase(phases.length - 1);
      setBars(phases.length, 0);
      return;
    }

    const starts = phases.map((phase) => phase.videoStartS ?? 0);
    let frame = 0;

    const update = (now: number) => {
      let current = activeRef.current;
      let fraction = 0;

      if (mode === "video") {
        const el = videoRef.current;
        const t = el?.currentTime ?? 0;
        const total = el?.duration || 0;
        // Dernière étape déjà commencée (findLastIndex manque aux vieux iPhone).
        current = 0;
        starts.forEach((start, i) => {
          if (start <= t) current = i;
        });
        const end = starts[current + 1] ?? total;
        fraction = end > starts[current] ? (t - starts[current]) / (end - starts[current]) : 0;
      } else {
        const duration = phases[current].durationMs ?? CYCLE_MS;
        let elapsed = now - slideStartRef.current;
        if (elapsed >= duration) {
          current = (current + 1) % phases.length;
          slideStartRef.current = now;
          elapsed = 0;
        }
        fraction = elapsed / (phases[current].durationMs ?? CYCLE_MS);
      }

      if (current !== activeRef.current) showPhase(current);
      setBars(current, fraction);
    };

    const tick = (now: number) => {
      update(now);
      frame = requestAnimationFrame(tick);
    };

    // Filet de sécurité : certains modes d'économie d'énergie suspendent ou
    // ralentissent requestAnimationFrame alors que la vidéo continue ; son
    // horloge (`timeupdate`, ~4 fois par seconde) garde les étapes à jour.
    const el = videoRef.current;
    const onTimeUpdate = () => update(performance.now());
    if (mode === "video") el?.addEventListener("timeupdate", onTimeUpdate);

    slideStartRef.current = performance.now();
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      el?.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [mode, phases]);

  const goToPhase = (index: number) => {
    const el = videoRef.current;
    if (mode === "video" && el) {
      el.currentTime = (phases[index].videoStartS ?? 0) + 0.05;
      el.play().catch(() => {});
    } else {
      slideStartRef.current = performance.now();
      showPhase(index);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[82vh] flex-col justify-end overflow-hidden bg-ink sm:min-h-[92vh]"
    >
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

      {video && (
        <video
          ref={videoRef}
          aria-hidden
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            videoShown ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(17,17,17,0.30) 0%, rgba(17,17,17,0.60) 50%, rgba(17,17,17,0.95) 100%)",
        }}
      />

      {/* Téléphones : le texte remplit le premier écran et repousse le bandeau
          du bas sous la ligne de flottaison. Les étapes passent donc en haut de
          la vidéo, en barres façon « stories », visibles dès l'arrivée. */}
      <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-ink/75 via-ink/40 to-transparent pb-8 pt-3 sm:hidden">
        <div className="container-site">{renderSteps("top")}</div>
      </div>

      <div className="container-site relative z-10 pb-8 pt-28 sm:pb-10 sm:pt-40">{children}</div>

      <div className="relative z-10 border-t border-white/15 bg-ink/50 backdrop-blur-sm">
        <div className="container-site py-5 sm:py-6">
          {caption}
          <div className="hidden sm:block">{renderSteps("bottom")}</div>
        </div>
      </div>
    </section>
  );

  function renderSteps(placement: "top" | "bottom") {
    const top = placement === "top";
    return (
      <ol className={top ? "grid grid-cols-4 gap-2" : "mt-4 grid grid-cols-4 gap-4"}>
        {phases.map((phase, i) => {
          const isActive = i === active;
          const isDone = mode !== "still" && i < active;
          const key = `${placement}-${i}`;
          return (
            <li key={phase.n}>
              <button
                type="button"
                onClick={() => goToPhase(i)}
                aria-current={isActive ? "step" : undefined}
                className="group w-full rounded text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <span
                  className={`relative block w-full overflow-hidden rounded-full bg-white/25 ${
                    top ? "h-[3px]" : "h-0.5"
                  }`}
                >
                  <span
                    ref={(el) => {
                      if (el) barsRef.current.set(key, { index: i, el });
                      else barsRef.current.delete(key);
                    }}
                    className="absolute inset-0 origin-left bg-primary"
                    style={{ transform: "scaleX(0)" }}
                  />
                </span>
                <span
                  className={`font-semibold uppercase transition-colors ${
                    top
                      ? "mt-1.5 block text-[9px] leading-snug tracking-[0.08em] [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]"
                      : "mt-2.5 flex items-baseline gap-1.5 text-xs tracking-[0.14em]"
                  } ${
                    isActive
                      ? "text-white"
                      : isDone
                        ? "text-white/75 group-hover:text-white"
                        : "text-white/50 group-hover:text-white/75"
                  }`}
                >
                  <span className={isActive || isDone ? "text-primary" : undefined}>{phase.n}</span>
                  {top ? " " : null}
                  {phase.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    );
  }
}

"use client";

import { useEffect, useRef, useState } from "react";

export interface HeroPhoto {
  src: string;
  /** Durée d'affichage dans le diaporama de secours. Par défaut : CYCLE_MS. */
  durationMs?: number;
}

export interface HeroVideo {
  /** Montage 9:16, pour les écrans en hauteur (téléphones). */
  portrait: string;
  /** Montage 16:9, pour les écrans en largeur. */
  landscape: string;
}

// Durée d'une photo dans le diaporama de secours.
const CYCLE_MS = 3500;

// - video : le montage tourne en fond ;
// - slideshow : secours quand la vidéo ne peut pas démarrer (lecture
//   automatique refusée, mode économie de données, erreur de chargement) ;
// - still : mouvement réduit demandé, on montre directement la villa livrée ;
// - pending : avant de savoir, la première photo (= première image du film).
type Mode = "pending" | "video" | "slideshow" | "still";

type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean } };

// Fond du Hero : le montage vidéo d'un chantier réel, du terrain à la villa
// livrée, sous un voile sombre qui garde le texte lisible. Les photos du
// montage servent de diaporama quand la vidéo ne peut pas être lue.
export function HeroShowcase({
  photos,
  video,
  caption,
  children,
}: {
  /** Ordre chronologique : la première est la première image de la vidéo, la dernière la villa livrée. */
  photos: HeroPhoto[];
  video?: HeroVideo;
  caption: React.ReactNode;
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<Mode>("pending");
  const [active, setActive] = useState(0);
  const [videoShown, setVideoShown] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  // Photo affichée hors vidéo : la villa livrée en mouvement réduit, un
  // défilement chronologique en secours.
  useEffect(() => {
    if (mode === "still") setActive(photos.length - 1);
    if (mode !== "slideshow") return;
    const id = setTimeout(
      () => setActive((current) => (current + 1) % photos.length),
      photos[active].durationMs ?? CYCLE_MS
    );
    return () => clearTimeout(id);
  }, [mode, active, photos]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[82vh] flex-col justify-end overflow-hidden bg-ink sm:min-h-[92vh]"
    >
      {photos.map((photo, i) => (
        <div
          key={photo.src}
          aria-hidden
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url('${photo.src}')` }}
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

      <div className="container-site relative z-10 pb-10 pt-28 sm:pb-14 sm:pt-40">
        {children}
        <div className="mt-8 border-t border-white/15 pt-6 sm:mt-12">{caption}</div>
      </div>
    </section>
  );
}

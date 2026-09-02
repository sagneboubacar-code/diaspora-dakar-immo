"use client";

import { useState } from "react";
import { SITE } from "@/lib/site-config";

const STATS = [
  { value: `${SITE.experienceYears}+`, label: "Années d'expérience" },
  { value: `${SITE.projectsCompleted}+`, label: "Chantiers réalisés" },
  { value: "100%", label: "Titres fonciers contrôlés", explainable: true },
];

export function KeyStats() {
  const [open, setOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-ink/10 bg-white p-8 text-center shadow-card"
        >
          <p className="font-display text-4xl font-bold text-primary sm:text-5xl">{stat.value}</p>
          <p className="mt-2 text-sm font-medium text-graytext">{stat.label}</p>
          {stat.explainable && (
            <>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className="mt-3 text-xs font-semibold uppercase tracking-wide text-primary underline decoration-primary/40 underline-offset-4 hover:text-primary-dark"
              >
                {open ? "Masquer l'explication" : "Que signifie ce chiffre ?"}
              </button>
              {open && (
                <p className="mt-3 text-left text-xs leading-relaxed text-graytext">
                  Avant toute proposition, la situation juridique du terrain ou du bien (titre, statut
                  foncier, conformité) fait l&apos;objet d&apos;une vérification par notre équipe. Le détail
                  exact de cette procédure — étapes et documents contrôlés — sera précisé ici par l&apos;agence.
                </p>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

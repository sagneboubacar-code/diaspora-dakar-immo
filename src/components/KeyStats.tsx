"use client";

import { useState } from "react";
import { SITE } from "@/lib/site-config";

// Aucun nombre de chantiers n'est avancé tant que l'agence n'a pas communiqué
// de chiffre exact : le volume est dit en toutes lettres plutôt que chiffré.
const STATS = [
  { value: `${SITE.experienceYears}+`, label: "Années d'expérience" },
  { value: SITE.projectsClaim.value, label: SITE.projectsClaim.label, wording: true },
  { value: "100%", label: "Titres fonciers contrôlés", explainable: true },
];

export function KeyStats() {
  const [open, setOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-2xl border border-ink/10 bg-white p-8 text-center shadow-card ${
            // Trois cartes sur deux colonnes : la dernière prend toute la
            // largeur plutôt que de rester orpheline à côté d'un vide.
            stat.explainable ? "sm:col-span-2 lg:col-span-1" : ""
          }`}
        >
          {/* Une formulation ne peut pas être composée comme un chiffre : « De
              nombreux » garde une taille fixe pour tenir sur une ligne, même à
              1024 px où la carte est la plus étroite. La hauteur du bloc garde
              les libellés des trois cartes alignés entre eux. */}
          <div className="flex h-9 items-end justify-center lg:h-12">
            <p
              className={`font-display font-bold leading-none text-primary ${
                stat.wording ? "text-3xl" : "text-4xl lg:text-5xl"
              }`}
            >
              {stat.value}
            </p>
          </div>
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

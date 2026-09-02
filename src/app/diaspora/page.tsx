import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { LeadForm } from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Diaspora — Votre projet immobilier au Sénégal, à distance",
  description:
    "Diaspora Dakar Immo accompagne les Sénégalais de l'étranger : recherche de terrain, visites, vérifications, acquisition, construction, suivi de chantier et remise des clés.",
};

const ACCOMPAGNEMENT = [
  "Recherche de terrain",
  "Visites (y compris à distance)",
  "Vérifications préalables",
  "Acquisition",
  "Construction",
  "Suivi de chantier",
  "Photos",
  "Vidéos",
  "Rapports réguliers",
  "Gestion du bien",
  "Remise des clés",
];

export default function DiasporaPage() {
  return (
    <div className="py-16 sm:py-20">
      <div className="container-site">
        <SectionHeading
          eyebrow="🇸🇳 Diaspora"
          title="Votre projet au Sénégal, même à distance."
          subtitle="Vous êtes à l'étranger, notre équipe est sur le terrain."
        />

        <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-2">
          <div>
            <p className="text-sm leading-relaxed text-graytext">
              Vivre à l&apos;étranger ne doit pas être un frein à la réalisation d&apos;un projet immobilier au
              Sénégal. Depuis Dakar, notre équipe se déplace, vérifie, coordonne et vous tient informé à
              chaque étape — de la première recherche jusqu&apos;à la remise des clés.
            </p>

            <p className="mt-6 font-display text-lg font-semibold text-ink">
              Un accompagnement complet, à chaque étape :
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
              {ACCOMPAGNEMENT.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-ink">
                  <span className="text-primary">✓</span> {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl border border-primary/30 bg-primary/5 p-6">
              <p className="font-display text-lg font-semibold text-ink">
                Vous êtes à l&apos;étranger, notre équipe est sur le terrain.
              </p>
            </div>
          </div>

          <div id="formulaire" className="rounded-2xl border border-ink/10 bg-white p-7 shadow-card sm:p-8">
            <h2 className="font-display text-xl font-bold text-ink">Je prépare mon projet au Sénégal</h2>
            <p className="mt-1 text-sm text-graytext">
              Décrivez votre projet, un conseiller vous recontacte rapidement.
            </p>
            <div className="mt-6">
              <LeadForm variant="diaspora" submitLabel="PARLER À UN CONSEILLER" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

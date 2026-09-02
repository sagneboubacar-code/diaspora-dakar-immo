"use client";

interface TitleExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TitleExplanationModal({ isOpen, onClose }: TitleExplanationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm transition-opacity">
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-primary/20 bg-white p-6 shadow-2xl sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
          aria-label="Fermer la boîte de dialogue"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-xl font-bold text-primary">
            🛡️
          </span>
          <div>
            <h3 id="modal-title" className="font-display text-xl font-bold text-ink">
              Titres Fonciers Contrôlés (100%)
            </h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              2DKR Immo & Construction — Garantie & Transparence
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4 text-sm leading-relaxed text-graytext">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-ink">
            <p className="font-medium">
              💡 <strong>Que signifie « Titres fonciers contrôlés » ?</strong>
            </p>
            <p className="mt-1 text-xs text-graytext">
              Avant toute transaction, mise en vente ou projet de construction, l&apos;équipe 2DKR réalise une procédure systématique de vérification juridique et cadastrale auprès des autorités compétentes au Sénégal.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="font-bold text-primary">1.</span>
              <div>
                <strong className="text-ink">Vérification à la Conservation Foncière :</strong>
                <p className="text-xs text-graytext">Confirmation de l&apos;existence effective du Titre Foncier (TF) ou du droit réel inscrit aux livres fonciers.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-primary">2.</span>
              <div>
                <strong className="text-ink">Contrôle d&apos;Identité & Qualité du Vendeur :</strong>
                <p className="text-xs text-graytext">Vérification de la légitimité du propriétaire ou du mandataire habilité à effectuer la transaction.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-primary">3.</span>
              <div>
                <strong className="text-ink">Absence de Litige ou d&apos;Hypothèque :</strong>
                <p className="text-xs text-graytext">S&apos;assurer que la parcelle ou l&apos;immeuble ne fait l&apos;objet d&apos;aucune saisie, hypothèque ou contestation judiciaire.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-primary">4.</span>
              <div>
                <strong className="text-ink">Conformité des Plans & Bornage :</strong>
                <p className="text-xs text-graytext">Contrôle des limites géographiques et des plans de lotissement approuvés par les services du Cadastre.</p>
              </div>
            </div>
          </div>

          <p className="pt-2 text-xs italic text-gray-500">
            * L&apos;agence fournit l&apos;état des droits réels et l&apos;ensemble des justificatifs juridiques lors de votre demande de projet.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary"
          >
            J&apos;ai compris
          </button>
        </div>
      </div>
    </div>
  );
}

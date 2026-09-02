import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = { title: "Mentions légales", robots: { index: false } };

export default function LegalNoticePage() {
  return (
    <div className="container-site max-w-3xl py-16 sm:py-20">
      <SectionHeading eyebrow="Informations légales" title="Mentions légales" />
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-graytext">
        <section>
          <h2 className="font-display text-base font-semibold text-ink">Éditeur du site</h2>
          <p className="mt-2">
            {SITE.name} — {SITE.signature}
            <br />
            {SITE.address}
            <br />
            Téléphone : {SITE.phones.map((p) => p.label).join(" / ")}
            <br />
            Email : {SITE.email}
          </p>
          <p className="mt-2 text-xs text-graytext/70">
            Numéro d&apos;immatriculation (RCCM/NINEA) : à compléter par l&apos;agence.
          </p>
        </section>
        <section>
          <h2 className="font-display text-base font-semibold text-ink">Hébergement</h2>
          <p className="mt-2">Informations d&apos;hébergement à compléter.</p>
        </section>
        <section>
          <h2 className="font-display text-base font-semibold text-ink">Propriété intellectuelle</h2>
          <p className="mt-2">
            L&apos;ensemble des contenus (textes, photos, logo) présents sur ce site est la propriété de{" "}
            {SITE.name} sauf mention contraire, et ne peut être reproduit sans autorisation.
          </p>
        </section>
      </div>
    </div>
  );
}

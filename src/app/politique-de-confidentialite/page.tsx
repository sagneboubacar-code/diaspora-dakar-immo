import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = { title: "Politique de confidentialité", robots: { index: false } };

export default function PrivacyPolicyPage() {
  return (
    <div className="container-site max-w-3xl py-16 sm:py-20">
      <SectionHeading eyebrow="Vos données" title="Politique de confidentialité" />
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-graytext">
        <section>
          <h2 className="font-display text-base font-semibold text-ink">Données collectées</h2>
          <p className="mt-2">
            Lorsque vous remplissez un formulaire sur ce site (contact, projet diaspora, demande sur un
            bien), nous collectons les informations que vous saisissez : nom, pays de résidence, téléphone /
            WhatsApp, email et le contenu de votre message, afin de pouvoir vous recontacter.
          </p>
        </section>
        <section>
          <h2 className="font-display text-base font-semibold text-ink">Utilisation des données</h2>
          <p className="mt-2">
            Ces informations sont utilisées exclusivement par {SITE.name} ({SITE.signature}) pour traiter
            votre demande. Elles ne sont ni vendues, ni transmises à des tiers à des fins commerciales.
          </p>
        </section>
        <section>
          <h2 className="font-display text-base font-semibold text-ink">Vos droits</h2>
          <p className="mt-2">
            Vous pouvez demander l&apos;accès, la correction ou la suppression de vos données en nous
            contactant à {SITE.email}.
          </p>
        </section>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { ButtonLink } from "@/components/Button";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Merci",
  robots: { index: false },
};

export default function ThankYouPage({ searchParams }: { searchParams: { wa?: string } }) {
  return (
    <div className="container-site flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="text-5xl">✅</span>
      <h1 className="mt-5 font-display text-3xl font-bold text-ink">Votre demande a bien été reçue.</h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-graytext">
        Merci de votre confiance. Pour un échange plus rapide, continuez la conversation directement sur
        WhatsApp — un conseiller de {SITE.name} vous répond au plus vite.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {searchParams.wa && (
          <ButtonLink href={searchParams.wa}>💬 Continuer sur WhatsApp</ButtonLink>
        )}
        <ButtonLink href="/" variant="outline">
          Retour à l&apos;accueil
        </ButtonLink>
      </div>
    </div>
  );
}

import { ButtonLink } from "@/components/Button";
import { WHATSAPP_MESSAGES, whatsappHref } from "@/lib/site-config";

// Utilisé partout où du vrai contenu (biens, réalisations, témoignages)
// n'est pas encore disponible — le cahier des charges interdit d'inventer,
// donc ce composant remplace l'annonce plutôt que d'afficher du placeholder
// factice.
export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink/15 bg-sand/60 p-10 text-center">
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-graytext">{description}</p>
      <ButtonLink href={whatsappHref(WHATSAPP_MESSAGES.general)} className="mt-5">
        💬 Nous contacter sur WhatsApp
      </ButtonLink>
    </div>
  );
}

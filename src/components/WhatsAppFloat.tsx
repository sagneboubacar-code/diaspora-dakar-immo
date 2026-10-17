import { WhatsAppIcon } from "@/components/Icon";
import { WHATSAPP_MESSAGES, whatsappHref } from "@/lib/site-config";

// Bouton flottant permanent — reste accessible pendant le défilement, sur
// desktop comme sur mobile (position: fixed, hors du flux des pages).
export function WhatsAppFloat() {
  return (
    <a
      href={whatsappHref(WHATSAPP_MESSAGES.general)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Discuter sur WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 sm:bottom-7 sm:right-7"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}

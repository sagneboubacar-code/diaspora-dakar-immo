"use client";

import { SITE, WHATSAPP_MESSAGES, whatsappHref } from "@/lib/site-config";
import { PhoneIcon, WhatsAppIcon } from "@/components/Icon";

export function MobileActionBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-ink/10 bg-white/95 p-3 backdrop-blur lg:hidden">
      <div className="flex items-center gap-2">
        <a
          href={whatsappHref(WHATSAPP_MESSAGES.general)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-bold text-white shadow-md active:scale-95 transition-transform"
        >
          <WhatsAppIcon className="h-5 w-5" />
          WhatsApp
        </a>

        <a
          href={SITE.phones[0].href}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-bold text-white shadow-md active:scale-95 transition-transform"
        >
          <PhoneIcon className="h-5 w-5" />
          Appeler
        </a>
      </div>
    </div>
  );
}

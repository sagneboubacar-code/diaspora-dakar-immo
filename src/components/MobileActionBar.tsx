"use client";

import { SITE, WHATSAPP_MESSAGES, whatsappHref } from "@/lib/site-config";

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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.44 1.32 4.94L2 22l5.24-1.37a9.9 9.9 0 0 0 4.8 1.22h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm0 18.2h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.11.81.83-3.03-.2-.31a8.24 8.24 0 0 1-1.26-4.38c0-4.55 3.7-8.25 8.25-8.25 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.84c0 4.55-3.7 8.23-8.25 8.23Z" />
          </svg>
          💬 WhatsApp
        </a>

        <a
          href={SITE.phones[0].href}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-bold text-white shadow-md active:scale-95 transition-transform"
        >
          📞 Appeler
        </a>
      </div>
    </div>
  );
}

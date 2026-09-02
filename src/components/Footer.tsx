import Link from "next/link";
import { NAV_LINKS, SITE, WHATSAPP_MESSAGES, whatsappHref } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="bg-ink text-white/80">
      <div className="container-site grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg font-bold text-white">{SITE.name}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-primary">{SITE.signature}</p>
          <p className="mt-4 text-sm leading-relaxed text-white/60">Terrain · Construction · Immobilier · Gestion</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Navigation</p>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-white/70 hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>📍 {SITE.address}</li>
            {SITE.phones.map((phone) => (
              <li key={phone.href}>
                <a href={phone.href} className="hover:text-primary">
                  📞 {phone.label}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${SITE.email}`} className="hover:text-primary">
                ✉️ {SITE.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Échanger</p>
          <a
            href={whatsappHref(WHATSAPP_MESSAGES.general)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            💬 WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-3 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name} — {SITE.signature}. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            <Link href="/mentions-legales" className="hover:text-white/70">
              Mentions légales
            </Link>
            <Link href="/politique-de-confidentialite" className="hover:text-white/70">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

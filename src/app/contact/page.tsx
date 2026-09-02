import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { LeadForm } from "@/components/LeadForm";
import { SITE, WHATSAPP_MESSAGES, whatsappHref } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez Diaspora Dakar Immo (2DKR Immo & Construction) à Cité Gadaye, Guédiawaye, Dakar, par téléphone, WhatsApp, email ou via notre formulaire.",
};

const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(SITE.address)}&output=embed`;

export default function ContactPage() {
  return (
    <div className="container-site py-16 sm:py-20">
      <SectionHeading eyebrow="Contact" title="Parlons de votre projet" />

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="rounded-2xl border border-ink/10 bg-white p-7 shadow-card">
            <p className="font-display text-lg font-bold text-ink">{SITE.name}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{SITE.signature}</p>
            <ul className="mt-5 space-y-3 text-sm text-graytext">
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
            <a
              href={whatsappHref(WHATSAPP_MESSAGES.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              💬 Écrire sur WhatsApp
            </a>
          </div>

          <div className="overflow-hidden rounded-2xl border border-ink/10 shadow-card">
            <iframe
              title="Localisation Diaspora Dakar Immo"
              src={mapSrc}
              loading="lazy"
              className="h-72 w-full"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-7 shadow-card sm:p-8">
          <h2 className="font-display text-xl font-bold text-ink">Envoyez-nous un message</h2>
          <div className="mt-6">
            <LeadForm variant="contact" submitLabel="ENVOYER" />
          </div>
        </div>
      </div>
    </div>
  );
}

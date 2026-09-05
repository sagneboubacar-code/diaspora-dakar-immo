import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { SITE } from "@/lib/site-config";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Agence immobilière Dakar, Sénégal | Terrain, Construction, Immobilier, Gestion`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Diaspora Dakar Immo (2DKR Immo & Construction) accompagne les Sénégalais au pays et à l'étranger : recherche de terrain, construction, achat immobilier et gestion locative à Dakar et partout au Sénégal. 18 ans d'expérience, de nombreux projets réalisés et une équipe présente sur le terrain.",
  keywords: [
    "agence immobilière Dakar",
    "immobilier Dakar",
    "immobilier Sénégal",
    "terrain à vendre Sénégal",
    "terrain Dakar",
    "construction maison Sénégal",
    "construction Dakar",
    "maison à vendre Dakar",
    "appartement à vendre Dakar",
    "gestion immobilière Dakar",
    "gestion locative Dakar",
    "investir au Sénégal",
    "immobilier diaspora Sénégal",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE.name,
    url: SITE.url,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: SITE.name,
  alternateName: SITE.signature,
  url: SITE.url,
  email: SITE.email,
  telephone: SITE.phones.map((p) => p.href.replace("tel:", "")),
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address,
    addressLocality: "Guédiawaye, Dakar",
    addressCountry: "SN",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="flex min-h-screen flex-col bg-white font-sans text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
  // Une seule adresse, celle de SITE.url : le www et l'ancienne adresse
  // Vercel renvoient vers le domaine de l'agence, à la même page. Les liens
  // déjà partagés sur WhatsApp avec l'adresse Vercel mènent ainsi au bon
  // bien ou au bon chantier.
  async redirects() {
    return ["www.diasporadakarimmo.com", "diaspora-dakar-immo.vercel.app"].map((host) => ({
      source: "/:path*",
      has: [{ type: "host", value: host }],
      destination: "https://diasporadakarimmo.com/:path*",
      permanent: true,
    }));
  },
};

export default nextConfig;

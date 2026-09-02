import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site-config";

const ROUTES = ["/", "/nos-biens", "/nos-services", "/realisations", "/diaspora", "/a-propos", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}

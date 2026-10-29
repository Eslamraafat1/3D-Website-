import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { getArticleSlugs, getProjectSlugs } from "@/lib/services/content";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/work", "/studio", "/approach", "/journal", "/contact",
    ...getProjectSlugs().map((s) => `/work/${s}`),
    ...getArticleSlugs().map((s) => `/journal/${s}`)];
  return paths.flatMap((p) =>
    locales.map((lang) => ({
      url: `${SITE_URL}/${lang}${p}`,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : p.split("/").length > 2 ? 0.6 : 0.8,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${p}`])) },
    })),
  );
}

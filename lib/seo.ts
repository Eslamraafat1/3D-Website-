import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";

/** Builds per-page metadata with canonical + hreflang alternates and Open Graph. */
export function pageMetadata(lang: Locale, path: string, title: string, description: string, absoluteTitle = false): Metadata {
  const url = `/${lang}${path}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: { en: `/en${path}`, ar: `/ar${path}`, "x-default": `/en${path}` },
    },
    openGraph: { title, description, url, type: "website", locale: lang === "ar" ? "ar_AR" : "en_GB" },
    twitter: { card: "summary_large_image", title, description },
  };
}

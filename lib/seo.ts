import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { AUTHOR, SITE_URL } from "@/lib/site";

export const OG_ALT = "MONOLITH® — a fictional architecture & spatial design studio (portfolio project)";

/** Builds per-page metadata with canonical + hreflang alternates and Open Graph. */
export function pageMetadata(lang: Locale, path: string, title: string, description: string, absoluteTitle = false): Metadata {
  const url = `/${lang}${path}`;
  // Nested segments replace the parent's openGraph/twitter objects, so the
  // generated social card (app/[lang]/opengraph-image.tsx) is referenced explicitly.
  const image = { url: `/${lang}/opengraph-image`, width: 1200, height: 630, alt: OG_ALT };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: { en: `/en${path}`, ar: `/ar${path}`, "x-default": `/en${path}` },
    },
    openGraph: { title, description, url, type: "website", locale: lang === "ar" ? "ar_AR" : "en_GB", images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [{ ...image, url: `/${lang}/twitter-image` }] },
  };
}

/* ───────── Structured data (JSON-LD) ───────── */

type Json = Record<string, unknown>;
const abs = (path: string) => `${SITE_URL}${path}`;
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Serialises JSON-LD safely for a <script> tag (escapes `<` to prevent tag injection). */
export const jsonLdString = (data: Json | Json[]) => JSON.stringify(data).replace(/</g, "\\u003c");

/**
 * Site-wide graph: the (fictional) studio as a ProfessionalService and the
 * WebSite itself. No address, phone or geo data on purpose — the studio does
 * not exist, so nothing that could be mistaken for a real business listing.
 */
export function siteJsonLd(lang: Locale, brand: string, description: string): Json {
  const author = { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url, sameAs: [...AUTHOR.sameAs] };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": ORG_ID,
        name: brand,
        url: abs(`/${lang}`),
        description,
        disambiguatingDescription: "Fictional architecture studio — a front-end portfolio project, not a real business.",
        knowsAbout: ["Architecture", "Spatial design", "Material research"],
        founder: author,
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: brand,
        url: abs(`/${lang}`),
        inLanguage: lang,
        description,
        publisher: { "@id": ORG_ID },
        creator: author,
      },
    ],
  };
}

/** BreadcrumbList from `[name, path]` pairs (paths without the locale prefix). */
export function breadcrumbJsonLd(lang: Locale, items: [string, string][]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(`/${lang}${path}`) })),
  };
}

/** A (fictional) project as a CreativeWork. */
export function projectJsonLd(lang: Locale, p: { slug: string; title: string; summary: string; typology: string; year: number; location: string; country: string; categoryLabel: string }): Json {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": abs(`/${lang}/work/${p.slug}#work`),
    name: p.title,
    headline: `${p.title} — ${p.typology}`,
    description: p.summary,
    url: abs(`/${lang}/work/${p.slug}`),
    inLanguage: lang,
    genre: p.categoryLabel,
    dateCreated: String(p.year),
    contentLocation: { "@type": "Place", name: `${p.location}, ${p.country}` },
    creator: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
    isFamilyFriendly: true,
    creativeWorkStatus: "Fictional demo project",
  };
}

/** A journal essay as a BlogPosting. */
export function articleJsonLd(lang: Locale, a: { slug: string; title: string; excerpt: string; publishedAt: string; authorName: string }): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.excerpt,
    url: abs(`/${lang}/journal/${a.slug}`),
    mainEntityOfPage: abs(`/${lang}/journal/${a.slug}`),
    inLanguage: lang,
    datePublished: a.publishedAt,
    author: { "@type": "Person", name: a.authorName },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}

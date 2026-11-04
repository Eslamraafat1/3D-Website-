/** Production URL of the live demo — the last-resort fallback, so canonical / sitemap / OG URLs are never localhost or a placeholder. */
const PRODUCTION_URL = "https://3-d-website-seven-xi.vercel.app";

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const url = explicit || (vercel ? `https://${vercel}` : PRODUCTION_URL);
  return url.replace(/\/+$/, "");
}

export const SITE_URL = resolveSiteUrl();
export const DEMO_EMAIL = "studio@monolith.example";

export const AUTHOR = {
  name: "Eslam Raafat",
  url: "https://new-portfolio-ashy-xi.vercel.app",
  sameAs: ["https://github.com/Eslamraafat1", "https://www.linkedin.com/in/eslamraafat-dev/"],
} as const;

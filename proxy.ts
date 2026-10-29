import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { projectsRaw } from "@/lib/data/projects";
import { articlesRaw } from "@/lib/data/articles";

const locales = ["en", "ar"];
const projectSlugs = new Set(projectsRaw.map((p) => p.slug));
const articleSlugs = new Set(articlesRaw.map((a) => a.slug));

function preferredLocale(request: NextRequest): string {
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookie && locales.includes(cookie)) return cookie;
  const accept = request.headers.get("accept-language") ?? "";
  return /^\s*ar/i.test(accept) ? "ar" : "en";
}

// 1. Every page lives under /en or /ar: other paths are redirected to the
//    visitor's preferred language, keeping path and query string.
// 2. Unknown project / article slugs are rendered by the same (styled)
//    not-found page, but with a real 404 status — streaming would otherwise
//    answer 200.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (!hasLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }
  const m = pathname.match(/^\/(?:en|ar)\/(work|journal)\/([^/]+)\/?$/);
  if (m) {
    const known = m[1] === "work" ? projectSlugs : articleSlugs;
    if (!known.has(decodeURIComponent(m[2]))) return NextResponse.rewrite(request.nextUrl, { status: 404 });
  }
}

export const config = {
  matcher: ["/((?!_next|api|.*\..*).*)"],
};

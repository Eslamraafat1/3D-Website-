import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale, L } from "@/lib/i18n/config";
import { projectsRaw } from "@/lib/data/projects";
import { articlesRaw } from "@/lib/data/articles";
import { teamRaw } from "@/lib/data/team";
import { plansRaw } from "@/lib/data/plans";
import type { ArticleView, PlanView, ProjectRaw, ProjectView, TeamMemberView } from "@/lib/data/types";

/**
 * Content service. The functions are async and return plain serialisable
 * objects, so the in-memory implementation can later be swapped for a CMS or
 * API call without touching the UI.
 */

const fmtCoord = (lat: number, lon: number) =>
  `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? "E" : "W"}`;

const pick = (v: string | L | undefined, lang: Locale) => (typeof v === "object" && v ? v[lang] : v);

function toProject(p: ProjectRaw, lang: Locale): ProjectView {
  const d = getDictionary(lang);
  return {
    id: p.id, slug: p.slug, number: p.number, title: p.title[lang],
    category: p.category, categoryLabel: d.categories[p.category],
    location: p.location[lang], country: p.country[lang],
    year: p.year, area: p.area, duration: p.duration,
    status: p.status, statusLabel: d.status[p.status],
    typology: p.typology[lang], summary: p.summary[lang], concept: p.concept[lang], brief: p.brief[lang],
    challenges: p.challenges.map((c) => c[lang]), solutions: p.solutions.map((c) => c[lang]),
    coordsLabel: fmtCoord(p.coords.lat, p.coords.lon),
    art: p.art,
    gallery: p.gallery.map((g) => ({ art: g.art, view: g.view, viewLabel: d.views[g.view], alt: `${p.title[lang]} — ${d.views[g.view]}` })),
    materials: p.materials,
    services: p.services.map((s) => d.services[s]),
    metrics: p.metrics.map((m) => ({ label: m.label[lang], value: m.value, unit: pick(m.unit, lang) })),
    team: p.team, accent: p.accent, featured: !!p.featured,
  };
}

export async function getProjects(lang: Locale): Promise<ProjectView[]> {
  return projectsRaw.map((p) => toProject(p, lang));
}

export async function getProject(slug: string, lang: Locale): Promise<ProjectView | null> {
  const p = projectsRaw.find((x) => x.slug === slug);
  return p ? toProject(p, lang) : null;
}

export async function getFeaturedProject(lang: Locale): Promise<ProjectView> {
  const p = projectsRaw.find((x) => x.featured) ?? projectsRaw[0];
  return toProject(p, lang);
}

export function getProjectSlugs(): string[] {
  return projectsRaw.map((p) => p.slug);
}

export async function getAdjacentProjects(slug: string, lang: Locale) {
  const i = projectsRaw.findIndex((p) => p.slug === slug);
  const n = projectsRaw.length;
  return {
    prev: toProject(projectsRaw[(i - 1 + n) % n], lang),
    next: toProject(projectsRaw[(i + 1) % n], lang),
  };
}

export async function getRelatedProjects(slug: string, lang: Locale, count = 3): Promise<ProjectView[]> {
  const current = projectsRaw.find((p) => p.slug === slug);
  if (!current) return [];
  return projectsRaw
    .filter((p) => p.slug !== slug)
    .map((p) => ({ p, score: (p.category === current.category ? 2 : 0) + p.materials.filter((m) => current.materials.includes(m)).length }))
    .sort((a, b) => b.score - a.score || b.p.year - a.p.year)
    .slice(0, count)
    .map(({ p }) => toProject(p, lang));
}

export async function getPlan(slug: string, lang: Locale): Promise<PlanView | null> {
  const plan = plansRaw.find((p) => p.slug === slug);
  if (!plan) return null;
  return {
    slug, width: plan.width, height: plan.height,
    levels: plan.levels.map((lv) => ({
      id: lv.id, name: lv.name[lang],
      rooms: lv.rooms.map((rm) => ({
        id: rm.id, name: rm.name[lang], kind: rm.kind, x: rm.x, y: rm.y, w: rm.w, h: rm.h,
        area: Math.round(rm.w * rm.h * plan.scale * plan.scale), note: rm.note[lang],
      })),
    })),
  };
}

export async function getTeam(lang: Locale): Promise<TeamMemberView[]> {
  return teamRaw.map((m) => ({ id: m.id, name: m.name, role: m.role[lang], bio: m.bio[lang], art: m.art }));
}

export async function getTeamByIds(ids: string[], lang: Locale): Promise<TeamMemberView[]> {
  const all = await getTeam(lang);
  return ids.map((id) => all.find((m) => m.id === id)).filter((m): m is TeamMemberView => !!m);
}

function formatDate(iso: string, lang: Locale) {
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-GB", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(iso));
}

const articleCategories: Record<string, L> = {
  light: { en: "Light", ar: "الضوء" },
  materials: { en: "Materials", ar: "المواد" },
  sustainability: { en: "Sustainability", ar: "الاستدامة" },
  space: { en: "Spatial design", ar: "التصميم المكاني" },
};

export async function getArticles(lang: Locale): Promise<ArticleView[]> {
  return articlesRaw
    .map((a) => ({
      id: a.id, slug: a.slug, title: a.title[lang], category: a.category, categoryLabel: articleCategories[a.category][lang],
      excerpt: a.excerpt[lang], art: a.art, publishedAt: a.publishedAt, dateLabel: formatDate(a.publishedAt, lang),
      readingTime: a.readingTime, authorName: teamRaw.find((t) => t.id === a.author)?.name ?? "",
      content: a.content.map((b) => (b.type === "image" ? { type: "image" as const, art: b.art, caption: b.caption[lang] } : { type: b.type, text: b.text[lang] })),
    }))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getArticle(slug: string, lang: Locale): Promise<ArticleView | null> {
  return (await getArticles(lang)).find((a) => a.slug === slug) ?? null;
}

export function getArticleSlugs(): string[] {
  return articlesRaw.map((a) => a.slug);
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LayoutGrid, List, Search, X } from "lucide-react";
import { num, type Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/dictionaries";
import type { CategoryId, ProjectView } from "@/lib/data/types";
import ArchArt from "@/components/art/ArchArt";
import ProjectCard from "./ProjectCard";
import { EmptyState } from "@/components/ui/primitives";

type Sort = "year-desc" | "year-asc" | "name";
type View = "grid" | "list";
type Filters = { category: CategoryId | ""; country: string; year: string; q: string; sort: Sort; view: View };

const CATEGORY_ORDER: CategoryId[] = ["residential", "cultural", "hospitality", "commercial", "installation", "research"];

function parse(sp: URLSearchParams): Filters {
  const sort = sp.get("sort");
  return {
    category: (sp.get("category") as CategoryId) ?? "",
    country: sp.get("location") ?? "",
    year: sp.get("year") ?? "",
    q: sp.get("q") ?? "",
    sort: sort === "year-asc" || sort === "name" ? sort : "year-desc",
    view: sp.get("view") === "list" ? "list" : "grid",
  };
}

function serialize(f: Filters) {
  const sp = new URLSearchParams();
  if (f.category) sp.set("category", f.category);
  if (f.country) sp.set("location", f.country);
  if (f.year) sp.set("year", f.year);
  if (f.q) sp.set("q", f.q);
  if (f.sort !== "year-desc") sp.set("sort", f.sort);
  if (f.view !== "grid") sp.set("view", f.view);
  return sp.toString();
}

const SPAN = [
  { col: "lg:col-span-7", aspect: "aspect-[4/5] lg:aspect-[16/11]", mt: "" },
  { col: "lg:col-span-5", aspect: "aspect-[4/5]", mt: "lg:mt-32" },
  { col: "lg:col-span-5", aspect: "aspect-[4/5] lg:aspect-[4/3]", mt: "" },
  { col: "lg:col-span-7", aspect: "aspect-[4/5] lg:aspect-[16/10]", mt: "lg:mt-20" },
];

export default function WorkBrowser({ projects, lang, dict }: { projects: ProjectView[]; lang: Locale; dict: Dict }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduce = useReducedMotion();
  const [f, setF] = useState<Filters>(() => parse(new URLSearchParams(searchParams.toString())));

  // Filters live in React state; the URL mirrors them so any view can be shared.
  function update(patch: Partial<Filters>) {
    const next = { ...f, ...patch };
    setF(next);
    const qs = serialize(next);
    window.history.replaceState(null, "", `${pathname}${qs ? `?${qs}` : ""}`);
  }

  const categories = useMemo(() => CATEGORY_ORDER.filter((c) => projects.some((p) => p.category === c)), [projects]);
  const countries = useMemo(() => [...new Set(projects.map((p) => p.country))].sort((a, b) => a.localeCompare(b, lang)), [projects, lang]);
  const years = useMemo(() => [...new Set(projects.map((p) => p.year))].sort((a, b) => b - a), [projects]);

  const results = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    return projects
      .filter((p) => (!f.category || p.category === f.category) && (!f.country || p.country === f.country) && (!f.year || String(p.year) === f.year) && (!q || p.title.toLowerCase().includes(q)))
      .sort((a, b) => (f.sort === "name" ? a.title.localeCompare(b.title, lang) : f.sort === "year-asc" ? a.year - b.year : b.year - a.year));
  }, [projects, f, lang]);

  const active = !!(f.category || f.country || f.year || f.q);
  const fadeIn = reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 }, transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] as const } };

  return (
    <div>
      <form role="search" aria-label={dict.work.search} onSubmit={(e) => e.preventDefault()} className="-mx-[var(--gutter)] lg:sticky lg:top-[var(--nav-h)] lg:z-[40] border-y border-line bg-bg/95 px-[var(--gutter)] py-4 backdrop-blur-sm">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
          <div className="field lg:col-span-3">
            <label htmlFor="work-q">{dict.work.search}</label>
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute start-0 top-1/2 -translate-y-1/2 text-fg-2" aria-hidden />
              <input id="work-q" type="search" value={f.q} onChange={(e) => update({ q: e.target.value })} placeholder={dict.work.searchPlaceholder} className="input !ps-7" autoComplete="off" />
            </div>
          </div>
          <div className="field lg:col-span-2">
            <label htmlFor="work-loc">{dict.work.location}</label>
            <select id="work-loc" className="input" value={f.country} onChange={(e) => update({ country: e.target.value })}>
              <option value="">{dict.work.allLocations}</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="field lg:col-span-2">
            <label htmlFor="work-year">{dict.work.year}</label>
            <select id="work-year" className="input" value={f.year} onChange={(e) => update({ year: e.target.value })}>
              <option value="">{dict.work.allYears}</option>
              {years.map((y) => <option key={y} value={y}>{num(y, lang)}</option>)}
            </select>
          </div>
          <div className="field lg:col-span-2">
            <label htmlFor="work-sort">{dict.work.sort}</label>
            <select id="work-sort" className="input" value={f.sort} onChange={(e) => update({ sort: e.target.value as Sort })}>
              <option value="year-desc">{dict.work.sortYearDesc}</option>
              <option value="year-asc">{dict.work.sortYearAsc}</option>
              <option value="name">{dict.work.sortName}</option>
            </select>
          </div>
          <div className="flex items-center gap-2 lg:col-span-3 lg:justify-end" role="group" aria-label={dict.work.view}>
            {(["grid", "list"] as const).map((v) => (
              <button key={v} type="button" aria-pressed={f.view === v} onClick={() => update({ view: v })} className={`label inline-flex min-h-11 items-center gap-2 border px-4 transition-colors ${f.view === v ? "border-fg bg-fg text-bg" : "border-line hover:border-fg"}`}>
                {v === "grid" ? <LayoutGrid size={14} aria-hidden /> : <List size={14} aria-hidden />} {dict.work[v]}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label={dict.work.category}>
          <button type="button" aria-pressed={!f.category} onClick={() => update({ category: "" })} className={`label min-h-9 border px-4 transition-colors ${!f.category ? "border-fg bg-fg text-bg" : "border-line hover:border-fg"}`}>{dict.work.allCategories}</button>
          {categories.map((c) => (
            <button key={c} type="button" aria-pressed={f.category === c} onClick={() => update({ category: f.category === c ? "" : c })} className={`label min-h-9 border px-4 transition-colors ${f.category === c ? "border-fg bg-fg text-bg" : "border-line hover:border-fg"}`}>{dict.categories[c]}</button>
          ))}
          {active && (
            <button type="button" onClick={() => { setF({ ...f, category: "", country: "", year: "", q: "" }); window.history.replaceState(null, "", `${pathname}${serialize({ ...f, category: "", country: "", year: "", q: "" }) ? `?${serialize({ ...f, category: "", country: "", year: "", q: "" })}` : ""}`); }} className="label ms-auto inline-flex min-h-9 items-center gap-2 text-accent-text underline underline-offset-4">
              <X size={14} aria-hidden /> {dict.work.clear}
            </button>
          )}
        </div>
      </form>

      <p className="mono mb-14 mt-8 text-fg-2" role="status" aria-live="polite">
        {dict.work.showing} <span className="text-fg">{num(results.length, lang)}</span> {dict.work.of} {num(projects.length, lang)} {dict.work.results}
      </p>

      {results.length === 0 ? (
        <EmptyState
          title={dict.work.empty}
          hint={dict.work.emptyHint}
          action={<button type="button" className="btn" onClick={() => update({ category: "", country: "", year: "", q: "" })}>{dict.work.clear}</button>}
        />
      ) : f.view === "grid" ? (
        <div className="grid grid-cols-1 gap-x-8 gap-y-20 lg:grid-cols-12 lg:gap-y-14">
          <AnimatePresence mode="popLayout">
            {results.map((p, i) => {
              const s = SPAN[i % SPAN.length];
              return (
                <motion.div key={p.id} layout={!reduce} {...fadeIn} className={`${s.col} ${s.mt}`}>
                  <ProjectCard project={p} lang={lang} dict={dict} aspect={s.aspect} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <ul className="border-b border-line">
          <li className="mono hidden grid-cols-12 gap-4 border-t border-line py-3 text-fg-2 md:grid" aria-hidden>
            <span className="col-span-1">№</span><span className="col-span-4">{dict.common.number}</span><span className="col-span-2">{dict.common.category}</span><span className="col-span-3">{dict.common.location}</span><span className="col-span-1">{dict.common.year}</span><span className="col-span-1 text-end">{dict.common.area}</span>
          </li>
          <AnimatePresence mode="popLayout">
            {results.map((p) => (
              <motion.li key={p.id} layout={!reduce} {...fadeIn} className="border-t border-line">
                <Link href={`/${lang}/work/${p.slug}`} className="group grid grid-cols-12 items-center gap-4 py-5 transition-colors hover:bg-surface md:py-6">
                  <span className="mono col-span-2 text-accent-text md:col-span-1" dir="ltr">{p.number}</span>
                  <span className="col-span-10 flex items-center gap-4 md:col-span-4">
                    <ArchArt art={p.art} className="hidden h-14 w-20 shrink-0 sm:block" />
                    <span className="display text-[clamp(1.6rem,2.6vw,2.6rem)] leading-none">{p.title}</span>
                  </span>
                  <span className="col-span-5 col-start-3 text-fg-2 md:col-span-2 md:col-start-auto">{p.categoryLabel}</span>
                  <span className="col-span-5 text-fg-2 md:col-span-3">{p.location}, {p.country}</span>
                  <span className="col-span-2 col-start-3 mono md:col-span-1 md:col-start-auto">{num(p.year, lang)}</span>
                  <span className="col-span-5 mono text-end md:col-span-1">{num(p.area, lang)} {dict.common.sqm}</span>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { num, type Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/dictionaries";
import type { ArticleView } from "@/lib/data/types";
import { EmptyState } from "@/components/ui/primitives";
import ArticleCard from "./ArticleCard";

export default function JournalBrowser({ articles, lang, dict }: { articles: ArticleView[]; lang: Locale; dict: Dict }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const cats = useMemo(() => {
    const m = new Map<string, string>();
    articles.forEach((a) => m.set(a.category, a.categoryLabel));
    return [...m.entries()];
  }, [articles]);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    return articles.filter((a) => (!cat || a.category === cat) && (!s || `${a.title} ${a.excerpt}`.toLowerCase().includes(s)));
  }, [articles, q, cat]);

  const [lead, ...rest] = results;
  const filtering = !!(q || cat);

  return (
    <div>
      <form role="search" aria-label={dict.journal.search} onSubmit={(e) => e.preventDefault()} className="mb-14 grid gap-6 border-y border-line py-5 md:grid-cols-12 md:items-end">
        <div className="field md:col-span-4">
          <label htmlFor="journal-q">{dict.journal.search}</label>
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute start-0 top-1/2 -translate-y-1/2 text-fg-2" aria-hidden />
            <input id="journal-q" type="search" className="input !ps-7" placeholder={dict.journal.searchPlaceholder} value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 md:col-span-8 md:justify-end" role="group" aria-label={dict.common.category}>
          <button type="button" aria-pressed={!cat} onClick={() => setCat("")} className={`label min-h-9 border px-4 transition-colors ${!cat ? "border-fg bg-fg text-bg" : "border-line hover:border-fg"}`}>{dict.common.all}</button>
          {cats.map(([id, label]) => (
            <button key={id} type="button" aria-pressed={cat === id} onClick={() => setCat(cat === id ? "" : id)} className={`label min-h-9 border px-4 transition-colors ${cat === id ? "border-fg bg-fg text-bg" : "border-line hover:border-fg"}`}>{label}</button>
          ))}
        </div>
      </form>

      <p className="mono mb-10 text-fg-2" role="status" aria-live="polite">{num(results.length, lang)} {dict.journal.results}</p>

      {results.length === 0 ? (
        <EmptyState title={dict.journal.empty} hint={dict.journal.emptyHint} action={<button type="button" className="btn" onClick={() => { setQ(""); setCat(""); }}>{dict.work.clear}</button>} />
      ) : (
        <div className="grid gap-x-8 gap-y-16 md:grid-cols-12">
          {lead && (
            <div className="md:col-span-12">
              {!filtering && <p className="label mb-4 text-accent-text">{dict.journal.featured}</p>}
              <ArticleCard article={lead} lang={lang} dict={dict} large aspect="aspect-[16/9]" />
            </div>
          )}
          {rest.map((a, i) => (
            <ArticleCard key={a.id} article={a} lang={lang} dict={dict} delay={i * 0.08} aspect="aspect-[4/3]" className={`md:col-span-4 ${i === 1 ? "md:mt-16" : ""}`} />
          ))}
        </div>
      )}
    </div>
  );
}

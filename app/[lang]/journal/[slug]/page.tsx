import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { isLocale, locales, num } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getArticle, getArticleSlugs, getArticles } from "@/lib/services/content";
import { pageMetadata } from "@/lib/seo";
import ArchArt from "@/components/art/ArchArt";
import ArticleCard from "@/components/sections/ArticleCard";
import Reveal from "@/components/ui/Reveal";
import ShareButton from "@/components/ui/ShareButton";
import { Section, SectionLabel } from "@/components/ui/primitives";


type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((lang) => getArticleSlugs().map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const a = await getArticle(slug, lang);
  if (!a) return { title: getDictionary(lang).meta.notFound.title };
  const meta = pageMetadata(lang, `/journal/${slug}`, a.title, a.excerpt);
  return { ...meta, openGraph: { ...meta.openGraph, type: "article", publishedTime: a.publishedAt } };
}

export default async function ArticlePage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const article = await getArticle(slug, lang);
  if (!article) notFound();
  const dict = getDictionary(lang);
  const related = (await getArticles(lang)).filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <article className="page-enter">
      <header className="pb-12 pt-[calc(var(--nav-h)+3rem)]" data-section={dict.journal.label}>
        <div className="wrap">
          <Link href={`/${lang}/journal`} className="label mb-10 inline-flex items-center gap-2 text-fg-2 hover:text-fg"><ArrowLeft size={14} className="rtl:-scale-x-100" aria-hidden /> {dict.journal.backToJournal}</Link>
          <p className="mono flex flex-wrap gap-x-5 text-fg-2">
            <span className="text-accent-text">{article.categoryLabel}</span>
            <time dateTime={article.publishedAt}>{dict.journal.published} {article.dateLabel}</time>
            <span>{num(article.readingTime, lang)} {dict.common.minutesRead}</span>
          </p>
          <h1 className="display mt-6 max-w-[18ch] text-[clamp(3rem,9vw,9rem)]">{article.title}</h1>
          <p className="lead mt-8">{article.excerpt}</p>
          <p className="mono mt-6 text-fg-2">{dict.journal.by} {article.authorName}</p>
        </div>
      </header>

      <ArchArt art={article.art} label={article.title} className="mx-auto aspect-[16/8] w-full max-w-[var(--max)]" />

      <Section label={article.title} className="section">
        <div className="wrap prose-block grid gap-8 md:grid-cols-12">
          <div className="grid gap-8 md:col-span-8 md:col-start-3">
            {article.content.map((b, i) => {
              if (b.type === "h2") return <Reveal key={i}><h2 className="display mt-8 text-[clamp(2rem,4vw,3.4rem)]">{b.text}</h2></Reveal>;
              if (b.type === "quote") return <Reveal key={i}><blockquote className="display border-s-2 border-accent ps-6 text-[clamp(1.8rem,3.6vw,3.2rem)] leading-[1.1]">“{b.text}”</blockquote></Reveal>;
              if (b.type === "image") return (
                <Reveal key={i} mask className="md:-mx-24">
                  <figure>
                    <ArchArt art={b.art} label={b.caption} className="aspect-[16/9] w-full" />
                    <figcaption className="mono mt-3 text-fg-2">{b.caption}</figcaption>
                  </figure>
                </Reveal>
              );
              return <Reveal key={i}><p>{b.text}</p></Reveal>;
            })}
          </div>
        </div>
        <div className="wrap mt-16 md:grid md:grid-cols-12">
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 md:col-span-8 md:col-start-3">
            <ShareButton title={article.title} label={dict.journal.share} doneLabel={dict.journal.shared} failLabel={dict.common.copyFailed} />
            <Link href={`/${lang}/journal`} className="label link-u">{dict.journal.backToJournal}</Link>
          </div>
        </div>
      </Section>

      <Section label={dict.journal.related} className="section border-t border-line bg-surface">
        <div className="wrap">
          <SectionLabel n="∞" className="mb-12">{dict.journal.related}</SectionLabel>
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-3">
            {related.map((a, i) => <ArticleCard key={a.id} article={a} lang={lang} dict={dict} delay={i * 0.08} aspect="aspect-[4/3]" />)}
          </div>
        </div>
      </Section>
    </article>
  );
}

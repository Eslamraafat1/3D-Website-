import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getArticles } from "@/lib/services/content";
import { pageMetadata } from "@/lib/seo";
import JournalBrowser from "@/components/sections/JournalBrowser";
import { Section, SectionLabel } from "@/components/ui/primitives";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang);
  return pageMetadata(lang, "/journal", d.meta.journal.title, d.meta.journal.description);
}

export default async function JournalPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const articles = await getArticles(lang);

  return (
    <div className="page-enter pt-[calc(var(--nav-h)+4rem)]">
      <Section label={dict.journal.label} className="wrap pb-24">
        <header className="mb-14 grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <SectionLabel n="∅" className="mb-6">{dict.journal.label}</SectionLabel>
            <h1 className="display text-[clamp(4rem,13vw,12rem)]">{dict.journal.title}</h1>
          </div>
          <p className="lead md:col-span-4">{dict.journal.intro}</p>
        </header>
        <JournalBrowser articles={articles} lang={lang} dict={dict} />
      </Section>
    </div>
  );
}

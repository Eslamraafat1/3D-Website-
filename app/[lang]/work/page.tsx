import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getProjects } from "@/lib/services/content";
import { pageMetadata } from "@/lib/seo";
import WorkBrowser from "@/components/work/WorkBrowser";
import { SectionLabel } from "@/components/ui/primitives";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang);
  return pageMetadata(lang, "/work", d.meta.work.title, d.meta.work.description);
}

export default async function WorkPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const projects = await getProjects(lang);

  return (
    <div className="page-enter pt-[calc(var(--nav-h)+4rem)]">
      <div className="wrap pb-24">
        <header data-section={dict.work.label} className="mb-14 grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <SectionLabel n="∅" className="mb-6">{dict.work.label}</SectionLabel>
            <h1 className="display text-[clamp(4rem,13vw,12rem)]">{dict.work.title}</h1>
          </div>
          <p className="lead md:col-span-4">{dict.work.intro}</p>
        </header>
        <Suspense fallback={<div className="grid gap-6 md:grid-cols-2" aria-busy="true" aria-label={dict.common.loading}>{[0, 1].map((i) => <div key={i} className="aspect-[4/3] animate-pulse bg-surface" />)}</div>}>
          <WorkBrowser projects={projects} lang={lang} dict={dict} />
        </Suspense>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getArticles, getFeaturedProject, getProjects, getTeam } from "@/lib/services/content";
import { pageMetadata } from "@/lib/seo";
import Hero from "@/components/home/Hero";
import MaterialLab from "@/components/home/MaterialLab";
import Blueprint from "@/components/home/Blueprint";
import { ContactBlock, Featured, JournalPreview, Philosophy, SelectedWorks, Statement, Stats, StudioPreview } from "@/components/home/HomeSections";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang);
  return pageMetadata(lang, "", d.meta.home.title, d.meta.home.description, true);
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const [projects, featured, articles, team] = await Promise.all([getProjects(lang), getFeaturedProject(lang), getArticles(lang), getTeam(lang)]);

  return (
    <div className="page-enter">
      <Hero lang={lang} dict={dict} projects={projects} />
      <Statement lang={lang} dict={dict} />
      <Featured lang={lang} dict={dict} project={featured} />
      <SelectedWorks lang={lang} dict={dict} projects={projects} />
      <MaterialLab dict={dict} />
      <Blueprint dict={dict} />
      <Philosophy lang={lang} dict={dict} />
      <Stats lang={lang} dict={dict} />
      <JournalPreview lang={lang} dict={dict} articles={articles} />
      <StudioPreview lang={lang} dict={dict} team={team} />
      <ContactBlock lang={lang} dict={dict} />
    </div>
  );
}

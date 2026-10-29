import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { isLocale, locales, num } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getAdjacentProjects, getPlan, getProject, getProjectSlugs, getRelatedProjects, getTeamByIds } from "@/lib/services/content";
import { materialArt } from "@/lib/data/materials";
import { pageMetadata } from "@/lib/seo";
import ArchArt from "@/components/art/ArchArt";
import FloorPlan from "@/components/plan/FloorPlan";
import ProjectGallery from "@/components/work/ProjectGallery";
import ProjectCard from "@/components/work/ProjectCard";
import Reveal from "@/components/ui/Reveal";
import { CountUp, Parallax } from "@/components/ui/Motion";
import { ButtonLink, ProjectMeta, Section, SectionLabel } from "@/components/ui/primitives";


type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((lang) => getProjectSlugs().map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const p = await getProject(slug, lang);
  if (!p) return { title: getDictionary(lang).meta.notFound.title };
  return pageMetadata(lang, `/work/${slug}`, `${p.title} — ${p.typology}`, p.summary);
}

export default async function CaseStudyPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const project = await getProject(slug, lang);
  if (!project) notFound();
  const dict = getDictionary(lang);
  const [plan, team, adjacent, related] = await Promise.all([
    getPlan(slug, lang), getTeamByIds(project.team, lang), getAdjacentProjects(slug, lang), getRelatedProjects(slug, lang),
  ]);
  const identity = { "--proj": `color-mix(in srgb, ${project.accent} 72%, var(--fg))` } as CSSProperties;
  const metrics = [
    { label: dict.common.area, value: project.area, unit: dict.common.sqm },
    { label: dict.common.duration, value: project.duration, unit: dict.common.months },
    ...project.metrics,
  ];

  return (
    <article className="page-enter" style={identity}>
      {/* 1 — Cover */}
      <Section label={dict.case.overview} className="relative min-h-svh overflow-hidden bg-[#171916] text-[#f5f3ee]">
        <Parallax amount={6} className="absolute inset-0">
          <ArchArt art={project.art} label={project.title} className="h-full w-full" />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-t from-[#171916] via-[#171916]/30 to-[#171916]/40" />
        <div className="wrap relative flex min-h-svh flex-col justify-between pb-10 pt-[calc(var(--nav-h)+2rem)]">
          <div className="flex items-start justify-between gap-6">
            <Link href={`/${lang}/work`} className="label inline-flex items-center gap-2 opacity-85 hover:opacity-100"><ArrowLeft size={14} className="rtl:-scale-x-100" aria-hidden /> {dict.case.allProjects}</Link>
            <p className="mono opacity-85" dir="ltr">{project.number} — {project.coordsLabel}</p>
          </div>
          <div>
            <p className="mono mb-5 text-[#e8b595]">{project.categoryLabel} · {project.statusLabel}</p>
            <h1 className="display text-[clamp(3.6rem,13vw,14rem)] uc leading-[0.86]">{project.title}</h1>
            <p className="lead mt-8 !text-[#e4dfd2]">{project.summary}</p>
          </div>
        </div>
      </Section>

      {/* 2 — Overview */}
      <Section label={dict.case.concept} className="section">
        <div className="wrap grid gap-14 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
              <ProjectMeta project={project} dict={dict} lang={lang} compact />
              <p className="label mb-3 mt-10 text-fg-2">{dict.common.services}</p>
              <ul className="flex flex-wrap gap-2">{project.services.map((s) => <li key={s} className="mono border border-line px-3 py-1.5">{s}</li>)}</ul>
            </div>
          </aside>
          <div className="lg:col-span-8">
            <SectionLabel n="01" className="mb-8">{dict.case.concept}</SectionLabel>
            <Reveal><p className="display text-[clamp(2rem,3.8vw,3.8rem)] leading-[1.08]">{project.concept}</p></Reveal>
            <Reveal className="mt-16 grid gap-4 border-t border-line pt-8 md:grid-cols-[10rem_1fr]">
              <h2 className="label text-fg-2">{dict.case.brief}</h2>
              <p className="prose-block text-[1.2rem]">{project.brief}</p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* 3 — Challenges & solutions */}
      <Section label={dict.case.challenges} className="section bg-surface">
        <div className="wrap">
          <SectionLabel n="02" className="mb-14">{dict.case.challenges} / {dict.case.solutions}</SectionLabel>
          <div className="grid gap-px bg-line">
            {project.challenges.map((c, i) => (
              <Reveal key={i} className="grid gap-8 bg-surface py-12 md:grid-cols-12">
                <span className="display text-[clamp(4rem,9vw,9rem)] leading-none text-[var(--proj)] md:col-span-2" dir="ltr">0{i + 1}</span>
                <div className="md:col-span-5">
                  <h3 className="label mb-3 text-fg-2">{dict.case.challenges}</h3>
                  <p className="text-[1.15rem] leading-relaxed">{c}</p>
                </div>
                <div className="md:col-span-5">
                  <h3 className="label mb-3 text-[var(--proj)]">{dict.case.solutions}</h3>
                  <p className="text-[1.15rem] leading-relaxed">{project.solutions[i]}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* 4 — Image sequence */}
      <Section label={dict.case.gallery} className="section">
        <div className="wrap">
          <SectionLabel n="03" className="mb-12">{dict.case.gallery}</SectionLabel>
          <ProjectGallery images={project.gallery.map((g) => ({ art: g.art, alt: g.alt, viewLabel: g.viewLabel }))} lang={lang} dict={dict} />
        </div>
      </Section>

      {/* 5 — Plans */}
      {plan && (
        <Section label={dict.case.plans} className="section border-t border-line bg-surface">
          <div className="wrap">
            <SectionLabel n="04" className="mb-6">{dict.case.plans}</SectionLabel>
            <h2 className="display mb-12 text-[clamp(2.4rem,5vw,4.6rem)]">{dict.plan.title}</h2>
            <FloorPlan plan={plan} title={project.title} lang={lang} dict={dict} />
          </div>
        </Section>
      )}

      {/* 6 — Materials */}
      <Section label={dict.case.materials} className="section">
        <div className="wrap">
          <SectionLabel n={plan ? "05" : "04"} className="mb-12">{dict.case.materials}</SectionLabel>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {project.materials.map((m, i) => (
              <Reveal as="li" key={m} delay={i * 0.08}>
                <ArchArt art={materialArt[m]} className="aspect-[4/3] w-full" />
                <p className="display mt-4 text-2xl">{dict.materials.items[m].name}</p>
                <p className="mono mt-1 text-fg-2">{dict.materials.items[m].finish}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* 7 — Metrics */}
      <Section label={dict.case.metrics} className="border-y border-line">
        <div className="wrap py-16 md:py-24">
          <SectionLabel n={plan ? "06" : "05"} className="mb-10">{dict.case.metrics}</SectionLabel>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-5">
            {metrics.map((m) => (
              <div key={m.label} className="border-t border-[var(--proj)] pt-4">
                <dd className="display text-[clamp(2.6rem,5vw,5rem)]"><CountUp value={m.value} lang={lang} /> <span className="mono text-fg-2">{m.unit}</span></dd>
                <dt className="label mt-3 text-fg-2">{m.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* 8 — Team */}
      <Section label={dict.case.team} className="section">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel n={plan ? "07" : "06"} className="mb-6">{dict.case.team}</SectionLabel>
            <p className="mono text-accent-text">{dict.common.demoNote}</p>
          </div>
          <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:col-span-8">
            {team.map((m, i) => (
              <Reveal as="li" key={m.id} mask delay={i * 0.1}>
                <ArchArt art={m.art} className="aspect-[4/5] w-full" />
                <p className="mt-3 font-medium">{m.name}</p>
                <p className="mono text-fg-2">{m.role}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* 9 — Previous / next */}
      <nav aria-label={`${dict.case.previous} / ${dict.case.next}`} className="grid border-t border-line md:grid-cols-2">
        {[{ p: adjacent.prev, label: dict.case.previous, prev: true }, { p: adjacent.next, label: dict.case.next, prev: false }].map(({ p, label, prev }) => (
          <Link key={p.id} href={`/${lang}/work/${p.slug}`} className="group relative block min-h-[22rem] overflow-hidden border-line text-[#f5f3ee] md:border-e md:last:border-e-0">
            <ArchArt art={p.art} className="absolute inset-0 h-full w-full transition-transform duration-[1600ms] group-hover:scale-105" />
            <span className="absolute inset-0 bg-[#171916]/55 transition-colors group-hover:bg-[#171916]/40" />
            <span className="relative flex h-full min-h-[22rem] flex-col justify-end p-8 md:p-12">
              <span className="label mb-3 inline-flex items-center gap-2">
                {prev && <ArrowLeft size={14} aria-hidden className="rtl:-scale-x-100" />}{label}{!prev && <ArrowRight size={14} aria-hidden className="rtl:-scale-x-100" />}
              </span>
              <span className="display text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.95]">{p.title}</span>
              <span className="mono mt-3 opacity-80">{p.number} · {p.location}, {p.country} · {num(p.year, lang)}</span>
            </span>
          </Link>
        ))}
      </nav>

      {/* 10 — Related */}
      <Section label={dict.case.related} className="section">
        <div className="wrap">
          <SectionLabel n="∞" className="mb-12">{dict.case.related}</SectionLabel>
          <div className="grid gap-x-8 gap-y-16 md:grid-cols-3">
            {related.map((p, i) => <ProjectCard key={p.id} project={p} lang={lang} dict={dict} aspect="aspect-[4/5]" delay={i * 0.1} plate={false} />)}
          </div>
        </div>
      </Section>

      {/* 11 — CTA */}
      <section className="bg-[var(--inverse-bg)] py-24 text-[var(--inverse-fg)] md:py-36" data-section={dict.nav.contact}>
        <div className="wrap grid items-end gap-10 md:grid-cols-12">
          <h2 className="display text-[clamp(2.6rem,7vw,7rem)] md:col-span-8">{dict.case.ctaTitle}</h2>
          <div className="grid gap-6 md:col-span-4">
            <p className="opacity-80">{dict.case.ctaText}</p>
            <ButtonLink href={`/${lang}/contact`} className="!border-[var(--inverse-fg)] !text-[var(--inverse-fg)] hover:!text-[var(--inverse-bg)] [&::before]:!bg-[var(--inverse-fg)]">{dict.case.ctaButton}</ButtonLink>
          </div>
        </div>
      </section>
    </article>
  );
}

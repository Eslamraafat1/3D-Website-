import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { num, type Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/dictionaries";
import type { ArticleView, ProjectView, TeamMemberView } from "@/lib/data/types";
import ArchArt from "@/components/art/ArchArt";
import ProjectCard from "@/components/work/ProjectCard";
import Reveal from "@/components/ui/Reveal";
import { CountUp, Parallax, WordFill } from "@/components/ui/Motion";
import { ButtonLink, ProjectMeta, Section, SectionLabel } from "@/components/ui/primitives";
import RiseText from "@/components/ui/RiseText";
import ArticleCard from "@/components/sections/ArticleCard";

type P = { lang: Locale; dict: Dict };

export function Statement({ dict }: P) {
  return (
    <Section id="statement" label={dict.statement.label} className="section">
      <div className="wrap">
        <SectionLabel n="01" className="mb-12">{dict.statement.label}</SectionLabel>
        <WordFill lines={dict.statement.lines} />
        <Reveal className="mt-14 grid md:grid-cols-12">
          <p className="lead md:col-span-5 md:col-start-8">{dict.statement.body}</p>
        </Reveal>
      </div>
    </Section>
  );
}

export function Featured({ lang, dict, project }: P & { project: ProjectView }) {
  return (
    <Section label={dict.featured.label} className="relative bg-[#171916] text-[#f1ede3]">
      <Link href={`/${lang}/work/${project.slug}`} data-cursor={dict.common.viewCaseStudy} className="group relative block" aria-label={`${dict.common.viewCaseStudy}: ${project.title}`}>
        <Parallax amount={7} className="h-[78svh] min-h-[34rem] w-full">
          <ArchArt art={{ ...project.art, tone: "dusk" }} label={project.title} className="h-full w-full transition-transform duration-[2000ms] group-hover:scale-[1.03]" />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-t from-[#171916] via-[#171916]/25 to-transparent" />
        <div className="wrap absolute inset-x-0 bottom-0 flex items-end justify-between gap-8 pb-10 md:pb-14">
          <div>
            <p className="mono mb-5 text-[#d8d2c3]" dir="ltr"><span className="text-[#e3a07c]">{project.number}</span> — {dict.featured.label}</p>
            <h2 className="display text-[clamp(3.4rem,11vw,11rem)] uc leading-[0.88]">{project.title}</h2>
          </div>
          <span className="label hidden shrink-0 items-center gap-2 border border-[#f1ede3]/40 px-5 py-3 transition-colors group-hover:bg-[#f1ede3] group-hover:text-[#171916] md:inline-flex">
            {dict.common.viewCaseStudy} <ArrowUpRight size={15} aria-hidden className="rtl:-scale-x-100" />
          </span>
        </div>
      </Link>
      <div className="wrap grid gap-12 py-14 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="label mb-4 text-[#e3a07c]">{dict.featured.concept}</p>
          <p className="display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.15]">{project.concept}</p>
        </div>
        <div className="lg:col-span-7 [&_*]:border-[#f1ede3]/20 [&_dt]:text-[#b9b3a4]">
          <ProjectMeta project={project} dict={dict} lang={lang} />
          <div className="mt-10"><ButtonLink href={`/${lang}/work/${project.slug}`} className="!border-[#f1ede3] hover:!text-[#171916]">{dict.common.viewCaseStudy}</ButtonLink></div>
        </div>
      </div>
    </Section>
  );
}

const GALLERY_LAYOUT = [
  { col: "lg:col-span-7 lg:col-start-1", aspect: "aspect-[4/5] lg:aspect-[16/11]", mt: "" },
  { col: "lg:col-span-4 lg:col-start-9", aspect: "aspect-[4/5] lg:aspect-[3/4]", mt: "lg:mt-40" },
  { col: "lg:col-span-5 lg:col-start-2", aspect: "aspect-[4/5] lg:aspect-[4/3]", mt: "lg:-mt-8" },
  { col: "lg:col-span-4 lg:col-start-8", aspect: "aspect-[4/5]", mt: "lg:-mt-48" },
  { col: "lg:col-span-7 lg:col-start-1", aspect: "aspect-[4/5] lg:aspect-[16/9]", mt: "lg:mt-4" },
  { col: "lg:col-span-5 lg:col-start-8", aspect: "aspect-[4/5] lg:aspect-square", mt: "lg:mt-28" },
];

export function SelectedWorks({ lang, dict, projects }: P & { projects: ProjectView[] }) {
  return (
    <Section id="works" label={dict.works.label} className="section">
      <div className="wrap">
        <div className="mb-16 flex flex-col justify-between gap-8 md:mb-24 md:flex-row md:items-end">
          <div>
            <SectionLabel n="03" className="mb-6">{dict.works.label}</SectionLabel>
            <RiseText as="h2" className="display text-[clamp(3rem,8vw,8rem)]" text={dict.works.title} />
          </div>
          <div className="grid gap-6 md:max-w-sm">
            <p className="lead">{dict.works.intro}</p>
            <ButtonLink href={`/${lang}/work`}>{dict.works.all}</ButtonLink>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-20 lg:grid-cols-12 lg:gap-y-16">
          {projects.slice(0, 6).map((p, i) => (
            <ProjectCard key={p.id} project={p} lang={lang} dict={dict} aspect={GALLERY_LAYOUT[i].aspect} className={`${GALLERY_LAYOUT[i].col} ${GALLERY_LAYOUT[i].mt}`} />
          ))}
        </div>
      </div>
    </Section>
  );
}

export function Philosophy({ dict }: P) {
  return (
    <Section label={dict.philosophy.label} className="section border-t border-line bg-surface">
      <div className="wrap">
        <SectionLabel n="06" className="mb-8">{dict.philosophy.label}</SectionLabel>
        <RiseText as="h2" className="display mb-20 text-[clamp(2.4rem,5vw,4.5rem)] md:mb-28" text={dict.philosophy.title} />
        <ol className="grid gap-0">
          {dict.philosophy.items.map((it, i) => (
            <Reveal as="li" key={it.name} className="grid items-start gap-6 border-t border-line py-12 md:grid-cols-12 md:py-16">
              <span className="mono text-accent-text md:col-span-1" dir="ltr">0{i + 1}</span>
              <RiseText as="h3" className="display text-[clamp(3.4rem,10vw,10rem)] md:col-span-7" text={it.name} />
              <div className="grid gap-6 md:col-span-4 md:pt-6">
                <p className="text-fg-2">{it.text}</p>
                <p className="mono border-s-2 border-accent ps-4 text-fg">{it.note}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}

const STATS = [
  { k: "projects", v: 48 }, { k: "years", v: 12 }, { k: "countries", v: 9 }, { k: "people", v: 22 }, { k: "materials", v: 140 },
] as const;

export function Stats({ lang, dict }: P) {
  return (
    <Section label={dict.stats.label} className="section">
      <div className="wrap">
        <div className="mb-14 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <SectionLabel n="07" className="mb-6">{dict.stats.label}</SectionLabel>
            <h2 className="display text-[clamp(2.4rem,5vw,4.5rem)]">{dict.stats.title}</h2>
          </div>
          <p className="mono max-w-xs text-accent-text">{dict.stats.demo}</p>
        </div>
        <dl className="grid grid-cols-2 gap-px bg-line md:grid-cols-5">
          {STATS.map((s) => (
            <div key={s.k} className="bg-bg px-4 py-10 md:px-6 md:py-14">
              <dd className="display text-[clamp(3.4rem,6vw,6.5rem)]"><CountUp value={s.v} lang={lang} suffix={s.k === "materials" ? "+" : ""} /></dd>
              <dt className="label mt-4 text-fg-2">{dict.stats.items[s.k]}</dt>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}

export function JournalPreview({ lang, dict, articles }: P & { articles: ArticleView[] }) {
  return (
    <Section label={dict.journal.label} className="section border-t border-line">
      <div className="wrap">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel n="08" className="mb-6">{dict.journal.label}</SectionLabel>
            <RiseText as="h2" className="display text-[clamp(3rem,7vw,7rem)]" text={dict.journal.title} />
          </div>
          <ButtonLink href={`/${lang}/journal`}>{dict.journal.all}</ButtonLink>
        </div>
        <div className="grid gap-x-8 gap-y-14 md:grid-cols-12">
          {articles.slice(0, 3).map((a, i) => (
            <ArticleCard key={a.id} article={a} lang={lang} dict={dict} delay={i * 0.1}
              className={i === 0 ? "md:col-span-6" : i === 1 ? "md:col-span-3 md:mt-24" : "md:col-span-3 md:mt-48"}
              aspect={i === 0 ? "aspect-[4/5]" : "aspect-[3/4]"} />
          ))}
        </div>
      </div>
    </Section>
  );
}

export function StudioPreview({ lang, dict, team }: P & { team: TeamMemberView[] }) {
  return (
    <Section label={dict.studioPreview.label} className="section bg-surface">
      <div className="wrap grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SectionLabel n="09" className="mb-8">{dict.studioPreview.label}</SectionLabel>
          <RiseText as="h2" className="display text-[clamp(2.6rem,5.6vw,5.5rem)]" text={dict.studioPreview.title} />
          <p className="lead mt-8">{dict.studioPreview.text}</p>
          <div className="mt-10"><ButtonLink href={`/${lang}/studio`}>{dict.studioPreview.cta}</ButtonLink></div>
          <ul className="mt-14 grid gap-px bg-line">
            {dict.approach.stages.map((s, i) => (
              <li key={s.name} className="flex items-baseline justify-between gap-6 bg-surface py-3">
                <span className="display text-2xl">{s.name}</span>
                <Link href={`/${lang}/approach`} className="mono link-u text-fg-2" dir="ltr">0{i + 1}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-3 gap-3 lg:col-span-6 lg:gap-5">
          {team.slice(0, 3).map((m, i) => (
            <Reveal key={m.id} mask delay={i * 0.12} className={i === 1 ? "mt-12" : i === 2 ? "mt-24" : ""}>
              <ArchArt art={m.art} className="aspect-[3/5] w-full" />
              <p className="mt-3 text-sm font-medium">{m.name}</p>
              <p className="mono text-fg-2">{m.role}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function ContactBlock({ lang, dict }: P) {
  return (
    <Section label={dict.contactBlock.label} className="section bg-[var(--inverse-bg)] text-[var(--inverse-fg)]">
      <div className="wrap">
        <SectionLabel n="10" className="mb-10 !text-[inherit] opacity-70">{dict.contactBlock.label}</SectionLabel>
        <Link href={`/${lang}/contact`} className="group block">
          <h2 className="display text-[clamp(3.6rem,13vw,14rem)] uc leading-[0.86]">
            {dict.contactBlock.lines.map((t, i) => (
              <span key={i} className={`block transition-transform duration-700 group-hover:translate-x-3 rtl:group-hover:-translate-x-3 ${i === 1 ? "ps-[0.7em] italic" : ""}`} style={{ transitionDelay: `${i * 60}ms` }}>{t}</span>
            ))}
          </h2>
        </Link>
        <div className="mt-14 flex flex-wrap items-center gap-6">
          <Link href={`/${lang}/contact`} className="btn !border-[var(--inverse-fg)] !text-[var(--inverse-fg)] hover:!text-[var(--inverse-bg)] [&::before]:!bg-[var(--inverse-fg)]">
            {dict.contactBlock.cta} <ArrowUpRight size={16} aria-hidden className="rtl:-scale-x-100" />
          </Link>
          <p className="mono opacity-70">{dict.common.demoNote}</p>
        </div>
      </div>
    </Section>
  );
}

export { num };

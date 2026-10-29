import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getTeam } from "@/lib/services/content";
import { pageMetadata } from "@/lib/seo";
import ArchArt from "@/components/art/ArchArt";
import MaterialLab from "@/components/home/MaterialLab";
import { ContactBlock, Philosophy } from "@/components/home/HomeSections";
import Reveal from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Motion";
import { ButtonLink, Section, SectionLabel } from "@/components/ui/primitives";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang);
  return pageMetadata(lang, "/studio", d.meta.studio.title, d.meta.studio.description);
}

export default async function StudioPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const s = dict.studio;
  const team = await getTeam(lang);

  return (
    <div className="page-enter">
      <Section label={s.label} className="pb-16 pt-[calc(var(--nav-h)+4rem)] md:pb-24">
        <div className="wrap">
          <SectionLabel n="01" className="mb-8">{s.label}</SectionLabel>
          <h1 className="display max-w-[16ch] text-[clamp(3.2rem,10vw,10rem)]">{s.title}</h1>
          <div className="mt-14 grid gap-10 md:grid-cols-12">
            <p className="lead md:col-span-5 md:col-start-8">{s.intro}</p>
          </div>
        </div>
        <Parallax amount={8} className="mt-16 h-[62svh] min-h-[22rem] w-full">
          <ArchArt art={{ variant: "fins", seed: 91, tone: "dusk" }} label={dict.a11y.decorative} className="h-full w-full" />
        </Parallax>
      </Section>

      <Section label={s.manifestoLabel} className="section">
        <div className="wrap">
          <SectionLabel n="02" className="mb-12">{s.manifestoLabel}</SectionLabel>
          <ol className="grid gap-2">
            {s.manifesto.map((line, i) => (
              <Reveal as="li" key={i} delay={i * 0.06} className="grid items-baseline gap-4 border-t border-line py-6 md:grid-cols-12">
                <span className="mono text-accent-text md:col-span-1" dir="ltr">0{i + 1}</span>
                <p className="display text-[clamp(2rem,4.6vw,4.6rem)] md:col-span-11">{line}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      <Philosophy lang={lang} dict={dict} />

      <Section label={s.teamLabel} className="section">
        <div className="wrap">
          <div className="mb-14 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <SectionLabel n="04" className="mb-6">{s.teamLabel}</SectionLabel>
              <h2 className="display text-[clamp(2.6rem,6vw,6rem)]">{s.teamLabel}</h2>
            </div>
            <p className="mono max-w-sm text-accent-text">{s.fictionNote}</p>
          </div>
          <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-5">
            {team.map((m, i) => (
              <Reveal as="li" key={m.id} delay={i * 0.08} className={i % 2 ? "lg:mt-16" : ""}>
                <ArchArt art={m.art} label={`${m.name} — ${dict.a11y.decorative}`} className="aspect-[3/4] w-full" />
                <h3 className="display mt-4 text-3xl">{m.name}</h3>
                <p className="mono mt-1 text-accent-text">{m.role}</p>
                <p className="mt-3 text-fg-2">{m.bio}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      <Section label={s.disciplinesLabel} className="section border-t border-line bg-surface">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel n="05" className="mb-6">{s.disciplinesLabel}</SectionLabel>
            <h2 className="display text-[clamp(2.4rem,5vw,4.6rem)]">{s.disciplinesLabel}</h2>
          </div>
          <ul className="lg:col-span-8">
            {s.disciplines.map((d, i) => (
              <Reveal as="li" key={d.name} className="grid gap-3 border-t border-line py-7 md:grid-cols-[4rem_1fr_1.2fr]">
                <span className="mono text-accent-text" dir="ltr">0{i + 1}</span>
                <h3 className="display text-3xl md:text-4xl">{d.name}</h3>
                <p className="text-fg-2">{d.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      <Section label={s.timelineLabel} className="section">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel n="06" className="mb-6">{s.timelineLabel}</SectionLabel>
            <h2 className="display text-[clamp(2.4rem,5vw,4.6rem)]">{s.timelineLabel}</h2>
            <p className="mono mt-6 text-accent-text">{s.fictionNote}</p>
          </div>
          <ol className="relative border-s border-line-strong ps-8 lg:col-span-8" style={{ borderColor: "var(--line-strong)" }}>
            {s.timeline.map((t, i) => (
              <Reveal as="li" key={t.year} delay={i * 0.05} className="relative pb-12 last:pb-0">
                <span aria-hidden className="absolute -start-[calc(2rem+4.5px)] top-3 size-2 rounded-full bg-accent" />
                <p className="display text-[clamp(2.6rem,5vw,4.6rem)] leading-none" dir="ltr">{t.year}</p>
                <p className="mt-3 max-w-[48ch] text-fg-2">{t.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      <Section label={s.researchLabel} className="section border-t border-line">
        <div className="wrap mb-14 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <SectionLabel n="07" className="mb-6">{s.researchLabel}</SectionLabel>
            <h2 className="display text-[clamp(2.4rem,5vw,4.8rem)]">{s.research.title}</h2>
          </div>
          <div className="md:col-span-5 md:self-end">
            <p className="lead">{s.research.text}</p>
          </div>
        </div>
        <MaterialLab dict={dict} showHeader={false} />
      </Section>

      <Section label={s.principlesLabel} className="section">
        <div className="wrap">
          <SectionLabel n="08" className="mb-12">{s.principlesLabel}</SectionLabel>
          <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {s.principles.map((p, i) => (
              <Reveal as="li" key={p.name} delay={i * 0.07} className="bg-bg py-8 pe-6">
                <span className="mono text-accent-text" dir="ltr">0{i + 1}</span>
                <h3 className="display mt-4 text-3xl">{p.name}</h3>
                <p className="mt-3 text-fg-2">{p.text}</p>
              </Reveal>
            ))}
          </ul>
          <div className="mt-12"><ButtonLink href={`/${lang}/approach`}>{dict.nav.approach}</ButtonLink></div>
        </div>
      </Section>

      <ContactBlock lang={lang} dict={dict} />
    </div>
  );
}

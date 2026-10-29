import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";
import ApproachScroll from "@/components/sections/ApproachScroll";
import { ButtonLink, Section, SectionLabel } from "@/components/ui/primitives";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang);
  return pageMetadata(lang, "/approach", d.meta.approach.title, d.meta.approach.description);
}

export default async function ApproachPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <div className="page-enter">
      <Section label={dict.approach.label} className="pb-16 pt-[calc(var(--nav-h)+4rem)]">
        <div className="wrap">
          <SectionLabel n="∅" className="mb-8">{dict.approach.label}</SectionLabel>
          <h1 className="display max-w-[14ch] text-[clamp(3.2rem,10vw,10rem)]">{dict.approach.title}</h1>
          <p className="lead mt-10">{dict.approach.intro}</p>
        </div>
      </Section>
      <section data-section={dict.approach.label}>
        <ApproachScroll dict={dict} lang={lang} />
      </section>
      <section className="section bg-surface" data-section={dict.nav.contact}>
        <div className="wrap flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <h2 className="display text-[clamp(2.6rem,7vw,7rem)]">{dict.approachCta.title}</h2>
            <p className="lead mt-5">{dict.approachCta.text}</p>
          </div>
          <ButtonLink href={`/${lang}/contact`} solid>{dict.contactBlock.cta}</ButtonLink>
        </div>
      </section>
    </div>
  );
}

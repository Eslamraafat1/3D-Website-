import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";
import { DEMO_EMAIL } from "@/lib/site";
import InquiryForm from "@/components/sections/InquiryForm";
import CopyEmail from "@/components/ui/CopyEmail";
import { Section, SectionLabel } from "@/components/ui/primitives";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang);
  return pageMetadata(lang, "/contact", d.meta.contact.title, d.meta.contact.description);
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <div className="page-enter pt-[calc(var(--nav-h)+4rem)]">
      <Section label={dict.contact.label} className="wrap pb-28">
        <div className="grid gap-16 lg:grid-cols-12">
          <header className="lg:col-span-5">
            <SectionLabel n="∅" className="mb-8">{dict.contact.label}</SectionLabel>
            <h1 className="display text-[clamp(3rem,7vw,7rem)]">{dict.contact.title}</h1>
            <p className="lead mt-8">{dict.contact.intro}</p>
            <dl className="mt-14 grid gap-8">
              <div className="border-t border-line pt-4">
                <dt className="label text-fg-2">{dict.contact.emailLabel}</dt>
                <dd className="mt-2 text-xl"><CopyEmail email={DEMO_EMAIL} dict={dict} /></dd>
              </div>
              <div className="border-t border-line pt-4">
                <dt className="label text-fg-2">{dict.contact.studioLabel}</dt>
                <dd className="mt-2">{dict.footer.address}</dd>
              </div>
              <div className="border-t border-line pt-4">
                <dt className="label text-fg-2">{dict.contact.hoursLabel}</dt>
                <dd className="mt-2">{dict.contact.hours}</dd>
              </div>
            </dl>
            <p className="mono mt-8 text-accent-text">{dict.contact.demoNote}</p>
          </header>
          <div className="lg:col-span-7">
            <InquiryForm dict={dict} />
          </div>
        </div>
      </Section>
    </div>
  );
}

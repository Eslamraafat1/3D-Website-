import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/dictionaries";
import { DEMO_EMAIL } from "@/lib/site";
import CopyEmail from "@/components/ui/CopyEmail";
import BackToTop from "@/components/ui/BackToTop";

const LINKS = ["work", "studio", "approach", "journal", "contact"] as const;

export default function Footer({ lang, dict }: { lang: Locale; dict: Dict }) {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="wrap py-16 md:py-24">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="display text-[clamp(2.6rem,6vw,5.5rem)]">{dict.brand}</p>
            <p className="mono mt-6 max-w-sm text-fg-2">{dict.footer.statement}</p>
          </div>
          <nav aria-label={dict.footer.explore} className="md:col-span-2">
            <h2 className="label mb-5 text-fg-2">{dict.footer.explore}</h2>
            <ul className="grid gap-3">
              {LINKS.map((k) => (
                <li key={k}><Link href={`/${lang}/${k}`} className="link-u">{dict.nav[k]}</Link></li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-4">
            <h2 className="label mb-5 text-fg-2">{dict.footer.studio}</h2>
            <address className="grid gap-3 not-italic">
              <span>{dict.footer.address}</span>
              <CopyEmail email={DEMO_EMAIL} dict={dict} />
              <span className="mono text-fg-2" dir="ltr">{dict.footer.coords}</span>
              <span className="mono text-accent-text">{dict.footer.demoContact}</span>
            </address>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
          <p className="mono text-fg-2">{dict.footer.rights}</p>
          <p className="mono text-fg-2">{dict.common.imageNote}</p>
          <BackToTop label={dict.common.backToTop} />
        </div>
      </div>
    </footer>
  );
}

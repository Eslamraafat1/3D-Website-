import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono, Instrument_Serif, IBM_Plex_Sans_Arabic, Noto_Naskh_Arabic } from "next/font/google";
import "../globals.css";
import { dirOf, isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Cursor from "@/components/layout/Cursor";
import ScrollProgress from "@/components/layout/ScrollProgress";
import { SITE_URL } from "@/lib/site";

const sans = Geist({ variable: "--f-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--f-mono", subsets: ["latin"] });
const serif = Instrument_Serif({ variable: "--f-serif", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const arSans = IBM_Plex_Sans_Arabic({ variable: "--f-ar-sans", subsets: ["arabic"], weight: ["300", "400", "500", "600"] });
const arSerif = Noto_Naskh_Arabic({ variable: "--f-ar-serif", subsets: ["arabic"], weight: ["400", "500", "700"] });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F3EE" },
    { media: "(prefers-color-scheme: dark)", color: "#131513" },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: d.meta.home.title, template: `%s — ${d.brand}` },
    description: d.meta.home.description,
    applicationName: d.brand,
    openGraph: { type: "website", siteName: d.brand, locale: lang === "ar" ? "ar_AR" : "en_GB", title: d.meta.home.title, description: d.meta.home.description },
    twitter: { card: "summary_large_image", title: d.meta.home.title, description: d.meta.home.description },
  };
}

// Runs before first paint: applies the stored (or system) theme and marks the
// document as JS-enabled so reveal animations never hide content without JS.
const bootScript = `(function(){try{var t=localStorage.getItem('monolith-theme');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='light'}document.documentElement.classList.add('js')})();`;

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDictionary(lang);

  return (
    <html
      lang={lang}
      dir={dirOf(lang)}
      data-theme="light"
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable} ${serif.variable} ${arSans.variable} ${arSerif.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a href="#main" className="skip">{d.nav.skip}</a>
        <Cursor />
        <ScrollProgress label={d.a11y.scrollProgress} />
        <Nav lang={lang} dict={d} />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer lang={lang} dict={d} />
      </body>
    </html>
  );
}

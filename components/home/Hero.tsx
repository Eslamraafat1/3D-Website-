"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowDown } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useMediaQuery, usePrefersReducedMotion, useTheme, useWebGL } from "@/lib/hooks";
import type { Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/dictionaries";
import type { ProjectView } from "@/lib/data/types";
import ArchArt from "@/components/art/ArchArt";
import { ButtonLink } from "@/components/ui/primitives";

const Hero3D = dynamic(() => import("@/components/three/Hero3D"), { ssr: false });

/** If WebGL throws at runtime the illustrated fallback simply stays in place. */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

const LINES = [
  { d: "M0 748 H1600", len: 1600, delay: 0.2 },
  { d: "M1060 0 V900", len: 900, delay: 0.5 },
  { d: "M240 0 V900", len: 900, delay: 0.7 },
  { d: "M0 180 H1600", len: 1600, delay: 0.9 },
  { d: "M240 748 L1060 180", len: 1200, delay: 1.1 },
  { d: "M1060 748 L1500 380", len: 700, delay: 1.3 },
];

export default function Hero({ lang, dict, projects }: { lang: Locale; dict: Dict; projects: ProjectView[] }) {
  const root = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true);
  const theme = useTheme();
  const reduced = usePrefersReducedMotion();
  const wide = useMediaQuery("(min-width: 900px) and (pointer: fine)");
  const webgl = useWebGL();
  const use3d = webgl && wide && !reduced;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const timer = setTimeout(() => setStarted(true), reduced ? 0 : 1700);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    let ctx: gsap.Context | undefined;
    try {
      ctx = gsap.context(() => {
        if (reduced) return;
        const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.7 });
        tl.fromTo("[data-step='meta']", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1 }, 0.1)
          .fromTo(".hero-line .line-inner", { yPercent: 112, y: 0 }, { yPercent: 0, y: 0, duration: 1.6, stagger: 0.14 }, 1.15)
          .fromTo("[data-step='copy']", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.12 }, 1.9)
          .fromTo("[data-step='scroll']", { opacity: 0 }, { opacity: 1, duration: 1 }, 2.6);
      }, el);
    } catch {
      document.documentElement.classList.remove("js"); // never leave hero text hidden
    }
    return () => {
      clearTimeout(timer);
      io.disconnect();
      ctx?.revert();
    };
  }, [reduced]);

  return (
    <section ref={root} data-section={dict.hero.index} className="relative min-h-svh overflow-hidden bg-surface" aria-labelledby="hero-title">
      {/* Scene layer */}
      <div className="absolute inset-0">
        <div className={`absolute inset-y-0 end-0 w-full transition-opacity duration-[1600ms] md:w-[78%] ${use3d && ready ? "opacity-0" : "opacity-100"}`} style={{ maskImage: "linear-gradient(to left, #000 62%, transparent)" }}>
          <ArchArt art={{ variant: "monolith", seed: 7, tone: "warm" }} label={dict.hero.alt} className="h-full w-full" />
        </div>
        {use3d && (
          <div className="absolute inset-0" role="img" aria-label={dict.hero.sceneLabel}>
            <SceneBoundary>
              <Hero3D dark={theme === "dark"} active={inView} started={started} onReady={() => setReady(true)} />
            </SceneBoundary>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
      </div>

      {/* Construction lines */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full text-fg" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden>
        {LINES.map((l, i) => (
          <path key={i} d={l.d} className="draw" stroke="currentColor" strokeOpacity={i < 4 ? 0.22 : 0.34} strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" style={{ "--len": l.len, "--d": `${l.delay}s` } as React.CSSProperties} />
        ))}
        <g stroke="currentColor" strokeOpacity=".5" strokeWidth="1" vectorEffect="non-scaling-stroke" className="draw" style={{ "--len": 300, "--d": "1.6s" } as React.CSSProperties}>
          <path d="M240 790 H1060 M240 780 V800 M1060 780 V800" fill="none" vectorEffect="non-scaling-stroke" />
        </g>
      </svg>

      <div className="wrap relative flex min-h-svh flex-col justify-between pb-10 pt-[calc(var(--nav-h)+1.75rem)]">
        <div data-step="meta" className="hero-i flex flex-wrap items-start justify-between gap-6">
          <p className="mono text-fg-2" dir="ltr">{dict.hero.studioId}</p>
          <p className="mono hidden text-fg-2 md:block" dir="ltr">{dict.hero.coord}</p>
        </div>

        <div className="grid items-end gap-10 xl:grid-cols-12">
          <div className="xl:col-span-8">
            <h1 id="hero-title" className="display text-[clamp(3.6rem,12.6vw,13.5rem)] uc leading-[0.86]">
              {[dict.hero.line1, dict.hero.line2, dict.hero.line3].map((t, i) => (
                <span key={i} className={`hero-line line-mask ${i === 1 ? "ps-[0.9em] text-accent-text italic md:ps-[1.4em]" : ""}`}>
                  <span className="line-inner">{t}</span>
                </span>
              ))}
            </h1>
          </div>

          <div className="grid gap-8 bg-surface/75 xl:col-span-4 xl:p-6">
            <p data-step="copy" className="hero-i lead">{dict.hero.sub}</p>
            <div data-step="copy" className="hero-i flex flex-wrap gap-3">
              <ButtonLink href={`/${lang}/work`} solid>{dict.hero.cta1}</ButtonLink>
              <ButtonLink href={`/${lang}/studio`}>{dict.hero.cta2}</ButtonLink>
            </div>
            <p data-step="copy" className="hero-i mono text-fg-2" dir="ltr">{dict.hero.fig}</p>
          </div>
        </div>
      </div>

      {/* Project index */}
      <nav aria-label={dict.a11y.projectIndex} data-step="copy" className="hero-i absolute end-[var(--gutter)] top-1/2 hidden -translate-y-1/2 2xl:block">
        <p className="mono mb-3 text-fg-2">{dict.hero.index}</p>
        <ol className="grid gap-1.5">
          {projects.slice(0, 8).map((p) => (
            <li key={p.id}>
              <Link href={`/${lang}/work/${p.slug}`} className="mono group flex gap-3 text-fg-2 transition-colors hover:text-fg">
                <span dir="ltr" className="text-accent-text">{p.number}</span>
                <span className="link-u">{p.title}</span>
              </Link>
            </li>
          ))}
        </ol>
      </nav>

      <a href="#statement" data-step="scroll" className="hero-i mono absolute end-[var(--gutter)] top-[calc(var(--nav-h)+5rem)] hidden flex-col items-center gap-2 text-fg-2 xl:flex" aria-label={dict.hero.scroll}>
        {dict.hero.scroll}
        <span className="relative block h-10 w-px overflow-hidden bg-line"><span className="absolute inset-0 bg-fg" style={{ animation: "scroll-cue 2.4s var(--ease) infinite" }} /></span>
        <ArrowDown size={12} aria-hidden className="sr-only" />
      </a>
    </section>
  );
}

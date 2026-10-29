"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";
import { num, type Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/dictionaries";
import type { ProjectView } from "@/lib/data/types";
import ArchArt from "@/components/art/ArchArt";

/** Pinned horizontal project reel (desktop). Elsewhere the Selected Works grid carries the same content. */
export default function Reel({ projects, lang, dict }: { projects: ProjectView[]; lang: Locale; dict: Dict }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const wide = useMediaQuery("(min-width: 900px)");
  const reduced = usePrefersReducedMotion();
  const on = wide && !reduced;
  const rtl = lang === "ar";

  useEffect(() => {
    const el = root.current;
    const tr = track.current;
    if (!on || !el || !tr) return;
    const ctx = gsap.context(() => {
      const dist = () => tr.scrollWidth - window.innerWidth;
      const sign = rtl ? 1 : -1;
      gsap.fromTo(tr, { x: 0 }, {
        x: () => sign * dist(), ease: "none",
        scrollTrigger: {
          trigger: el, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: (self) => setIndex(Math.min(projects.length - 1, Math.round(self.progress * (projects.length - 1)))),
        },
      });
    }, el);
    return () => ctx.revert();
  }, [on, rtl, projects.length]);

  if (!on) return null;
  return (
    <section ref={root} data-section={dict.works.index} className="relative h-svh overflow-hidden bg-[#171916] text-[#f5f3ee]" aria-label={dict.works.index}>
      <div className="absolute inset-x-0 top-[calc(var(--nav-h)+1rem)] z-10 flex justify-between px-[var(--gutter)]">
        <p className="mono opacity-70">{dict.works.index} — {dict.works.title}</p>
        <p className="display text-3xl" dir="ltr">{String(index + 1).padStart(2, "0")}<span className="opacity-40"> / {String(projects.length).padStart(2, "0")}</span></p>
      </div>
      <div ref={track} dir={rtl ? "rtl" : "ltr"} className="flex h-full w-max items-center gap-[6vw] px-[var(--gutter)] pt-16" style={{ willChange: "transform" }}>
        {projects.map((p) => (
          <Link key={p.id} href={`/${lang}/work/${p.slug}`} data-cursor={dict.common.viewProject} className="group relative block h-[64svh] w-[52vw] shrink-0">
            <div className="h-full w-full overflow-hidden">
              <ArchArt art={p.art} label={p.title} className="reel-art h-full w-full" />
            </div>
            <span className="display absolute -top-[0.4em] start-4 text-[clamp(6rem,14vw,15rem)] leading-none text-transparent [-webkit-text-stroke:1px_rgba(245,243,238,0.55)]" dir="ltr">{p.number}</span>
            <div className="absolute inset-x-0 -bottom-16 flex items-end justify-between gap-6">
              <h3 className="display text-[clamp(2rem,3.4vw,3.6rem)] leading-none">{p.title}</h3>
              <p className="mono pb-1 text-end opacity-70">{p.location}, {p.country} · {num(p.year, lang)}</p>
            </div>
          </Link>
        ))}
        <div className="w-[20vw] shrink-0" aria-hidden />
      </div>
    </section>
  );
}

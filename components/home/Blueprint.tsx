"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";
import type { Dict } from "@/lib/i18n/dictionaries";
import ArchArt from "@/components/art/ArchArt";
import { SectionLabel } from "@/components/ui/primitives";

/* Geometry of the drawing (oblique projection, 1200×750) */
const GY = 610;
type Box = { x: number; y: number; w: number; h: number; d: number; holes: [number, number, number, number][] };
const BOXES: Box[] = [
  { x: 120, y: 390, w: 300, h: 220, d: 80, holes: [[40, 60, 190, 36]] },
  { x: 430, y: 130, w: 380, h: 480, d: 130, holes: [[50, 55, 48, 330], [160, 240, 170, 70], [170, 60, 80, 80]] },
  { x: 870, y: 260, w: 54, h: 350, d: 60, holes: [] },
];
const top = (b: Box) => { const dx = b.d * 0.7, dy = b.d * 0.26; return `${b.x},${b.y} ${b.x + dx},${b.y - dy} ${b.x + b.w + dx},${b.y - dy} ${b.x + b.w},${b.y}`; };
const side = (b: Box) => { const dx = b.d * 0.7, dy = b.d * 0.26; return `${b.x + b.w},${b.y} ${b.x + b.w + dx},${b.y - dy} ${b.x + b.w + dx},${b.y + b.h - dy} ${b.x + b.w},${b.y + b.h}`; };

function BlueprintSVG({ stage }: { stage: number }) {
  const vis = (n: number) => ({ opacity: stage >= n ? 1 : 0 });
  const stroke = { stroke: "currentColor", fill: "none", vectorEffect: "non-scaling-stroke" as const };
  return (
    <svg viewBox="0 0 1200 750" className="h-full w-full text-fg" role="img" aria-hidden focusable="false" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="bp-minor" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" fill="none" stroke="currentColor" strokeOpacity=".09" /></pattern>
        <pattern id="bp-major" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M100 0H0V100" fill="none" stroke="currentColor" strokeOpacity=".2" /></pattern>
        <pattern id="bp-board" width="60" height="14" patternUnits="userSpaceOnUse"><rect width="60" height="1" fill="#171916" opacity=".22" /></pattern>
        <linearGradient id="bp-sun" x1="0" x2="1"><stop offset="0" stopColor="#fff3d8" stopOpacity=".5" /><stop offset="1" stopColor="#fff3d8" stopOpacity="0" /></linearGradient>
      </defs>

      <g className="bp-grid" style={vis(0)}>
        <rect width="1200" height="750" fill="url(#bp-minor)" />
        <rect width="1200" height="750" fill="url(#bp-major)" />
        {["A", "B", "C", "D", "E", "F"].map((c, i) => <text key={c} x={50 + i * 200} y="24" className="fill-current" fontSize="12" fontFamily="var(--ff-mono)" opacity=".5">{c}</text>)}
        {[1, 2, 3, 4, 5, 6, 7].map((n) => <text key={n} x="10" y={n * 100 - 40} className="fill-current" fontSize="12" fontFamily="var(--ff-mono)" opacity=".5">{n}</text>)}
        <path d={`M0 ${GY} H1200`} {...stroke} strokeOpacity=".7" strokeWidth="1.5" />
        <path d="M600 735 v-30 M585 720 h30" {...stroke} strokeOpacity=".6" />
        <circle cx="600" cy="720" r="12" {...stroke} strokeOpacity=".6" />
      </g>

      <g className="bp-elev" style={{ opacity: 1 }}>
        {BOXES.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} pathLength={1} strokeDasharray="1" strokeDashoffset={stage >= 1 ? 0 : 1} {...stroke} strokeWidth="1.6" />
            {b.holes.map((h, j) => <rect key={j} x={b.x + h[0]} y={b.y + h[1]} width={h[2]} height={h[3]} pathLength={1} strokeDasharray="1" strokeDashoffset={stage >= 1 ? 0 : 1} {...stroke} strokeWidth="1.2" />)}
          </g>
        ))}
      </g>

      <g className="bp-dims" style={vis(1)} fontFamily="var(--ff-mono)" fontSize="13" fill="currentColor">
        <g {...stroke} strokeOpacity=".7">
          <path d="M395 130 V610 M385 130 h20 M385 610 h20" />
          <path d="M430 650 H810 M430 640 v20 M810 640 v20" />
          <path d="M95 390 V610 M85 390 h20 M85 610 h20" />
        </g>
        <text x="372" y="380" transform="rotate(-90 372 380)" textAnchor="middle">H 4.60 m</text>
        <text x="620" y="676" textAnchor="middle">W 3.80 m</text>
        <text x="72" y="500" transform="rotate(-90 72 500)" textAnchor="middle">H 2.20 m</text>
        <text x="480" y="112" fillOpacity=".7">ELEV. A — 1:100</text>
      </g>

      <g className="bp-wire" style={vis(2)} {...stroke} strokeWidth="1.1" strokeOpacity=".8">
        {BOXES.map((b, i) => (<g key={i}><polygon points={top(b)} /><polygon points={side(b)} /></g>))}
        {BOXES.map((b, i) => <path key={`h${i}`} d={`M${b.x},${b.y + b.h} l${b.d * 0.7},${-b.d * 0.26}`} strokeDasharray="5 5" strokeOpacity=".4" />)}
      </g>

      <g className="bp-solid" style={vis(3)}>
        {BOXES.map((b, i) => (
          <g key={i}>
            <polygon points={top(b)} fill="#efe8da" />
            <polygon points={side(b)} fill="#8f897c" />
            <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="#c9c1b0" />
            <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="url(#bp-board)" />
            {b.holes.map((h, j) => <rect key={j} x={b.x + h[0]} y={b.y + h[1]} width={h[2]} height={h[3]} fill="#24231f" />)}
            <polygon points={top(b)} fill="none" stroke="#171916" strokeOpacity=".25" />
          </g>
        ))}
      </g>

      <g className="bp-light" style={vis(4)}>
        <polygon points="430,610 900,596 1170,640 560,660" fill="#171916" opacity=".26" />
        <rect x="0" y="0" width="1200" height="750" fill="url(#bp-sun)" />
        {BOXES[1].holes.map((h, j) => <rect key={j} x={BOXES[1].x + h[0]} y={BOXES[1].y + h[1] + h[3] * 0.62} width={h[2]} height={h[3] * 0.38} fill="#fff3d8" opacity=".25" />)}
      </g>
    </svg>
  );
}

export default function Blueprint({ dict }: { dict: Dict }) {
  const root = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const wide = useMediaQuery("(min-width: 900px)");
  const reduced = usePrefersReducedMotion();
  const pinned = wide && !reduced;
  const stages = dict.blueprint.stages;

  useEffect(() => {
    const el = root.current;
    if (!pinned || !el) return;
    const ctx = gsap.context(() => {
      const q = (s: string) => el.querySelectorAll<SVGElement>(s);
      gsap.set(q(".bp-elev rect"), { strokeDashoffset: 1 });
      gsap.set([q(".bp-dims"), q(".bp-wire"), q(".bp-solid"), q(".bp-light")], { opacity: 0 });
      gsap.set(q(".bp-grid"), { opacity: 0.35 });
      gsap.set(".bp-photo", { clipPath: "inset(0 100% 0 0)" });

      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" }, paused: false });
      tl.to(q(".bp-grid"), { opacity: 1, duration: 0.8 }, 0)
        .to(q(".bp-elev rect"), { strokeDashoffset: 0, duration: 1, stagger: 0.04 }, 1)
        .to(q(".bp-dims"), { opacity: 1, duration: 0.6 }, 1.5)
        .to(q(".bp-wire"), { opacity: 1, duration: 0.9 }, 2)
        .to(q(".bp-elev"), { opacity: 0.35, duration: 0.8 }, 2.4)
        .to(q(".bp-solid"), { opacity: 1, duration: 1 }, 3)
        .to(q(".bp-wire"), { opacity: 0.2, duration: 0.8 }, 3.2)
        .to(q(".bp-dims"), { opacity: 0.4, duration: 0.8 }, 3.2)
        .to(q(".bp-light"), { opacity: 1, duration: 0.8 }, 4)
        .to(".bp-photo", { clipPath: "inset(0 0% 0 0)", duration: 1.1, ease: "power3.inOut" }, 4.3)
        .to({}, { duration: 0.4 });

      ScrollTrigger.create({
        trigger: el, start: "top top", end: () => `+=${window.innerHeight * 4.2}`, pin: true, scrub: 0.7, anticipatePin: 1, animation: tl,
        onUpdate: (self) => {
          const p = self.progress;
          setProgress((prev) => (Math.abs(prev - p) > 0.01 ? p : prev));
          const s = Math.min(4, Math.floor(p * 5));
          setStage((prev) => (prev === s ? prev : s));
        },
      });
    }, el);
    return () => ctx.revert();
  }, [pinned]);

  return (
    <section data-section={dict.blueprint.label} className="border-t border-line bg-surface">
      {pinned ? (
        <div ref={root} className="relative flex h-svh items-center">
          <div className="wrap grid w-full items-center gap-12 pt-[var(--nav-h)] lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionLabel n="05" className="mb-8">{dict.blueprint.label}</SectionLabel>
              <h2 className="display text-[clamp(2.4rem,4.6vw,4.6rem)]">{dict.blueprint.title}</h2>
              <div className="mt-10 min-h-[9.5rem]" aria-live="polite">
                <p className="mono text-accent-text" dir="ltr">0{stage + 1} / 05</p>
                <p className="display mt-2 text-4xl">{stages[stage].name}</p>
                <p className="mt-3 max-w-[34ch] text-fg-2">{stages[stage].text}</p>
              </div>
              <div role="progressbar" aria-label={dict.blueprint.progress} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} className="mt-6 grid grid-cols-5 gap-1.5">
                {stages.map((s, i) => (
                  <span key={s.name} className="grid gap-2">
                    <span className={`h-[3px] transition-colors duration-500 ${i <= stage ? "bg-accent" : "bg-line"}`} />
                    <span className={`mono transition-opacity ${i === stage ? "opacity-100" : "opacity-40"}`}>{s.name}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="lg:col-span-8" dir="ltr">
              <div className="relative aspect-[16/10] overflow-hidden border border-line bg-bg">
                <BlueprintSVG stage={4} />
                <div className="bp-photo absolute inset-0">
                  <ArchArt art={{ variant: "monolith", seed: 7, tone: "dusk" }} className="h-full w-full" />
                </div>
                <p className="mono absolute bottom-3 start-4 rounded-sm bg-bg/80 px-2 py-1 text-fg-2">{dict.hero.fig}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="wrap section">
          <SectionLabel n="05" className="mb-8">{dict.blueprint.label}</SectionLabel>
          <h2 className="display text-[clamp(2.6rem,9vw,4.6rem)]">{dict.blueprint.title}</h2>
          <p className="lead mt-6">{dict.blueprint.intro}</p>
          <ol className="mt-12 grid gap-12 sm:grid-cols-2">
            {stages.map((s, i) => (
              <li key={s.name}>
                <div className="relative aspect-[16/10] overflow-hidden border border-line bg-bg" dir="ltr">
                  {i === 4 ? <ArchArt art={{ variant: "monolith", seed: 7, tone: "dusk" }} className="h-full w-full" /> : <BlueprintSVG stage={i} />}
                </div>
                <p className="mono mt-4 text-accent-text" dir="ltr">0{i + 1} / 05</p>
                <p className="display mt-1 text-3xl">{s.name}</p>
                <p className="mt-2 text-fg-2">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}

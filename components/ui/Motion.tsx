"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { num, type Locale } from "@/lib/i18n/config";

/** Number that counts up once when scrolled into view. The final value is server-rendered. */
export function CountUp({ value, lang, suffix = "" }: { value: number; lang: Locale; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const state = { v: 0 };
    const render = () => { el.textContent = num(Math.round(state.v), lang) + suffix; };
    const ctx = gsap.context(() => {
      render();
      gsap.to(state, {
        v: value, duration: 2.2, ease: "power3.out", onUpdate: render,
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [value, lang, suffix]);
  return <span ref={ref}>{num(value, lang)}{suffix}</span>;
}

/** Image wrapper whose content drifts slightly against the scroll. */
export function Parallax({ children, amount = 9, className = "" }: { children: ReactNode; amount?: number; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(inner.current, { yPercent: -amount }, {
        yPercent: amount, ease: "none",
        scrollTrigger: { trigger: wrap.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, wrap);
    return () => ctx.revert();
  }, [amount]);
  return (
    <div ref={wrap} className={`overflow-hidden ${className}`}>
      <div ref={inner} className="h-[118%] -mt-[9%] w-full">{children}</div>
    </div>
  );
}

/** Large statement whose words fill in as the reader scrolls (scrubbed, reversible). */
export function WordFill({ lines }: { lines: string[] }) {
  const root = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const words = el.querySelectorAll<HTMLElement>("[data-w]");
      gsap.fromTo(words, { opacity: 0.14 }, {
        opacity: 1, ease: "none", stagger: 0.12,
        scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 45%", scrub: 0.6 },
      });
    }, el);
    return () => ctx.revert();
  }, []);
  return (
    <p ref={root} className="display text-[clamp(2.8rem,9.2vw,9.5rem)]">
      {lines.map((line, i) => (
        <span key={i} className="block">
          {line.split(" ").map((w, j) => (
            <span key={j} data-w className="inline-block pe-[0.22em]">{w}</span>
          ))}
        </span>
      ))}
    </p>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Desktop-only custom cursor: a dot plus a lagging ring that grows over
 * interactive elements, shows a label on `[data-cursor]` targets and gives
 * `.btn` buttons a small magnetic pull. Native cursor stays on form fields.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const fine = useMediaQuery("(pointer: fine) and (min-width: 900px)");
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current || !label.current) return;
    const d = dot.current;
    const r = ring.current;
    const lb = label.current;
    document.documentElement.classList.add("has-cursor");
    gsap.set([d, r], { xPercent: -50, yPercent: -50, opacity: 0 });
    const rx = gsap.quickTo(r, "x", { duration: 0.55, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.55, ease: "power3" });
    let magnet: HTMLElement | null = null;

    const move = (e: PointerEvent) => {
      gsap.set(d, { x: e.clientX, y: e.clientY, opacity: 1 });
      gsap.to(r, { opacity: 1, duration: 0.3, overwrite: "auto" });
      rx(e.clientX); ry(e.clientY);
      const t = e.target as HTMLElement | null;
      const cursorLabel = t?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "";
      const link = !!t?.closest("a, button, [role='button'], summary");
      const field = !!t?.closest("input, textarea, select");
      r.dataset.state = cursorLabel ? "label" : link ? "link" : field ? "field" : "idle";
      lb.textContent = cursorLabel;
      const btn = t?.closest<HTMLElement>(".btn");
      if (btn !== magnet) {
        if (magnet) gsap.to(magnet, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.5)" });
        magnet = btn ?? null;
      }
      if (btn) {
        const b = btn.getBoundingClientRect();
        gsap.to(btn, { x: (e.clientX - (b.left + b.width / 2)) * 0.22, y: (e.clientY - (b.top + b.height / 2)) * 0.3, duration: 0.4, ease: "power3" });
      }
    };
    const leave = () => gsap.to([d, r], { opacity: 0, duration: 0.2 });
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-cursor");
      if (magnet) gsap.set(magnet, { x: 0, y: 0 });
      gsap.killTweensOf([d, r]);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[95]">
      <div ref={ring} data-state="idle" className="cursor-ring fixed left-0 top-0 grid place-items-center rounded-full">
        <span ref={label} className="cursor-label" />
      </div>
      <div ref={dot} className="cursor-dot fixed left-0 top-0 rounded-full" />
    </div>
  );
}

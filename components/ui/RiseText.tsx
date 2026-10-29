"use client";

import { useEffect, useRef, type ElementType } from "react";

/** Headline whose words rise out of a mask when scrolled into view. Readable without JS. */
export default function RiseText({ text, as: Tag = "h2", className = "" }: { text: string; as?: ElementType; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { rootMargin: "0px 0px -10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`rise ${className}`} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden className="rise-w"><span style={{ "--i": i } as React.CSSProperties}>{w}</span></span>
      ))}
    </Tag>
  );
}

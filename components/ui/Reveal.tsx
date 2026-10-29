"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  /** Clip-path wipe (images) instead of fade-up (text). */
  mask?: boolean;
  className?: string;
  style?: CSSProperties;
};

/** Adds `.in` once the element scrolls into view. Content stays visible if JS never runs (see globals.css). */
export default function Reveal({ children, as: Tag = "div", delay = 0, mask = false, className = "", style }: Props) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.04 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const attr = mask ? { "data-mask": "" } : { "data-reveal": "" };
  return (
    <Tag ref={ref} className={className} style={{ "--d": `${delay}s`, ...style } as CSSProperties} {...attr}>
      {children}
    </Tag>
  );
}

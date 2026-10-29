"use client";

import { ArrowUp } from "lucide-react";

export default function BackToTop({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
      className="label inline-flex min-h-11 items-center gap-2 border border-line px-4 transition-colors hover:border-fg"
    >
      <ArrowUp size={14} aria-hidden /> {label}
    </button>
  );
}

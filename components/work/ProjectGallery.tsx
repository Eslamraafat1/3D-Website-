"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { num, type Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/dictionaries";
import type { ArtSpec } from "@/lib/data/types";
import ArchArt from "@/components/art/ArchArt";
import Reveal from "@/components/ui/Reveal";

type Img = { art: ArtSpec; alt: string; viewLabel: string };

const LAYOUT = ["md:col-span-12 aspect-[16/8]", "md:col-span-7 aspect-[4/3]", "md:col-span-5 aspect-[4/5] md:mt-24", "md:col-span-12 aspect-[16/8]"];

export default function ProjectGallery({ images, lang, dict }: { images: Img[]; lang: Locale; dict: Dict }) {
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const reduce = useReducedMotion();
  const rtl = lang === "ar";
  const n = images.length;

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  const go = (dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + n) % n));

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(rtl ? -1 : 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(rtl ? 1 : -1); }
    if (e.key === "Home") { e.preventDefault(); setOpen(0); }
    if (e.key === "End") { e.preventDefault(); setOpen(n - 1); }
  };

  const cur = open !== null ? images[open] : null;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-12 md:gap-6">
        {images.map((img, i) => (
          <Reveal key={i} mask delay={0.05} className={LAYOUT[i % LAYOUT.length]}>
            <button type="button" onClick={() => setOpen(i)} className="group relative block h-full w-full overflow-hidden" aria-label={`${dict.case.openImage}: ${img.alt}`} aria-haspopup="dialog">
              <ArchArt art={img.art} className="h-full w-full transition-transform duration-[1400ms] ease-[var(--ease)] group-hover:scale-[1.03]" />
              <span className="mono absolute bottom-3 start-3 bg-bg/85 px-2 py-1 text-fg">{String(i + 1).padStart(2, "0")} — {img.viewLabel}</span>
              <span className="absolute end-3 top-3 grid size-10 place-items-center bg-bg/85 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100"><Maximize2 size={15} aria-hidden /></span>
            </button>
          </Reveal>
        ))}
      </div>

      <dialog ref={dialog} className="lightbox" aria-label={dict.case.gallery} onClose={() => setOpen(null)} onKeyDown={onKeyDown} onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}>
        {cur && open !== null && (
          <div className="flex h-full flex-col" onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}>
            <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-8">
              <p className="mono" role="status" aria-live="polite">
                {dict.case.imageOf.replace("{n}", num(open + 1, lang)).replace("{total}", num(n, lang))} — {cur.viewLabel}
              </p>
              <button type="button" onClick={() => setOpen(null)} aria-label={dict.case.closeGallery} className="grid size-12 place-items-center border border-white/30 transition-colors hover:bg-white/10"><X size={18} aria-hidden /></button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 md:px-20">
              <button type="button" onClick={() => go(rtl ? 1 : -1)} aria-label={dict.case.prevImage} className="absolute start-2 z-10 grid size-12 place-items-center border border-white/30 bg-black/40 transition-colors hover:bg-white/15 md:start-5"><ChevronLeft size={20} aria-hidden className="rtl:-scale-x-100" /></button>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={open}
                  initial={reduce ? false : { opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="h-full max-h-[78dvh] w-full max-w-[min(100%,calc(78dvh*1.6))]"
                >
                  <ArchArt art={cur.art} label={cur.alt} className="h-full w-full" />
                </motion.div>
              </AnimatePresence>
              <button type="button" onClick={() => go(rtl ? -1 : 1)} aria-label={dict.case.nextImage} className="absolute end-2 z-10 grid size-12 place-items-center border border-white/30 bg-black/40 transition-colors hover:bg-white/15 md:end-5"><ChevronRight size={20} aria-hidden className="rtl:-scale-x-100" /></button>
            </div>
            <ul className="flex justify-center gap-2 px-4 py-4" aria-label={dict.case.thumbnails}>
              {images.map((img, i) => (
                <li key={i}>
                  <button type="button" onClick={() => setOpen(i)} aria-label={img.alt} aria-current={i === open} className={`block h-12 w-[4.5rem] overflow-hidden border transition-opacity ${i === open ? "border-white opacity-100" : "border-transparent opacity-50 hover:opacity-90"}`}>
                    <ArchArt art={img.art} className="h-full w-full" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </dialog>
    </>
  );
}

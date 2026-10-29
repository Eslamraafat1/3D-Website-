"use client";

import { useState } from "react";
import type { Dict } from "@/lib/i18n/dictionaries";
import { materialArt, materialIds } from "@/lib/data/materials";
import ArchArt from "@/components/art/ArchArt";
import { SectionLabel } from "@/components/ui/primitives";
import type { MaterialId } from "@/lib/data/types";

/**
 * Material accordion. Hover, focus or tap selects a material; the pointer
 * also drives a "raking light" highlight across the sample.
 */
export default function MaterialLab({ dict, showHeader = true }: { dict: Dict; showHeader?: boolean }) {
  const [active, setActive] = useState<MaterialId>("limestone");
  return (
    <section data-section={dict.materials.label} className={showHeader ? "section border-t border-line" : ""}>
      <div className="wrap">
        {showHeader && (
          <div className="mb-14 grid gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <SectionLabel n="04" className="mb-6">{dict.materials.label}</SectionLabel>
              <h2 className="display text-[clamp(3rem,7vw,7rem)]">{dict.materials.title}</h2>
            </div>
            <div className="md:col-span-5 md:self-end">
              <p className="lead">{dict.materials.intro}</p>
              <p className="mono mt-4 text-fg-2">{dict.materials.hint}</p>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-2 lg:h-[34rem] lg:flex-row">
          {materialIds.map((id) => {
            const m = dict.materials.items[id];
            const on = active === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                aria-label={m.name}
                onClick={() => setActive(id)}
                onMouseEnter={() => setActive(id)}
                onFocus={() => setActive(id)}
                onPointerMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
                  e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
                }}
                className={`group relative overflow-hidden text-start transition-[flex-grow,min-height] duration-[900ms] ease-[var(--ease)] ${on ? "min-h-[26rem] flex-[4_1_0%]" : "min-h-[6.5rem] flex-[1_1_0%]"}`}
              >
                <ArchArt art={materialArt[id]} className="absolute inset-0 h-full w-full" />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: "radial-gradient(circle 14rem at var(--mx,50%) var(--my,50%), rgb(255 246 226 / 0.38), transparent 70%)", mixBlendMode: "soft-light" }}
                />
                <span className="absolute inset-0 bg-gradient-to-t from-[#171916]/80 via-[#171916]/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-5 text-[#f5f3ee] md:p-7">
                  <span className="mono block opacity-80" dir="ltr">0{materialIds.indexOf(id) + 1}</span>
                  <span className={`display block transition-[font-size] duration-700 ${on ? "text-[clamp(2rem,3.2vw,3.4rem)]" : "text-2xl lg:text-[1.4rem]"} leading-none`}>{m.name}</span>
                  <span className={`grid transition-[grid-template-rows,opacity] duration-700 ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <span className="overflow-hidden">
                      <span className="mt-4 block max-w-[38ch] text-[0.95rem] leading-relaxed">{m.text}</span>
                      <span className="mono mt-4 grid grid-cols-3 gap-4 opacity-90">
                        <span><span className="block opacity-70">{dict.materials.origin}</span>{m.origin}</span>
                        <span><span className="block opacity-70">{dict.materials.finish}</span>{m.finish}</span>
                        <span><span className="block opacity-70">{dict.materials.density}</span><span dir="ltr">{m.density}</span></span>
                      </span>
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

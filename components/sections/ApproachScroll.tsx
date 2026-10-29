"use client";

import { useEffect, useRef, useState } from "react";
import type { Dict } from "@/lib/i18n/dictionaries";
import { num, type Locale } from "@/lib/i18n/config";
import type { ArtSpec } from "@/lib/data/types";
import ArchArt from "@/components/art/ArchArt";

const VISUALS: ArtSpec[] = [
  { variant: "observatory", seed: 501, tone: "dusk" },
  { variant: "travertine", seed: 502, tone: "warm" },
  { variant: "court", seed: 503, tone: "warm" },
  { variant: "detail", seed: 504, tone: "cool" },
  { variant: "stack", seed: 505, tone: "dusk" },
];

/**
 * Five-stage process narrative. A sticky visual and a progress rail follow
 * whichever stage is centred in the viewport; below `lg` each stage carries
 * its own image so the page scrolls naturally.
 */
export default function ApproachScroll({ dict, lang }: { dict: Dict; lang: Locale }) {
  const stages = dict.approach.stages;
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.stage));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="wrap grid gap-12 lg:grid-cols-12">
      <aside className="hidden lg:col-span-5 lg:block" aria-hidden>
        <div className="sticky top-[calc(var(--nav-h)+2rem)]">
          <div className="relative aspect-[4/5] overflow-hidden border border-line">
            {VISUALS.map((v, i) => (
              <div key={i} className={`absolute inset-0 transition-all duration-[1100ms] ease-[var(--ease)] ${i === active ? "scale-100 opacity-100" : "scale-[1.06] opacity-0"}`}>
                <ArchArt art={v} className="h-full w-full" />
              </div>
            ))}
            <p className="mono absolute bottom-3 start-4 bg-bg/85 px-2 py-1" dir="ltr">FIG. 0{active + 1} — {stages[active].name}</p>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <div className="h-[3px] flex-1 bg-line">
              <div className="h-full bg-accent transition-[width] duration-700 ease-[var(--ease)]" style={{ width: `${((active + 1) / stages.length) * 100}%` }} />
            </div>
            <p className="mono">{dict.approach.progress.replace("{n}", num(active + 1, lang)).replace("{total}", num(stages.length, lang))}</p>
          </div>
        </div>
      </aside>

      <ol className="lg:col-span-7">
        {stages.map((s, i) => (
          <li
            key={s.name}
            data-stage={i}
            ref={(el) => { refs.current[i] = el; }}
            className={`flex min-h-[70svh] flex-col justify-center gap-6 border-t border-line py-14 transition-opacity duration-700 lg:min-h-[85svh] ${i === active ? "lg:opacity-100" : "lg:opacity-35"}`}
          >
            <ArchArt art={VISUALS[i]} className="aspect-[16/10] w-full lg:hidden" />
            <p className="mono text-accent-text" dir="ltr">0{i + 1} / 0{stages.length}</p>
            <h2 className="display text-[clamp(3.6rem,9vw,8.5rem)]">{s.name}</h2>
            <p className="lead">{s.text}</p>
            <div>
              <p className="label mb-3 text-fg-2">{dict.approach.artifacts}</p>
              <ul className="flex flex-wrap gap-2">
                {s.artifacts.map((a) => <li key={a} className="mono border border-line px-3 py-2">{a}</li>)}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

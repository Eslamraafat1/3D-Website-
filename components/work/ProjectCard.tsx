import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { num, type Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/dictionaries";
import type { ProjectView } from "@/lib/data/types";
import ArchArt from "@/components/art/ArchArt";
import Reveal from "@/components/ui/Reveal";

/**
 * Editorial project card. Information is always visible as a caption (no
 * hover-only content); hover/focus adds a summary veil and image motion.
 */
export default function ProjectCard({
  project, lang, dict, aspect = "aspect-[4/5]", className = "", delay = 0, plate = true,
}: {
  project: ProjectView; lang: Locale; dict: Dict; aspect?: string; className?: string; delay?: number; plate?: boolean;
}) {
  return (
    <Reveal as="article" delay={delay} className={className}>
      <Link href={`/${lang}/work/${project.slug}`} className="group block">
        <div className="mono mb-3 flex items-center justify-between gap-4 text-fg-2">
          <span dir="ltr"><span className="text-accent-text">{project.number}</span> — {project.coordsLabel}</span>
          <span className="hidden sm:inline">{project.categoryLabel}</span>
        </div>
        <div className={`relative overflow-hidden ${aspect}`}>
          <ArchArt art={project.art} label={`${project.title} — ${project.typology}`} className="h-full w-full transition-transform duration-[1400ms] ease-[var(--ease)] group-hover:scale-[1.045] group-focus-visible:scale-[1.045]" />
          <div className="pointer-events-none absolute inset-0 hidden bg-ink/0 p-5 opacity-0 transition-all duration-700 [@media(hover:hover)]:flex group-hover:bg-[rgb(23_25_22/0.55)] group-hover:opacity-100 group-focus-visible:bg-[rgb(23_25_22/0.55)] group-focus-visible:opacity-100 flex-col justify-end text-[#f5f3ee]">
            <p className="max-w-[30ch] translate-y-3 text-sm leading-relaxed transition-transform duration-700 group-hover:translate-y-0">{project.summary}</p>
            <span className="label mt-4 inline-flex items-center gap-2 translate-y-3 transition-transform delay-75 duration-700 group-hover:translate-y-0">
              {dict.common.viewProject} <ArrowUpRight size={14} aria-hidden className="rtl:-scale-x-100" />
            </span>
          </div>
        </div>
        <div className={`relative ${plate ? "-mt-7 ms-4 max-w-[92%] bg-bg px-5 pb-1 pt-4 sm:ms-8 sm:max-w-[85%]" : "mt-4"}`}>
          <h3 className="display text-[clamp(1.9rem,3.4vw,3.4rem)] leading-[0.95]">{project.title}</h3>
          <p className="mono mt-3 text-fg-2">
            {project.location}, {project.country} · {num(project.year, lang)} · {num(project.area, lang)} {dict.common.sqm}
          </p>
        </div>
      </Link>
    </Reveal>
  );
}

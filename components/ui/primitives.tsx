import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { num, type Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/dictionaries";
import type { ProjectView } from "@/lib/data/types";

/** Primary / secondary call-to-action rendered as a real link. */
export function ButtonLink({ href, children, solid = false, className = "" }: { href: string; children: ReactNode; solid?: boolean; className?: string }) {
  return (
    <Link href={href} className={`btn ${solid ? "btn-solid" : ""} ${className}`}>
      {children}
      <ArrowRight size={16} className="arrow" aria-hidden />
    </Link>
  );
}

/** "02 — Selected works" section label. */
export function SectionLabel({ n, children, className = "" }: { n?: string; children: ReactNode; className?: string }) {
  return (
    <p className={`mono flex items-center gap-4 text-fg-2 ${className}`}>
      {n && <span className="text-accent-text" dir="ltr">{n}</span>}
      <span aria-hidden className="h-px w-10 bg-line-strong" style={{ background: "var(--line-strong)" }} />
      <span>{children}</span>
    </p>
  );
}

/** A page section that registers itself with the navigation's section indicator. */
export function Section({ id, label, className = "", children }: { id?: string; label: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} data-section={label} className={className}>
      {children}
    </section>
  );
}

/** Structured metadata list shared by featured block, gallery cards and case studies. */
export function ProjectMeta({ project, dict, lang, compact = false }: { project: ProjectView; dict: Dict; lang: Locale; compact?: boolean }) {
  const rows: [string, ReactNode][] = [
    [dict.common.location, `${project.location}, ${project.country}`],
    [dict.common.year, num(project.year, lang).replace(/[٬,]/g, "")],
    [dict.common.typology, project.typology],
    [dict.common.area, `${num(project.area, lang)} ${dict.common.sqm}`],
  ];
  if (!compact) rows.push([dict.common.status, project.statusLabel]);
  return (
    <dl className={`grid gap-x-8 gap-y-5 ${compact ? "grid-cols-2" : "grid-cols-2 md:grid-cols-5"}`}>
      {rows.map(([k, v]) => (
        <div key={k} className="border-t border-line pt-3">
          <dt className="label text-fg-2">{k}</dt>
          <dd className="mt-1.5">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div role="status" className="grid place-items-center gap-5 border border-dashed border-line px-6 py-24 text-center">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden className="text-fg-2">
        <rect x="8" y="14" width="48" height="36" /><path d="M8 14l48 36M56 14L8 50" />
      </svg>
      <p className="display text-3xl md:text-4xl">{title}</p>
      {hint && <p className="max-w-md text-fg-2">{hint}</p>}
      {action}
    </div>
  );
}

/** Four-digit year in Latin digits (technical annotation). */
export const pad = (n: number | string, size = 2) => String(n).padStart(size, "0");

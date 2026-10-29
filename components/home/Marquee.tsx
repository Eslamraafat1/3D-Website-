import type { ProjectView } from "@/lib/data/types";

/** Endless project ticker. Pure CSS; pauses on hover and under reduced motion. */
export default function Marquee({ projects }: { projects: ProjectView[] }) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {projects.map((p, i) => (
        <li key={p.id} className="flex items-center">
          <span className="mono px-6 text-accent-text" dir="ltr">{p.number}</span>
          <span className={`display whitespace-nowrap text-[clamp(2.4rem,5vw,5rem)] ${i % 2 ? "italic text-transparent [-webkit-text-stroke:1px_var(--fg)]" : ""}`}>{p.title}</span>
          <span className="px-8 text-accent" aria-hidden>✦</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee overflow-hidden border-y border-line py-6" role="group" aria-label={projects.map((p) => p.title).join(", ")}>
      <div className="marquee-track flex w-max" dir="ltr">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

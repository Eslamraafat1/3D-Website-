"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const lang = usePathname().startsWith("/ar") ? "ar" : "en";
  const d = getDictionary(lang);
  return (
    <div role="alert" className="wrap grid min-h-svh content-center gap-8 pb-24 pt-[calc(var(--nav-h)+4rem)]">
      <h1 className="display text-[clamp(3rem,9vw,9rem)]">{d.error.title}</h1>
      <p className="lead">{d.error.text}</p>
      {error.digest && <p className="mono text-fg-2" dir="ltr">ref: {error.digest}</p>}
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="btn btn-solid">{d.error.retry}</button>
        <Link href={`/${lang}`} className="btn">{d.error.home}</Link>
      </div>
    </div>
  );
}

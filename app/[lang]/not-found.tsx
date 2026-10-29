"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default function NotFound() {
  const lang = usePathname().startsWith("/ar") ? "ar" : "en";
  const d = getDictionary(lang);
  return (
    <div className="wrap grid min-h-svh content-center gap-8 pb-24 pt-[calc(var(--nav-h)+4rem)]">
      <p className="mono text-accent-text" dir="ltr">{d.notFound.code}</p>
      <h1 className="display text-[clamp(3.4rem,11vw,11rem)]">{d.notFound.title}</h1>
      <p className="lead">{d.notFound.text}</p>
      <div className="flex flex-wrap gap-3">
        <Link href={`/${lang}`} className="btn btn-solid">{d.notFound.home}</Link>
        <Link href={`/${lang}/work`} className="btn">{d.notFound.work}</Link>
      </div>
    </div>
  );
}

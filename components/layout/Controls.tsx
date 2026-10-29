"use client";

import { useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/dictionaries";

const STORAGE_KEY = "monolith-theme";

function subscribeTheme(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const getTheme = () => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

export function ThemeToggle({ dict }: { dict: Dict }) {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => "light");
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try { localStorage.setItem(STORAGE_KEY, next); } catch { /* storage blocked — theme still applies for this visit */ }
      }}
      aria-label={theme === "dark" ? dict.theme.toLight : dict.theme.toDark}
      className="grid size-11 place-items-center rounded-full border border-line transition-colors hover:border-fg"
    >
      {theme === "dark" ? <Sun size={17} aria-hidden /> : <Moon size={17} aria-hidden />}
    </button>
  );
}

export function LangSwitch({ lang, dict }: { lang: Locale; dict: Dict }) {
  const pathname = usePathname();
  const router = useRouter();
  const other: Locale = lang === "en" ? "ar" : "en";
  const href = pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${other}`);
  return (
    <a
      href={href}
      hrefLang={other}
      lang={other}
      aria-label={dict.lang.switchTo}
      onClick={(e) => {
        e.preventDefault();
        document.cookie = `NEXT_LOCALE=${other}; path=/; max-age=31536000; samesite=lax`;
        router.push(href + window.location.search + window.location.hash);
      }}
      className="label grid h-11 min-w-11 place-items-center rounded-full border border-line px-3 transition-colors hover:border-fg"
    >
      {dict.lang.short}
    </a>
  );
}

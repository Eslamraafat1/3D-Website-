"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/dictionaries";
import { useActiveSection } from "@/lib/hooks";
import { LangSwitch, ThemeToggle } from "./Controls";

const ITEMS = ["work", "studio", "approach", "journal", "contact"] as const;

export default function Nav({ lang, dict }: { lang: Locale; dict: Dict }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const isHome = pathname === `/${lang}`;
  const section = useActiveSection(pathname);
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the menu when the route changes (state derived from props, no effect needed).
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: lock scroll, trap focus, close on Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    const focusables = () => Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const f = [...focusables(), toggleRef.current!].filter(Boolean);
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const transparent = isHome && !scrolled && !open;
  const current = ITEMS.find((k) => pathname.startsWith(`/${lang}/${k}`));
  const indicator = section
    ? `${String(section.index).padStart(2, "0")}/${String(section.total).padStart(2, "0")} — ${section.label}`
    : current
      ? dict.nav[current]
      : "";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] transition-[background-color,border-color] duration-500 ${transparent ? "border-b border-transparent bg-transparent" : "border-b border-line bg-bg"}`}
      style={{ height: "var(--nav-h)" }}
    >
      <div className="wrap flex h-full items-center justify-between gap-6">
        <Link href={`/${lang}`} className="display text-[1.55rem] leading-none tracking-tight" aria-label={dict.nav.home}>
          {dict.brand}
        </Link>

        <nav aria-label={dict.nav.primary} className="hidden items-center gap-9 lg:flex">
          {ITEMS.map((k) => (
            <Link key={k} href={`/${lang}/${k}`} aria-current={current === k ? "page" : undefined} className="link-u label">
              {dict.nav[k]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {indicator && (
            <p className="mono me-4 hidden max-w-[16rem] truncate text-fg-2 xl:block" aria-live="off">
              <span className="me-2 inline-block size-1.5 rounded-full bg-accent align-middle" style={{ animation: "pulse-dot 2.4s infinite" }} aria-hidden />
              {indicator}
            </p>
          )}
          <LangSwitch lang={lang} dict={dict} />
          <ThemeToggle dict={dict} />
          <button
            ref={toggleRef}
            type="button"
            className="grid size-11 place-items-center rounded-full border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? dict.a11y.closeMenu : dict.a11y.openMenu}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={dict.nav.mobileMenu}
            className="fixed inset-x-0 bottom-0 z-[-1] overflow-y-auto bg-bg lg:hidden"
            style={{ top: "var(--nav-h)" }}
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          >
            <nav aria-label={dict.nav.primary} className="wrap flex min-h-full flex-col justify-between py-10">
              <ul className="grid gap-1">
                {ITEMS.map((k, i) => (
                  <motion.li
                    key={k}
                    initial={reduce ? false : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + i * 0.06, duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                    className="border-b border-line"
                  >
                    <Link href={`/${lang}/${k}`} className="display flex items-baseline justify-between py-5 text-[clamp(2.6rem,12vw,4.5rem)]" aria-current={current === k ? "page" : undefined}>
                      <span>{dict.nav[k]}</span>
                      <span className="mono text-fg-2">0{i + 1}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <p className="mono mt-10 text-fg-2">{dict.tagline}</p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

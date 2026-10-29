"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import type { Dict } from "@/lib/i18n/dictionaries";

type Status = "idle" | "copied" | "failed";

/** Copies the studio email using the real Clipboard API, with an announced result. */
export default function CopyEmail({ email, dict, className = "" }: { email: string; dict: Dict; className?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  async function copy() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(email);
      ok = true;
    } catch {
      ok = false;
    }
    setStatus(ok ? "copied" : "failed");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2600);
  }

  return (
    <span className={`inline-flex flex-wrap items-center gap-3 ${className}`}>
      <a href={`mailto:${email}`} className="link-u ltr">{email}</a>
      <button type="button" onClick={copy} className="label inline-flex min-h-11 items-center gap-2 border border-line px-3 transition-colors hover:border-fg">
        {status === "copied" ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
        {dict.common.copy}
      </button>
      <span role="status" aria-live="polite" className="mono text-accent-text">
        {status === "copied" ? dict.common.copied : status === "failed" ? dict.common.copyFailed : ""}
      </span>
    </span>
  );
}

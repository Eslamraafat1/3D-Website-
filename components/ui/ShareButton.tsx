"use client";

import { useRef, useState } from "react";
import { Share2 } from "lucide-react";

/** Uses the native share sheet when available, otherwise copies the page link. */
export default function ShareButton({ title, label, doneLabel, failLabel }: { title: string; label: string; doneLabel: string; failLabel: string }) {
  const [msg, setMsg] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  async function share() {
    const url = window.location.href;
    let text = "";
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        text = doneLabel;
      }
    } catch (e) {
      if ((e as DOMException)?.name !== "AbortError") text = failLabel;
    }
    setMsg(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(""), 2600);
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-3">
      <button type="button" onClick={share} className="label inline-flex min-h-11 items-center gap-2 border border-line px-4 transition-colors hover:border-fg">
        <Share2 size={14} aria-hidden /> {label}
      </button>
      <span role="status" aria-live="polite" className="mono text-accent-text">{msg}</span>
    </span>
  );
}

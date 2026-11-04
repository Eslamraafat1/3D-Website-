import { notFound } from "next/navigation";

/**
 * Catch-all for unknown URLs inside a locale (e.g. /en/does-not-exist), so
 * they get the styled, localised not-found page instead of the bare default.
 */
export default function CatchAll() {
  notFound();
}

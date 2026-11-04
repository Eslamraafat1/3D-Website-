import { ImageResponse } from "next/og";
import { locales } from "@/lib/i18n/config";
import { OG_ALT } from "@/lib/seo";

export const alt = OG_ALT;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/** Shared social card, generated at build time (Latin text only, so no font files are needed). */
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", background: "#171916", color: "#f5f3ee" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, letterSpacing: 4, color: "#e8b595" }}>
          <span>ARCHITECTURE · SPATIAL DESIGN · MATERIAL RESEARCH</span>
          <span>38.5667° N</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 64 }}>
          <div style={{ width: 150, height: 300, background: "#8f8d86", display: "flex" }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 150, lineHeight: 1, letterSpacing: -4 }}>MONOLITH®</span>
            <span style={{ fontSize: 40, marginTop: 24, color: "#e4dfd2" }}>We shape what outlasts us.</span>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#b9b4a8" }}>A fictional studio — front-end portfolio project by Eslam Raafat</div>
      </div>
    ),
    size,
  );
}

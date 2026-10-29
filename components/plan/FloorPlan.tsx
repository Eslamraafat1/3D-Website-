"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, Plus, RotateCcw, X } from "lucide-react";
import { num, type Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/dictionaries";
import type { PlanView, RoomKind } from "@/lib/data/types";

type VB = { x: number; y: number; w: number; h: number };
const KINDS: RoomKind[] = ["living", "private", "service", "circulation", "outdoor"];
const MAX_ZOOM = 4;

export default function FloorPlan({ plan, title, lang, dict }: { plan: PlanView; title: string; lang: Locale; dict: Dict }) {
  const full: VB = { x: 0, y: 0, w: plan.width, h: plan.height };
  const [levelIdx, setLevelIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [vb, setVb] = useState<VB>(full);
  const drag = useRef<{ px: number; py: number; vb: VB; moved: boolean } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const reduce = useReducedMotion();

  const level = plan.levels[levelIdx];
  const room = level.rooms.find((r) => r.id === selected) ?? null;
  const zoom = full.w / vb.w;

  const clamp = (v: VB): VB => {
    const w = Math.min(full.w, Math.max(full.w / MAX_ZOOM, v.w));
    const h = (w / full.w) * full.h;
    return { w, h, x: Math.min(full.w - w, Math.max(0, v.x)), y: Math.min(full.h - h, Math.max(0, v.y)) };
  };
  const zoomBy = (f: number) => setVb((v) => {
    const w = v.w / f;
    const h = (w / full.w) * full.h;
    return clamp({ w, h, x: v.x + (v.w - w) / 2, y: v.y + (v.h - h) / 2 });
  });

  function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    if (zoom <= 1.001) return;
    drag.current = { px: e.clientX, py: e.clientY, vb, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    const d = drag.current;
    if (!d || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const dx = e.clientX - d.px;
    const dy = e.clientY - d.py;
    if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true;
    if (d.moved) setVb(clamp({ ...d.vb, x: d.vb.x - (dx / rect.width) * d.vb.w, y: d.vb.y - (dy / rect.height) * d.vb.h }));
  }
  const endDrag = () => { setTimeout(() => { drag.current = null; }, 0); };

  function pick(id: string) {
    if (drag.current?.moved) return;
    setSelected((s) => (s === id ? null : id));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <div className="relative border border-line bg-bg">
          <svg
            ref={svgRef}
            viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
            role="group"
            aria-label={dict.plan.aria.replace("{title}", title).replace("{level}", level.name).replace("{count}", String(level.rooms.length))}
            className="aspect-[3/2] w-full select-none"
            style={{ direction: "ltr", touchAction: zoom > 1.001 ? "none" : "pan-y", cursor: zoom > 1.001 ? "grab" : "default" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <defs>
              <pattern id="plan-hatch" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="3" height="3" fill="var(--bg)" /><rect width="0.35" height="3" fill="var(--green)" opacity=".6" /></pattern>
              <pattern id="plan-grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" fill="none" stroke="currentColor" strokeOpacity=".08" strokeWidth="0.2" /></pattern>
            </defs>
            <rect width={plan.width} height={plan.height} fill="url(#plan-grid)" className="text-fg" />
            {level.rooms.map((r) => {
              const showText = r.w >= 18 && r.h >= 10;
              return (
                <g
                  key={r.id}
                  className="plan-room"
                  data-kind={r.kind}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selected === r.id}
                  aria-label={`${r.name}, ${dict.plan.kinds[r.kind]}, ${dict.plan.approxArea} ${num(r.area, lang)} ${dict.common.sqm}`}
                  onClick={() => pick(r.id)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(r.id); } }}
                >
                  <rect x={r.x} y={r.y} width={r.w} height={r.h} />
                  {showText && (
                    <text x={r.x + r.w / 2} y={r.y + r.h / 2 - 0.4} textAnchor="middle" fontSize={r.w >= 30 ? 3.1 : 2.5} fill="currentColor" className="pointer-events-none text-fg" fontFamily="var(--ff-sans)" style={{ letterSpacing: 0 }}>
                      {r.name}
                      <tspan x={r.x + r.w / 2} dy="3.6" fontSize="2.3" fontFamily="var(--ff-mono)" opacity=".7">≈ {num(r.area, lang)} {dict.common.sqm}</tspan>
                    </text>
                  )}
                </g>
              );
            })}
            <g className="text-fg" fill="currentColor" fontFamily="var(--ff-mono)" fontSize="2.2" opacity=".6" pointerEvents="none">
              <path d={`M6 ${plan.height - 6} h12`} stroke="currentColor" strokeWidth="0.4" /><text x="6" y={plan.height - 8}>N ↑ · 1:200 · {dict.plan.title}</text>
            </g>
          </svg>
          <div className="absolute end-3 top-3 flex flex-col gap-1" role="group" aria-label={dict.plan.title}>
            <button type="button" onClick={() => zoomBy(1.5)} disabled={zoom >= MAX_ZOOM - 0.01} aria-label={dict.plan.zoomIn} className="grid size-11 place-items-center border border-line bg-bg transition-colors hover:border-fg disabled:opacity-40"><Plus size={16} aria-hidden /></button>
            <button type="button" onClick={() => zoomBy(1 / 1.5)} disabled={zoom <= 1.001} aria-label={dict.plan.zoomOut} className="grid size-11 place-items-center border border-line bg-bg transition-colors hover:border-fg disabled:opacity-40"><Minus size={16} aria-hidden /></button>
            <button type="button" onClick={() => setVb(full)} disabled={zoom <= 1.001 && vb.x === 0} aria-label={dict.plan.reset} className="grid size-11 place-items-center border border-line bg-bg transition-colors hover:border-fg disabled:opacity-40"><RotateCcw size={16} aria-hidden /></button>
          </div>
        </div>
        <p className="mono mt-3 text-fg-2">{dict.plan.hint}</p>
        <p className="mono mt-1 text-accent-text">{dict.plan.note}</p>
      </div>

      <div className="grid content-start gap-8 lg:col-span-4">
        {plan.levels.length > 1 && (
          <div>
            <p className="label mb-3 text-fg-2" id="plan-levels">{dict.plan.levels}</p>
            <div role="group" aria-labelledby="plan-levels" className="flex flex-wrap gap-2">
              {plan.levels.map((lv, i) => (
                <button key={lv.id} type="button" aria-pressed={i === levelIdx} onClick={() => { setLevelIdx(i); setSelected(null); setVb(full); }} className={`label min-h-11 border px-4 transition-colors ${i === levelIdx ? "border-fg bg-fg text-bg" : "border-line hover:border-fg"}`}>{lv.name}</button>
              ))}
            </div>
          </div>
        )}

        <div aria-live="polite" className="min-h-[11rem]">
          <AnimatePresence mode="wait">
            {room ? (
              <motion.div key={room.id} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0 }} transition={{ duration: 0.35 }} className="border border-line bg-surface p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="label text-fg-2"><span className="swatch me-2" data-kind={room.kind} />{dict.plan.kinds[room.kind]}</p>
                    <h3 className="display mt-2 text-3xl">{room.name}</h3>
                  </div>
                  <button type="button" onClick={() => setSelected(null)} aria-label={dict.plan.close} className="grid size-11 shrink-0 place-items-center border border-line hover:border-fg"><X size={16} aria-hidden /></button>
                </div>
                <p className="mono mt-4 text-accent-text">{dict.plan.approxArea}: ≈ {num(room.area, lang)} {dict.common.sqm}</p>
                <p className="mt-3 text-fg-2">{room.note}</p>
              </motion.div>
            ) : (
              <p key="none" className="border border-dashed border-line p-5 text-fg-2">{dict.plan.selectRoom}</p>
            )}
          </AnimatePresence>
        </div>

        <div>
          <p className="label mb-3 text-fg-2">{dict.plan.legend}</p>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {KINDS.filter((k) => level.rooms.some((r) => r.kind === k)).map((k) => (
              <li key={k}><span className="swatch me-2" data-kind={k} />{dict.plan.kinds[k]}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label mb-3 text-fg-2">{dict.plan.rooms}</p>
          <ul className="grid">
            {level.rooms.map((r) => (
              <li key={r.id}>
                <button type="button" aria-pressed={selected === r.id} onClick={() => setSelected(r.id === selected ? null : r.id)} className={`flex min-h-11 w-full items-center justify-between gap-4 border-t border-line py-2 text-start transition-colors hover:text-accent-text ${selected === r.id ? "text-accent-text" : ""}`}>
                  <span>{r.name}</span>
                  <span className="mono text-fg-2">≈ {num(r.area, lang)} {dict.common.sqm}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

import { useId, type ReactNode } from "react";
import type { ArtSpec, ArtTone } from "@/lib/data/types";
import { mix, rng } from "@/lib/rng";

/**
 * Procedural architectural illustration. Every image on the site is drawn
 * from a deterministic spec (variant + seed + tone), so the whole portfolio
 * shares one lighting model and needs no remote assets. Swap `ArchArt` for
 * <Image> when real photography is available — the data layer already
 * carries one spec per picture.
 */

type Pal = { sky: [string, string]; sun: string; wall: string; ink: string; ground: [string, string]; accent: string };

const TONES: Record<ArtTone, Pal> = {
  warm: { sky: ["#f1e9da", "#dccfb9"], sun: "#fff3da", wall: "#c9c0ae", ink: "#24231f", ground: ["#cfc4ae", "#a99d86"], accent: "#a66d4e" },
  dusk: { sky: ["#ecd2b4", "#c08c6a"], sun: "#ffe2b8", wall: "#a8978a", ink: "#2a211d", ground: ["#b9926f", "#7f5d43"], accent: "#a66d4e" },
  cool: { sky: ["#dfe2dc", "#b6bdb3"], sun: "#f7f8f2", wall: "#aeb2a8", ink: "#1f231f", ground: ["#b5b8ab", "#868b7d"], accent: "#505a49" },
  night: { sky: ["#1b1d1a", "#37332c"], sun: "#f0bd8f", wall: "#55514a", ink: "#0c0d0b", ground: ["#2b2925", "#151412"], accent: "#c98a68" },
};

const W = 1600;
const H = 1000;
type Ctx = { p: Pal; r: () => number; id: string; tone: ArtTone };
type Hole = { x: number; y: number; w: number; h: number };

const pts = (...a: number[][]) => a.map((p) => p.join(",")).join(" ");

function Defs({ c }: { c: Ctx }) {
  const { p, id } = c;
  return (
    <defs>
      <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={p.sky[0]} /><stop offset="1" stopColor={p.sky[1]} /></linearGradient>
      <radialGradient id={`${id}g`} cx=".74" cy=".2" r=".75"><stop offset="0" stopColor={p.sun} stopOpacity=".95" /><stop offset="1" stopColor={p.sun} stopOpacity="0" /></radialGradient>
      <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={p.ground[0]} /><stop offset="1" stopColor={p.ground[1]} /></linearGradient>
      <linearGradient id={`${id}l`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity=".16" /><stop offset="1" stopColor="#000" stopOpacity=".12" /></linearGradient>
      <linearGradient id={`${id}h`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={p.ink} stopOpacity=".42" /><stop offset="1" stopColor={p.ink} stopOpacity="0" /></linearGradient>
      <radialGradient id={`${id}v`} cx=".5" cy=".5" r=".8"><stop offset=".55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".38" /></radialGradient>
      <pattern id={`${id}b`} width="360" height="26" patternUnits="userSpaceOnUse">
        <rect width="360" height="26" fill="none" />
        <rect y="0" width="360" height="1.4" fill={p.ink} opacity=".16" />
        <rect y="13" width="360" height="9" fill={p.ink} opacity=".035" />
        {Array.from({ length: 4 }, (_, i) => (<rect key={i} x={c.r() * 330} y={c.r() * 20} width={20 + c.r() * 90} height="1" fill={p.ink} opacity=".12" />))}
        <rect x={(c.r() * 300) | 0} y="0" width="1.4" height="26" fill={p.ink} opacity=".14" />
      </pattern>
    </defs>
  );
}

function Sky({ c, gy }: { c: Ctx; gy: number }) {
  const { id, r, tone } = c;
  return (
    <>
      <rect width={W} height={H} fill={`url(#${id}s)`} />
      <rect width={W} height={H} fill={`url(#${id}g)`} />
      {tone === "night" && Array.from({ length: 46 }, (_, i) => <circle key={i} cx={r() * W} cy={r() * gy * 0.9} r={0.6 + r() * 1.5} fill="#f6efe0" opacity={0.3 + r() * 0.6} />)}
      <rect y={gy} width={W} height={H - gy} fill={`url(#${id}f)`} />
    </>
  );
}

function Shadow({ c, x, y, w, h, d = 140, long = 0.7 }: { c: Ctx; x: number; y: number; w: number; h: number; d?: number; long?: number }) {
  const gy = y + h;
  const sx = h * long;
  const dx = d * 0.7;
  const dy = d * 0.26;
  return <polygon points={pts([x + 20, gy], [x + w + dx, gy - dy], [x + w + dx + sx, gy - dy + 34], [x + sx * 0.9, gy + 40])} fill={c.p.ink} opacity=".3" />;
}

function Opening({ c, x, y, w, h }: { c: Ctx } & Hole) {
  const { p, tone } = c;
  const lit = tone === "night";
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={p.ink} />
      <rect x={x + w * 0.1} y={y + h * 0.08} width={w * 0.84} height={h * 0.92} fill={lit ? p.sun : mix(p.ink, p.wall, 0.16)} opacity={lit ? 0.85 : 1} />
      {!lit && <rect x={x + w * 0.1} y={y + h * 0.62} width={w * 0.84} height={h * 0.38} fill={p.sun} opacity=".16" />}
      <rect x={x} y={y} width={w} height={Math.max(8, h * 0.1)} fill="#000" opacity=".5" />
      <rect x={x} y={y} width={Math.max(5, w * 0.06)} height={h} fill={mix(p.wall, "#ffffff", 0.3)} opacity=".4" />
    </g>
  );
}

function Mass({ c, x, y, w, h, d = 140, holes = [], tint = 0 }: { c: Ctx; x: number; y: number; w: number; h: number; d?: number; holes?: Hole[]; tint?: number }) {
  const { p, id } = c;
  const dx = d * 0.7;
  const dy = d * 0.26;
  const right = pts([x + w, y], [x + w + dx, y - dy], [x + w + dx, y + h - dy], [x + w, y + h]);
  return (
    <g>
      <polygon points={pts([x, y], [x + dx, y - dy], [x + w + dx, y - dy], [x + w, y])} fill={mix(p.wall, "#ffffff", 0.42 + tint)} />
      <polygon points={right} fill={mix(p.wall, "#000000", 0.4 - tint)} />
      <polygon points={right} fill={`url(#${id}b)`} opacity=".55" />
      <rect x={x} y={y} width={w} height={h} fill={mix(p.wall, "#ffffff", 0.07 + tint)} />
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id}b)`} />
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id}l)`} />
      {holes.map((o, i) => <Opening key={i} c={c} x={x + o.x} y={y + o.y} w={o.w} h={o.h} />)}
    </g>
  );
}

/* ───────── Scenes ───────── */

function Monolith({ c }: { c: Ctx }) {
  const gy = 800;
  return (
    <>
      <Sky c={c} gy={gy} />
      <Shadow c={c} x={520} y={170} w={520} h={630} d={170} long={0.9} />
      <Mass c={c} x={110} y={540} w={420} h={260} d={110} tint={0.03} holes={[{ x: 50, y: 80, w: 260, h: 54 }]} />
      <Mass c={c} x={520} y={170} w={520} h={630} d={170} holes={[{ x: 70, y: 70, w: 64, h: 440 }, { x: 210, y: 320, w: 230, h: 96 }, { x: 220, y: 80, w: 100, h: 100 }]} />
      <Mass c={c} x={1130} y={330} w={74} h={470} d={90} tint={-0.02} />
      <rect x="0" y={gy} width={W} height="10" fill={c.p.ink} opacity=".12" />
    </>
  );
}

function Stack({ c }: { c: Ctx }) {
  const gy = 790;
  const { p, id } = c;
  return (
    <>
      <Sky c={c} gy={gy} />
      <Shadow c={c} x={260} y={500} w={900} h={290} d={130} long={0.8} />
      <Mass c={c} x={260} y={500} w={900} h={290} d={130} holes={[{ x: 60, y: 90, w: 560, h: 66 }, { x: 700, y: 60, w: 96, h: 230 }]} />
      <Mass c={c} x={470} y={286} w={900} h={214} d={130} tint={0.02} holes={[{ x: 40, y: 82, w: 700, h: 46 }]} />
      <rect x="150" y="826" width="1020" height="120" fill={`url(#${id}s)`} />
      <rect x="150" y="826" width="1020" height="120" fill={p.ink} opacity=".12" />
      <rect x="150" y="826" width="1020" height="3" fill={p.ink} opacity=".35" />
    </>
  );
}

function Fins({ c }: { c: Ctx }) {
  const gy = 800;
  const { p, r } = c;
  const fins = Array.from({ length: 24 }, (_, i) => ({ x: 170 + i * 52, h: 360 + ((i * 37) % 7) * 22 + r() * 40 }));
  return (
    <>
      <Sky c={c} gy={gy} />
      <polygon points={pts([900, gy], [1250, 430], [1600, 360], [1600, gy])} fill={mix(p.ground[0], p.ink, 0.12)} opacity=".7" />
      <Mass c={c} x={130} y={620} w={1340} h={180} d={100} tint={0.02} holes={[{ x: 560, y: 30, w: 210, h: 150 }]} />
      {fins.filter((f) => f.x < 700 || f.x > 860).map((f, i) => (
        <g key={i}>
          <rect x={f.x} y={620 - f.h} width="30" height={f.h} fill={mix(p.wall, "#ffffff", 0.1)} />
          <polygon points={pts([f.x + 30, 620 - f.h], [f.x + 62, 620 - f.h - 8], [f.x + 62, 612], [f.x + 30, 620])} fill={mix(p.wall, "#000000", 0.42)} />
          <rect x={f.x} y={620 - f.h} width="30" height={f.h} fill={p.ink} opacity={0.04 + (i % 3) * 0.03} />
        </g>
      ))}
      <rect x="760" y="230" width="90" height="390" fill={p.ink} opacity=".82" />
      <rect x="772" y="244" width="66" height="376" fill={p.sun} opacity=".3" />
    </>
  );
}

function Observatory({ c }: { c: Ctx }) {
  const { p, r, id, tone } = c;
  const gy = 690;
  return (
    <>
      <Sky c={c} gy={gy} />
      <path d={`M0,${gy - 40} Q400,${gy - 150} 820,${gy - 50} T1600,${gy - 80} V${H} H0 Z`} fill={mix(p.ground[0], p.sky[1], 0.4)} opacity=".8" />
      <path d={`M280,${gy + 10} h760 v-170 q-380,-90 -760,0 Z`} fill={mix(p.wall, "#ffffff", 0.1)} />
      <path d={`M1040,${gy + 10} v-170 q130,10 220,70 v100 Z`} fill={mix(p.wall, "#000000", 0.38)} />
      <rect x="280" y={gy - 160} width="760" height="180" fill={`url(#${id}b)`} opacity=".7" />
      <circle cx="660" cy={gy - 130} r="108" fill={p.ink} />
      <circle cx="660" cy={gy - 130} r="108" fill={`url(#${id}s)`} opacity={tone === "night" ? 0.95 : 0.7} />
      <path d={`M660,${gy - 238} a108,108 0 0 1 0,216`} fill="none" stroke={p.sun} strokeOpacity=".5" strokeWidth="4" />
      <path d={`M0,${gy + 90} Q300,${gy + 10} 700,${gy + 80} T1600,${gy + 40} V${H} H0 Z`} fill={`url(#${id}f)`} />
      <path d={`M0,${gy + 190} Q500,${gy + 120} 1000,${gy + 190} T1600,${gy + 150} V${H} H0 Z`} fill={mix(p.ground[1], p.ink, 0.25)} opacity=".6" />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M0,${gy + 230 + i * 14} Q${400 + r() * 300},${gy + 190 + i * 14} 1600,${gy + 250 + i * 12}`} fill="none" stroke={p.ink} strokeOpacity=".07" strokeWidth="2" />)}
    </>
  );
}

function Court({ c }: { c: Ctx }) {
  const { p, id } = c;
  return (
    <>
      <rect width={W} height={H} fill={`url(#${id}s)`} />
      <rect width={W} height={H} fill={`url(#${id}g)`} />
      <polygon points={pts([0, 80], [430, 250], [430, 770], [0, 1000])} fill={mix(p.wall, "#000000", 0.28)} />
      <polygon points={pts([W, 80], [1170, 250], [1170, 770], [W, 1000])} fill={mix(p.wall, "#ffffff", 0.05)} />
      <rect x="430" y="250" width="740" height="520" fill={mix(p.wall, "#ffffff", 0.14)} />
      <rect x="430" y="250" width="740" height="520" fill={`url(#${id}b)`} opacity=".5" />
      <path d="M740,770 V540 a60,60 0 0 1 120,0 V770 Z" fill={p.ink} opacity=".86" />
      <path d="M752,770 V545 a48,48 0 0 1 96,0 V770 Z" fill={p.sun} opacity=".34" />
      <polygon points={pts([0, 1000], [430, 770], [1170, 770], [W, 1000])} fill={mix(p.ground[0], "#ffffff", 0.2)} />
      <polygon points={pts([160, 1000], [560, 800], [1040, 800], [1440, 1000])} fill={mix(p.sky[1], p.ink, 0.22)} />
      <polygon points={pts([160, 1000], [560, 800], [700, 800], [420, 1000])} fill="#fff" opacity=".14" />
      <polygon points={pts([-40, 1000], [330, 940], [460, 770], [60, 770])} fill={p.sun} opacity=".32" />
      <polygon points={pts([0, 80], [430, 250], [430, 275], [0, 150])} fill={p.ink} opacity=".25" />
      <circle cx="1080" cy="520" r="90" fill={mix("#505a49", p.ink, 0.15)} opacity=".9" />
      <rect x="1074" y="560" width="14" height="210" fill={p.ink} opacity=".7" />
    </>
  );
}

function Pavilion({ c }: { c: Ctx }) {
  const { p, id } = c;
  const hy = 640;
  const cols = Array.from({ length: 8 }, (_, i) => 330 + i * 130);
  const body = (
    <g>
      <polygon points={pts([260, 300], [1380, 300], [1330, 270], [310, 270])} fill={mix(p.wall, "#ffffff", 0.45)} />
      <rect x="260" y="300" width="1120" height="30" fill={mix(p.wall, "#000000", 0.2)} />
      {cols.map((x) => <rect key={x} x={x} y="330" width="10" height={hy - 330} fill={mix(p.wall, "#000000", 0.35)} />)}
    </g>
  );
  return (
    <>
      <rect width={W} height={H} fill={`url(#${id}s)`} />
      <rect width={W} height={H} fill={`url(#${id}g)`} />
      <rect y={hy - 40} width={W} height="40" fill={mix(p.sky[1], p.ink, 0.2)} opacity=".55" />
      {body}
      <rect y={hy} width={W} height={H - hy} fill={mix(p.sky[1], p.ink, 0.12)} />
      <g transform={`translate(0 ${hy * 2}) scale(1 -1)`} opacity=".42">{body}</g>
      <rect y={hy} width={W} height={H - hy} fill={`url(#${id}s)`} opacity=".38" />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={(i * 211) % W} y={hy + 20 + i * 28} width={160 + (i % 4) * 60} height="2" fill="#fff" opacity=".22" />)}
    </>
  );
}

function Earth({ c }: { c: Ctx }) {
  const { p, r, id } = c;
  const gy = 820;
  const cols = [mix(p.accent, p.wall, 0.4), mix(p.accent, p.wall, 0.15), mix(p.accent, "#000000", 0.1), mix(p.wall, p.accent, 0.55), mix(p.accent, p.ink, 0.25)];
  const layers: ReactNode[] = [];
  let y = 90;
  let i = 0;
  while (y < gy) {
    const h = 26 + r() * 38;
    layers.push(<path key={i} d={`M120,${y} q300,${-5 + r() * 10} 680,0 t680,0 v${h} q-340,${-6 + r() * 12} -680,0 t-680,0 Z`} fill={cols[Math.floor(r() * cols.length)]} />);
    y += h - 1;
    i++;
  }
  return (
    <>
      <Sky c={c} gy={gy} />
      <polygon points={pts([120, gy], [1480, gy], [1750, gy + 36], [160, gy + 36])} fill={p.ink} opacity=".18" />
      <g>{layers}</g>
      <rect x="120" y="90" width="1360" height={gy - 90} fill={`url(#${id}l)`} />
      <path d={`M640,${gy} V430 a160,160 0 0 1 320,0 V${gy} Z`} fill={p.ink} />
      <path d={`M670,${gy} V440 a130,130 0 0 1 260,0 V${gy} Z`} fill={p.sun} opacity=".3" />
      <rect x="120" y={gy - 24} width="1360" height="24" fill={mix(p.wall, "#000000", 0.45)} />
    </>
  );
}

function Terrace({ c }: { c: Ctx }) {
  const { p, r } = c;
  return (
    <>
      <Sky c={c} gy={880} />
      <polygon points={pts([0, 120], [900, 60], [1600, 220], [1600, 880], [0, 880])} fill={mix(p.ground[0], p.ink, 0.1)} />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={0} y={140 + i * 62} width={W} height={4 + r() * 6} fill={p.ink} opacity={0.05 + r() * 0.07} />)}
      {Array.from({ length: 7 }, (_, i) => {
        const x = 90 + i * 190;
        const y = 220 + i * 92;
        return (
          <g key={i}>
            <polygon points={pts([x, y], [x + 70, y - 24], [x + 600, y - 24], [x + 530, y])} fill={mix(p.wall, "#ffffff", 0.45)} />
            <rect x={x} y={y} width="530" height="70" fill={mix(p.wall, "#ffffff", 0.05 + i * 0.01)} />
            <rect x={x + 30} y={y + 20} width="470" height="26" fill={p.ink} opacity=".82" />
            <rect x={x + 30} y={y + 20} width="470" height="26" fill={p.sun} opacity=".2" />
            <polygon points={pts([x + 530, y], [x + 600, y - 24], [x + 600, y + 46], [x + 530, y + 70])} fill={mix(p.wall, "#000000", 0.4)} />
          </g>
        );
      })}
    </>
  );
}

function Tower({ c }: { c: Ctx }) {
  const gy = 820;
  const { p, id } = c;
  const x = 560;
  const w = 480;
  const top = 30;
  return (
    <>
      <Sky c={c} gy={gy} />
      <Shadow c={c} x={x} y={top} w={w} h={gy - top} d={160} long={0.35} />
      <Mass c={c} x={120} y={560} w={330} h={260} d={90} tint={0.03} holes={[{ x: 40, y: 70, w: 200, h: 40 }]} />
      <Mass c={c} x={x} y={top} w={w} h={gy - top} d={160} tint={-0.14} />
      {Array.from({ length: 12 }, (_, i) => (
        <g key={i}>
          <rect x={x} y={top + 70 + i * 54} width={w} height="24" fill={p.ink} opacity=".9" />
          <rect x={x} y={top + 90 + i * 54} width={w} height="3" fill={p.sun} opacity=".5" />
        </g>
      ))}
      <rect x={x - 20} y={gy - 110} width={w + 40} height="110" fill={p.ink} opacity=".92" />
      <rect x={x - 6} y={gy - 100} width={w + 12} height="100" fill={`url(#${id}s)`} opacity=".25" />
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={x + i * 54} y={gy - 110} width="8" height="110" fill={p.wall} />)}
    </>
  );
}

function Interior({ c }: { c: Ctx }) {
  const { p, id } = c;
  return (
    <>
      <rect width={W} height={H} fill={mix(p.wall, "#ffffff", 0.12)} />
      <polygon points={pts([0, 0], [W, 0], [1300, 150], [300, 150])} fill={mix(p.wall, "#000000", 0.1)} />
      <polygon points={pts([0, 0], [300, 150], [300, 780], [0, H])} fill={mix(p.wall, "#000000", 0.32)} />
      <polygon points={pts([W, 0], [1300, 150], [1300, 780], [W, H])} fill={mix(p.wall, "#000000", 0.18)} />
      <rect x="300" y="150" width="1000" height="630" fill={mix(p.wall, "#ffffff", 0.16)} />
      <rect x="300" y="150" width="1000" height="630" fill={`url(#${id}b)`} opacity=".7" />
      <polygon points={pts([0, H], [300, 780], [1300, 780], [W, H])} fill={mix(p.ground[0], "#ffffff", 0.18)} />
      <rect x="740" y="190" width="120" height="480" fill={p.sun} />
      <rect x="740" y="190" width="120" height="480" fill="#fff" opacity=".4" />
      <polygon points={pts([720, 780], [880, 780], [1180, H], [520, H])} fill={p.sun} opacity=".55" />
      <polygon points={pts([740, 670], [860, 670], [1010, 780], [720, 780])} fill={p.sun} opacity=".25" />
      <rect x="470" y="700" width="340" height="80" fill={p.ink} opacity=".85" />
      <rect x="470" y="700" width="340" height="12" fill={p.sun} opacity=".2" />
      <rect width={W} height={H} fill={`url(#${id}h)`} />
    </>
  );
}

function Detail({ c }: { c: Ctx }) {
  const { p, id, r } = c;
  return (
    <>
      <rect width={W} height={H} fill={mix(p.wall, "#ffffff", 0.08)} />
      <rect width={W} height={H} fill={`url(#${id}b)`} />
      {Array.from({ length: 7 }, (_, row) => Array.from({ length: 6 }, (_, col) => (
        <circle key={`${row}-${col}`} cx={90 + col * 280 + (row % 2) * 12} cy={90 + row * 150} r="13" fill={p.ink} opacity=".5" />
      )))}
      <rect x="880" y="-10" width="190" height="1020" fill={p.ink} />
      <rect x="900" y="-10" width="150" height="1020" fill={mix(p.ink, p.wall, 0.12)} />
      <polygon points={pts([1070, 0], [1250, 0], [1250, H], [1070, H])} fill={p.sun} opacity=".25" />
      <rect x="880" y="-10" width="16" height="1020" fill="#fff" opacity=".25" />
      <rect width={W} height={H} fill={`url(#${id}l)`} />
      <rect x="0" y="0" width={W} height={H} fill="#000" opacity={0.03 + r() * 0.03} />
    </>
  );
}

function Threshold({ c }: { c: Ctx }) {
  const { p, id } = c;
  return (
    <>
      <rect width={W} height={H} fill={mix(p.ink, p.wall, 0.12)} />
      <rect width={W} height={H} fill={`url(#${id}b)`} opacity=".4" />
      <g>
        <rect x="560" y="140" width="480" height="860" fill={`url(#${id}s)`} />
        <rect x="560" y="140" width="480" height="860" fill={`url(#${id}g)`} />
        <polygon points={pts([560, 700], [1040, 700], [1040, 1000], [560, 1000])} fill={`url(#${id}f)`} />
        <rect x="760" y="360" width="26" height="340" fill={mix(p.wall, "#000000", 0.35)} />
        <rect x="860" y="500" width="140" height="200" fill={mix(p.wall, "#ffffff", 0.1)} />
        <polygon points={pts([560, 1000], [700, 700], [830, 700], [740, 1000])} fill={p.sun} opacity=".3" />
      </g>
      <rect x="560" y="140" width="480" height="860" fill="none" stroke={p.ink} strokeWidth="26" />
      <rect width={W} height={H} fill={`url(#${id}v)`} />
    </>
  );
}

function Portrait({ c }: { c: Ctx }) {
  const { p, id, r } = c;
  const hx = 770 + (r() - 0.5) * 60;
  return (
    <>
      <rect width={W} height={H} fill={`url(#${id}s)`} />
      <rect width={W} height={H} fill={`url(#${id}g)`} />
      <path d="M520,1000 V420 a280,280 0 0 1 560,0 V1000 Z" fill={mix(p.wall, "#ffffff", 0.18)} />
      <path d="M520,1000 V420 a280,280 0 0 1 560,0 V1000 Z" fill={`url(#${id}b)`} opacity=".5" />
      <path d="M1080,1000 V420 a280,280 0 0 0 -60,-170 V1000 Z" fill={p.ink} opacity=".2" />
      <circle cx={hx} cy="500" r="104" fill={mix(p.ink, p.accent, 0.3)} />
      <path d={`M${hx - 250},1000 q20,-300 250,-310 q230,10 250,310 Z`} fill={mix(p.ink, p.accent, 0.18)} />
      <path d={`M${hx + 30},396 a104,104 0 0 1 74,104 a104,104 0 0 0 -74,-104`} fill={p.sun} opacity=".25" />
      <rect width={W} height={H} fill={`url(#${id}v)`} />
    </>
  );
}

/* ───────── Material textures ───────── */

function Texture({ c, kind }: { c: Ctx; kind: "limestone" | "concrete" | "steel" | "oak" | "travertine" | "stone" }) {
  const { r, id } = c;
  const nf = `${id}n`;
  const base = { limestone: "#d6cdb9", concrete: "#9b9a93", steel: "#8a4b2f", oak: "#2b2119", travertine: "#e0d3bb", stone: "#bdb7ac" }[kind];
  const freq = { limestone: 0.012, concrete: 0.02, steel: 0.008, oak: 0.01, travertine: 0.015, stone: 0.03 }[kind];
  return (
    <>
      <defs>
        <filter id={nf} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency={`${freq} ${kind === "oak" ? freq * 9 : freq}`} numOctaves="4" seed={Math.floor(r() * 90)} />
          <feColorMatrix values="0 0 0 0 0.1  0 0 0 0 0.09  0 0 0 0 0.08  0 0 0 1.1 -0.28" />
        </filter>
        <filter id={`${nf}f`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 -0.2" />
        </filter>
      </defs>
      <rect width={W} height={H} fill={base} />
      {kind === "concrete" && Array.from({ length: 18 }, (_, i) => <rect key={i} y={i * 56} width={W} height="56" fill={r() > 0.5 ? "#fff" : "#000"} opacity={0.02 + r() * 0.06} />)}
      {kind === "concrete" && Array.from({ length: 18 }, (_, i) => <rect key={`l${i}`} y={i * 56} width={W} height="2" fill="#000" opacity=".28" />)}
      {kind === "concrete" && Array.from({ length: 5 }, (_, i) => Array.from({ length: 4 }, (_, j) => <circle key={`${i}-${j}`} cx={160 + i * 330} cy={140 + j * 270} r="9" fill="#000" opacity=".5" />))}
      {kind === "steel" && Array.from({ length: 90 }, (_, i) => <rect key={i} x={i * 18 + r() * 8} width={2 + r() * 12} height={H} fill={["#b5693e", "#5e2e1b", "#c98a58", "#41200f"][Math.floor(r() * 4)]} opacity={0.15 + r() * 0.35} />)}
      {kind === "oak" && Array.from({ length: 60 }, (_, i) => <path key={i} d={`M0,${i * 17 + r() * 8} C400,${i * 17 - 30 + r() * 60} 1000,${i * 17 + 30 + r() * 60} 1600,${i * 17 + r() * 14}`} fill="none" stroke={r() > 0.5 ? "#6b5238" : "#0e0a07"} strokeOpacity={0.15 + r() * 0.4} strokeWidth={1 + r() * 3} />)}
      {kind === "travertine" && Array.from({ length: 22 }, (_, i) => <rect key={i} y={i * 46 + r() * 20} width={W} height={6 + r() * 26} fill={r() > 0.5 ? "#b99f7b" : "#f3ead6"} opacity={0.25 + r() * 0.3} />)}
      {kind === "travertine" && Array.from({ length: 140 }, (_, i) => <ellipse key={i} cx={r() * W} cy={r() * H} rx={4 + r() * 24} ry={1.5 + r() * 3} fill="#5b4a33" opacity={0.25 + r() * 0.4} />)}
      {kind === "limestone" && Array.from({ length: 180 }, (_, i) => <ellipse key={i} cx={r() * W} cy={r() * H} rx={1 + r() * 5} ry={1 + r() * 3} fill="#8c8068" opacity={0.2 + r() * 0.35} />)}
      {kind === "limestone" && Array.from({ length: 3 }, (_, i) => <path key={i} d={`M${200 + r() * 800},${100 + r() * 800} a${60 + r() * 120},${40 + r() * 60} 0 1 1 ${40 + r() * 60},${20 + r() * 60}`} fill="none" stroke="#9e9378" strokeOpacity=".5" strokeWidth="3" />)}
      {kind === "stone" && Array.from({ length: 200 }, (_, i) => {
        const cx = r() * W;
        const cy = r() * H;
        const s = 14 + r() * 56;
        const col = ["#6f6c66", "#d9d2c3", "#a3552f", "#4c5646", "#efe9dc", "#2f2e2b"][Math.floor(r() * 6)];
        return <polygon key={i} points={pts([cx, cy - s], [cx + s * 0.9, cy - s * 0.2], [cx + s * 0.5, cy + s * 0.8], [cx - s * 0.7, cy + s * 0.5], [cx - s * 0.8, cy - s * 0.3])} fill={col} opacity={0.85} />;
      })}
      <rect width={W} height={H} filter={`url(#${nf})`} opacity={kind === "steel" ? 0.55 : 0.6} />
      <rect width={W} height={H} filter={`url(#${nf}f)`} opacity=".25" />
      <rect width={W} height={H} fill={`url(#${id}l)`} opacity={0.7} />
      <rect width={W} height={H} fill={`url(#${id}v)`} opacity=".55" />
    </>
  );
}

function Scene({ c, variant }: { c: Ctx; variant: ArtSpec["variant"] }) {
  switch (variant) {
    case "monolith": return <Monolith c={c} />;
    case "stack": return <Stack c={c} />;
    case "fins": return <Fins c={c} />;
    case "observatory": return <Observatory c={c} />;
    case "court": return <Court c={c} />;
    case "pavilion": return <Pavilion c={c} />;
    case "earth": return <Earth c={c} />;
    case "terrace": return <Terrace c={c} />;
    case "tower": return <Tower c={c} />;
    case "interior": return <Interior c={c} />;
    case "detail": return <Detail c={c} />;
    case "threshold": return <Threshold c={c} />;
    case "portrait": return <Portrait c={c} />;
    default: return <Texture c={c} kind={variant} />;
  }
}

export default function ArchArt({ art, className = "", label }: { art: ArtSpec; className?: string; label?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const c: Ctx = { p: TONES[art.tone], r: rng(art.seed), id: `a${uid}`, tone: art.tone };
  const isTexture = ["limestone", "concrete", "steel", "oak", "travertine", "stone"].includes(art.variant);
  return (
    <div className={`art ${className}`} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" focusable="false">
        <Defs c={c} />
        <Scene c={c} variant={art.variant} />
        {!isTexture && <rect width={W} height={H} fill={`url(#${c.id}v)`} />}
      </svg>
    </div>
  );
}

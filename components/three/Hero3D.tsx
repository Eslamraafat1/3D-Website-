/* eslint-disable react-hooks/immutability -- imperative three.js scene: the clip plane, materials and camera are mutated every frame by design */
"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type Props = { dark: boolean; active: boolean; started: boolean; onReady: () => void };

/** Procedural board-formed concrete: grain, boards, and tie holes drawn to a canvas. */
function makeConcrete(dark: boolean) {
  const size = 512;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  g.fillStyle = dark ? "#7d7f7d" : "#9c9d9a";
  g.fillRect(0, 0, size, size);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const img = g.getImageData(0, 0, size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (rnd() - 0.5) * 26;
    img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n;
  }
  g.putImageData(img, 0, 0);
  for (let y = 0; y < size; y += 32) {
    g.fillStyle = `rgba(0,0,0,${0.05 + rnd() * 0.07})`;
    g.fillRect(0, y, size, 2);
    g.fillStyle = `rgba(${rnd() > 0.5 ? "255,255,255" : "0,0,0"},${0.03 + rnd() * 0.05})`;
    g.fillRect(0, y + 2, size, 30);
    for (let k = 0; k < 4; k++) { g.fillStyle = "rgba(0,0,0,0.07)"; g.fillRect(rnd() * size, y + rnd() * 28, 30 + rnd() * 90, 1); }
  }
  for (let x = 64; x < size; x += 192) for (let y = 48; y < size; y += 128) {
    g.fillStyle = "rgba(0,0,0,0.38)"; g.beginPath(); g.arc(x, y, 3.5, 0, Math.PI * 2); g.fill();
  }
  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(0.3, 0.3);
  map.anisotropy = 4;
  return map;
}

function slab(w: number, h: number, depth: number, holes: [number, number, number, number][]) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h); s.lineTo(-w / 2, h); s.closePath();
  for (const [x, y, hw, hh] of holes) {
    const p = new THREE.Path();
    p.moveTo(x, y); p.lineTo(x, y + hh); p.lineTo(x + hw, y + hh); p.lineTo(x + hw, y); p.closePath();
    s.holes.push(p);
  }
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false });
  g.translate(0, 0, -depth / 2);
  return g;
}

function Monolith({ dark, started, onReady }: Pick<Props, "dark" | "started" | "onReady">) {
  const group = useRef<THREE.Group>(null);
  const edges = useRef<THREE.LineBasicMaterial[]>([]);
  const t0 = useRef<number | null>(null);
  const { size, gl } = useThree();

  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0), []);
  const map = useMemo(() => makeConcrete(dark), [dark]);
  const parts = useMemo(() => {
    const geos = [
      { g: slab(3.2, 4.6, 2.2, [[-1.1, 0.7, 0.38, 3.2], [0.0, 1.7, 1.5, 0.75], [0.15, 3.35, 0.95, 0.95]]), p: [0, 0, 0] as const },
      { g: slab(3.8, 1.9, 1.7, [[-1.2, 0.8, 2.3, 0.28]]), p: [-3.4, 0, 0.7] as const },
      { g: new THREE.BoxGeometry(0.42, 3.4, 1.2).translate(0, 1.7, 0), p: [2.7, 0, -0.2] as const },
      { g: new THREE.BoxGeometry(2.6, 0.2, 2.8).translate(0, 0.1, 0), p: [2.1, 3.1, 0.2] as const },
    ];
    return geos.map((x) => ({ ...x, e: new THREE.EdgesGeometry(x.g, 22) }));
  }, []);
  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ map, bumpMap: map, bumpScale: 1.2, roughness: 0.93, metalness: 0, clippingPlanes: [plane], clipShadows: true });
    return m;
  }, [map, plane]);

  useEffect(() => {
    gl.localClippingEnabled = true;
    onReady();
  }, [gl, onReady]);

  useEffect(() => () => {
    map.dispose(); material.dispose();
    parts.forEach((p) => { p.g.dispose(); p.e.dispose(); });
  }, [map, material, parts]);

  useFrame((state) => {
    if (started && t0.current === null) t0.current = state.clock.elapsedTime;
    const p = started && t0.current !== null ? Math.min(1, (state.clock.elapsedTime - t0.current) / 3.4) : 0;
    const e = 1 - Math.pow(1 - p, 3);
    plane.constant = e * 5.6 - 0.2;
    edges.current.forEach((m) => { m.opacity = 1 - e * 0.78; });
    if (group.current) group.current.position.x = size.width / size.height > 1.25 ? 3.4 : 0;
  });

  const lineColor = dark ? "#e7e2d6" : "#171916";
  return (
    <group ref={group}>
      {parts.map((part, i) => (
        <group key={i} position={[part.p[0], part.p[1], part.p[2]]}>
          <mesh geometry={part.g} material={material} castShadow receiveShadow />
          <lineSegments geometry={part.e}>
            <lineBasicMaterial ref={(m) => { if (m) edges.current[i] = m; }} color={lineColor} transparent opacity={1} />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}

function Rig({ dark }: { dark: boolean }) {
  const pointer = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  useFrame((state) => {
    smooth.current.x += (pointer.current.x - smooth.current.x) * 0.04;
    smooth.current.y += (pointer.current.y - smooth.current.y) * 0.04;
    const t = state.clock.elapsedTime;
    const a = 0.62 + Math.sin(t * 0.14) * 0.07 + smooth.current.x * 0.12;
    const r = 17;
    state.camera.position.set(Math.sin(a) * r, 5 - smooth.current.y * 0.9, Math.cos(a) * r);
    state.camera.lookAt(1.4, 2.0, 0);
  });
  return (
    <>
      <hemisphereLight args={[dark ? "#9aa3b0" : "#fff3dc", dark ? "#1a1a18" : "#bfae92", dark ? 0.55 : 0.9]} />
      <directionalLight
        position={[-7, 10, 6]} intensity={dark ? 2.6 : 3.1} color={dark ? "#ffd9b0" : "#fff6ea"} castShadow
        shadow-mapSize={[2048, 2048]} shadow-camera-left={-11} shadow-camera-right={11} shadow-camera-top={11} shadow-camera-bottom={-11}
        shadow-camera-near={1} shadow-camera-far={34} shadow-bias={-0.0004} shadow-normalBias={0.03}
      />
      <directionalLight position={[8, 3, -4]} intensity={dark ? 0.45 : 0.3} color="#a9b7c9" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.001, 0]}>
        <planeGeometry args={[60, 60]} />
        <shadowMaterial opacity={dark ? 0.5 : 0.3} color={dark ? "#000" : "#2a2014"} />
      </mesh>
    </>
  );
}

export default function Hero3D({ dark, active, started, onReady }: Props) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 30, near: 0.1, far: 80, position: [8, 4.4, 11] }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      aria-hidden
    >
      <Rig dark={dark} />
      <Monolith dark={dark} started={started} onReady={onReady} />
    </Canvas>
  );
}

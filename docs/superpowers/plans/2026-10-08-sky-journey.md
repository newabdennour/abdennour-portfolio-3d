# Sky Journey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the plain project grid with a bright sticky sky-journey (clouds, flying objects, self-drawing colored line, one-by-one flip panels), split into Projects Developed + Research Papers sections.

**Architecture:** One tall scroll track per section with a sticky R3F canvas behind normal-flow stop panels. A single shared scroll progress (springs) drives camera glide, tube-line drawRange, and panel flip thresholds. Web GLBs vendored locally with procedural fallbacks behind an error boundary.

**Tech Stack:** Next.js 14.2.5, React 18, TypeScript 5, Tailwind 3, framer-motion 11, three 0.169, @react-three/fiber 8, @react-three/drei 9 (Sky, Sparkles, useGLTF, Float, ContactShadows not needed here).

**Spec:** `docs/superpowers/specs/2026-10-08-sky-journey-design.md`

## Global Constraints

- No new npm dependencies.
- All three.js imports only inside `"use client"` components loaded via `next/dynamic` with `ssr: false`.
- Reduced-motion / saveData / no-WebGL / context-lost / mobile <640px must render static stacked panels with no layout shift.
- `npx tsc --noEmit` must pass after every task.
- `npm run build` must pass at the end.
- White/light theme preserved; hero untouched; existing `ProjectShowcase3D` ring stays above `#work`.
- Vendored GLBs total <600KB, CC0 only, attribution comment in code.

---

### Task 1: Papers data + journey types

**Files:**
- Modify: `data/portfolio.ts` (append only)
- Test: typecheck

**Interfaces:**
- Consumes: existing `Project` type.
- Produces: `export type Paper = { id: number; title: string; venue: string; year: string; abstract: string; tags: string[]; link: string }`, `export const papers: Paper[]` (5 examples derived from Data/AI projects), `export type JourneyTheme = "playful" | "academic"`.

- [ ] **Step 1: Append the types and papers array to data/portfolio.ts**

```ts
export type Paper = {
  id: number;
  title: string;
  venue: string;
  year: string;
  abstract: string;
  tags: string[];
  link: string;
};

export type JourneyTheme = "playful" | "academic";

// EXAMPLE DATA (derived from existing projects) — owner rewrites with real papers later.
export const papers: Paper[] = [
  {
    id: 101,
    title: "ARIMA-Based Forecasting of Algeria's Oil & Gas Production",
    venue: "Applied Energy Analytics — Working Paper",
    year: "2025",
    abstract:
      "Time-series modeling of national hydrocarbon output and revenue with ARIMA baselines, exogenous regressors, and rolling-origin evaluation.",
    tags: ["Time Series", "ARIMA", "Energy"],
    link: "https://colab.research.google.com/drive/13N31tkvfJZf7nM9U0O8qBLgqnhOpqzue",
  },
  {
    id: 102,
    title: "Stacked Ensembles for Sleep-Stage Classification",
    venue: "Biomedical Signal Processing — Preprint",
    year: "2025",
    abstract:
      "Stacked ensemble learning over physiological time series with spectral and Hjorth features for five-stage sleep classification.",
    tags: ["Ensembles", "Signal Processing", "Health"],
    link: "https://colab.research.google.com/drive/1xOeaHCSjtY-pKOtnRnj6Sn94jL1Vw1Dp",
  },
  {
    id: 103,
    title: "Predicting News Popularity with NLP-Augmented Regression",
    venue: "NLP Applications — Study Note",
    year: "2025",
    abstract:
      "Regression models over UCI news-popularity features enriched with sentiment, entity, and readability signals.",
    tags: ["Regression", "NLP", "Media"],
    link: "https://www.kaggle.com/datasets/thehapyone/uci-online-news-popularity-data-set",
  },
  {
    id: 104,
    title: "Neural SMS Classification: Spam vs Ham at Scale",
    venue: "Text Classification — Technical Report",
    year: "2025",
    abstract:
      "Character- and word-level neural baselines for SMS spam detection with calibration and error analysis.",
    tags: ["Neural Networks", "NLP", "Security"],
    link: "https://colab.research.google.com/drive/1fFhr_RO3QnRGP2Stob-U0yF925FPjOii",
  },
  {
    id: 105,
    title: "MGRPO: Multi-Modal Group Relative Policy Optimization",
    venue: "LLM Reasoning — Research Draft",
    year: "2025",
    abstract:
      "Extending GRPO with multi-modal critics that fuse text, image, and structured evidence for advanced reasoning tasks.",
    tags: ["RL", "Multi-modal", "Transformers"],
    link: "#",
  },
];
```

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS (no output)

- [ ] **Step 3: Commit**

```bash
git add data/portfolio.ts
git commit -m "feat: add papers data and journey theme type"
```

---

### Task 2: SkyJourney engine (track + sky + line + camera)

**Files:**
- Create: `components/SkyJourney.tsx`
- Test: typecheck + dev visual (sky renders, line draws on scroll)

**Interfaces:**
- Consumes: `JourneyTheme` from `@/data/portfolio`, `useWebGLAllowed` from `./GlobalBackdrop`, framer-motion `useScroll/useSpring/useTransform/MotionValue`.
- Produces: `export default function SkyJourney({ id, theme, stops, renderPanel }: { id: string; theme: JourneyTheme; stops: number; renderPanel: (index: number, active: boolean) => React.ReactNode }): JSX.Element | null` — tall track with sticky canvas; `stops` = panel count; `renderPanel(i, isActive)` called per stop block. Returns stacked static panels (no canvas) when WebGL disallowed / reduced-motion / mobile.

Full file content:

```tsx
"use client";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sky, Sparkles } from "@react-three/drei";
import { motion, useReducedMotion, useScroll, useSpring, type MotionValue } from "framer-motion";
import * as THREE from "three";
import { useWebGLAllowed } from "./GlobalBackdrop";
import type { JourneyTheme } from "@/data/portfolio";

const THEMES: Record<JourneyTheme, { line: [string, string]; fog: string; bg: string }> = {
  playful: { line: ["#2563eb", "#8b5cf6"], fog: "#eef4ff", bg: "linear-gradient(180deg,#dbeafe 0%,#eef2ff 45%,#ffffff 100%)" },
  academic: { line: ["#d97706", "#0d9488"], fog: "#fdf8ec", bg: "linear-gradient(180deg,#fef3c7 0%,#fdf8ec 50%,#ffffff 100%)" },
};

function makeCloudTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 128;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, 256, 128);
  const blobs: [number, number, number][] = [[70, 80, 42], [120, 66, 52], [175, 78, 44], [100, 90, 48], [150, 92, 40]];
  for (const [x, y, r] of blobs) {
    const g = ctx.createRadialGradient(x, y, 4, x, y, r);
    g.addColorStop(0, "rgba(255,255,255,0.95)");
    g.addColorStop(0.7, "rgba(255,255,255,0.55)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const CLOUDS: { pos: [number, number, number]; scale: number; speed: number }[] = [
  { pos: [-6, 3.5, -6], scale: 5, speed: 0.12 },
  { pos: [5.5, 2, -8], scale: 6.5, speed: 0.09 },
  { pos: [0, -1, -5], scale: 4, speed: 0.15 },
  { pos: [-4, -4.5, -7], scale: 7, speed: 0.07 },
  { pos: [6, -3, -4], scale: 4.5, speed: 0.13 },
  { pos: [-7, 0.5, -9], scale: 8, speed: 0.06 },
  { pos: [3, 5, -10], scale: 7.5, speed: 0.08 },
  { pos: [-2, -8, -6], scale: 5.5, speed: 0.1 },
  { pos: [7, -7, -8], scale: 6, speed: 0.09 },
  { pos: [-5, -11, -5], scale: 4.5, speed: 0.12 },
];

function Clouds() {
  const tex = useMemo(() => makeCloudTexture(), []);
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useEffect(() => () => tex.dispose(), [tex]);
  useFrame((state, dt) => {
    if (document.hidden) return;
    const px = state.pointer.x;
    refs.current.forEach((m, i) => {
      if (!m) return;
      m.position.x += (CLOUDS[i].speed * dt + px * dt * 0.15);
      if (m.position.x > 11) m.position.x = -11;
    });
  });
  return (
    <group>
      {CLOUDS.map((c, i) => (
        <mesh key={i} ref={(m) => { refs.current[i] = m; }} position={c.pos} scale={[c.scale, c.scale * 0.5, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={tex} transparent depthWrite={false} opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function journeyCurve(stops: number): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < stops; i++) {
    const t = stops === 1 ? 0 : i / (stops - 1);
    pts.push(new THREE.Vector3(Math.sin(t * Math.PI * 2.5) * 2.2, 4 - t * 18, 0));
  }
  return new THREE.CatmullRomCurve3(pts);
}

function LineAndRig({ curve, progress, colors }: {
  curve: THREE.CatmullRomCurve3;
  progress: MotionValue<number>;
  colors: [string, string];
}) {
  const headRef = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => {
    const g = new THREE.TubeGeometry(curve, 220, 0.045, 8, false);
    const count = g.index ? g.index.count : g.attributes.position.count;
    const arr = new Float32Array(count * 3);
    const cA = new THREE.Color(colors[0]);
    const cB = new THREE.Color(colors[1]);
    const pos = g.attributes.position;
    for (let i = 0; i < count; i++) {
      const vi = g.index ? g.index.getX(i) : i;
      const c = cA.clone().lerp(cB, THREE.MathUtils.clamp(1 - (pos.getY(vi) + 14) / 18, 0, 1));
      arr[i * 3] = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    }
    g.setAttribute("color", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [curve, colors]);
  useEffect(() => () => geo.dispose(), [geo]);
  const total = geo.index ? geo.index.count : geo.attributes.position.count;
  useFrame((state, dt) => {
    if (document.hidden) return;
    const p = THREE.MathUtils.clamp(progress.get(), 0, 1);
    geo.setDrawRange(0, Math.floor(p * total));
    const t = p * 0.999;
    const pos = curve.getPoint(t);
    const ahead = curve.getPoint(Math.min(t + 0.04, 1));
    if (headRef.current) {
      headRef.current.position.copy(pos);
      const s = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.18;
      headRef.current.scale.setScalar(s);
    }
    const camPos = pos.clone().add(new THREE.Vector3(0, 0.4, 8.2));
    camPos.x += state.pointer.x * 0.5;
    camPos.y += state.pointer.y * 0.3;
    state.camera.position.lerp(camPos, 1 - Math.exp(-4 * dt));
    state.camera.lookAt(ahead.x, ahead.y, 0);
  });
  return (
    <>
      <mesh geometry={geo}>
        <meshBasicMaterial vertexColors toneMapped={false} />
      </mesh>
      <mesh ref={headRef}>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshBasicMaterial color={colors[1]} toneMapped={false} />
      </mesh>
    </>
  );
}

export default function SkyJourney({ id, theme, stops, renderPanel }: {
  id: string;
  theme: JourneyTheme;
  stops: number;
  renderPanel: (index: number, progress: MotionValue<number>) => React.ReactNode;
}) {
  const allowed = useWebGLAllowed();
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [glLost, setGlLost] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 22 });
  const t = THEMES[theme];
  const curve = useMemo(() => journeyCurve(Math.max(stops, 1)), [stops]);
  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const el = trackRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const showCanvas = allowed && !reduce && !glLost && inView && !isMobile;
  return (
    <div id={id} ref={trackRef} className="journey-track relative" style={{ background: t.bg }}>
      <div className="sticky top-[8vh] h-[84vh] overflow-hidden">
        {showCanvas && (
          <Canvas dpr={[1, 1.5]} camera={{ position: [0, 4.4, 8.2], fov: 50 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} onCreated={({ gl }) => {
            gl.domElement.addEventListener("webglcontextlost", (e) => { e.preventDefault(); setGlLost(true); });
          }}>
            <fog attach="fog" args={[t.fog, 9, 22]} />
            <ambientLight intensity={1.1} />
            <directionalLight position={[4, 6, 6]} intensity={1} />
            <Suspense fallback={null}>
              <Sky sunPosition={[60, 25, -80]} turbidity={4} rayleigh={1.2} />
              <Clouds />
              <Sparkles count={70} scale={[14, 20, 4]} size={2.5} speed={0.25} opacity={0.5} color="#ffffff" />
              <LineAndRig curve={curve} progress={progress} colors={t.line} />
            </Suspense>
          </Canvas>
        )}
      </div>
      <div className="journey-stops relative z-10 -mt-[84vh]">
        {Array.from({ length: stops }, (_, i) => (
          <div key={i} className="flex min-h-[84vh] items-center px-4 py-10 md:px-10">
            <div className={`w-full md:w-[46%] ${i % 2 === 0 ? "md:mr-auto md:ml-[4%]" : "md:ml-auto md:mr-[4%]"}`}>
              {renderPanel(i, progress)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

Notes for implementer: `Sky` props sunPosition/turbidity/rayleigh exist in drei 9. `Sparkles` props count/scale/size/speed/opacity/color exist. `fog attach="fog"` standard R3F. Import line must be `import { useReducedMotion, useScroll, useSpring, type MotionValue } from "framer-motion";` — no `motion` import (unused, lint fails the build otherwise).

- [ ] **Step 1: Create components/SkyJourney.tsx with the code above, minus the `motion` import**
- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/SkyJourney.tsx
git commit -m "feat: add SkyJourney scroll engine"
```

---

### Task 3: JourneyPanels flip-cascade panels

**Files:**
- Create: `components/JourneyPanels.tsx`
- Test: typecheck

**Interfaces:**
- Consumes: `JourneyTheme` type, framer-motion `MotionValue/useTransform/useSpring/useReducedMotion`.
- Produces: `export function ProjectPanel({ index, stops, progress, project, onSelect }: {...}): JSX.Element` and `export function PaperPanel({ index, stops, progress, paper }: {...}): JSX.Element`. Each takes shared `progress: MotionValue<number>` and animates flip when progress crosses its stop range. `project` is `Project` from `@/data/portfolio`; `onSelect: (p: Project) => void`.

```tsx
"use client";
import { motion, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, Calendar, ScrollText } from "lucide-react";
import type { Paper, Project } from "@/data/portfolio";

function useStopProgress(progress: MotionValue<number>, index: number, stops: number) {
  const a = index / stops;
  const b = Math.min(a + 1.2 / stops, 1);
  const raw = useTransform(progress, [Math.max(a - 0.06, 0), b], [0, 1]);
  return useSpring(raw, { stiffness: 120, damping: 16 });
}

function PanelShell({ local, side, theme, children }: {
  local: MotionValue<number>;
  side: 1 | -1;
  theme: "playful" | "academic";
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const opacity = useTransform(local, [0, 0.35], [0, 1]);
  const y = useTransform(local, [0, 1], [70, 0]);
  const rotateX = useTransform(local, [0, 1], reduce ? [0, 0] : [55, 0]);
  const rotateY = useTransform(local, [0, 1], reduce ? [0, 0] : [18 * side, 0]);
  const blur = useTransform(local, [0, 0.6], ["blur(8px)", "blur(0px)"]);
  return (
    <motion.div
      style={{ opacity, y, rotateX, rotateY, filter: reduce ? undefined : blur, transformPerspective: 1100 }}
      className={theme === "academic"
        ? "rounded-2xl border border-amber-200/70 bg-[#fffdf4]/95 p-6 shadow-[0_18px_44px_-18px_rgba(120,72,0,0.35)] backdrop-blur-sm"
        : "rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-[0_18px_44px_-18px_rgba(37,99,235,0.35)] backdrop-blur-sm"}
    >
      {children}
    </motion.div>
  );
}

export function ProjectPanel({ index, stops, progress, project, onSelect }: {
  index: number; stops: number; progress: MotionValue<number>; project: Project; onSelect: (p: Project) => void;
}) {
  const local = useStopProgress(progress, index, stops);
  const side = (index % 2 === 0 ? 1 : -1) as 1 | -1;
  return (
    <PanelShell local={local} side={side} theme="playful">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={project.image} alt={project.title} loading="lazy" className="h-40 w-full rounded-xl object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">{project.category} — {project.year}</p>
      <h3 className="mt-1 font-display text-xl font-bold tracking-tight text-slate-900">{project.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{project.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500"><Calendar size={12} /> {project.year}</span>
        <button onClick={() => onSelect(project)} className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
          Open <ArrowUpRight size={15} />
        </button>
      </div>
    </PanelShell>
  );
}

export function PaperPanel({ index, stops, progress, paper }: {
  index: number; stops: number; progress: MotionValue<number>; paper: Paper;
}) {
  const local = useStopProgress(progress, index, stops);
  const side = (index % 2 === 0 ? -1 : 1) as 1 | -1;
  return (
    <PanelShell local={local} side={side} theme="academic">
      <p className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700">
        <ScrollText size={12} /> {paper.venue}
      </p>
      <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-slate-900">{paper.title}</h3>
      <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-slate-600">{paper.abstract}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {paper.tags.map((tg) => (
          <span key={tg} className="rounded-lg border border-amber-100 bg-amber-50/60 px-2 py-1 text-[11px] font-medium text-amber-800">{tg}</span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">{paper.year}</span>
        <a href={paper.link} target={paper.link.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700">
          Read <ArrowUpRight size={15} />
        </a>
      </div>
    </PanelShell>
  );
}
```

Note: panels derive motion from the shared `progress` MotionValue passed by SkyJourney's `renderPanel(i, progress)` — no per-panel viewport observers, activation stays line-synced by construction.

- [ ] **Step 1: Create components/JourneyPanels.tsx with the code above**
- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/JourneyPanels.tsx
git commit -m "feat: add journey flip panels"
```

---

### Task 4: FlyingObjects (web GLBs + procedural fallback)

**Files:**
- Create: `components/FlyingObjects.tsx`
- Binary: `public/models/paper-plane.glb`, `public/models/hot-air-balloon.glb` (attempt download; procedural-only if impossible)
- Test: typecheck + dev visual

**Interfaces:**
- Consumes: drei `useGLTF/Float`, `JourneyTheme`.
- Produces: `export default function FlyingObjects({ theme }: { theme: JourneyTheme }): JSX.Element` — renders inside any Canvas (must be placed inside SkyJourney's Canvas by Task 5).

- [ ] **Step 1: Attempt to vendor two CC0 GLBs**

Search Poly Pizza (https://poly.pizza) for "paper airplane" and "hot air balloon" by Quaternius (CC0, no login). Download the **GLB** files (not GLTF+bin) and save as `public/models/paper-plane.glb` and `public/models/hot-air-balloon.glb`. Constraints: each <300KB; if a file is bigger, pick a smaller alternative (e.g., "toy plane", "balloon", "kite", "bird"). Verify with `Get-Item` sizes. If download is impossible in this environment, SKIP the binaries and note it in the commit message + report — the code below handles absence via error boundary.

- [ ] **Step 2: Create components/FlyingObjects.tsx with this exact content**

```tsx
"use client";
import { Component, Suspense, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { JourneyTheme } from "@/data/portfolio";

// Models: CC0 by Quaternius (https://quaternius.com), via Poly Pizza (https://poly.pizza), Public Domain CC0.

class ModelBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function ProceduralPlane({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current || document.hidden) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 1.4) * 0.25;
    ref.current.rotation.z = Math.sin(t * 0.9) * 0.12 + state.pointer.x * 0.2;
    ref.current.rotation.y = Math.sin(t * 0.5) * 0.2;
  });
  return (
    <group ref={ref} position={position}>
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh rotation={[0, 0, -0.2]}>
          <coneGeometry args={[0.28, 1.1, 4]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} flatShading />
        </mesh>
        <mesh position={[0, 0.02, 0.1]} rotation={[Math.PI / 2, 0, Math.PI / 4]}>
          <planeGeometry args={[0.7, 0.5]} />
          <meshStandardMaterial color="#bfdbfe" roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.02, -0.35]} rotation={[Math.PI / 2, 0, Math.PI / 4]}>
          <planeGeometry args={[0.34, 0.24]} />
          <meshStandardMaterial color="#93c5fd" roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
      </Float>
    </group>
  );
}

function ProceduralBalloon({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current || document.hidden) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 0.7 + 2) * 0.3;
    ref.current.rotation.y += 0.0015;
    ref.current.rotation.z = state.pointer.x * 0.1;
  });
  return (
    <group ref={ref} position={position}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={1}>
        <mesh>
          <sphereGeometry args={[0.55, 24, 24]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.45} />
        </mesh>
        <mesh position={[0, -0.85, 0]}>
          <boxGeometry args={[0.28, 0.24, 0.28]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
          <meshStandardMaterial color="#57534e" roughness={0.8} />
        </mesh>
      </Float>
    </group>
  );
}

function GlbFlyer({ url, position, scale }: { url: string; position: [number, number, number]; scale: number }) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current || document.hidden) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 1.1) * 0.25;
    ref.current.rotation.y += 0.002;
    ref.current.rotation.z = state.pointer.x * 0.15;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      <Float speed={1.3} rotationIntensity={0.3} floatIntensity={0.9}>
        <primitive object={scene.clone()} />
      </Float>
    </group>
  );
}

export default function FlyingObjects({ theme }: { theme: JourneyTheme }) {
  const playful = theme === "playful";
  const planePos: [number, number, number] = playful ? [-3.4, 2.2, -1.5] : [-3.6, 1.4, -2];
  const balloonPos: [number, number, number] = playful ? [3.6, -2.5, -2.5] : [3.8, -3.5, -3];
  return (
    <group>
      <ModelBoundary fallback={<ProceduralPlane position={planePos} />}>
        <Suspense fallback={<ProceduralPlane position={planePos} />}>
          <GlbFlyer url="/models/paper-plane.glb" position={planePos} scale={playful ? 1 : 0.8} />
        </Suspense>
      </ModelBoundary>
      <ModelBoundary fallback={<ProceduralBalloon position={balloonPos} />}>
        <Suspense fallback={<ProceduralBalloon position={balloonPos} />}>
          <GlbFlyer url="/models/hot-air-balloon.glb" position={balloonPos} scale={playful ? 1.1 : 0.9} />
        </Suspense>
      </ModelBoundary>
    </group>
  );
}
```

Note: `useGLTF` caches by URL; missing files throw → boundary catches → procedural shows. If binaries were skipped in Step 1, this still works (boundary path). Either way the scene never breaks.

- [ ] **Step 3: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: Commit (binaries + component together)**

```bash
git add components/FlyingObjects.tsx public/models
git commit -m "feat: add flying objects with web GLBs and procedural fallback"
```

---

### Task 5: Wire two themed journeys into Projects + CSS + verify

**Files:**
- Modify: `components/Projects.tsx` (replace grid with two journeys; keep ring + dialog + pills for developed)
- Modify: `components/SkyJourney.tsx` (renderPanel signature is `(index, progress)` per Task 3 resolution; mount `<FlyingObjects theme>` inside Canvas)
- Modify: `app/globals.css` (track/parchment styles)
- Test: typecheck + build + manual

**Interfaces:**
- Consumes: Tasks 1–4 exports; existing `ProjectDialog`, `SectionHeading`, `ProjectShowcase3D`.
- Produces: no new exports.

- [ ] **Step 1: Edit SkyJourney — mount flyers inside Canvas**

Add import `import FlyingObjects from "./FlyingObjects";` and add `<FlyingObjects theme={theme} />` inside the Canvas `<Suspense>` after `<LineAndRig ... />`. Nothing else in SkyJourney changes (signature is already `(index, progress)`).

- [ ] **Step 2: Rewrite Projects.tsx sections**

Keep: `"use client"`, SectionHeading, ProjectShowcase3D dynamic mount, category pills, ProjectDialog, TiltCard/grid REMOVED and replaced as below. Structure:

```tsx
"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import SectionHeading from "./SectionHeading";
import ProjectDialog from "./ProjectDialog";
import { ProjectPanel, PaperPanel } from "./JourneyPanels";
import { projects, papers, categories, type Project } from "@/data/portfolio";

const ProjectShowcase3D = dynamic(() => import("./ProjectShowcase3D"), { ssr: false });
const SkyJourney = dynamic(() => import("./SkyJourney"), { ssr: false });

export default function Projects() {
  const [cat, setCat] = useState("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const developed = cat === "All" ? projects : projects.filter((p) => p.category === cat);
  return (
    <>
      <section id="work" className="relative bg-white/80 py-24 backdrop-blur-sm">
        <div className="container-x">
          <SectionHeading title={<>Featured Projects</>} subtitle="Production-grade builds across AI, full-stack, mobile and data — each with real-world impact." />
          <ProjectShowcase3D projects={projects} activeId={selected?.id ?? null} onPick={setSelected} />
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {categories.map((c) => { /* unchanged pill buttons */ })}
          </div>
        </div>
        <SkyJourney id="work-journey" theme="playful" stops={developed.length} renderPanel={(i, progress) => (
          <ProjectPanel index={i} stops={developed.length} progress={progress} project={developed[i]} onSelect={setSelected} />
        )} />
      </section>
      <section id="research" className="relative bg-white/80 py-24 backdrop-blur-sm">
        <div className="container-x">
          <SectionHeading title={<>Research & Papers</>} subtitle="Academic writing and applied studies — early drafts, notes and reports you can edit freely later." />
        </div>
        <SkyJourney id="research-journey" theme="academic" stops={papers.length} renderPanel={(i, progress) => (
          <PaperPanel index={i} stops={papers.length} progress={progress} paper={papers[i]} />
        )} />
      </section>
      {selected && <ProjectDialog project={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
```

Keep the existing pill-button JSX verbatim (copy from current file). Keep AnimatePresence around dialog if currently present. Add `scroll-margin` — `#research-journey` inner div already has id; ensure `section[id]` CSS covers it (it does). Update Navbar links? Navbar has Work/About/Journey/Contact — Journey points to `#journey` (Timeline). Leave Navbar unchanged (YAGNI).

- [ ] **Step 3: Append CSS to globals.css**

```css
.journey-track { min-height: 200vh; }
@media (max-width: 640px) {
  .journey-track .sticky { position: static; height: auto; }
  .journey-track .journey-stops { margin-top: 0; }
  .journey-track .journey-stops > div { min-height: 0; }
}
```

The mobile override collapses the empty sticky spacer AND zeroes the `-mt-[84vh]` pull-up plus the tall stop blocks, so phones get plain stacked panels. Do not invent other selectors.

- [ ] **Step 4: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 5: Run production build**

Run: `npm run build`
Expected: compiled successfully

- [ ] **Step 6: Manual acceptance (dev)**

Run: `npm run dev`, open `http://localhost:3000`
Expected: ring teaser intact; scroll `#work-journey` draws blue→violet line, camera glides through clouds, flyers bank on mouse, developed panels flip in one-by-one alternating sides, click opens dialog; pills filter stops; `#research` draws amber→teal line with parchment panels; mobile 390px + reduced-motion show stacked static panels with no canvas.

- [ ] **Step 7: Commit**

```bash
git add components/Projects.tsx components/SkyJourney.tsx app/globals.css
git commit -m "feat: wire sky journeys for projects and research"
```

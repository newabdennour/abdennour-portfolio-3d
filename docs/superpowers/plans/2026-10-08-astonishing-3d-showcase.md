# Astonishing 3D Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add section-local real-3D islands (Hero3D object cluster + featured-projects 3D ring) synced with existing grid + dialog, white-theme safe.

**Architecture:** Native page scroll stays. Two lazy R3F islands read springed scroll progress via a tiny shared hook and R3F `state.pointer`. Click on 3D reuses existing `onSelect(project)` dialog flow.

**Tech Stack:** Next.js 14.2.5, React 18, TypeScript 5, Tailwind 3, framer-motion 11, three 0.169, @react-three/fiber 8, @react-three/drei 9.

**Spec:** `docs/superpowers/specs/2026-10-08-astonishing-3d-showcase-design.md`

## Global Constraints

- No new npm dependencies.
- All three.js imports only inside `"use client"` components loaded via `next/dynamic` with `ssr: false`.
- Reduced-motion / saveData / no-WebGL / context-lost must render static fallback with no layout shift.
- `npx tsc --noEmit` must pass after every task.
- `npm run build` must pass at the end.
- White theme preserved; hero stays pure white; canvases never sit behind hero text.

---

### Task 1: ScrollRig shared scroll hook

**Files:**
- Create: `components/ScrollRig.tsx`
- Test: typecheck + build (no unit framework in repo)

**Interfaces:**
- Consumes: `framer-motion` `useScroll`, `useSpring`, `MotionValue`.
- Produces: `export function useGlobalScrollSprings(): { scrollYProgress: MotionValue<number>, heroProgress: MotionValue<number> }` — `heroProgress` is 0 at top, 1 after ~700px, springed.

- [ ] **Step 1: Write the file**

```tsx
"use client";
import { useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";

export function useGlobalScrollSprings(): {
  scrollYProgress: MotionValue<number>;
  heroProgress: MotionValue<number>;
} {
  const { scrollY, scrollYProgress } = useScroll();
  const heroRaw = useTransform(scrollY, [0, 700], [0, 1]);
  const heroProgress = useSpring(heroRaw, { stiffness: 90, damping: 24 });
  return { scrollYProgress, heroProgress };
}
```

- [ ] **Step 2: Run typecheck to verify it compiles**

Run: `npx tsc --noEmit`
Expected: PASS (no output)

- [ ] **Step 3: Commit**

```bash
git add components/ScrollRig.tsx
git commit -m "feat: add ScrollRig global scroll springs hook"
```

---

### Task 2: Hero3D interactive object cluster

**Files:**
- Create: `components/Hero3D.tsx`
- Test: typecheck + dev visual (drag spins, scroll tilts away)

**Interfaces:**
- Consumes: `useGlobalScrollSprings` heroProgress (MotionValue), drei `Float`, `ContactShadows`, `PresentationControls`, `MeshDistortMaterial`.
- Produces: `export default function Hero3D(): JSX.Element | null` — renders 300px-tall canvas or null when WebGL disallowed; no props.

```tsx
"use client";
import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows, PresentationControls, MeshDistortMaterial } from "@react-three/drei";
import { motion, useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { useGlobalScrollSprings } from "./ScrollRig";
import { useWebGLAllowed } from "./GlobalBackdrop";

function Rig({ heroProgress }: { heroProgress: import("framer-motion").MotionValue<number> }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (!ref.current || document.hidden) return;
    const p = heroProgress.get();
    const { pointer, clock } = state;
    const t = clock.getElapsedTime();
    ref.current.rotation.y += dt * (0.25 + p * 0.6);
    ref.current.rotation.x += ((pointer.y * 0.3 + p * 0.9) - ref.current.rotation.x) * 0.05;
    ref.current.position.y += ((Math.sin(t * 0.8) * 0.08 - p * 1.4) - ref.current.position.y) * 0.06;
    const s = 1 - p * 0.35;
    ref.current.scale.setScalar(s);
  });
  return (
    <group ref={ref}>
      <Float speed={1.6} rotationIntensity={0.7} floatIntensity={1.1}>
        <mesh>
          <torusKnotGeometry args={[0.85, 0.26, 128, 32]} />
          <MeshDistortMaterial color="#2563eb" roughness={0.25} metalness={0.15} distort={0.35} speed={2} transparent opacity={0.92} />
        </mesh>
      </Float>
      <Float speed={1.1} rotationIntensity={0.5} floatIntensity={0.9}>
        <mesh position={[1.5, -0.7, -1]} rotation={[0.4, 0.6, 0]}>
          <icosahedronGeometry args={[0.45, 1]} />
          <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.5} />
        </mesh>
      </Float>
    </group>
  );
}

export default function Hero3D() {
  const allowed = useWebGLAllowed();
  const reduce = useReducedMotion();
  const { heroProgress } = useGlobalScrollSprings();
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = document.getElementById("top");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  if (!allowed || reduce || !visible) return null;
  return (
    <motion.div aria-hidden className="hero-3d pointer-events-auto relative h-[240px] w-full md:h-[300px]">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5.2], fov: 50 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 4, 5]} intensity={1.1} />
        <Suspense fallback={null}>
          <PresentationControls enabled global={false} snap cursor speed={1} polar={[-0.5, 0.5]} config={{ mass: 1, tension: 170, friction: 26 }}>
            <Rig heroProgress={heroProgress} />
          </PresentationControls>
          <ContactShadows position={[0, -1.6, 0]} opacity={0.32} scale={8} blur={2.2} far={4} resolution={256} color="#0f172a" />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}
```

- [ ] **Step 1: Create the file with the code above**
- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/Hero3D.tsx
git commit -m "feat: add Hero3D interactive object cluster"
```

---

### Task 3: ProjectShowcase3D featured ring

**Files:**
- Create: `components/ProjectShowcase3D.tsx`
- Test: typecheck + dev visual (ring rotates, drag works, click opens dialog)

**Interfaces:**
- Consumes: `type Project` from `@/data/portfolio`, drei `useTexture`, `Float`, `ContactShadows`, `PresentationControls`, `Edges`.
- Produces: `export default function ProjectShowcase3D({ projects, activeId, onPick }: { projects: Project[]; activeId: number | null; onPick: (p: Project) => void }): JSX.Element | null`.

```tsx
"use client";
import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Float, ContactShadows, PresentationControls, useTexture, Edges } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import type { Project } from "@/data/portfolio";
import { useWebGLAllowed } from "./GlobalBackdrop";

function Ring({ projects, activeId, onPick }: { projects: Project[]; activeId: number | null; onPick: (p: Project) => void }) {
  const group = useRef<THREE.Group>(null);
  const urls = projects.map((p) => p.image);
  const textures = useTexture(urls);
  const [hovered, setHovered] = useState<number | null>(null);
  const arr = Array.isArray(textures) ? textures : [textures];
  arr.forEach((t) => {
    const tex = t as THREE.Texture;
    tex.colorSpace = THREE.SRGBColorSpace;
  });
  useFrame((state, dt) => {
    if (!group.current || document.hidden) return;
    const dragging = hovered !== null;
    if (!dragging) group.current.rotation.y += dt * 0.12;
    group.current.rotation.y += state.pointer.x * dt * 0.05;
  });
  const n = projects.length;
  return (
    <group ref={group}>
      {projects.map((p, i) => {
        const a = (i / n) * Math.PI * 2;
        const x = Math.sin(a) * 3.2;
        const z = Math.cos(a) * 3.2;
        const isActive = p.id === activeId || hovered === p.id;
        return (
          <Float key={p.id} speed={1.2} rotationIntensity={0.25} floatIntensity={0.7}>
            <mesh
              position={[x, 0, z]}
              rotation={[0, a, 0]}
              scale={isActive ? 1.18 : 1}
              onPointerOver={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHovered(p.id); document.body.style.cursor = "pointer"; }}
              onPointerOut={() => { setHovered(null); document.body.style.cursor = "auto"; }}
              onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onPick(p); }}
            >
              <planeGeometry args={[2, 1.3]} />
              <meshBasicMaterial map={arr[i] as THREE.Texture} toneMapped={false} />
              {isActive ? <Edges scale={1.02} threshold={15} color="#2563eb" /> : null}
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

export default function ProjectShowcase3D({ projects, activeId, onPick }: { projects: Project[]; activeId: number | null; onPick: (p: Project) => void }) {
  const allowed = useWebGLAllowed();
  const reduce = useReducedMotion();
  const [inView, setInView] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const featured = projects.filter((p) => p.featured).slice(0, 5);
  if (!allowed || reduce || !inView || featured.length === 0) return null;
  return (
    <div ref={wrapRef} aria-hidden={false} className="showcase-3d relative mx-auto mb-10 h-[380px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 md:h-[440px]">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.4, 7.5], fov: 48 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <ambientLight intensity={1} />
        <directionalLight position={[4, 5, 6]} intensity={1} />
        <Suspense fallback={null}>
          <PresentationControls enabled global={false} snap cursor speed={1.2} polar={[-0.35, 0.35]} azimuth={[-Math.PI, Math.PI]} config={{ mass: 1, tension: 170, friction: 26 }}>
            <Ring projects={featured} activeId={activeId} onPick={onPick} />
          </PresentationControls>
          <ContactShadows position={[0, -1.4, 0]} opacity={0.28} scale={12} blur={2.4} far={5} resolution={256} color="#0f172a" />
        </Suspense>
      </Canvas>
      <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-xs font-medium text-slate-400">Drag to spin · Click a panel to open details</p>
    </div>
  );
}
```

- [ ] **Step 1: Create the file with the code above**
- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/ProjectShowcase3D.tsx
git commit -m "feat: add ProjectShowcase3D featured ring"
```

---

### Task 4: Wire Hero3D + Showcase into page

**Files:**
- Modify: `components/Hero.tsx` (embed Hero3D in 2-col row on md+)
- Modify: `components/Projects.tsx` (render showcase above categories when cat All)
- Modify: `app/globals.css` (heights + fallback, no layout shift)
- Test: typecheck + build + manual

**Interfaces:**
- Consumes: Task 1–3 exports, existing `ProjectDialog` state in Projects.
- Produces: no new exports; page shows 3D islands with grid fallback intact.

- [ ] **Step 1: Edit Hero.tsx — add dynamic import and layout**

Add after existing imports:

```tsx
import dynamic from "next/dynamic";
const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false });
```

Replace the stats `motion.div` block opener `<motion.div ... className="mx-auto mt-14 max-w-3xl">` with a 2-col wrapper on md+ that keeps stats left and 3D right. Minimal edit: directly after the location `<motion.p>` block, insert:

```tsx
<div className="mx-auto mt-10 grid max-w-4xl items-center gap-6 md:grid-cols-[1.2fr_0.8fr]">
  <div className="min-w-0">
```

And close the new div after the stats `</motion.div>` + add `<Hero3D />` as second column:

```tsx
  </div>
  <Hero3D />
</div>
```

Concretely: wrap the existing stats `motion.div` (the `mx-auto mt-14 max-w-3xl` block) inside the left column div, keep its classes, change `mt-14` to `mt-0`. Verify JSX balances.

- [ ] **Step 2: Edit Projects.tsx — mount showcase**

Add import:

```tsx
import dynamic from "next/dynamic";
const ProjectShowcase3D = dynamic(() => import("./ProjectShowcase3D"), { ssr: false });
```

Inside `Projects()` return, directly after `<SectionHeading ... />`, insert:

```tsx
{cat === "All" && (
  <ProjectShowcase3D projects={projects} activeId={selected?.id ?? null} onPick={setSelected} />
)}
```

- [ ] **Step 3: Edit globals.css — reserve space**

Append inside `@layer components`:

```css
.hero-3d canvas { display: block; }
.showcase-3d canvas { display: block; touch-action: pan-y; }
@media (max-width: 640px) {
  .showcase-3d { height: 320px; }
}
```

- [ ] **Step 4: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 5: Run production build**

Run: `npm run build`
Expected: compiled successfully, `/` 300–450 kB first load acceptable

- [ ] **Step 6: Manual acceptance (dev)**

Run: `npm run dev`, open `http://localhost:3000`
Expected: hero right shows blue torus-knot + violet wireframe, drag spins with spring-back, scroll shrinks/lifts it; Featured Projects shows 5-panel 3D ring with real screenshots, drag spins, click opens dialog, pills/grid below still work; mobile 390px + reduced-motion shows grid only.

- [ ] **Step 7: Commit**

```bash
git add components/Hero.tsx components/Projects.tsx app/globals.css
git commit -m "feat: wire Hero3D and ProjectShowcase3D into page"
```

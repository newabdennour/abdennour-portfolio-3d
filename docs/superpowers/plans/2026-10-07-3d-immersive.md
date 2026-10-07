# Immersive 3D Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add full immersive Three.js background + immersive project showcase while keeping clean white professional theme.

**Architecture:** Single lazy-loaded global WebGL Canvas (`GlobalBackdrop`) behind content with particle field + floating wireframes reacting to mouse/scroll, Hero gets scroll parallax, Projects TiltCard upgraded to true 3D with glare.

**Tech Stack:** Next.js 14.2.5, React 18.3.1, three@0.169.0, @react-three/fiber@8.17.10, @react-three/drei@9.114.0, framer-motion@11.11.9, Tailwind 3.4.13

**Spec:** `docs/superpowers/specs/2026-10-07-3d-immersive-design.md`

## Global Constraints

- Keep white theme readable: WebGL opacity low, blue #2563eb / violet #8b5cf6 at 0.15-0.25 opacity only.
- All 3D imports client-only via `next/dynamic` with `ssr:false`.
- Canvas `dpr` capped to `[1, 1.75]`, `antialias:true`, `alpha:true`.
- Must respect `prefers-reduced-motion`, `saveData`, WebGL failure → CSS fallback.
- No dark mode change, no gltf model loading, no postprocessing bloom, no new routes.
- `npm run build` and `npm run lint` must pass.

---

### Task 1: Deps + GlobalBackdrop + mount

**Files:**
- Modify: `package.json`
- Create: `components/GlobalBackdrop.tsx`
- Modify: `app/page.tsx:1-24`

**Interfaces:**
- Consumes: `data/portfolio.ts` (none directly, backdrop is standalone)
- Produces: `GlobalBackdrop` default export `() => JSX.Element | null`, `useWebGLAllowed() => boolean` (exported from same file for reuse). `app/page.tsx` dynamically imports it as `DynamicBackdrop`.

- [ ] **Step 1: Install pinned 3D deps**

Run:
```bash
npm install three@0.169.0 @react-three/fiber@8.17.10 @react-three/drei@9.114.0
npm install -D @types/three@0.169.0
```
Expected: `package.json` contains those exact versions, `npm ls three` succeeds.

- [ ] **Step 2: Create `components/GlobalBackdrop.tsx`**

```tsx
"use client";
import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

export function useWebGLAllowed() {
  const [allowed, setAllowed] = useState(true);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return void setAllowed(false);
    // @ts-expect-error saveData
    if (navigator?.connection?.saveData) return void setAllowed(false);
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl");
      if (!gl) setAllowed(false);
    } catch { setAllowed(false); }
  }, []);
  return allowed;
}

function Particles({ count = 1200 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
    }
    return arr;
  }, [count]);
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", fn, { passive: true });
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  useFrame((state, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.02;
    ref.current.rotation.x += ((mouse.current.y * 0.15) - ref.current.rotation.x) * 0.03;
    ref.current.rotation.y += ((mouse.current.x * 0.2) - 0) * 0.002;
    const scroll = Math.min(window.scrollY / window.innerHeight, 1);
    (ref.current.material as THREE.PointsMaterial).opacity = 0.55 - scroll * 0.3;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#2563eb" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Shapes() {
  return (
    <>
      <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
        <mesh position={[-3.2, 0.8, -2]} rotation={[0.4, 0.5, 0]}>
          <icosahedronGeometry args={[0.9, 1]} />
          <meshBasicMaterial color="#2563eb" wireframe transparent opacity={0.18} />
        </mesh>
      </Float>
      <Float speed={1.1} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[3.4, -0.6, -2.5]} rotation={[0.2, 0.8, 0.1]}>
          <icosahedronGeometry args={[1.1, 1]} />
          <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.15} />
        </mesh>
      </Float>
    </>
  );
}

export default function GlobalBackdrop() {
  const allowed = useWebGLAllowed();
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > window.innerHeight * 3);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!allowed || hidden) return <div aria-hidden className="webgl-fallback" />;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 6], fov: 55 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} onCreated={({ gl }) => {
        const el = gl.domElement;
        el.addEventListener("webglcontextlost", (e) => { e.preventDefault(); setHidden(true); });
      }}>
        <Suspense fallback={null}>
          <Particles />
          <Shapes />
        </Suspense>
      </Canvas>
      <div className="webgl-fallback absolute inset-0" />
    </div>
  );
}
```

- [ ] **Step 3: Mount in `app/page.tsx`**

Replace imports block with:
```tsx
import dynamic from "next/dynamic";
import Preloader from "@/components/Preloader";
// ... keep existing imports
const GlobalBackdrop = dynamic(() => import("@/components/GlobalBackdrop"), { ssr: false });
```
Inside `<main>` add `<GlobalBackdrop />` as first child before `<Preloader />`.

- [ ] **Step 4: Verify Task 1**

Run:
```bash
npm run build
```
Expected: PASS, no SSR `window` errors, 3D chunk lazy-loaded (check `.next` output mentions GlobalBackdrop).

- [ ] **Step 5: Commit**

```bash
git add package.json components/GlobalBackdrop.tsx app/page.tsx
git commit -m "feat: add global immersive WebGL backdrop with fallback"
```

### Task 2: Hero scroll parallax (keeps copy readable)

**Files:**
- Modify: `components/Hero.tsx:63-177`

**Interfaces:**
- Consumes: `GlobalBackdrop` (behind, no import), `useScroll`, `useTransform` from framer-motion
- Produces: Hero section with `style={{ y, opacity }}` parallax wrapper, no API change

- [ ] **Step 1: Add scroll parallax to Hero container**

In `components/Hero.tsx`, add import:
```tsx
import { useScroll, useTransform } from "framer-motion";
```
Inside `export default function Hero()` top:
```tsx
const { scrollY } = useScroll();
const y = useTransform(scrollY, [0, 600], [0, 80]);
const opacity = useTransform(scrollY, [0, 500], [1, 0.25]);
```
Wrap the existing `<div className="container-x relative z-10 ...">` with:
```tsx
<motion.div style={{ y, opacity }} className="container-x relative z-10 max-w-4xl text-center">
  {/* ... existing content unchanged ... */}
</motion.div>
```
Close tag accordingly. Keep all `Magnetic`, `CountUp`, buttons unchanged.

- [ ] **Step 2: Verify Task 2**

Run:
```bash
npm run build
```
Expected: PASS. Manual: scroll hero, text drifts up 80px and fades to 0.25, backdrop particles fade too, no overlap glitch.

- [ ] **Step 3: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat: add hero scroll parallax over WebGL"
```

### Task 3: Immersive Projects cards + CSS fallback + final verification

**Files:**
- Modify: `components/Projects.tsx:18-55`
- Modify: `app/globals.css:38-89`
- Test: manual + `npm run build`, `npm run lint`

**Interfaces:**
- Consumes: `Project` type from `@/data/portfolio`, `useWebGLAllowed` pattern (CSS-only, no import needed)
- Produces: Upgraded `TiltCard` with ±10deg tilt, glare, scale 1.02, `whileInView` stagger. `.webgl-fallback` CSS class.

- [ ] **Step 1: Upgrade TiltCard tilt + glare**

In `components/Projects.tsx` replace `onMove` body:
```tsx
const onMove = (e: React.MouseEvent) => {
  const r = ref.current?.getBoundingClientRect();
  if (!r) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const px = (e.clientX - r.left) / r.width;
  const py = (e.clientY - r.top) / r.height;
  setTilt({ rx: (0.5 - py) * 10, ry: (px - 0.5) * 10 });
  ref.current?.style.setProperty("--mx", `${px * 100}%`);
  ref.current?.style.setProperty("--my", `${py * 100}%`);
};
```
Replace `motion.div` props: change `initial={{ opacity: 0, y: 28 }}` + `animate` to `initial={{ opacity: 0, y: 32 }}` + `whileInView={{ opacity: 1, y: 0 }}` + `viewport={{ once: true, margin: "-60px" }}`, and style transform to:
```tsx
transform: `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.rx === 0 && tilt.ry === 0 ? 1 : 1.02})`,
transition: "transform 0.15s ease-out, box-shadow 0.3s",
```

- [ ] **Step 2: Add fallback CSS to `app/globals.css`**

Append inside `@layer components`:
```css
.webgl-fallback {
  background:
    radial-gradient(ellipse 60% 45% at 50% 0%, rgba(37,99,235,0.08), transparent 70%),
    radial-gradient(600px 300px at 15% 20%, rgba(139,92,246,0.08), transparent 70%);
}
```

- [ ] **Step 3: Final verification**

Run:
```bash
npm run lint
npm run build
```
Expected: PASS both. Manual checklist:
1. Desktop: particles visible, mouse parallax works, cards tilt ±10deg with blue glare, dialog opens.
2. DevTools mobile 390px + Network save-data: fallback gradient shows, no canvas.
3. DevTools rendering → emulate `prefers-reduced-motion`: no tilt, no parallax, static readable.
4. No horizontal scroll, no text contrast loss.

- [ ] **Step 4: Commit**

```bash
git add components/Projects.tsx app/globals.css
git commit -m "feat: immersive 3D project cards with glare and fallback"
```

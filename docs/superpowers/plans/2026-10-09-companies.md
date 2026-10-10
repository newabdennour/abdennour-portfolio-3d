# Companies 3D Slides Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `#companies` section after the hero with dual counter-scrolling 3D logo marquee plus interactive rotating 3D logo ring.

**Architecture:** Static marquee (CSS keyframes, perspective tilt) + one lazy R3F ring canvas (textured planes, drag-spin). Reduced-motion/mobile fall back to a static wrap grid; logo images hide on error leaving the name.

**Tech Stack:** Next.js 14.2.5, React 18, TypeScript 5, Tailwind 3, framer-motion 11, three 0.169, @react-three/fiber 8, @react-three/drei 9.

**Spec:** `docs/superpowers/specs/2026-10-09-companies-design.md`

## Global Constraints

- No new npm dependencies.
- All three.js imports only inside `"use client"` components loaded via `next/dynamic` with `ssr: false`.
- Reduced-motion / no-WebGL / mobile <640px render the static grid with no layout shift.
- Logo filenames with spaces/`&`/`'` encoded via `encodeURI` at render.
- `npx tsc --noEmit` must pass after every task.
- `npm run build` must pass at the end.

---

### Task 1: Companies data

**Files:**
- Modify: `data/portfolio.ts` (append only)
- Test: typecheck

**Interfaces:**
- Consumes: nothing.
- Produces: `export type Company = { name: string; logo: string; tag: string }`, `export const companies: Company[]` (11 entries, logo paths like `/companies/FEMTO-ST.jpg` unencoded — encoding happens at render).

- [ ] **Step 1: Append to data/portfolio.ts**

```ts
export type Company = { name: string; logo: string; tag: string };

export const companies: Company[] = [
  { name: "FEMTO-ST Institute", logo: "/companies/FEMTO-ST.jpg", tag: "Research · France" },
  { name: "Ministry of Higher Education (MESRS)", logo: "/companies/mesrs.png", tag: "Institution" },
  { name: "Algerian People's National Assembly", logo: "/companies/Algerian People's National Assembly.png", tag: "Institution" },
  { name: "Algérie Poste", logo: "/companies/algerie post.png", tag: "Post & Logistics" },
  { name: "Algérie Télécom", logo: "/companies/algerie telecome.png", tag: "Telecom" },
  { name: "Sonatrach", logo: "/companies/sonatrach.png", tag: "Energy" },
  { name: "University of Montreal", logo: "/companies/UofMontreal_logo.jpg", tag: "Research · Canada" },
  { name: "BMS", logo: "/companies/bms.png", tag: "Industry" },
  { name: "Ramy", logo: "/companies/ramy.jpg", tag: "Enterprise" },
  { name: "Iconnet", logo: "/companies/iconnet.jpg", tag: "Technology" },
  { name: "Leaf Partner", logo: "/companies/Minimalist Black Leaf Emblem.png", tag: "Partner" },
];
```

Note: the "Leaf Partner" label is provisional — Task 2 implementer inspects `public/companies/Minimalist Black Leaf Emblem.png` and corrects the name to the truthful organization (or keeps it if unidentifiable).

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add data/portfolio.ts
git commit -m "feat: add companies data"
```

---

### Task 2: CompanyRing canvas + leaf label check

**Files:**
- Create: `components/CompanyRing.tsx`
- Modify: `data/portfolio.ts` (leaf label only, if image identifies it)
- Test: typecheck

**Interfaces:**
- Consumes: `useWebGLAllowed` from `./GlobalBackdrop`, drei `useTexture/PresentationControls/ContactShadows/Float`.
- Produces: `export default function CompanyRing({ logos }: { logos: string[] }): JSX.Element | null`.

- [ ] **Step 1: Inspect the leaf emblem image and fix its label if identifiable**

Open `public/companies/Minimalist Black Leaf Emblem.png` in the Read tool. If it clearly belongs to a named organization (e.g., a ministry or brand mark), update that entry's `name` in `data/portfolio.ts`. Otherwise leave "Leaf Partner".

- [ ] **Step 2: Create components/CompanyRing.tsx**

```tsx
"use client";
import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, PresentationControls, useTexture, Edges } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { useWebGLAllowed } from "./GlobalBackdrop";

function Ring({ logos }: { logos: string[] }) {
  const group = useRef<THREE.Group>(null);
  const textures = useTexture(logos);
  const [hovered, setHovered] = useState<number | null>(null);
  const arr = (Array.isArray(textures) ? textures : [textures]) as THREE.Texture[];
  useEffect(() => {
    arr.forEach((t) => { t.colorSpace = THREE.SRGBColorSpace; });
  }, [arr]);
  useFrame((state, dt) => {
    if (!group.current || document.hidden) return;
    if (hovered === null) group.current.rotation.y += dt * 0.15;
    group.current.rotation.y += state.pointer.x * dt * 0.04;
  });
  const n = logos.length;
  return (
    <group ref={group}>
      {logos.map((url, i) => {
        const a = (i / n) * Math.PI * 2;
        return (
          <mesh
            key={url}
            position={[Math.sin(a) * 3.6, 0, Math.cos(a) * 3.6]}
            rotation={[0, a, 0]}
            scale={hovered === i ? 1.18 : 1}
            onPointerOver={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHovered(i); }}
            onPointerOut={() => setHovered(null)}
          >
            <planeGeometry args={[1.7, 1.1]} />
            <meshBasicMaterial map={arr[i]} toneMapped={false} transparent />
            {hovered === i ? <Edges scale={1.02} threshold={15} color="#b45309" /> : null}
          </mesh>
        );
      })}
    </group>
  );
}

export default function CompanyRing({ logos }: { logos: string[] }) {
  const allowed = useWebGLAllowed();
  const reduce = useReducedMotion();
  const [inView, setInView] = useState(true);
  const [glLost, setGlLost] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const show = allowed && !reduce && !glLost && inView;
  return (
    <div ref={wrapRef} className="relative mx-auto h-[380px] w-full overflow-hidden rounded-2xl border border-[#e5ddcc] bg-[#fffdf6] max-sm:h-[320px] md:h-[420px]">
      {show && (
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.4, 8], fov: 48 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => { e.preventDefault(); setGlLost(true); });
        }}>
          <ambientLight intensity={1} />
          <directionalLight position={[4, 5, 6]} intensity={1} />
          <Suspense fallback={null}>
            <PresentationControls enabled global={false} snap cursor speed={1.2} polar={[-0.35, 0.35]} azimuth={[-Math.PI, Math.PI]} config={{ mass: 1, tension: 170, friction: 26 }}>
              <Ring logos={logos} />
            </PresentationControls>
            <ContactShadows position={[0, -1.2, 0]} opacity={0.25} scale={13} blur={2.4} far={5} resolution={256} color="#0f172a" />
          </Suspense>
        </Canvas>
      )}
      <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-xs font-medium text-slate-400">Drag to spin</p>
    </div>
  );
}
```

Note: `useEffect` colorSpace pass runs once per texture array identity — `useTexture` returns stable array for static urls. `transparent` on material lets non-rectangular logos blend. Wrapper always renders (reserved height, no shift) — learned from prior plan.

- [ ] **Step 3: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/CompanyRing.tsx data/portfolio.ts
git commit -m "feat: add company logo ring canvas"
```

---

### Task 3: Companies section + marquee + mount

**Files:**
- Create: `components/Companies.tsx`
- Modify: `app/page.tsx` (mount after Hero), `app/globals.css` (keyframes)
- Test: typecheck + build + manual

**Interfaces:**
- Consumes: `companies` data, `CompanyRing` via dynamic ssr:false.
- Produces: `export default function Companies(): JSX.Element`.

- [ ] **Step 1: Create components/Companies.tsx**

```tsx
"use client";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { companies } from "@/data/portfolio";

const CompanyRing = dynamic(() => import("./CompanyRing"), { ssr: false });

function LogoCard({ name, logo, tag }: { name: string; logo: string; tag: string }) {
  return (
    <div className="flex w-56 shrink-0 items-center gap-3 rounded-2xl border border-[#e5ddcc] bg-white/95 px-4 py-3 shadow-[0_10px_24px_-14px_rgba(15,23,42,0.25)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={encodeURI(logo)}
        alt={name}
        loading="lazy"
        className="h-12 w-12 shrink-0 rounded-lg bg-white object-contain"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold text-slate-900">{name}</span>
        <span className="block text-xs text-slate-500">{tag}</span>
      </span>
    </div>
  );
}

export default function Companies() {
  const reduce = useReducedMotion();
  const rowA = companies.slice(0, 6);
  const rowB = companies.slice(6);
  return (
    <section id="companies" className="paper-bg relative py-20 md:py-24">
      <div className="container-x">
        <SectionHeading
          title={<>Companies & institutes I&apos;ve worked with</>}
          subtitle="Ministries, telecoms, energy, research labs and enterprises across Algeria, France and Canada."
        />
      </div>
      {reduce ? (
        <div className="container-x flex flex-wrap justify-center gap-3">
          {companies.map((c) => (
            <LogoCard key={c.name} {...c} />
          ))}
        </div>
      ) : (
        <div className="[perspective:1200px]">
          <div className="marquee-row animate-[marquee-left_42s_linear_infinite] hover:[animation-play-state:paused]">
            {[...rowA, ...rowA].map((c, i) => (
              <LogoCard key={`${c.name}-${i}`} {...c} />
            ))}
          </div>
          <div className="marquee-row mt-4 animate-[marquee-right_48s_linear_infinite] hover:[animation-play-state:paused]">
            {[...rowB, ...rowB].map((c, i) => (
              <LogoCard key={`${c.name}-${i}`} {...c} />
            ))}
          </div>
        </div>
      )}
      <div className="container-x mt-8">
        <CompanyRing logos={companies.map((c) => encodeURI(c.logo))} />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Append marquee CSS to app/globals.css**

```css
.marquee-row {
  display: flex;
  gap: 12px;
  width: max-content;
  margin-inline: auto;
  transform: rotateX(18deg);
  transform-style: preserve-3d;
}
@keyframes marquee-left {
  from { transform: rotateX(18deg) translateX(0); }
  to { transform: rotateX(18deg) translateX(-50%); }
}
@keyframes marquee-right {
  from { transform: rotateX(18deg) translateX(-50%); }
  to { transform: rotateX(18deg) translateX(0); }
}
@media (prefers-reduced-motion: reduce) {
  .marquee-row { animation: none !important; transform: none; }
}
```

Note: `translateX(-50%)` of doubled list = seamless loop. `motion` import in Companies.tsx is unused — OMIT it (lint fails build on unused imports). The file above has no motion usage: drop `motion` from the import line, keep `useReducedMotion`.

- [ ] **Step 3: Mount in app/page.tsx after Hero**

Add `import Companies from "@/components/Companies";` and `<Companies />` between `<Hero />` and `<Projects />`.

- [ ] **Step 4: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 5: Run build**

Run: `npm run build`
Expected: compiled successfully

- [ ] **Step 6: Manual acceptance**

`npm run dev` → `#companies` shows two counter-scrolling tilted rows (pause on hover), ring drags/spins with 11 logos, all logo URLs load (network tab, `%20` encoded), mobile 390px + reduced-motion static grid, hero chip anchor scrolls to it.

- [ ] **Step 7: Commit**

```bash
git add components/Companies.tsx app/page.tsx app/globals.css
git commit -m "feat: add companies 3D slides section"
```

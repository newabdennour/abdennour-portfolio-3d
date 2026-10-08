# Astonishing 3D Showcase — Design Spec (2026-10-08)

## Context
Next.js 14.2.5 + React 18 + Tailwind + Framer Motion + R3F 8 + drei 9 + three 0.169.
Current: clean white hero (no WebGL behind hero, per user), `GlobalBackdrop` particle field faded in after hero, `Projects` grid with 60fps motion-value tilt + glare, `Navbar` progress bar, `SectionHeading` blur reveal.
User request: "where are the 3d animations where i scroll? i want astonishing things, where you load 3d objects and stuff. ultra creative Featured Projects, not just cards."
Choice: Hybrid grid + 3D (keeps SEO/grid, adds real loaded 3D objects).

## Goal
Real loaded 3D objects, scroll-linked + drag-interactive, white-theme safe, 60fps, with static fallback. Featured Projects becomes a 3D ring showcase synced with the existing grid + dialog.

## Architecture (approved §1)
- No new deps. Reuse `three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`.
- Native page scroll stays (no `ScrollControls` hijack — fights App Router + anchors).
- Two isolated section-local Canvases (not one global rig):
  1. `components/Hero3D.tsx` — small interactive object cluster next to hero stats. `torusKnotGeometry + meshDistortMaterial` + inner `icosahedronGeometry` wireframe + `Float` + `ContactShadows`. `PresentationControls` for drag-spin with spring-back. Scroll progress (from `ScrollRig`) tilts/scales it away as you leave hero.
  2. `components/ProjectShowcase3D.tsx` — astonishing featured-projects ring. 5 featured projects from `data/portfolio.ts` loaded as textures via `useTexture` (`/assets/images/projects/*.png`), each on a rounded plane on a ring radius ~3.2. Group auto-rotates slowly, drag via `PresentationControls`, click plane calls existing `onSelect(project)` to open `ProjectDialog`. Active index synced to DOM pills below.
  3. `components/ScrollRig.tsx` — tiny provider: `useScroll` + `useSpring` exposing heroProgress (0-1) and showcaseProgress. No GSAP.
- Reuse: `data/portfolio.ts` featured filter, `ProjectDialog`, `useWebGLAllowed()` pattern, `webgl-fallback` CSS.
- Mount: `Hero.tsx` embeds `<Hero3D/>` in stats block; `Projects.tsx` renders `<ProjectShowcase3D/>` above the grid (featured only), grid stays for All/categories + SEO.

## Components
1. `ScrollRig.tsx` — props: none (context). Returns `{ heroProgress: MotionValue, showcaseProgress: MotionValue }` via `useScroll` targeted refs. Reduced-motion returns static 0.
2. `Hero3D.tsx` — props: `{ progress: MotionValue<number> }`. Canvas `dpr [1,1.5]`, camera `[0,0,6] fov 50`. `Suspense` fallback null. `useFrame` lerps `group.rotation.y += delta*0.15 + pointer.x*0.002`, `group.position.y` from progress, scale from progress. `Float speed 1.6`. `ContactShadows opacity 0.35 blur 2`. `PresentationControls snap polar [-0.4,0.4]`.
3. `ProjectShowcase3D.tsx` — props: `{ projects: Project[], onSelect: (p: Project) => void }`. Ring: `angle = (i/n)*Math.PI*2`, `position [sin*3.2, 0, cos*3.2]`, `rotation-y` facing center. Plane `args [1.9, 1.2]` with `meshBasicMaterial map` + rounded overlay via DOM? Keep simple plane + `Edges` highlight for active. Auto-rotate `group.rotation.y += delta*0.12` paused on drag/hover. Click sets active + calls `onSelect` on double-click / button. DOM pills mirror active index for a11y.
4. `Projects.tsx` (edit) — insert showcase above category buttons, only when `cat === 'All'` or featured exists; keep grid + dialog unchanged.
5. `Hero.tsx` (edit) — embed Hero3D in a 2-col row on md+ (copy left, 3D right 320px), stacked on mobile with reduced height 240px.

## Data Flow
- Scroll: `window.scrollY` via `useScroll` in `ScrollRig` → springs → `useTransform` in each 3D component → `useFrame` lerp (no direct setState per frame).
- Pointer: R3F `state.pointer` only, no window listeners.
- Select: 3D plane click → `onSelect(project)` → existing `ProjectDialog` state in `Projects.tsx`. No new store.
- Textures: `useTexture(featured.map(p => p.image))` preloaded, `THREE.SRGBColorSpace`, `onError` → color fallback material.

## Error Handling
- SSR: `next/dynamic ssr:false` for both Canvases.
- No WebGL / context-lost / `prefers-reduced-motion` / `saveData` / mobile <640 low-power → render static fallback: Hero3D hides (layout collapses), Showcase renders existing image grid only. No layout shift (fixed min-heights).
- Texture fail: per-plane `ErrorBoundary`-style try → solid `slate-200` material with title sprite? Simplified: slate material, DOM grid still shows image.
- Build: three imports only in client components; `npm run build` must pass.

## Testing / Acceptance
- `npx tsc --noEmit` + `npm run build` pass.
- Desktop: drag spins objects with spring-back, scroll tilts hero object away and rotates showcase ring, click 3D project opens dialog, 60fps (no per-frame setState).
- Mobile 390px + reduced-motion: no Canvas, grid visible, no shift, Lighthouse no major regression (3D chunks lazy, <400kb each).
- Manual: 5 featured textures load, active pill syncs, Esc closes dialog, anchors still work.

## Files Touched
- `components/ScrollRig.tsx` (new)
- `components/Hero3D.tsx` (new)
- `components/ProjectShowcase3D.tsx` (new)
- `components/Hero.tsx` (embed Hero3D)
- `components/Projects.tsx` (embed showcase)
- `app/globals.css` (`.showcase-3d` heights, fallback)
- This spec.

## Out of Scope (YAGNI)
- No `ScrollControls` page hijack, no GSAP pin/scrub, no gltf model downloads, no postprocessing bloom, no dark theme, no route changes, no CMS.

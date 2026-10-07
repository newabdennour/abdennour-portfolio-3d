# Immersive 3D Portfolio — Design Spec (2026-10-07)

## Context
Next.js 14 + React 18 + Tailwind + Framer Motion portfolio, clean white professional theme (Space Grotesk).
Previously had Three.js (`@react-three/fiber@8`, `drei@9`, `three@0.169`, `HeroCanvas.tsx`) removed in uncommitted working tree to go clean/minimal.
User request: "cool 3d animations and stuff, three js or what you think" → wants full immersive Three.js focused on showing work, keeping professional readability.

## Goal
Add real interactive 3D wow without breaking clean white recruiter-friendly look, with graceful fallbacks for mobile / no-WebGL / reduced-motion.

## Approaches Considered
1. **Lightweight no-Three.js (CSS + Framer + 2D canvas)** — 0kb added, safest, but no true 3D. Rejected (user wants real 3D).
2. **Hybrid Three.js (recommended)** — lazy hero 3D + upgraded CSS 3D cards. Balanced. Was recommendation.
3. **Full immersive Three.js (chosen)** — global fixed WebGL canvas + scroll/mouse reactive + immersive Projects showcase. Max wow, heavier (~300-500kb lazy), more risk. User explicitly chose this.

## Architecture
- Re-add deps (pin to last known good from HEAD): `three@^0.169.0`, `@react-three/fiber@^8.17.10`, `@react-three/drei@^9.114.0`, `@types/three@^0.169.0` dev.
- Single global WebGL layer to avoid multiple canvases:
  - `components/GlobalBackdrop.tsx` (new, `next/dynamic` ssr:false, lazy): fixed `inset-0 -z-10`, `dpr=[1,1.75]`, `antialias`, `alpha`, `frameloop=always` but pauses when tab hidden.
  - Scene: soft particle field (~1200 points, blue `#2563eb` / violet `#8b5cf6` at 0.15-0.25 opacity) + 2 wireframe icosahedrons floating, slow rotation + mouse parallax (lerped) + scroll fade (opacity → 0.25 past hero).
- Keep white theme: canvas `opacity` low, blends with existing `radial-gradient` + blur blobs in Hero. No dark mode change.
- Performance: `Suspense` fallback = current CSS gradient; `frameloop` demand when offscreen via IntersectionObserver; passive scroll + rAF throttle.

## Components
1. `GlobalBackdrop.tsx` — Canvas + Points + Float shapes + Rig (mouse + scroll). Props: none. Internal `useWebGLAllowed()` check.
2. `Hero.tsx` (edit) — keep text/buttons/stats, wrap copy in parallax `motion.div` (`useScroll` → y 0-80px fade), canvas sits behind, remove heavy blur if WebGL active (keep as fallback layer).
3. `Projects.tsx` (edit) — upgrade `TiltCard`: stronger perspective (1100px), rotate ±10deg, glare radial at `--mx/--my`, scale 1.02 on hover, scroll stagger via `whileInView`, dialog entrance `scale 0.92→1 + rotateX 8→0`. No content/API change, reuses `data/portfolio.ts`.
4. `useWebGLAllowed.ts` (new hook, inside GlobalBackdrop or `hooks/`) — returns false if: `prefers-reduced-motion`, `navigator.saveData`, mobile width <640 with low DPR, WebGL context creation fails, context-lost event.

## Data Flow
- No new data. Reads `projects`, `profile` from `data/portfolio.ts`. No store, no API.
- Scroll: `window.scrollY` → normalized 0-1 → rig lerps camera z/y.
- Mouse: normalized -1..1 → group rotation lerp 0.05/frame.

## Error Handling
- SSR: `dynamic(..., {ssr:false})` everywhere for 3D.
- No WebGL / context lost → `setAllowed(false)` → render only CSS fallback div (current Hero gradient).
- Image `onError` hide already exists in Projects — keep.
- Reduced-motion: render static, disable `frameloop`, disable tilt/magnetic.
- Build: `npm run build` must pass with `three` types; isolate `three` imports to client components.

## Testing / Acceptance
- `npm run build` + `npm run lint` pass.
- Desktop Chrome: 60fps, mouse moves shapes smoothly, scroll fades canvas, no text readability loss (contrast check).
- Mobile emulation (Moto G) + `prefers-reduced-motion`: canvas hidden, fallback gradient visible, no layout shift.
- Lighthouse: no major perf regression vs baseline (lazy 3D chunk <500kb, initial bundle unchanged).
- Manual: hover project cards tilt+glare, click opens dialog with 3D entrance, cursor glow still works.

## Files Touched
- `package.json` (+3 deps, +1 dev type)
- `app/page.tsx` (mount `<GlobalBackdrop/>`)
- `components/GlobalBackdrop.tsx` (new)
- `components/Hero.tsx` (parallax wrapper)
- `components/Projects.tsx` (immersive tilt/glare)
- `app/globals.css` (`.webgl-fallback`, canvas container, `will-change` hints)
- This spec: `docs/superpowers/specs/2026-10-07-3d-immersive-design.md`

## Out of Scope (YAGNI)
- No dark theme, no 3D model loading (gltf), no postprocessing bloom, no sound, no custom shaders beyond points, no CMS, no route changes.

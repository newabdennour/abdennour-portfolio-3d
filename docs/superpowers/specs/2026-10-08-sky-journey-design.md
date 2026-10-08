# Sky Journey Projects — Design Spec (2026-10-08)

## Context
Next.js 14.2.5 + React 18 + Tailwind + Framer Motion + R3F 8 + drei 9 + three 0.169.
Current: clean white hero with Hero3D cluster, featured-projects 3D ring (`ProjectShowcase3D`) + tilt-card grid in `Projects.tsx`, global particle backdrop.
User request: replace plain cards with an ultra-cool 3D scroll journey — bright sky with clouds (NOT dark space), flying objects, a colored line that draws as you scroll with projects appearing one-by-one; split into Projects Developed + Research Papers (academic-styled twin); add web-sourced 3D models/objects.
Choices: sticky sky-journey (A), flip-cascade panels, papers derived from existing projects as editable examples.

## Goal
A bright "in the air, on the clouds" scroll journey for `#work`, plus an academic-styled twin for `#research`, with real loaded 3D models, one-by-one panel reveals synced to a drawing colored line, and full static fallbacks.

## Approaches Considered
1. **Sticky sky-journey (chosen)** — tall track + sticky canvas, native scroll preserved, camera glides a curve, line draws via drawRange, panels activate per stop. Max wow within safe architecture.
2. **Per-card sky islands** — rejected: no journey/line, many canvases, less astonishing.
3. **Full-page ScrollControls** — rejected: hijacks scroll, fights anchors/navbar, worst mobile story.

## Architecture
- `components/SkyJourney.tsx` (new, engine): tall track (`h-[420vh]` desktop, `auto` stacked on mobile) with sticky R3F canvas (`top-[10vh] h-[80vh]`). Owns `useScroll({ target: trackRef, offset: ["start start", "end end"] })` + springs, exposes progress + activeStop via render-prop/children props. Drei `Sky` (bright, low sun) + procedural billboard clouds + `Sparkles` + fog. Camera rig lerps along CatmullRomCurve3 by progress; tube-line `drawRange` = progress; head marker sphere + active-stop pulse ring.
- `components/JourneyPanels.tsx` (new): HTML panels per stop, absolutely positioned beside sticky canvas on md+ (alternating sides), stacked statically on mobile. Entrance: `rotateX` flip + alternating `rotateY` + blur-to-sharp + spring overshoot, triggered when line progress passes the stop threshold. Content reuses card data (image, title, desc, tech, year) + opens existing `ProjectDialog` via `onSelect`.
- `components/FlyingObjects.tsx` (new): vendored CC0 GLBs (`/public/models/paper-plane.glb`, `/public/models/hot-air-balloon.glb`, Quaternius via Poly Pizza, CC0 attribution comment) via `useGLTF` + `useGLTF.preload`, `Suspense` + inline `useProgress` loader. Procedural fallbacks (prism plane, sphere+basket balloon) on load error. Bobbing/drift in `useFrame`, pointer-reactive bank.
- `components/Projects.tsx` (edit → split): renders `#work` ("Projects Developed", blue→violet line, playful flight) then `#research` ("Research & Papers", amber→teal line, calmer springs, parchment panels, venue/year header). Both use `SkyJourney` + `JourneyPanels` + `FlyingObjects` with a `theme` prop (`"playful" | "academic"`). Featured ring (`ProjectShowcase3D`) stays above `#work` as the teaser; category pills filter only the developed-projects journey stops (research has no filter).
- `data/portfolio.ts` (edit): add `papers` array (5 examples derived from Data/AI projects: Oil & Gas Forecasting, Sleep Stages, News Popularity, SMS Classifier, MGRPO) with `{ id, title, venue, year, abstract, tags, link }`. User rewrites with real papers later; shape is final.

## Data Flow
- Scroll: track `useScroll` → `useSpring` progress 0..1 → camera `t`, line `drawRange`, `activeStop = floor(progress * n)`, panel thresholds, marker scale pulse. No store, no GSAP.
- Pointer: R3F `state.pointer` only (cloud drift bias, flyer banking).
- Select: panel button / 3D stop marker click → existing `onSelect(project|paper)` → `ProjectDialog` (papers pass through a mapped adapter with venue shown).
- Models: `useGLTF(url)` + `preload`; `onError` → procedural fallback component; never throws to root.

## Motion Details
- Panels: initial `{ opacity 0, rotateX 55, rotateY ±18 (alternating), y 60, filter blur(8px) }` → animate on activation `{ opacity 1, rotateX 0, rotateY 0, y 0, blur 0 }`, spring `{ stiffness 120, damping 16 }` overshoot. Deactivate never (once:true per stop).
- Line: `TubeGeometry(curve, 200, 0.035)` vertex colors gradient; `geometry.setDrawRange(0, floor(progress * indexCount))` per frame (no setState).
- Camera: `pos = curve.getPoint(t)`, `lookAt = curve.getPoint(min(t + 0.06, 1))`, damped lerp 0.06; FOV 50.
- Flyers: `y = base + sin(time*speed+phase)*amp`, bank `rotation.z = pointer.x * 0.3`, forward loop along offset curve.

## Error Handling
- SSR: `dynamic ssr:false` for `SkyJourney` (+ islands). Track/panels SSR-safe (static stacked).
- No WebGL / context-lost / reduced-motion / saveData / mobile <640px: canvases off, track collapses to stacked panels (reserved min-heights, no shift). Reduced-motion: panels appear without flip (opacity/y only).
- GLB 404/corrupt: per-model error boundary → procedural fallback; scene never suspends forever (`Suspense` fallback null + loader with timeout note).
- Textures: existing project images reused; `onError` hide kept.

## Testing / Acceptance
- `npx tsc --noEmit` + `npm run build` pass; new GLB files <600KB total (quaternius low-poly).
- Desktop: scroll draws line 0→100%, camera glides, every developed stop and each of the 5 research panels activates one-by-one with flip, flyers bank on mouse, click opens dialog.
- Mobile 390px + reduced-motion + `--disable-gpu`: static stacked panels, no canvas, no shift.
- Manual: anchors `#work`/`#research` work; pills filter developed stops; papers editable in one array.

## Files Touched
- `components/SkyJourney.tsx` (new), `components/JourneyPanels.tsx` (new), `components/FlyingObjects.tsx` (new)
- `components/Projects.tsx` (split into two themed journeys, keep ring + dialog)
- `data/portfolio.ts` (`papers` array)
- `public/models/paper-plane.glb`, `public/models/hot-air-balloon.glb` (new, CC0)
- `app/globals.css` (track/sticky heights, parchment panel class)
- This spec.

## Out of Scope (YAGNI)
- No ScrollControls hijack, no GSAP, no postprocessing bloom, no dark theme, no model animations/skinning, no CMS, no new routes, no changes to Hero/About/Timeline/Contact.

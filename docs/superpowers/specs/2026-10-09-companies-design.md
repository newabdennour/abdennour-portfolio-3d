# Companies 3D Slides — Design Spec (Phase B)

## Context
Next.js 14 + React 18 + Tailwind + Framer Motion + R3F 8 + drei 9. Lab-notes hero shipped (Phase A). Vendor asset folders moved to `public/companies/` (11 logos) and `public/top-projects/tp1-tp4/` (Phase C/D).
User request: ultra-cool 3D slides showing companies & institutes worked with, using the provided logos.

## Goal
A `#companies` section directly after the hero: dual counter-scrolling 3D logo marquee + interactive rotating 3D logo ring, static grid fallback.

## Data
Append to `data/portfolio.ts` (no other edits there):
`export type Company = { name: string; logo: string; tag: string }`, `export const companies: Company[]` — 11 entries, logo paths under `/companies/`, filenames URL-encoded at render via `encodeURI`:
APN Assembly ("Algerian People's National Assembly", tag "Institution"), Algérie Poste ("Telecom & Post"), Algérie Télécom ("Telecom"), BMS ("Industry"), FEMTO-ST ("FEMTO-ST Institute", "Research · France"), Iconnet ("Technology"), MESRS ("Ministry of Higher Education", "Institution"), Ramy ("Enterprise"), Sonatrach ("Energy"), University of Montreal ("Research · Canada"), plus "Minimalist Black Leaf Emblem.png" — implementer inspects the image and picks the truthful label (partner org), tag "Partner".

## Components
1. `components/Companies.tsx` (new, `"use client"`): section `id="companies"`, paper-tinted bg to follow hero. `SectionHeading` title "Companies & institutes I've worked with".
   - Marquee: two rows, opposite directions, CSS keyframes translateX loop (duplicate list ×2 for seamlessness), cards with `[transform:rotateX(18deg)]` perspective tilt, logo (h-12 object-contain) + name. Pause on hover. `prefers-reduced-motion`: static wrap grid.
   - Ring: `CompanyRing` inline in same file, `next/dynamic ssr:false` from page (export both; page imports `{ Companies }` static and ring dynamic? Simplest: `Companies` static section with marquee + fallback grid; `CompanyRing` separate dynamic import mounted inside Companies? Dynamic must be at module level of a client component — allowed: `const CompanyRingCanvas = dynamic(() => import("./CompanyRing"), {ssr:false})` inside Companies.tsx). Ring: 11 textured planes on radius 3.6 circle, auto-rotate + drag via PresentationControls, `useTexture` logos, ContactShadows, height 380px (320 mobile), `useWebGLAllowed` + reduced-motion + IO gating → null (marquee remains).
2. `components/CompanyRing.tsx` (new): the R3F canvas only, props `{ logos: string[] }`.
3. `app/page.tsx` (edit): mount `<Companies />` between Hero and Projects.
4. `app/globals.css`: marquee keyframes (`marquee-left`, `marquee-right` 40s linear infinite), `.perspective-1200`, reduced-motion override to static.

## Motion Details
- Rows: `animate-[marquee-left_40s_linear_infinite]`, second row reverse + `animation-delay:-20s` offset for variety. Cards `whileHover` lift via framer (or CSS) — CSS only to keep it cheap.
- Ring: `rotation.y += dt*0.15`, pointer nudge, click logo → no-op (decorative) with hover scale 1.15 + cursor pointer? Decorative: hover glow only, no click action.

## Error Handling
- Logo `onError` → hide img, show name text (never broken-image icon).
- No WebGL/reduced-motion/mobile<640: ring null, marquee → static flex-wrap grid (same cards, no animation).
- Filenames with spaces/`&`/`'` encoded via `encodeURI` at render.

## Testing
- `tsc` + `build` pass; dev: marquee loops seamlessly, ring drags/spins, 11 logos all load (network tab, incl. `%20`/`&` URLs); mobile + reduced-motion static; anchors `#companies` works from hero chips.

## Files
- `data/portfolio.ts` (append), `components/Companies.tsx` + `components/CompanyRing.tsx` (new), `app/page.tsx`, `app/globals.css`, this spec.

## Out of Scope
- No filtering, no dialogs on logos, no changes to hero/projects/research.

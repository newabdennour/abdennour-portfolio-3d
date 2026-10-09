# Research Journal Section — Design Spec (Phase D)

## Context
Phases A–C shipped: lab-notes hero, companies slides, top-project 3D showcases with live NVIDIA chats. `papers[5]` examples exist in data. The `#research` academic sky-journey (SkyJourney/JourneyPanels/FlyingObjects) is disliked and gets replaced by a journal-styled pinned-papers section.
User request: journal-ish background, 3 example papers as first-pages with abstracts, pinned, expandable with more info; user edits later.

## Goal
`#research` becomes "Research & Journals": deep-paper backdrop with watermark, 3 pinned first-page cards (abstract visible, expand for details), static-first with subtle scroll rise. Sky-journey files deleted.

## Components
1. `data/portfolio.ts` (edit): add `highlights: string[]` (3 bullets each) to papers 101, 102, 105; export `export const featuredPapers = [105, 102, 101]` (ids in display order: MGRPO, sleep, oil&gas).
2. `components/Research.tsx` (new, `"use client"`, NO three.js): section `id="research"`, journal backdrop (deep espresso-to-amber gradient + giant outlined "RESEARCH" watermark + faint ruled texture via CSS). Heading "Research & papers" + subtitle "Selected studies — examples, being replaced with publications."
   - Grid of 3 `PaperCard`s, slight alternating rotation (-1.2deg/+1deg/0.6deg), tape strip on top + pin dot. Card = first page: journal kicker (venue), title (serif via font-display), authors line "Guerroudj Abdennour et al." (honest: et al. since co-authors vary — user edits), year, Abstract block (line-clamped, full on expand), Keywords chips, footer: Read link + "More info" toggle expanding highlights + venue + citation line (`{title} ({year}). {venue}.`).
   - Entrance: `whileInView` rise while retaining tilt, stagger; reduced-motion: opacity only.
3. `app/page.tsx` (edit): mount `<Research />` after `<Projects />` (Projects keeps `#work` only).
4. `components/Projects.tsx` (edit): remove `#research` section + `PaperPanel`/`papers` usage (keep `papers` import? remove if unused — lint). Keep everything else byte-identical.
5. Delete `components/SkyJourney.tsx`, `components/JourneyPanels.tsx`, `components/FlyingObjects.tsx` (verify no other importers first via grep; CompanyRing/GlobalBackdrop untouched).
6. `app/globals.css`: `.journal-bg` (gradient + ruled texture), `.tape-top` reuse existing, `.watermark` outlined text.

## Data Flow
- Static only. No scroll progress, no canvas, no API. Expand state per card (useState).

## Error Handling
- Link "#" (MGRPO): same "Soon" span pattern as JourneyPanels. Images: none (typographic cards). Mobile: single column, rotation removed.

## Testing
- `tsc` + `build` pass; no `SkyJourney|JourneyPanels|FlyingObjects` strings remain outside docs/history (grep); `#research` anchor works from hero chips; expand/collapse all 3; mobile single column; reduced-motion static.

## Files
- `data/portfolio.ts`, `components/Research.tsx` (new), `app/page.tsx`, `components/Projects.tsx`, `app/globals.css`, deletions ×3, this spec.

## Out of Scope
- No 3D in research, no new papers data beyond highlights, no PDF rendering, no changes to hero/companies/work.

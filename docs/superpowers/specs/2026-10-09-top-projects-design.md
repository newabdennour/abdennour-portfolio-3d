# Top Projects 3D Showcases — Design Spec (Phase C)

## Context
Lab-notes hero (A) + companies slides (B) shipped. Assets vendored: `public/top-projects/tp1/` (tourism ministry logo, texa.png), `tp2/` (FEMTO-ST, logo.png), `tp3/` (algérie poste), `tp4/` (ramy). NVIDIA API verified: `https://integrate.api.nvidia.com/v1/chat/completions`, OpenAI-compatible SSE, Bearer key, reasoning models emit `reasoning_content` deltas.
User request: 4 top-project showcases in 3D devices with LIVE working UIs inside (2 NVIDIA chats with thinking + markdown, 0 storage), texaAI UI recreated from screenshot, e-store app UI in iPhone, Ramy chat + predictions in mobile frame; keep orbiting ring below for more projects; then research section (Phase D).

## Goal
`#work` becomes: ring teaser (kept) → 4 full-width 3D device showcases (Femto browser chat, texaAI monitor map-UI, E-Poste iPhone app, Ramy mobile chat + predictions) → compact "more projects" static grid. Live chats stream from Nemotron via a server route; no message persists anywhere.

## Rulings (binding)
1. **No Sketchfab downloads** — logins, per-model licenses, dead-link risk. Devices are procedural (browser window / monitor / iPhone from three primitives) with live UIs embedded via drei `Html transform`. The UIs really work inside the 3D scene.
2. **Key never touches repo** — `.env.local` (`NVIDIA_API_KEY`, gitignored) + server route; `.env.local.example` documents vars with placeholder. User rotates the pasted key.
3. **New dep `react-markdown`** allowed for chat rendering.
4. SkyJourney playful journey is removed from `#work`; SkyJourney/JourneyPanels/FlyingObjects files stay until Phase D retires the research journey.

## Architecture
- `app/api/chat/route.ts` (new, server-only): POST `{ system?: string, messages: {role,content}[] }` → forwards to NVIDIA with `stream:true`, reads SSE, re-emits own SSE lines `data: {"type":"thinking"|"text","delta":"..."}` + `{"type":"done"}` / `{"type":"error","message"}`. Caps: max 20 messages, 4000 chars each, `max_tokens` 1024, 60s timeout. Key missing → 500 "server misconfigured" (never leaks key). No logging of content, no storage.
- `components/ChatPanel.tsx` (new, client): props `{ system: string, title: string, accent: "blue"|"amber", placeholder?: string, samples?: string[] }`. In-memory messages only (useState, never localStorage). Streams via fetch reader, splits thinking vs text, renders thinking in collapsed `<details>`, markdown via react-markdown, auto-scroll, Enter-to-send, stop button, error bubble with retry. Prediction variant prop `mode?: "chat" | "sentiment"` — sentiment mode adds "Analyze" that sends with a verdict-forcing system suffix and renders a meter from parsed `Verdict: <label> (<score>%)` line (regex, fallback: show raw).
- `components/DeviceFrame.tsx` (new, client, dynamic ssr:false consumers): procedural frames — `BrowserFrame` (rounded box + top bar with traffic dots + url pill, screen = drei `Html transform` 1024×640), `MonitorFrame` (wide 16:10 + stand + base), `PhoneFrame` (rounded slab + notch + side buttons, screen 390×700). Props `{ children (the live UI), title }`. Slow turntable `Float` + `PresentationControls` drag. Fallback: children render statically without canvas (reduced-motion/mobile/no-WebGL).
- Showcases in `components/Projects.tsx` rewrite of `#work` body (keep ring + pills? pills filter the MORE grid, not showcases):
  1. Femto (`tp2` logo + FEMTO-ST img): MonitorFrame + ChatPanel (medical multi-agent demo system prompt, blue).
  2. texaAI (`tp1` logos): BrowserFrame/MonitorFrame + `TexaUI` static recreation (search bar, Itinéraire/Carte tabs, MAP LAYERS chips, SUGGESTED CIRCUITS list, My Plan list, SVG dashed route + pins over stylized Algeria outline, right "Your 3-Day Journey" panel) from screenshot; logos in header.
  3. E-Poste (`tp3` logo): PhoneFrame + `EPosteUI` (greeting header w/ logo, stat cards, orders list, bottom nav) static demo data.
  4. Ramy (`tp4` logo): PhoneFrame + ChatPanel sentiment mode (amber).
- "More projects": compact static grid (image, title, category, year, open-dialog) reusing `ProjectDialog`; ring stays above showcases as teaser.

## Data Flow
- Chat: input → POST /api/chat → NVIDIA SSE → route reframes → client accumulates `{thinking, text}` → renders. AbortController stop. History sent each turn (stateless server).
- No DB, no localStorage, no cookies for chat. Server logs only errors without content.

## Motion Details
- Devices: `Float` idle + scroll `whileInView` rise-in for section wrappers (DOM), `PresentationControls` drag-spin with snap-back. Html screens `transform` + `distanceFactor` tuned so text readable at default camera.
- TexaUI pins pulse (CSS), dashed route draw-on-view (SVG stroke-dashoffset animation, reduced-motion off).

## Error Handling
- Key missing/invalid, model 4xx/5xx, timeout, network fail → error bubble + retry, dialog never crashes; empty input blocked; over-long input truncated client-side with notice.
- Html screens: if WebGL off, DeviceFrame renders children in a static browser/phone chrome (CSS) — same UI, no 3D.
- Images `onError` hide; encodeURI all `public/` paths with spaces.

## Testing
- `tsc` + `build` pass; `.env.local` absent → route 500 handled in UI; with key: stream shows thinking-then-answer, markdown renders, stop works, reload clears history (proves no storage); devices drag on desktop, static chrome on mobile/reduced-motion; ring + grid intact; anchors work.

## Files
- `app/api/chat/route.ts`, `components/ChatPanel.tsx`, `components/DeviceFrame.tsx`, `components/TexaUI.tsx`, `components/EPosteUI.tsx` (new)
- `components/Projects.tsx` (rewrite `#work`; research journey untouched for Phase D)
- `.env.local.example` (new, placeholders only), `package.json` (react-markdown), this spec.

## Out of Scope
- No auth/accounts, no chat history persistence, no map tiles/geodata, no Sketchfab, no changes to hero/companies/research-this-phase.

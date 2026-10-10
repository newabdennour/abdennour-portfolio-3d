# Top Projects 3D Showcases Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Four 3D-device showcases with live working UIs (two streaming NVIDIA chats, tourism map UI, e-store app UI) plus ring teaser and static more-projects grid.

**Architecture:** Server-only `/api/chat` route proxies NVIDIA SSE and reframes thinking/text events; `ChatPanel` streams them with zero persistence; procedural device frames embed live UIs via drei `Html transform`; Projects `#work` rewritten around showcases, research journey untouched.

**Tech Stack:** Next.js 14.2.5, React 18, TypeScript 5, Tailwind 3, framer-motion 11, three 0.169, @react-three/fiber 8, @react-three/drei 9, react-markdown (new).

**Spec:** `docs/superpowers/specs/2026-10-09-top-projects-design.md`

## Global Constraints

- NVIDIA key only via `NVIDIA_API_KEY` env in server route; never in client code, logs, or repo (`.env.local` gitignored; only `.env.local.example` with placeholders is committed).
- No chat persistence: in-memory state only, no localStorage/DB/cookies; reload clears history.
- three.js only in `"use client"` components via `next/dynamic ssr:false`; DeviceFrame renders static CSS chrome fallback when WebGL off/reduced-motion/mobile.
- `npx tsc --noEmit` after every task; `npm run build` at end.
- encodeURI all `public/` paths with spaces.

---

### Task 1: Deps, env example, /api/chat route

**Files:**
- Modify: `package.json` (add react-markdown)
- Create: `.env.local.example`, `app/api/chat/route.ts`
- Test: typecheck + build + route behavior with/without key

**Interfaces:**
- Consumes: `NVIDIA_API_KEY`, `NVIDIA_MODEL` env (server only).
- Produces: `POST /api/chat` accepting `{ system?: string, messages: {role,content}[] }`, returning SSE lines `data: {"type":"thinking"|"text","delta":string}`, `{"type":"done"}`, `{"type":"error","message":string}`.

- [ ] **Step 1: Install react-markdown and create .env.local.example**

Run: `npm install react-markdown`
Create `.env.local.example`:
```
# Copy to .env.local and fill in. NEVER commit .env.local.
NVIDIA_API_KEY=your-nvidia-api-key-here
# Override only if the model id differs:
# NVIDIA_MODEL=nvidia/nemotron-3-ultra-550b-a55b
```

- [ ] **Step 2: Create app/api/chat/route.ts with this exact content**

```ts
import { NextRequest } from "next/server";

const NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = process.env.NVIDIA_MODEL ?? "nvidia/nemotron-3-ultra-550b-a55b";

export async function POST(req: NextRequest) {
  const key = process.env.NVIDIA_API_KEY;
  if (!key) {
    return Response.json({ error: "Chat is not configured on this deployment." }, { status: 500 });
  }
  let body: { system?: string; messages?: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const messages = (body.messages ?? [])
    .slice(-20)
    .map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content).slice(0, 4000),
    }));
  if (messages.length === 0 || messages.every((m) => !m.content.trim())) {
    return Response.json({ error: "Empty conversation." }, { status: 400 });
  }
  const upstream = await fetch(NVIDIA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: MODEL,
      messages: body.system && String(body.system).trim()
        ? [{ role: "system", content: String(body.system).slice(0, 2000) }, ...messages]
        : messages,
      max_tokens: 1024,
      stream: true,
    }),
    signal: AbortSignal.timeout(60000),
  }).catch(() => null);
  if (!upstream || !upstream.ok || !upstream.body) {
    return Response.json({ error: "Model service unavailable. Try again." }, { status: 502 });
  }
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buf = "";
  const out = new ReadableStream({
    async start(ctrl) {
      const send = (obj: unknown) => ctrl.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const parts = buf.split("\n\n");
          buf = parts.pop() ?? "";
          for (const part of parts) {
            for (const line of part.split("\n")) {
              const t = line.trim();
              if (!t.startsWith("data:")) continue;
              const payload = t.slice(5).trim();
              if (payload === "[DONE]") continue;
              try {
                const j = JSON.parse(payload);
                const d = j.choices?.[0]?.delta ?? {};
                if (typeof d.reasoning_content === "string" && d.reasoning_content) {
                  send({ type: "thinking", delta: d.reasoning_content });
                }
                if (typeof d.content === "string" && d.content) {
                  send({ type: "text", delta: d.content });
                }
              } catch {
                /* skip partial chunk */
              }
            }
          }
        }
        send({ type: "done" });
      } catch {
        send({ type: "error", message: "Stream interrupted. Try again." });
      } finally {
        ctrl.close();
      }
    },
  });
  return new Response(out, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}
```

Security notes (must hold): key read only here, never logged, never sent to client; error paths return generic messages; no content logged anywhere.

- [ ] **Step 3: Typecheck + install check**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: Verify route without key + build**

Run: `npm run build`
Expected: compiled successfully (route builds; without `.env.local`, POST returns 500 JSON — verify manually with dev server: `Invoke-WebRequest -Method POST -Uri http://localhost:3000/api/chat -ContentType "application/json" -Body '{"messages":[]}'` returns 400/500 JSON, never a key).

- [ ] **Step 5: Commit (NEVER commit .env.local)**

```bash
git add package.json package-lock.json .env.local.example app/api/chat/route.ts
git commit -m "feat: NVIDIA chat proxy route with thinking stream"
```

Verify `git status --short` shows no `.env.local` before committing.

---

### Task 2: ChatPanel (streaming chat + sentiment mode)

**Files:**
- Create: `components/ChatPanel.tsx`
- Test: typecheck + dev chat (needs NVIDIA_API_KEY in local .env.local — create it locally from example + real key for testing ONLY, never commit)

**Interfaces:**
- Consumes: `POST /api/chat` SSE protocol from Task 1.
- Produces: `export default function ChatPanel({ system, title, subtitle, accent, placeholder, samples, mode }: { system: string; title: string; subtitle?: string; accent?: "blue" | "amber"; placeholder?: string; samples?: string[]; mode?: "chat" | "sentiment" }): JSX.Element`.

- [ ] **Step 1: Create components/ChatPanel.tsx with this exact content**

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Bot, Loader2, Send, Square, Sparkles, User } from "lucide-react";

type Msg = { role: "user" | "assistant"; thinking: string; text: string };

function parseVerdict(text: string): { label: string; score: number } | null {
  const m = text.match(/verdict\s*:\s*(positive|negative|neutral|mixed)[^\d]*(\d{1,3})\s*%/i);
  if (!m) return null;
  return { label: m[1].toLowerCase(), score: Math.min(100, parseInt(m[2], 10)) };
}

export default function ChatPanel({ system, title, subtitle, accent = "blue", placeholder = "Ask something to try it live…", samples = [], mode = "chat" }: {
  system: string; title: string; subtitle?: string; accent?: "blue" | "amber"; placeholder?: string; samples?: string[]; mode?: "chat" | "sentiment";
}) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const abort = useRef<AbortController | null>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const isAmber = accent === "amber";

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [msgs]);

  useEffect(() => () => abort.current?.abort(), []);

  async function send(raw: string, sysOverride?: string) {
    const content = raw.trim().slice(0, 4000);
    if (!content || busy) return;
    setError("");
    const next = [...msgs, { role: "user" as const, thinking: "", text: content }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    abort.current = new AbortController();
    const ai: Msg = { role: "assistant", thinking: "", text: "" };
    setMsgs([...next, ai]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: sysOverride ?? system,
          messages: next.map((m) => ({ role: m.role, content: m.role === "user" ? m.text : m.text })),
        }),
        signal: abort.current.signal,
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error ?? "Service unavailable.");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop() ?? "";
        let changed = false;
        for (const part of parts) {
          for (const line of part.split("\n")) {
            const t = line.trim();
            if (!t.startsWith("data:")) continue;
            try {
              const ev = JSON.parse(t.slice(5).trim());
              if (ev.type === "thinking" && ev.delta) { ai.thinking += ev.delta; changed = true; }
              else if (ev.type === "text" && ev.delta) { ai.text += ev.delta; changed = true; }
              else if (ev.type === "error") { throw new Error(ev.message ?? "Stream error."); }
            } catch (e) {
              if (e instanceof Error && (e.message.endsWith(".") || e.message.includes("Stream"))) throw e;
            }
          }
        }
        if (changed) setMsgs([...next, { ...ai }]);
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") {
        ai.text += ai.text ? "\n\n*— stopped —*" : "Stopped before answering.";
        setMsgs([...next, { ...ai }]);
      } else {
        setError((e as Error).message || "Something went wrong.");
        setMsgs(next);
      }
    } finally {
      setBusy(false);
    }
  }

  function analyze() {
    const lastUser = [...msgs].reverse().find((m) => m.role === "user");
    const target = input.trim() || lastUser?.text || "";
    if (!target) return;
    const suffix = "\n\nEnd your reply with exactly one line in this format: Verdict: <positive|negative|neutral|mixed> (<0-100>%)";
    send(target + (target.endsWith("%") || target.includes("Verdict:") ? "" : suffix), system);
  }

  const lastVerdict = mode === "sentiment"
    ? parseVerdict([...msgs].reverse().find((m) => m.role === "assistant" && m.text)?.text ?? "")
    : null;

  return (
    <div className={`flex h-full flex-col overflow-hidden rounded-xl text-left ${isAmber ? "bg-amber-50/60" : "bg-slate-50"}`}>
      <div className={`flex items-center gap-2 border-b px-4 py-2.5 ${isAmber ? "border-amber-200 bg-amber-100/60" : "border-slate-200 bg-white"}`}>
        <span className={`grid h-7 w-7 place-items-center rounded-lg text-white ${isAmber ? "bg-amber-600" : "bg-blue-600"}`}>
          <Bot size={15} />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[13px] font-bold text-slate-900">{title}</span>
          {subtitle && <span className="block truncate text-[11px] text-slate-500">{subtitle} · live demo, nothing is stored</span>}
        </span>
        <span className="ml-auto flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> LIVE
        </span>
      </div>

      {mode === "sentiment" && (
        <div className="border-b border-amber-200 bg-white px-4 py-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
            <span className="inline-flex items-center gap-1"><Sparkles size={12} /> SENTIMENT PREDICTION</span>
            <button onClick={analyze} disabled={busy} className="rounded-lg bg-amber-600 px-3 py-1 text-[11px] font-bold text-white disabled:opacity-50">
              Analyze
            </button>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full transition-all ${!lastVerdict ? "" : lastVerdict.label === "positive" ? "bg-emerald-500" : lastVerdict.label === "negative" ? "bg-red-500" : lastVerdict.label === "mixed" ? "bg-violet-500" : "bg-slate-400"}`}
              style={{ width: `${lastVerdict ? lastVerdict.score : 0}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] font-semibold text-slate-600">
            {lastVerdict ? `${lastVerdict.label} · ${lastVerdict.score}%` : "Send a text, then press Analyze"}
          </p>
        </div>
      )}

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {msgs.length === 0 && (
          <div className="mt-6 text-center">
            <p className="text-[13px] text-slate-500">Try it — messages stay in this session only.</p>
            {samples.length > 0 && (
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {samples.map((s) => (
                  <button key={s} onClick={() => send(s)} disabled={busy} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-600 hover:border-blue-300 hover:text-blue-700 disabled:opacity-50">
                    {s.length > 42 ? s.slice(0, 42) + "…" : s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md text-white ${isAmber ? "bg-amber-600" : "bg-blue-600"}`}>
                <Bot size={13} />
              </span>
            )}
            <div className={`max-w-[85%] rounded-xl px-3 py-2 text-[13px] leading-relaxed ${m.role === "user" ? (isAmber ? "bg-amber-600 text-white" : "bg-slate-900 text-white") : "border border-slate-200 bg-white text-slate-800"}`}>
              {m.role === "assistant" && m.thinking && (
                <details className="mb-1.5 rounded-lg bg-slate-50 px-2 py-1 text-[11px] text-slate-500">
                  <summary className="cursor-pointer font-semibold">Thinking</summary>
                  <p className="mt-1 whitespace-pre-wrap">{m.thinking}</p>
                </details>
              )}
              {m.role === "assistant" && !m.text && !m.thinking && busy && i === msgs.length - 1 ? (
                <Loader2 size={14} className="animate-spin" />
              ) : m.role === "assistant" ? (
                <div className="markdown"><ReactMarkdown>{m.text || "…"}</ReactMarkdown></div>
              ) : (
                <p className="whitespace-pre-wrap">{m.text}</p>
              )}
            </div>
            {m.role === "user" && (
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-slate-200 text-slate-600">
                <User size={13} />
              </span>
            )}
          </div>
        ))}
        <div ref={bottom} />
      </div>

      {error && (
        <p className="border-t border-red-200 bg-red-50 px-4 py-2 text-[12px] font-medium text-red-700">
          {error} <button onClick={() => { const l = [...msgs].reverse().find((m) => m.role === "user"); if (l) send(l.text); }} className="underline">Retry</button>
        </p>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="flex items-center gap-2 border-t border-slate-200 bg-white px-3 py-2.5"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          maxLength={4000}
          className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-blue-400"
          aria-label="Chat message"
        />
        {busy ? (
          <button type="button" onClick={() => abort.current?.abort()} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-900 text-white" aria-label="Stop">
            <Square size={14} />
          </button>
        ) : (
          <button type="submit" disabled={!input.trim()} className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white disabled:opacity-40 ${isAmber ? "bg-amber-600" : "bg-blue-600"}`} aria-label="Send">
            <Send size={14} />
          </button>
        )}
      </form>
    </div>
  );
}
```

Add to globals.css (same task): `.markdown p { margin: 0.35em 0; } .markdown ul { list-style: disc; padding-left: 1.1em; margin: 0.35em 0; } .markdown ol { list-style: decimal; padding-left: 1.1em; } .markdown code { background: #f1f5f9; border-radius: 4px; padding: 0 4px; font-size: 12px; } .markdown pre { background: #0f172a; color: #e2e8f0; border-radius: 8px; padding: 8px; overflow-x: auto; font-size: 12px; } .markdown pre code { background: transparent; padding: 0; } .markdown strong { font-weight: 700; }`

- [ ] **Step 1: Create the component + CSS**
- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/ChatPanel.tsx app/globals.css
git commit -m "feat: streaming chat panel with thinking and sentiment mode"
```

---

### Task 3: DeviceFrame (procedural 3D devices + live Html screens)

**Files:**
- Create: `components/DeviceFrame.tsx`
- Test: typecheck

**Interfaces:**
- Consumes: drei `Html/Float/PresentationControls`, `useWebGLAllowed`.
- Produces: `BrowserFrame`, `MonitorFrame`, `PhoneFrame` — each `( { children, label }: { children: React.ReactNode; label: string } )`, rendering a 3D device with the live UI inside via `Html transform`, or static CSS chrome fallback when `!show`.

- [ ] **Step 1: Create components/DeviceFrame.tsx with this exact content**

```tsx
"use client";
import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, PresentationControls, ContactShadows } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { useWebGLAllowed } from "./GlobalBackdrop";

function useShowCanvas() {
  const allowed = useWebGLAllowed();
  const reduce = useReducedMotion();
  const [inView, setInView] = useState(true);
  const [glLost, setGlLost] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches
  );
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onR = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onR);
    const el = ref.current;
    let io: IntersectionObserver | null = null;
    if (el) {
      io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
      io.observe(el);
    }
    return () => { window.removeEventListener("resize", onR); io?.disconnect(); };
  }, []);
  return { ref, show: allowed && !reduce && !glLost && inView && !isMobile, setGlLost };
}

function Shell({ height, chrome, scene, label }: { height: string; chrome: ReactNode; scene: ReactNode; label: string }) {
  const { ref, show, setGlLost } = useShowCanvas();
  return (
    <div ref={ref} aria-label={label} className={`relative mx-auto w-full ${height}`}>
      {show ? (
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.6, 7.4], fov: 45 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => { e.preventDefault(); setGlLost(true); });
        }}>
          <ambientLight intensity={1} />
          <directionalLight position={[4, 5, 6]} intensity={1} />
          <Suspense fallback={null}>
            <PresentationControls enabled global={false} snap cursor speed={1.1} polar={[-0.3, 0.3]} azimuth={[-0.6, 0.6]} config={{ mass: 1, tension: 170, friction: 26 }}>
              {scene}
            </PresentationControls>
            <ContactShadows position={[0, -2.2, 0]} opacity={0.25} scale={12} blur={2.4} far={5} resolution={256} color="#0f172a" />
          </Suspense>
        </Canvas>
      ) : (
        chrome
      )}
    </div>
  );
}

function SlowSpin({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (!ref.current || document.hidden) return;
    ref.current.rotation.y += dt * 0.08 + state.pointer.x * dt * 0.05;
  });
  return <group ref={ref}>{children}</group>;
}

export function BrowserFrame({ children, label }: { children: ReactNode; label: string }) {
  const screen = (
    <div style={{ width: 980, height: 600 }} className="overflow-hidden rounded-lg bg-white shadow-2xl">
      <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-100 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-2 flex-1 truncate rounded-md bg-white px-2 py-0.5 text-[10px] text-slate-400">{label}</span>
      </div>
      <div style={{ height: 560 }} className="overflow-hidden">{children}</div>
    </div>
  );
  return (
    <Shell
      height="h-[420px] md:h-[520px]"
      label={label}
      chrome={<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">{screen}</div>}
      scene={
        <SlowSpin>
          <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.6}>
            <Html transform position={[0, 0.2, 0]} distanceFactor={1.6} occlude="blending">
              {screen}
            </Html>
          </Float>
        </SlowSpin>
      }
    />
  );
}

export function MonitorFrame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <Shell
      height="h-[440px] md:h-[560px]"
      label={label}
      chrome={
        <div className="overflow-hidden rounded-2xl bg-slate-900 p-2 shadow-xl">
          <div className="overflow-hidden rounded-xl bg-white">{children}</div>
          <div className="mx-auto mt-2 h-8 w-24 rounded-b-xl bg-slate-700" />
        </div>
      }
      scene={
        <SlowSpin>
          <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.5}>
            <mesh position={[0, 0.35, -0.12]}>
              <boxGeometry args={[7.4, 4.7, 0.18]} />
              <meshStandardMaterial color="#0f172a" roughness={0.4} />
            </mesh>
            <mesh position={[0, -2.5, -0.1]}>
              <boxGeometry args={[0.5, 1.4, 0.3]} />
              <meshStandardMaterial color="#1e293b" roughness={0.5} />
            </mesh>
            <mesh position={[0, -3.2, 0.1]}>
              <boxGeometry args={[2.6, 0.18, 1.2]} />
              <meshStandardMaterial color="#1e293b" roughness={0.5} />
            </mesh>
            <Html transform position={[0, 0.35, 0]} distanceFactor={1.6} occlude="blending">
              <div style={{ width: 1060, height: 640 }} className="overflow-hidden bg-white">{children}</div>
            </Html>
          </Float>
        </SlowSpin>
      }
    />
  );
}

export function PhoneFrame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <Shell
      height="h-[560px] md:h-[640px]"
      label={label}
      chrome={
        <div className="mx-auto w-[300px] overflow-hidden rounded-[2rem] bg-slate-900 p-2 shadow-xl">
          <div className="overflow-hidden rounded-[1.6rem] bg-white" style={{ height: 560 }}>{children}</div>
        </div>
      }
      scene={
        <SlowSpin>
          <Float speed={1.3} rotationIntensity={0.3} floatIntensity={0.7}>
            <mesh>
              <boxGeometry args={[2.5, 5.1, 0.28]} />
              <meshStandardMaterial color="#0f172a" roughness={0.35} />
            </mesh>
            <mesh position={[0, 2.32, 0.1]}>
              <boxGeometry args={[1.1, 0.22, 0.05]} />
              <meshStandardMaterial color="#020617" roughness={0.4} />
            </mesh>
            <Html transform position={[0, -0.05, 0.02]} distanceFactor={1.35} occlude="blending">
              <div style={{ width: 390, height: 760 }} className="overflow-hidden bg-white">{children}</div>
            </Html>
          </Float>
        </SlowSpin>
      }
    />
  );
}
```

Html sizing: `transform` mode scales px by distanceFactor — values above verified against drei docs pattern (distanceFactor ~1.3-1.6 at camera z 7.4 keeps screens readable). If text is too small in dev, Task 5 adjusts distanceFactor only (one-line change, no re-review needed if visual-only).

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/DeviceFrame.tsx
git commit -m "feat: procedural 3D device frames with live screens"
```

---

### Task 4: TexaUI + EPosteUI static showcase UIs

**Files:**
- Create: `components/TexaUI.tsx`, `components/EPosteUI.tsx`
- Test: typecheck

**Interfaces:**
- Consumes: logo images via encodeURI (tp1/tp3).
- Produces: `export default function TexaUI(): JSX.Element` (1060×640 landscape UI), `export default function EPosteUI(): JSX.Element` (390×760 portrait UI). Pure static JSX, no hooks except trivial useState for tabs (allowed).

TexaUI layout (from user screenshot, static recreation):
- Left sidebar (250px): search input (decorative), tabs Itinéraire(3)/Carte(69), MAP LAYERS chips (UNESCO Sites, Historical, National Parks, Beaches, Ski Stations, Airports, Train Stations), SUGGESTED CIRCUITS (Roman Circuit, Sahara Route, Mediterranean Coast with ›), My Plan list (Ouled Djellal, Médéa, Dar El Ghaba, Citroën Collection, Restaurant Cap Sabri, Messaad, Hotel El Djazaïr, Assekrem/Hoggar, Restaurant Étoile + counts).
- Center: stylized map panel (bg slate-100, faint region labels ALGERIA/MOROCCO, decorative pins: blue cities, amber south, numbered route badges 1/2/3, dashed SVG route path Chlef→Tlemcen→Adrar, bottom Plan/Carte toggle).
- Right panel (300px): header "Your 3-Day Journey / Chlef → Tlemcen → Adrar / 3 days", Day 1 Chlef / Day 2 Tlemcen / Day 3 Adrar cards with thumb blocks (gradient placeholders, no external images).
- Header row: tp1 tourism ministry logo (h-8) + texa.png logo + title "TEXA — Tourism Explorer".

EPosteUI layout (390×760):
- Header: tp3 Algérie Poste logo (h-9) + "E-Store Manager" + bell dot.
- Stat cards row: Revenue 2.4M DA, Orders 1,284, Products 356.
- "Recent orders" list (5 rows: id, customer, status pill, amount).
- "Top products" 2×2 mini grid (gradient thumbs + names + prices).
- Bottom nav: Home, Orders, Products, Settings icons (lucide).
- All demo data inline const arrays in the file.

- [ ] **Step 1: Create both files per layouts above (static JSX + Tailwind only, tiny text sizes ~10-12px since screens are scaled)**
- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/TexaUI.tsx components/EPosteUI.tsx
git commit -m "feat: static texaAI and e-poste showcase UIs"
```

---

### Task 5: Projects rewrite — showcases + more grid, verify

**Files:**
- Modify: `components/Projects.tsx` (rewrite `#work`; research journey untouched)
- Test: typecheck + build + manual (needs local .env.local with real key for live test ONLY, never commit)

**Interfaces:**
- Consumes: Tasks 1–4, existing `ProjectDialog`, `ProjectShowcase3D`, `SectionHeading`, `projects` data.
- Produces: no new exports.

- [ ] **Step 1: Rewrite #work body (keep ring + dialog + pills-for-grid)**

Structure:
```tsx
"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import SectionHeading from "./SectionHeading";
import ProjectDialog from "./ProjectDialog";
import ChatPanel from "./ChatPanel";
import TexaUI from "./TexaUI";
import EPosteUI from "./EPosteUI";
import { projects, categories, type Project } from "@/data/portfolio";

const ProjectShowcase3D = dynamic(() => import("./ProjectShowcase3D"), { ssr: false });
CORRECTION (binding): dynamic() needs default exports — use `dynamic(() => import("./DeviceFrame").then((m) => ({ default: m.BrowserFrame })), { ssr: false })` per frame (3 dynamic consts). That pattern is valid Next.js. Use it.
```

CORRECTION (binding): dynamic() needs default exports. `DeviceFrame.tsx` exports named frames — Task 5 implementer FIRST adds a default-export wrapper? NO — simplest: in Projects.tsx use `dynamic(() => import("./DeviceFrame").then((m) => ({ default: m.BrowserFrame })), { ssr: false })` per frame (3 dynamic consts). That pattern is valid Next.js. Use it.

Sections (each: copy block left w/ logos + title + desc + tech chips, device right; alternate sides; `whileInView` rise):
1. Femto (tp2 `logo.png` + `FEMTO-ST.jpg`): MonitorFrame + ChatPanel system="You are FemtoCare, a medical multi-agent demo assistant. Answer concisely with markdown. You coordinate triage, literature, and safety agents." title="FemtoCare — Medical Agents" subtitle="Multi-agent clinical demo" accent blue, samples ["What are first-line options for community pneumonia?", "Summarize RAG safety guardrails"].
2. texaAI (tp1 ministry logo + texa.png): BrowserFrame + TexaUI. Copy: "TEXA — Tourism Explorer", "Multi-agent platform for tourism and exploration planning in Algeria — Ministry of Tourism and Handicrafts".
3. E-Poste (tp3 logo): PhoneFrame + EPosteUI. Copy: "E-Store Manager", "Professional mobile app for e-store management — Algérie Poste".
4. Ramy (tp4 logo): PhoneFrame + ChatPanel mode="sentiment" system="You are Ramy Insights, a sentiment-analysis engine. Analyze the user's text and always end with: Verdict: <positive|negative|neutral|mixed> (<score>%)" title="Ramy Insights" subtitle="Sentiment predictions" accent amber, samples ["Ramy Cola is the best drink ever!", "The delivery was late and the bottle leaked."].
Then ring teaser (kept, moved BELOW showcases? Spec says ring teaser above showcases — keep ring directly under heading, showcases after, then "More projects" static grid (projects filtered by pills, compact cards opening dialog), dialog kept.

- [ ] **Step 2: Typecheck + build**

Run: `npx tsc --noEmit` → PASS; `npm run build` → compiled successfully.

- [ ] **Step 3: Manual acceptance (local .env.local with real key, NEVER commit)**

`npm run dev`: each device drags; Femto chat streams thinking-then-answer with markdown; Ramy Analyze fills meter; texa/eposte static UIs render inside 3D; WebGL-off/mobile shows static chrome with working chats; reload clears history; no-key → friendly error; ring + grid + dialog intact.

- [ ] **Step 4: Commit (verify no .env.local staged)**

```bash
git status --short | grep -c env.local; git add components/Projects.tsx; git commit -m "feat: top project 3D showcases with live chats"
```

If grep count > 0, STOP and remove from index before committing.

"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  BookOpen,
  CalendarDays,
  HeartPulse,
  Library,
  Mic,
  NotebookPen,
  Paperclip,
  Plus,
  Send,
  SlidersHorizontal,
  SquarePen,
  Stethoscope,
} from "lucide-react";

type Msg = { role: "user" | "assistant"; text: string };

const PAST = [
  "Psa Result Discussion",
  "Initial Consultation Di…",
  "Psa Trend Chart",
  "Give Me Histogram Ch…",
  "Psa Trend Chart",
  "Symptoms Discussion",
  "Understanding PSA an…",
  "Conversation, 22 Sept",
  "Conversation, 21 Sept",
  "Imaging Report Review",
  "First Thing I Asked Dis…",
  "First Message On Chat…",
];

const QUICK = ["My PSA of 6.8", "Update on dizziness", "Prepare my visit"];

export default function FemtoMedRag({ system }: { system: string }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"text" | "voice">("text");
  const abort = useRef<AbortController | null>(null);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [msgs]);

  useEffect(() => () => abort.current?.abort(), []);

  async function send(raw: string) {
    const content = raw.trim().slice(0, 4000);
    if (!content || busy) return;
    setError("");
    const next = [...msgs, { role: "user" as const, text: content }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    abort.current = new AbortController();
    const ai: Msg = { role: "assistant", text: "" };
    setMsgs([...next, ai]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system,
          messages: next.map((m) => ({ role: m.role, content: m.text })),
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
              if (ev.type === "text" && ev.delta) { ai.text += ev.delta; changed = true; }
              else if (ev.type === "error") throw new Error(ev.message ?? "Stream error.");
            } catch (e) {
              if (e instanceof Error && e.message.includes("Stream")) throw e;
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

  function fresh() {
    abort.current?.abort();
    setMsgs([]);
    setError("");
    setInput("");
  }

  return (
    <div className="flex h-full min-h-[380px] w-full overflow-hidden bg-[#FBFAF7] text-left text-slate-800">
      {/* Sidebar */}
      <aside className="flex w-[168px] shrink-0 flex-col border-r border-stone-200/70 bg-white/60">
        <div className="flex items-center gap-1.5 px-3 pb-2 pt-3">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-teal-50 text-teal-600">
            <HeartPulse size={15} />
          </span>
          <span className="leading-tight">
            <span className="block text-[12px] font-extrabold tracking-tight text-slate-900">MedRAG</span>
            <span className="block text-[9px] text-slate-500">Your health companion</span>
          </span>
        </div>
        <nav className="space-y-0.5 px-2">
          <button onClick={fresh} className="flex w-full items-center gap-2 rounded-lg bg-stone-100/80 px-2 py-1.5 text-[11px] font-bold text-slate-800">
            <SquarePen size={12} /> New Conversation
          </button>
          <span className="flex items-center gap-2 px-2 py-1.5 text-[11px] font-medium text-slate-500">
            <Library size={12} /> Library
          </span>
          <span className="flex items-center gap-2 px-2 py-1.5 text-[11px] font-medium text-slate-500">
            <NotebookPen size={12} /> Leave a Note
          </span>
        </nav>
        <p className="mt-2 flex items-center justify-between px-3 text-[9px] font-bold uppercase tracking-wider text-slate-400">
          Conversations <span className="text-slate-300">▫</span>
        </p>
        <ul className="mt-1 min-h-0 flex-1 space-y-px overflow-hidden px-2">
          {PAST.map((c, i) => (
            <li key={`${c}-${i}`} className="flex items-center gap-1.5 truncate rounded-md px-2 py-[5px] text-[10.5px] text-slate-600 hover:bg-stone-100">
              <BookOpen size={10} className="shrink-0 text-stone-400" />
              <span className="truncate">{c}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2 border-t border-stone-200/70 px-3 py-2">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#F3D9CF] text-[10px] font-extrabold text-slate-700">SG</span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[11px] font-bold text-slate-900">Samir Guenchi</span>
            <span className="block text-[9px] text-slate-500">Patient</span>
          </span>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <div className="flex shrink-0 items-center border-b border-stone-200/60 px-3 py-2">
          <div className="mx-auto flex items-center gap-0.5 rounded-full bg-stone-100/90 p-0.5">
            <button
              onClick={() => setMode("voice")}
              aria-pressed={mode === "voice"}
              className={`grid h-6 w-6 place-items-center rounded-full ${mode === "voice" ? "bg-white text-slate-800 shadow" : "text-slate-400"}`}
              aria-label="Voice mode"
            >
              <Mic size={12} />
            </button>
            <button
              onClick={() => setMode("text")}
              aria-pressed={mode === "text"}
              className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${mode === "text" ? "bg-white text-slate-800 shadow" : "text-slate-400"}`}
            >
              <Send size={10} /> Text
            </button>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-600">
              <CalendarDays size={11} className="text-slate-400" /> Appointment
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-stone-300" />
            <SlidersHorizontal size={13} className="text-slate-500" />
          </div>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4">
          {msgs.length === 0 ? (
            <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center py-6 text-center">
              <Stethoscope size={18} className="mb-2 text-teal-600" />
              <h4 className="font-serif text-[26px] font-medium tracking-tight text-slate-900">Good afternoon, Samir.</h4>
              <p className="mt-1 text-[12px] text-slate-500">Last time you mentioned dizziness. How is it now?</p>
              <p className="mt-3 rounded-full bg-[#F4EFE7] px-3 py-1.5 text-[10.5px] font-medium text-slate-600">
                I remember: <b>PSA 6.8 ng/mL</b> · dizziness, headache <span className="text-slate-400">+10 more</span>
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {QUICK.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    disabled={busy}
                    className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-600 shadow-sm hover:border-teal-300 hover:text-teal-700 disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-xl space-y-2.5 py-4">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-[12px] leading-relaxed ${
                      m.role === "user" ? "bg-slate-900 text-white" : "border border-stone-200/80 bg-white text-slate-700 shadow-sm"
                    }`}
                  >
                    {m.text || (busy && i === msgs.length - 1 ? "…" : "")}
                  </div>
                </div>
              ))}
              <div ref={bottom} />
            </div>
          )}
          {error && (
            <p className="mx-auto mb-2 max-w-xl rounded-lg bg-red-50 px-3 py-1.5 text-[11px] font-medium text-red-700">
              {error} <button onClick={() => { const l = [...msgs].reverse().find((m) => m.role === "user"); if (l) send(l.text); }} className="underline">Retry</button>
            </p>
          )}
        </div>

        {/* Composer */}
        <div className="shrink-0 px-4 pb-3">
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-1 rounded-2xl border border-stone-200/80 bg-white px-2 py-1.5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.15)]"
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center text-stone-400">
              <Paperclip size={14} />
            </span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "voice" ? "Tap mic and speak…" : "Ask about a recent test or result…"}
              maxLength={4000}
              aria-label="Ask MedRAG"
              className="min-w-0 flex-1 bg-transparent text-[12px] outline-none placeholder:text-stone-400"
            />
            {mode === "voice" && <Mic size={14} className="shrink-0 text-stone-400" />}
            {busy ? (
              <button type="button" onClick={() => abort.current?.abort()} aria-label="Stop" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-900 text-white">
                <Plus size={14} className="rotate-45" />
              </button>
            ) : (
              <button type="submit" disabled={!input.trim()} aria-label="Send" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#F1E8D8] text-slate-600 disabled:opacity-50">
                <ArrowUp size={15} />
              </button>
            )}
          </form>
          <p className="mt-1 text-center text-[9px] text-slate-400">Live demo · triage + literature + safety agents · nothing is stored</p>
        </div>
      </div>
    </div>
  );
}

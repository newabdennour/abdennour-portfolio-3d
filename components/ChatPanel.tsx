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

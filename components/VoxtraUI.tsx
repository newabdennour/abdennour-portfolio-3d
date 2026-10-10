"use client";
import { useEffect, useRef, useState } from "react";
import { Copy, Loader2, Mic, Sparkles, Square, Trash2 } from "lucide-react";

type SR = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort?: () => void;
};

function getRecognition(): (new () => SR) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  return (w.SpeechRecognition as new () => SR) ?? (w.webkitSpeechRecognition as new () => SR) ?? null;
}

export default function VoxtraUI() {
  const [text, setText] = useState("");
  const [interim, setInterim] = useState("");
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [busy, setBusy] = useState(false);
  const rec = useRef<SR | null>(null);
  const base = useRef("");

  useEffect(() => {
    setSupported(!!getRecognition());
    return () => {
      try { rec.current?.stop(); } catch { /* noop */ }
    };
  }, []);

  function start() {
    const Ctor = getRecognition();
    if (!Ctor) { setSupported(false); return; }
    setError("");
    try { rec.current?.stop(); } catch { /* noop */ }
    const r = new Ctor();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-US";
    base.current = text;
    r.onresult = (e: any) => {
      let finalChunk = "";
      let interimChunk = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) finalChunk += res[0].transcript;
        else interimChunk += res[0].transcript;
      }
      if (finalChunk) {
        base.current = (base.current ? base.current + " " : "") + finalChunk.trim();
        setText(base.current);
      }
      setInterim(interimChunk);
    };
    r.onerror = (e: any) => {
      const msg = String(e?.error ?? "mic-error");
      if (msg.includes("not-allowed") || msg.includes("denied")) setError("Microphone blocked — allow mic access, or type manually.");
      else if (msg.includes("no-speech")) setError("No speech detected — try again closer to the mic.");
      else setError(`Mic error (${msg}) — you can still type manually.`);
      setListening(false);
    };
    r.onend = () => setListening(false);
    rec.current = r;
    try {
      r.start();
      setListening(true);
    } catch {
      setError("Could not start dictation in this browser — type manually.");
    }
  }

  function stop() {
    try { rec.current?.stop(); } catch { /* noop */ }
    setListening(false);
    setInterim("");
  }

  async function summarize() {
    const content = text.trim();
    if (!content || busy) return;
    setBusy(true);
    setSummary("");
    setError("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: "You are Voxtra, a speech-transcription summarizer. Summarize concisely with 3 bullets + one 1-line TL;DR. Use markdown.",
          messages: [{ role: "user", content: `Transcribe and summarize:\n\n${content.slice(0, 3500)}` }],
        }),
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error ?? "Summarizer unavailable.");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let out = "";
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
            try {
              const ev = JSON.parse(t.slice(5).trim());
              if (ev.type === "text" && ev.delta) { out += ev.delta; setSummary(out); }
              else if (ev.type === "error") throw new Error(ev.message ?? "Stream error.");
            } catch (e) {
              if (e instanceof Error && e.message.includes("Stream")) throw e;
            }
          }
        }
      }
    } catch (e) {
      setError((e as Error).message || "Summarizer failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-[600px] w-full flex-col overflow-hidden bg-slate-50 text-left text-slate-800">
      <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-3 py-2.5">
        <span className={`grid h-8 w-8 place-items-center rounded-lg text-white ${listening ? "bg-red-600" : "bg-violet-600"}`}>
          <Mic size={15} />
        </span>
        <div className="min-w-0">
          <p className="text-[12px] font-bold leading-tight">Voxtra — Voice to Text</p>
          <p className="text-[10px] leading-tight text-slate-500">
            {supported ? (listening ? "Listening… speak now" : "Browser STT · nothing is stored") : "STT not supported — type manually"}
          </p>
        </div>
        <span className={`ml-auto flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${listening ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${listening ? "bg-red-500" : "bg-emerald-500"}`} />
          {listening ? "LIVE" : "READY"}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2.5">
        <div className="flex gap-1.5">
          {listening ? (
            <button onClick={stop} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-[12px] font-bold text-white">
              <Square size={13} /> Stop
            </button>
          ) : (
            <button onClick={start} disabled={!supported} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-[12px] font-bold text-white disabled:opacity-40">
              <Mic size={13} /> Dictate
            </button>
          )}
          <button
            onClick={summarize}
            disabled={busy || !text.trim()}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] font-bold text-slate-700 disabled:opacity-40"
          >
            {busy ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />} Summarize
          </button>
        </div>

        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Transcript</label>
        <textarea
          value={text + (interim ? (text ? " " : "") + interim : "")}
          onChange={(e) => { setText(e.target.value); setInterim(""); base.current = e.target.value; }}
          placeholder={supported ? "Press Dictate and speak — your words appear here…" : "Type your text here…"}
          rows={6}
          className="min-h-[130px] w-full resize-none rounded-xl border border-slate-200 bg-white p-2.5 text-[13px] leading-relaxed outline-none focus:border-violet-400"
        />
        <div className="flex gap-1.5">
          <button
            onClick={() => { setText(""); setInterim(""); base.current = ""; setSummary(""); }}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600"
          >
            <Trash2 size={12} /> Clear
          </button>
          <button
            onClick={() => { if (text) void navigator.clipboard?.writeText(text).catch(() => null); }}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600"
          >
            <Copy size={12} /> Copy
          </button>
          <button
            onClick={() => setText("Ramy Cola launched a new citrus flavor. Customers love the taste and fast delivery, but some bottles leaked during shipping.")}
            className="ml-auto rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-violet-700 hover:underline"
          >
            Load sample
          </button>
        </div>

        <label className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">AI Summary</label>
        <div className="min-h-[110px] rounded-xl border border-slate-200 bg-white p-2.5 text-[13px] leading-relaxed text-slate-700">
          {busy && !summary ? (
            <span className="inline-flex items-center gap-1.5 text-slate-500"><Loader2 size={13} className="animate-spin" /> Summarizing…</span>
          ) : summary ? (
            <p className="whitespace-pre-wrap">{summary}</p>
          ) : (
            <p className="text-slate-400">Press Summarize after dictating — 3 bullets + TL;DR appear here.</p>
          )}
        </div>

        {error && <p className="rounded-lg bg-red-50 px-2.5 py-1.5 text-[12px] font-medium text-red-700">{error}</p>}
      </div>
    </div>
  );
}

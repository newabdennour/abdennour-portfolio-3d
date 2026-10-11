"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Copy,
  FileUp,
  Globe,
  History,
  LayoutGrid,
  Loader2,
  Mic,
  MoreVertical,
  Pause,
  Pencil,
  Play,
  Plus,
  Sparkles,
  Square,
  Trash2,
  Users,
  Video,
  Zap,
} from "lucide-react";

type VFile = { id: string; title: string; added: string; transcript: string };

const SEED_FILES: VFile[] = [
  {
    id: "f1",
    title: "(ChatGPT) تطبيقات الذكاء الاصطناعي و “تشات-جي.بي.تي.” في التعليم ar_chunk_3",
    added: "Added on December 21, 2025 at 12:39 AM",
    transcript:
      "كل مكتب من استخدامات شائعة حيث يتم بتدعش الاوله القوه انه الظروف العاديه الرايعه ان فقط بتقدم ابن معلومات احيانا لنمو القاص او تكثها النفس ونبغي استخدامات لم اكرم الباحثه الرايعه . وطلب منه . الاستدلال على نتائج الباحثه الي تم اجراء البحثه التحليله . بالباحثه انني فقط هي تتضمن في ثانيا بينمها تجنب ضعيف مثل ماهو ضعيف مثل ضهيف على الشائك على الطبيعه مثلها. كوميديا سياسون . أي اني بأهميه تقبل والنكته اكثر كما ان اما كا بطويله في نبطولي في نبطولي في نبطولي. وهل هذا شي ضهير حضور . أي انه اتى نفس م ازاج مع ان في مجالنا في التحليلات الكلك اكتشف انه منها وجهه تعلمه سنطبطب وهي بطليق وهي وجهه ضهير وهي جهه مفهوم وهم جهه مفهوم وهم جهه ضعقتوها وهذا ال شي متعباي انها بقولوها بعنفه . انا طلبت الى منك انا طلبت منك انا طلبت الى ما قاله . و انا ما طلبت منك التزيع ابتك هذا اثناء اثناء انتظار ضهيري وتعطيني ما كنت اجاوبك هيني . انا طلبت منك مثل ماتك يضهرلك",
  },
  {
    id: "f2",
    title: "مقدمة للبرمجة بلغة جافا Java - الجزء 3 - محاضرة 4 - رواق : مقدمة للبرمجة بلغة جافا ar_chunk_11",
    added: "Added on December 20, 2025 at 09:12 PM",
    transcript:
      "في هذه المحاضرة نستكمل أساسيات لغة جافا: المتغيرات والشروط والحلقات التكرارية. سنكتب أول برنامج كامل ونشرح كيفية عمل الذاكرة مع المصفوفات، ثم ننتقل إلى البرمجة كائنية التوجه بخطوات عملية مبسطة.",
  },
  {
    id: "f3",
    title: "المحاضرة 7 الجزء 2 : مقدمة في علم التسويق - رواق ar_chunk_1",
    added: "Added on December 18, 2025 at 04:47 PM",
    transcript:
      "يتناول هذا الجزء مفهوم المزيج التسويقي وتجزئة السوق واستهداف العملاء. نناقش أمثلة من السوق المحلي ونشرح كيف تبني العلامات التجارية رسائلها للوصول إلى الجمهور المناسب.",
  },
];

const ADD_MENU = [
  { icon: Zap, tint: "bg-blue-100 text-blue-600", name: "Quick Transcribe", desc: "Fast transcribe without saving" },
  { icon: Globe, tint: "bg-red-100 text-red-500", name: "YouTube URL", desc: "Download audio from YouTube" },
  { icon: FileUp, tint: "bg-emerald-100 text-emerald-600", name: "Upload Files", desc: "Choose one or more audio files" },
  { icon: Video, tint: "bg-violet-100 text-violet-600", name: "Upload Videos", desc: "Extract audio from video files" },
  { icon: Mic, tint: "bg-amber-100 text-amber-600", name: "Record Audio", desc: "Record using microphone" },
  { icon: Users, tint: "bg-indigo-100 text-indigo-600", name: "Multi-Track Audio", desc: "Upload multiple speaker tracks" },
];

type SR = {
  continuous: boolean; interimResults: boolean; lang: string;
  onresult: ((e: any) => void) | null; onerror: ((e: any) => void) | null; onend: (() => void) | null;
  start: () => void; stop: () => void;
};

function getRecognition(): (new () => SR) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  return (w.SpeechRecognition as new () => SR) ?? (w.webkitSpeechRecognition as new () => SR) ?? null;
}

const VOXTRA_LOGO = encodeURI("/top-projects/tp5/voxtra black.png");

function Waveform({ playing }: { playing: boolean }) {
  const bars = useMemo(
    () =>
      Array.from({ length: 72 }, (_, i) => {
        const v = Math.abs(Math.sin(i * 0.55) * 0.7 + Math.sin(i * 0.21 + 1.3) * 0.5 + Math.sin(i * 1.7) * 0.15);
        return 6 + Math.min(1, v) * 26;
      }),
    []
  );
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setTick((t) => (t + 1) % 200), 120);
    return () => window.clearInterval(id);
  }, [playing]);
  const progress = playing ? (tick % 72) : 30;
  return (
    <div className="flex h-10 flex-1 items-center gap-[2px] overflow-hidden rounded-md bg-slate-100/80 px-2">
      {bars.map((h, i) => (
        <span
          key={i}
          style={{ height: h }}
          className={`w-[3px] shrink-0 rounded-full ${i < progress ? "bg-blue-500" : "bg-slate-300"}`}
        />
      ))}
    </div>
  );
}

export default function VoxtraUI() {
  const [files, setFiles] = useState<VFile[]>(SEED_FILES);
  const [openId, setOpenId] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [listening, setListening] = useState(false);
  const [liveText, setLiveText] = useState("");
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [busy, setBusy] = useState(false);
  const rec = useRef<SR | null>(null);
  const base = useRef("");
  const menuRef = useRef<HTMLDivElement>(null);

  const open = files.find((f) => f.id === openId) ?? null;

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => () => { try { rec.current?.stop(); } catch { /* noop */ } }, []);
  useEffect(() => { setPlaying(false); setSummary(""); setLiveText(""); }, [openId]);

  function record() {
    const Ctor = getRecognition();
    setMenu(false);
    setError("");
    if (!Ctor) {
      const f: VFile = { id: `f-${Date.now()}`, title: `Dictation — ${new Date().toLocaleString()}`, added: "Added just now · typed manually", transcript: "" };
      setFiles((p) => [f, ...p]);
      setOpenId(f.id);
      setError("Speech recognition isn't supported in this browser — type in the transcript box instead.");
      return;
    }
    try { rec.current?.stop(); } catch { /* noop */ }
    const r = new Ctor();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "ar-SA";
    base.current = "";
    setLiveText("");
    const f: VFile = { id: `f-${Date.now()}`, title: `Recorded audio — ${new Date().toLocaleTimeString()}`, added: "Added just now · microphone", transcript: "" };
    setFiles((p) => [f, ...p]);
    setOpenId(f.id);
    r.onresult = (e: any) => {
      let fin = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) fin += e.results[i][0].transcript;
      }
      if (fin) {
        base.current = (base.current ? base.current + " " : "") + fin.trim();
        const txt = base.current;
        setLiveText(txt);
        setFiles((p) => p.map((x) => (x.id === f.id ? { ...x, transcript: txt } : x)));
      }
    };
    r.onerror = () => { setListening(false); setError("Mic blocked or silent — allow microphone access and try again."); };
    r.onend = () => setListening(false);
    rec.current = r;
    try { r.start(); setListening(true); } catch { setError("Could not start recording."); }
  }

  function stopRec() {
    try { rec.current?.stop(); } catch { /* noop */ }
    setListening(false);
  }

  async function summarize() {
    const target = open?.transcript.trim() || liveText.trim();
    if (!target || busy) return;
    setBusy(true);
    setSummary("");
    setError("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: "You are Voxtra, a speech-transcription summarizer. Summarize concisely with 3 bullets + one 1-line TL;DR. Use markdown.",
          messages: [{ role: "user", content: `Summarize this transcript:\n\n${target.slice(0, 3500)}` }],
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

  /* ---------- detail view ---------- */
  if (open) {
    return (
      <div style={{ width: 1060, height: 596 }} className="flex flex-col overflow-hidden bg-[#F7F7F8] text-left text-slate-800">
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex items-center justify-between">
            <button onClick={() => { stopRec(); setOpenId(null); }} className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-[10px] font-semibold text-slate-700">
              <ArrowLeft size={11} /> Back to Audio Files
            </button>
            <button aria-label="File options" className="grid h-6 w-6 place-items-center rounded-md border border-slate-300 bg-white text-slate-500">
              <MoreVertical size={12} />
            </button>
          </div>

          <div className="mt-2 rounded-lg border border-slate-200 bg-white p-3">
            <p className="flex items-center gap-1 text-[12px] font-bold text-slate-900">
              {open.title} <Pencil size={11} className="text-slate-400" />
            </p>
            <p className="mt-0.5 text-[9px] text-slate-400">{open.added}</p>
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "Pause" : "Play"}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-600 text-white"
              >
                {playing ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
              </button>
              <Waveform playing={playing} />
            </div>
          </div>

          <div className="mt-2 rounded-lg border border-slate-200 bg-white p-3">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-bold text-slate-900">Transcript</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={summarize}
                  disabled={busy || !(open.transcript.trim() || liveText.trim())}
                  className="flex items-center gap-1 rounded-md bg-slate-900 px-2 py-1 text-[10px] font-bold text-white disabled:opacity-40"
                >
                  {busy ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />} Summarize
                </button>
                <button
                  onClick={() => { if (open.transcript) void navigator.clipboard?.writeText(open.transcript).catch(() => null); }}
                  aria-label="Copy transcript"
                  className="grid h-6 w-6 place-items-center rounded-md border border-slate-200 text-slate-500"
                >
                  <Copy size={11} />
                </button>
                <button
                  onClick={() => setFiles((p) => { setOpenId(null); return p.filter((x) => x.id !== open.id); })}
                  aria-label="Delete file"
                  className="grid h-6 w-6 place-items-center rounded-md border border-slate-200 text-slate-500"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
            {listening && (
              <button onClick={stopRec} className="mt-2 flex items-center gap-1.5 rounded-md bg-red-600 px-2.5 py-1.5 text-[10px] font-bold text-white">
                <Square size={10} /> Stop recording
              </button>
            )}
            <p dir="auto" className="mt-2 whitespace-pre-wrap text-[11px] leading-[1.9] text-slate-600">
              {open.transcript || liveText || "No transcript yet — press Record and speak."}
            </p>
            {summary && (
              <div className="mt-2 rounded-md bg-violet-50 p-2 text-[11px] leading-relaxed text-slate-700">
                <p className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-violet-700"><Sparkles size={10} /> AI Summary</p>
                <p className="whitespace-pre-wrap">{summary}</p>
              </div>
            )}
            {error && <p className="mt-2 rounded-md bg-red-50 px-2 py-1 text-[10px] font-medium text-red-700">{error}</p>}
          </div>
        </div>
        </div>
      </div>
    );
  }

  /* ---------- list view ---------- */
  return (
    <div style={{ width: 1060, height: 596 }} className="flex flex-col overflow-hidden bg-[#F7F7F8] text-left text-slate-800">
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
      <div className="mx-auto w-full max-w-3xl">
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
        <div className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={VOXTRA_LOGO} alt="Voxtra" className="h-7 w-auto object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          <div className="ml-auto flex items-center gap-1.5" ref={menuRef}>
            <div className="relative">
              <button onClick={() => setMenu((m) => !m)} aria-label="Add audio" className="grid h-7 w-7 place-items-center rounded-md bg-black text-white">
                <Plus size={14} />
              </button>
              {menu && (
                <div className="absolute right-0 top-9 z-50 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
                  {ADD_MENU.map((a) => (
                    <button
                      key={a.name}
                      onClick={() => (a.name === "Record Audio" ? record() : setMenu(false))}
                      className="flex w-full items-center gap-2 px-2.5 py-2 text-left hover:bg-slate-50"
                    >
                      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-md ${a.tint}`}>
                        <a.icon size={14} />
                      </span>
                      <span>
                        <span className="block text-[11px] font-bold text-slate-900">{a.name}</span>
                        <span className="block text-[9px] leading-tight text-slate-500">{a.desc}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button aria-label="Grid view" className="grid h-7 w-7 place-items-center rounded-md border border-slate-300 text-slate-600">
              <LayoutGrid size={13} />
            </button>
            <button aria-label="History" className="grid h-7 w-7 place-items-center rounded-md border border-slate-300 text-slate-600">
              <History size={13} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-2 w-full rounded-lg border border-slate-200 bg-white p-3">
        <p className="text-[13px] font-bold text-slate-900">Audio Files</p>
        <p className="text-[10px] text-slate-500">{files.length} files total</p>

        <div className="mt-2 overflow-hidden rounded-lg border border-slate-200">
          <div className="grid grid-cols-[1fr_28px] bg-slate-50 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
            <span>Title</span>
            <span className="text-right">Actions</span>
          </div>
          {files.map((f) => (
            <button
              key={f.id}
              onClick={() => setOpenId(f.id)}
              className="grid w-full grid-cols-[1fr_28px] items-center gap-1 border-t border-slate-100 px-2.5 py-2 text-left hover:bg-slate-50"
            >
              <span dir="auto" className="truncate text-[10.5px] text-slate-700">{f.title}</span>
              <span className="flex justify-end text-slate-400" onClick={(e) => e.stopPropagation()}>
                <span className="grid h-6 w-6 place-items-center rounded hover:bg-slate-100" aria-hidden>
                  <MoreVertical size={13} />
                </span>
              </span>
            </button>
          ))}
          {files.length === 0 && <p className="px-2.5 py-4 text-center text-[11px] text-slate-400">No files — press + to add audio.</p>}
        </div>

        <div className="mt-2 flex items-center justify-between text-[9px] text-slate-500">
          <span>Showing 1 to {files.length} of {files.length} entries</span>
          <span className="flex items-center gap-1">
            <ChevronLeft size={12} /> <ChevronRight size={12} />
          </span>
        </div>
        {listening && (
          <button onClick={stopRec} className="mt-2 flex items-center gap-1.5 rounded-md bg-red-600 px-2.5 py-1.5 text-[10px] font-bold text-white">
            <Square size={10} /> Stop recording…
          </button>
        )}
        {error && <p className="mt-2 rounded-md bg-red-50 px-2 py-1 text-[10px] font-medium text-red-700">{error}</p>}
        <p className="mt-2 flex items-center justify-end gap-1 text-[9px] text-slate-400">
          <ArrowLeft size={10} /> <ArrowRight size={10} /> Click a file to open its transcript
        </p>
      </div>
      </div>
      </div>
    </div>
  );
}

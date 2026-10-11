"use client";
import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import ProjectDialog from "./ProjectDialog";
import ProjectScroller from "./ProjectScroller";
import ChatPanel from "./ChatPanel";
import FemtoMedRag from "./FemtoMedRag";
import TexaUI from "./TexaUI";
import EPosteUI from "./EPosteUI";
import VoxtraUI from "./VoxtraUI";
import { BrowserFrame, PhoneFrame } from "./DeviceFrame";
import { projects, categories, type Project } from "@/data/portfolio";

const femtoLogo = encodeURI("/top-projects/tp2/logo.png");
const femtoInst = encodeURI("/top-projects/tp2/FEMTO-ST.jpg");
const texaMinistry = encodeURI("/top-projects/tp1/Ministry of Tourism and Handicrafts logo.jpg");
const texaLogo = encodeURI("/top-projects/tp1/texa.png");
const eposteLogo = encodeURI("/top-projects/tp3/algerie post.png");
const ramyLogo = encodeURI("/top-projects/tp4/ramy.jpg");
const voxtraLogo = encodeURI("/top-projects/tp5/voxtra black.png");

function hideImg(e: SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = "none";
}

function TechChips({ tech }: { tech: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-1.5">
      {tech.map((t) => (
        <span
          key={t}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

const rise = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
} as const;

// Presents a fixed-size desktop design inside an exact 16:9 box.
// cover (default): scales to the box width, crops top/bottom equally.
// contain: shrinks the whole design to fit with nothing cropped.
function FitCover16x9({
  designWidth,
  designHeight,
  fit = "cover",
  children,
}: {
  designWidth: number;
  designHeight: number;
  fit?: "cover" | "contain";
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [boxW, setBoxW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setBoxW(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const boxH = (boxW * 9) / 16;
  const scale = fit === "contain"
    ? Math.min(boxW / designWidth, boxH / designHeight)
    : boxW > 0 ? boxW / designWidth : 0;
  const top = (boxH - designHeight * scale) / 2;
  const left = fit === "contain" ? (boxW - designWidth * scale) / 2 : 0;
  return (
    <div ref={ref} className="relative w-full overflow-hidden bg-white" style={{ aspectRatio: "16 / 9" }}>
      {boxW > 0 && (
        <div
          style={{
            width: designWidth,
            height: designHeight,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            top,
            left,
          }}
          className="absolute"
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default function Projects() {
  const [cat, setCat] = useState("All");
  const [selected, setSelected] = useState<Project | null>(null);
  // Archive excludes anything already showcased above (Featured Projects)
  // to avoid duplication: featured flag + keyword match for the live demos.
  // Web & Mobile are hidden from the archive on request.
  const archive = projects.filter((p) => {
    if (p.featured) return false;
    if (p.category === "Web" || p.category === "Mobile") return false;
    const t = `${p.title} ${p.description}`.toLowerCase();
    return !(
      t.includes("voxtra") ||
      t.includes("ramy") ||
      t.includes("e-commerce") ||
      t.includes("ecommerce") ||
      t.includes("femto") ||
      t.includes("texa") ||
      t.includes("e-store") ||
      t.includes("eposte")
    );
  });
  const developed = cat === "All" ? archive : archive.filter((p) => p.category === cat);
  const visibleCats = categories.filter((c) => c !== "Web" && c !== "Mobile");

  return (
    <>
      <section id="work" className="relative bg-white/80 py-24 backdrop-blur-sm">
        <div className="container-x">
          <SectionHeading
            title={<>Featured Projects</>}
            subtitle="Production-grade builds across AI, full-stack, mobile and data — each with real-world impact."
          />

          <div className="mx-auto mt-4 flex w-full max-w-7xl flex-col gap-16 md:gap-20">
            {/* 1 — FemtoCare (side 3D browser, wider than text, 16:9) */}
            <motion.div {...rise} className="grid items-center gap-8 md:grid-cols-[2fr_3fr]">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={femtoLogo} alt="FemtoCare" className="h-10 w-10 rounded-lg border border-slate-200 object-contain" onError={hideImg} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={femtoInst} alt="FEMTO-ST" className="h-10 w-10 rounded-lg border border-slate-200 object-cover" onError={hideImg} />
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">AI · Multi-agent</span>
                </div>
                <h3 className="font-display mt-4 text-2xl font-bold tracking-tight text-slate-900">FemtoCare — Medical Agents</h3>
                <p className="mt-2 leading-relaxed text-slate-600">
                  MedRAG clinical demo coordinating triage, literature, and safety agents — try it live, nothing is stored.
                </p>
                <TechChips tech={["Multi-agent", "RAG", "Gemini", "Next.js"]} />
              </div>
              <div className="min-w-0">
                <BrowserFrame label="femtocare.demo/chat" tilt="left">
                  <div className="aspect-video min-h-[380px] w-full">
                    <FemtoMedRag
                      system="You are FemtoCare (MedRAG), a medical multi-agent demo assistant. You coordinate triage, literature, and safety agents. Answer concisely with markdown."
                    />
                  </div>
                </BrowserFrame>
              </div>
            </motion.div>

            {/* 2 — TEXA (side 3D browser, wider than text, 16:9) */}
            <motion.div {...rise} className="grid items-center gap-8 md:grid-cols-[3fr_2fr]">
              <div className="min-w-0 order-2 md:order-1">
                <BrowserFrame label="texa.demo/itinerary" tilt="right">
                  <FitCover16x9 designWidth={1060} designHeight={640} fit="contain">
                    <TexaUI />
                  </FitCover16x9>
                </BrowserFrame>
              </div>
              <div className="order-1 min-w-0 md:order-2">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={texaMinistry} alt="Ministry of Tourism and Handicrafts" className="h-10 w-10 rounded-full border border-slate-200 object-cover" onError={hideImg} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={texaLogo} alt="TEXA" className="h-10 w-10 rounded-md border border-slate-200 object-contain" onError={hideImg} />
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">Web · Tourism</span>
                </div>
                <h3 className="font-display mt-4 text-2xl font-bold tracking-tight text-slate-900">TEXA — Tourism Explorer</h3>
                <p className="mt-2 leading-relaxed text-slate-600">
                  Multi-agent platform for tourism and exploration planning in Algeria — Ministry of Tourism and Handicrafts.
                </p>
                <TechChips tech={["Multi-agent", "Next.js", "Mapping", "Itineraries"]} />
              </div>
            </motion.div>

            {/* 3 — E-Poste */}
            <motion.div {...rise} className="grid items-center gap-8 md:grid-cols-2">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={eposteLogo} alt="Algérie Poste" className="h-10 w-10 rounded-md border border-slate-200 object-contain" onError={hideImg} />
                  <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-bold text-sky-700">Mobile · E-commerce</span>
                </div>
                <h3 className="font-display mt-4 text-2xl font-bold tracking-tight text-slate-900">E-Store Manager</h3>
                <p className="mt-2 leading-relaxed text-slate-600">
                  Professional mobile app for e-store management — Algérie Poste.
                </p>
                <TechChips tech={["Flutter", "Firebase", "E-commerce"]} />
              </div>
              <div className="min-w-0">
                <PhoneFrame label="eposte.demo/store" tilt="right">
                  <EPosteUI />
                </PhoneFrame>
              </div>
            </motion.div>

            {/* 4 — Ramy */}
            <motion.div {...rise} className="grid items-center gap-8 md:grid-cols-2">
              <div className="min-w-0 order-2 md:order-1">
                <PhoneFrame label="ramy.demo/sentiment" tilt="left">
                  <div className="h-[600px] w-full">
                    <ChatPanel
                      system="You are Ramy Insights, a sentiment-analysis engine. Analyze the user's text and always end with: Verdict: <positive|negative|neutral|mixed> (<score>%)"
                      title="Ramy Insights"
                      subtitle="Sentiment predictions"
                      accent="amber"
                      mode="sentiment"
                      samples={["Ramy Cola is the best drink ever!", "The delivery was late and the bottle leaked."]}
                    />
                  </div>
                </PhoneFrame>
              </div>
              <div className="order-1 min-w-0 md:order-2">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ramyLogo} alt="Ramy" className="h-10 w-10 rounded-lg border border-slate-200 object-cover" onError={hideImg} />
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">AI · Sentiment</span>
                </div>
                <h3 className="font-display mt-4 text-2xl font-bold tracking-tight text-slate-900">Ramy Insights</h3>
                <p className="mt-2 leading-relaxed text-slate-600">
                  Sentiment-analysis engine with a live verdict meter — type any product feedback, press Analyze, and watch the prediction.
                </p>
                <TechChips tech={["LLMs", "NLP", "Transformers", "Python"]} />
              </div>
            </motion.div>

            {/* 5 — Voxtra (web, browser STT) */}
            <motion.div {...rise} className="grid items-center gap-8 md:grid-cols-2">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={voxtraLogo} alt="Voxtra" className="h-10 w-10 rounded-lg border border-slate-200 bg-white object-contain p-1" onError={hideImg} />
                  <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-bold text-violet-700">Web · Speech AI</span>
                </div>
                <h3 className="font-display mt-4 text-2xl font-bold tracking-tight text-slate-900">Voxtra — Speech Transcription</h3>
                <p className="mt-2 leading-relaxed text-slate-600">
                  Audio library with waveform transcripts — open a file to read it, record with your mic, or summarize with AI. Nothing is stored.
                </p>
                <TechChips tech={["Web Speech API", "STT", "LLMs", "Next.js"]} />
              </div>
              <div className="min-w-0">
                <BrowserFrame label="voxtra.demo/transcribe" tilt="right">
                  <FitCover16x9 designWidth={1060} designHeight={596}>
                    <VoxtraUI />
                  </FitCover16x9>
                </BrowserFrame>
              </div>
            </motion.div>
          </div>

          {/* More projects */}
          <div className="mx-auto mt-20 max-w-6xl">
            <h3 className="font-display text-center text-2xl font-bold tracking-tight text-slate-900">More projects</h3>
            <p className="mt-2 text-center text-sm text-slate-500">Filter the archive — click any card for details.</p>
            <div className="mb-8 mt-6 flex flex-wrap justify-center gap-2">
              {visibleCats.map((c) => {
                const count = c === "All" ? archive.length : archive.filter((p) => p.category === c).length;
                return (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    aria-pressed={cat === c}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                      cat === c
                        ? "bg-slate-900 text-white shadow-md"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                    }`}
                  >
                    {c}
                    <span className={`ml-1.5 text-xs ${cat === c ? "text-slate-300" : "text-slate-400"}`}>{count}</span>
                  </button>
                );
              })}
            </div>
            <ProjectScroller key={cat} projects={developed} resetKey={cat} onSelect={setSelected} />
          </div>
        </div>
      </section>
      <AnimatePresence>
        {selected && <ProjectDialog project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}

"use client";
import { useState, type SyntheticEvent } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import ProjectDialog from "./ProjectDialog";
import ProjectScroller from "./ProjectScroller";
import ChatPanel from "./ChatPanel";
import TexaUI from "./TexaUI";
import EPosteUI from "./EPosteUI";
import { projects, categories, type Project } from "@/data/portfolio";

const ProjectShowcase3D = dynamic(() => import("./ProjectShowcase3D"), { ssr: false });
const BrowserFrame = dynamic(() => import("./DeviceFrame").then((m) => ({ default: m.BrowserFrame })), { ssr: false });
const MonitorFrame = dynamic(() => import("./DeviceFrame").then((m) => ({ default: m.MonitorFrame })), { ssr: false });
const PhoneFrame = dynamic(() => import("./DeviceFrame").then((m) => ({ default: m.PhoneFrame })), { ssr: false });

const femtoLogo = encodeURI("/top-projects/tp2/logo.png");
const femtoInst = encodeURI("/top-projects/tp2/FEMTO-ST.jpg");
const texaMinistry = encodeURI("/top-projects/tp1/Ministry of Tourism and Handicrafts logo.jpg");
const texaLogo = encodeURI("/top-projects/tp1/texa.png");
const eposteLogo = encodeURI("/top-projects/tp3/algerie post.png");
const ramyLogo = encodeURI("/top-projects/tp4/ramy.jpg");

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

export default function Projects() {
  const [cat, setCat] = useState("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const developed = cat === "All" ? projects : projects.filter((p) => p.category === cat);

  return (
    <>
      <section id="work" className="relative bg-white/80 py-24 backdrop-blur-sm">
        <div className="container-x">
          <SectionHeading
            title={<>Featured Projects</>}
            subtitle="Production-grade builds across AI, full-stack, mobile and data — each with real-world impact."
          />
          <ProjectShowcase3D projects={projects} activeId={selected?.id ?? null} onPick={setSelected} />

          <div className="mx-auto mt-4 flex max-w-5xl flex-col gap-16 md:gap-20">
            {/* 1 — FemtoCare */}
            <motion.div {...rise} className="grid items-center gap-8 md:grid-cols-2">
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
                  Multi-agent clinical demo coordinating triage, literature, and safety agents — try it live, nothing is stored.
                </p>
                <TechChips tech={["Multi-agent", "RAG", "Gemini", "Next.js"]} />
              </div>
              <div className="min-w-0 overflow-x-auto">
                <MonitorFrame label="femtocare.demo/chat">
                  <div style={{ width: 1060, height: 640 }}>
                    <ChatPanel
                      system="You are FemtoCare, a medical multi-agent demo assistant. Answer concisely with markdown. You coordinate triage, literature, and safety agents."
                      title="FemtoCare — Medical Agents"
                      subtitle="Multi-agent clinical demo"
                      accent="blue"
                      samples={["What are first-line options for community pneumonia?", "Summarize RAG safety guardrails"]}
                    />
                  </div>
                </MonitorFrame>
              </div>
            </motion.div>

            {/* 2 — TEXA */}
            <motion.div {...rise} className="grid items-center gap-8 md:grid-cols-2">
              <div className="min-w-0 overflow-x-auto order-2 md:order-1">
                <BrowserFrame label="texa.demo/itinerary">
                  <div style={{ width: 980, height: 560 }} className="flex justify-center overflow-hidden bg-white">
                    <div style={{ width: 1060, height: 640, transform: "scale(0.875)", transformOrigin: "top center" }}>
                      <TexaUI />
                    </div>
                  </div>
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
              <div className="min-w-0 overflow-x-auto">
                <PhoneFrame label="eposte.demo/store">
                  <EPosteUI />
                </PhoneFrame>
              </div>
            </motion.div>

            {/* 4 — Ramy */}
            <motion.div {...rise} className="grid items-center gap-8 md:grid-cols-2">
              <div className="min-w-0 overflow-x-auto order-2 md:order-1">
                <PhoneFrame label="ramy.demo/sentiment">
                  <div style={{ width: 390, height: 760 }}>
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
          </div>

          {/* More projects */}
          <div className="mx-auto mt-20 max-w-6xl">
            <h3 className="font-display text-center text-2xl font-bold tracking-tight text-slate-900">More projects</h3>
            <p className="mt-2 text-center text-sm text-slate-500">Filter the archive — click any card for details.</p>
            <div className="mb-8 mt-6 flex flex-wrap justify-center gap-2">
              {categories.map((c) => {
                const count = c === "All" ? projects.length : projects.filter((p) => p.category === c).length;
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

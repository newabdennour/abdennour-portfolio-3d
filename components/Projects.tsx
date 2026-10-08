"use client";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import SectionHeading from "./SectionHeading";
import ProjectDialog from "./ProjectDialog";
import { ProjectPanel, PaperPanel } from "./JourneyPanels";
import { projects, papers, categories, type Project } from "@/data/portfolio";

const ProjectShowcase3D = dynamic(() => import("./ProjectShowcase3D"), { ssr: false });
const SkyJourney = dynamic(() => import("./SkyJourney"), { ssr: false });

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
          <div className="mb-10 flex flex-wrap justify-center gap-2">
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
        </div>
        <SkyJourney
          id="work-journey"
          theme="playful"
          stops={developed.length}
          renderPanel={(i, progress) => (
            <ProjectPanel index={i} stops={developed.length} progress={progress} project={developed[i]} onSelect={setSelected} />
          )}
        />
      </section>
      <section id="research" className="relative bg-white/80 py-24 backdrop-blur-sm">
        <div className="container-x">
          <SectionHeading
            title={<>Research & Papers</>}
            subtitle="Academic writing and applied studies — early drafts, notes and reports you can edit freely later."
          />
        </div>
        <SkyJourney
          id="research-journey"
          theme="academic"
          stops={papers.length}
          renderPanel={(i, progress) => (
            <PaperPanel index={i} stops={papers.length} progress={progress} paper={papers[i]} />
          )}
        />
      </section>
      <AnimatePresence>
        {selected && <ProjectDialog project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}

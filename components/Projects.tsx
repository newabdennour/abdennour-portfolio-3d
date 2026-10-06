"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Calendar, Sparkles } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { projects, categories, type Project } from "@/data/portfolio";

function TiltCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({ rx: 0, ry: 0, glareX: 50, glareY: 50 });
  const hasLink = project.link && project.link !== "#";

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setStyle({ rx: (0.5 - py) * 14, ry: (px - 0.5) * 14, glareX: px * 100, glareY: py * 100 });
  };

  const inner = (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setStyle({ rx: 0, ry: 0, glareX: 50, glareY: 50 })}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.4) }}
      className="card-3d group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl transition-colors duration-300 hover:border-cyan-400/30 hover:shadow-glow"
      style={{
        transform: `perspective(1100px) rotateX(${style.rx}deg) rotateY(${style.ry}deg)`,
        transition: "transform 0.12s ease-out, border-color 0.3s, box-shadow 0.3s",
      }}
    >
      {/* glare */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at ${style.glareX}% ${style.glareY}%, rgba(255,255,255,0.14), transparent 55%)`,
        }}
      />
      <div className="relative h-52 overflow-hidden bg-slate-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="h-full w-full object-cover opacity-90 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0620] via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-glow">
          {project.category}
        </span>
        {project.featured && (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-400/15 px-3 py-1 text-[11px] font-bold text-amber-200 backdrop-blur-md">
            <Sparkles size={11} /> Featured
          </span>
        )}
        {hasLink && (
          <span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white text-slate-950 opacity-0 shadow-xl transition-all duration-300 group-hover:opacity-100">
            <ArrowUpRight size={18} />
          </span>
        )}
      </div>

      <div className="relative p-6" style={{ transform: "translateZ(30px)" }}>
        <h3 className="font-display text-lg font-bold leading-snug text-white transition-colors group-hover:text-cyan-200">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-400">
          {project.description}
        </p>
        <div className="mt-5 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Calendar size={12} /> {project.year}
          </span>
          <div className="flex flex-wrap justify-end gap-1.5">
            {project.technologies.slice(0, 2).map((t) => (
              <span key={t} className="rounded-lg bg-white/8 border border-white/10 px-2 py-1 text-[11px] font-medium text-slate-300">
                {t}
              </span>
            ))}
            {project.technologies.length > 2 && (
              <span className="rounded-lg bg-cyan-400/15 border border-cyan-400/25 px-2 py-1 text-[11px] font-bold text-cyan-200">
                +{project.technologies.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 transition-transform duration-500 group-hover:scale-x-100" />
    </motion.div>
  );

  if (!hasLink) return inner;
  return (
    <a href={project.link} target="_blank" rel="noopener noreferrer" className="block h-full">
      {inner}
    </a>
  );
}

export default function Projects() {
  const [cat, setCat] = useState("All");
  const filtered = cat === "All" ? projects : projects.filter((p) => p.category === cat);

  return (
    <section id="work" className="relative py-28">
      <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      <div className="container-x">
        <SectionHeading
          eyebrow="Selected Work"
          title={<>Featured <span className="text-gradient-neon">Projects</span></>}
          subtitle="A collection of production-grade builds across AI, full-stack, mobile and data — each with real-world impact."
        />

        <div className="mb-12 flex flex-wrap justify-center gap-2.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                cat === c
                  ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-glow scale-105"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {c}
              <span className="ml-2 text-xs opacity-70">
                {c === "All" ? projects.length : projects.filter((p) => p.category === c).length}
              </span>
            </button>
          ))}
        </div>

        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <TiltCard key={p.id} project={p} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

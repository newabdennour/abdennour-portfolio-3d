"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Calendar } from "lucide-react";
import SectionHeading from "./SectionHeading";
import ProjectDialog from "./ProjectDialog";
import { projects, categories, type Project } from "@/data/portfolio";

function TiltCard({
  project,
  index,
  onSelect,
}: {
  project: Project;
  index: number;
  onSelect: (p: Project) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({ rx: (0.5 - py) * 10, ry: (px - 0.5) * 10 });
    ref.current?.style.setProperty("--mx", `${px * 100}%`);
    ref.current?.style.setProperty("--my", `${py * 100}%`);
  };

  const inner = (
    <motion.div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${project.title}`}
      onClick={() => onSelect(project)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(project);
        }
      }}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.35) }}
      className="card-3d group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-[0_10px_28px_-14px_rgba(15,23,42,0.18)] transition-shadow duration-300 hover:shadow-[0_24px_50px_-20px_rgba(37,99,235,0.35)]"
      style={{
        transform: `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.rx === 0 && tilt.ry === 0 ? 1 : 1.02})`,
        transition: "transform 0.15s ease-out, box-shadow 0.3s",
      }}
    >
      <div className="relative h-48 shrink-0 overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-slate-900/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
          {project.category}
        </span>
        {project.featured && (
          <span className="absolute right-4 top-4 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-blue-700">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
          {project.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-5">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Calendar size={12} /> {project.year}
          </span>
          <div className="flex flex-wrap justify-end gap-1.5">
            {project.technologies.slice(0, 2).map((t) => (
              <span key={t} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600">
                {t}
              </span>
            ))}
            {project.technologies.length > 2 && (
              <span className="rounded-lg border border-blue-100 bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700">
                +{project.technologies.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(520px circle at var(--mx, 50%) var(--my, 50%), rgba(37,99,235,0.12), transparent 65%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-blue-600 to-violet-600 transition-transform duration-500 group-hover:scale-x-100" />
      <span className="absolute bottom-5 right-5 grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-white opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100">
        <ArrowUpRight size={16} />
      </span>
    </motion.div>
  );

  return inner;
}

export default function Projects() {
  const [cat, setCat] = useState("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const filtered = cat === "All" ? projects : projects.filter((p) => p.category === cat);

  return (
    <section id="work" className="relative bg-white py-24">
      <div className="container-x">
        <SectionHeading
          title={<>Featured Projects</>}
          subtitle="Production-grade builds across AI, full-stack, mobile and data — each with real-world impact."
        />

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

        <motion.div layout className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filtered.map((p, i) => (
              <TiltCard key={p.id} project={p} index={i} onSelect={setSelected} />
            ))}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {selected && <ProjectDialog project={selected} onClose={() => setSelected(null)} />}
        </AnimatePresence>
      </div>
    </section>
  );
}

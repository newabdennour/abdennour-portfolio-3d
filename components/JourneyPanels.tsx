"use client";
import { motion, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, Calendar, ScrollText } from "lucide-react";
import type { Paper, Project } from "@/data/portfolio";

function useStopProgress(progress: MotionValue<number>, index: number, stops: number) {
  const a = index / stops;
  const b = Math.min(a + 1.2 / stops, 1);
  const raw = useTransform(progress, [Math.max(a - 0.06, 0), b], [0, 1]);
  return useSpring(raw, { stiffness: 120, damping: 16 });
}

function PanelShell({ local, side, theme, children }: {
  local: MotionValue<number>;
  side: 1 | -1;
  theme: "playful" | "academic";
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const opacity = useTransform(local, [0, 0.35], [0, 1]);
  const y = useTransform(local, [0, 1], [70, 0]);
  const rotateX = useTransform(local, [0, 1], reduce ? [0, 0] : [55, 0]);
  const rotateY = useTransform(local, [0, 1], reduce ? [0, 0] : [18 * side, 0]);
  const blur = useTransform(local, [0, 0.6], ["blur(8px)", "blur(0px)"]);
  return (
    <motion.div
      style={{ opacity, y, rotateX, rotateY, filter: reduce ? undefined : blur, transformPerspective: 1100 }}
      className={theme === "academic"
        ? "rounded-2xl border border-amber-200/70 bg-[#fffdf4]/95 p-6 shadow-[0_18px_44px_-18px_rgba(120,72,0,0.35)] backdrop-blur-sm"
        : "rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-[0_18px_44px_-18px_rgba(37,99,235,0.35)] backdrop-blur-sm"}
    >
      {children}
    </motion.div>
  );
}

export function ProjectPanel({ index, stops, progress, project, onSelect }: {
  index: number; stops: number; progress: MotionValue<number>; project: Project; onSelect: (p: Project) => void;
}) {
  const local = useStopProgress(progress, index, stops);
  const side = (index % 2 === 0 ? 1 : -1) as 1 | -1;
  return (
    <PanelShell local={local} side={side} theme="playful">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={project.image} alt={project.title} loading="lazy" className="h-40 w-full rounded-xl object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">{project.category} — {project.year}</p>
      <h3 className="mt-1 font-display text-xl font-bold tracking-tight text-slate-900">{project.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{project.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500"><Calendar size={12} /> {project.year}</span>
        <button onClick={() => onSelect(project)} className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
          Open <ArrowUpRight size={15} />
        </button>
      </div>
    </PanelShell>
  );
}

export function PaperPanel({ index, stops, progress, paper }: {
  index: number; stops: number; progress: MotionValue<number>; paper: Paper;
}) {
  const local = useStopProgress(progress, index, stops);
  const side = (index % 2 === 0 ? -1 : 1) as 1 | -1;
  return (
    <PanelShell local={local} side={side} theme="academic">
      <p className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700">
        <ScrollText size={12} /> {paper.venue}
      </p>
      <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-slate-900">{paper.title}</h3>
      <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-slate-600">{paper.abstract}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {paper.tags.map((tg) => (
          <span key={tg} className="rounded-lg border border-amber-100 bg-amber-50/60 px-2 py-1 text-[11px] font-medium text-amber-800">{tg}</span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">{paper.year}</span>
        {paper.link === "#" ? (
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 cursor-default">
            Soon
          </span>
        ) : (
          <a href={paper.link} target={paper.link.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700">
            Read <ArrowUpRight size={15} />
          </a>
        )}
      </div>
    </PanelShell>
  );
}

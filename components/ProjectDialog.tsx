"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, X } from "lucide-react";
import type { Project } from "@/data/portfolio";

export default function ProjectDialog({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const hasLink = project.link && project.link !== "#";

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevActive = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      prevActive?.focus?.();
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[95] flex items-end justify-center bg-slate-900/50 p-4 backdrop-blur-sm sm:items-center sm:p-6"
    >
      <div style={{ perspective: 1400 }} className="w-full max-w-2xl">
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-dialog-title"
          initial={{ opacity: 0, y: 90, scale: 0.9, rotateX: 28 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          exit={{ opacity: 0, y: 60, scale: 0.94, rotateX: -14 }}
          transition={{ type: "spring", stiffness: 240, damping: 26 }}
          className="relative max-h-[88vh] overflow-y-auto rounded-3xl bg-white shadow-[0_40px_120px_-30px_rgba(15,23,42,0.5)]"
        >
          <div className="relative h-52 shrink-0 overflow-hidden sm:h-64">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close project details"
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-slate-700 shadow-lg backdrop-blur transition hover:bg-white hover:text-slate-900"
            >
              <X size={18} />
            </button>
            <div className="absolute inset-x-6 bottom-4 flex items-center gap-2">
              <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-900 backdrop-blur-sm">
                {project.category}
              </span>
              {project.featured && (
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700">
                  Featured
                </span>
              )}
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-slate-900/70 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                <Calendar size={12} /> {project.year}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <h3
              id="project-dialog-title"
              className="font-display text-2xl font-bold tracking-tight text-slate-900 text-balance sm:text-3xl"
            >
              {project.title}
            </h3>
            <p className="mt-3 leading-relaxed text-slate-600">{project.description}</p>

            <dl className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-slate-200/70">
              {[
                { value: project.year, label: "Year" },
                { value: project.category, label: "Category" },
                { value: String(project.technologies.length), label: "Tools" },
              ].map((m) => (
                <div key={m.label} className="bg-slate-50/70 px-3 py-3 text-center">
                  <dd className="truncate font-display text-base font-bold tracking-tight text-slate-900">
                    {m.value}
                  </dd>
                  <dt className="mt-0.5 text-[11px] font-medium uppercase tracking-widest text-slate-500">
                    {m.label}
                  </dt>
                </div>
              ))}
            </dl>

            <h4 className="mt-6 font-display text-sm font-bold tracking-tight text-slate-900">
              Built with
            </h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <span
                  key={t}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
              {hasLink && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary btn-shine flex-1"
                >
                  Open project
                  <ArrowUpRight size={17} />
                </a>
              )}
              <button onClick={onClose} className="btn-ghost flex-1">
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

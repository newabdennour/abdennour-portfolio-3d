"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BookOpen, ChevronDown } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { papers, featuredPapers, type Paper } from "@/data/portfolio";

const tilts = ["md:-rotate-1", "md:rotate-1", "md:rotate-[0.6deg]"];

function PaperCard({ paper, tilt, index }: { paper: Paper; tilt: string; index: number }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const hasLink = paper.link !== "#";
  return (
    <motion.article
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className={`relative rounded-xl bg-[#fffdf4] p-6 pt-8 shadow-[0_20px_44px_-20px_rgba(60,30,0,0.45)] md:p-7 ${tilt}`}
    >
      <span aria-hidden className="absolute -top-3 left-1/2 h-7 w-24 -translate-x-1/2 rotate-[-2deg] bg-[rgba(233,213,166,0.9)] shadow" />
      <span aria-hidden className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-gradient-to-br from-slate-500 to-slate-800 shadow" />
      <p className="flex items-center gap-1.5 font-mono text-[11px] tracking-widest text-amber-700">
        <BookOpen size={12} /> {paper.venue}
      </p>
      <h3 className="mt-2 font-display text-xl font-bold leading-snug tracking-tight text-slate-900">
        {paper.title}
      </h3>
      <p className="mt-1 text-xs italic text-slate-500">Guerroudj Abdennour et al. — {paper.year}</p>
      <div className="mt-3 border-l-2 border-amber-300 bg-amber-50/50 py-1 pl-3 pr-2">
        <p className="text-[11px] font-bold uppercase tracking-widest text-amber-800">Abstract</p>
        <p className={`mt-1 text-sm leading-relaxed text-slate-700 ${open ? "" : "line-clamp-4"}`}>{paper.abstract}</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {paper.tags.map((t) => (
          <span key={t} className="rounded-md border border-amber-200 bg-white px-2 py-0.5 text-[11px] font-medium text-amber-900">{t}</span>
        ))}
      </div>
      {open && (
        <div className="mt-4 rounded-lg border border-dashed border-amber-300 bg-white p-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Highlights</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {paper.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <p className="mt-3 font-mono text-[11px] leading-relaxed text-slate-500">
            {paper.title} ({paper.year}). {paper.venue}.
          </p>
        </div>
      )}
      <div className="mt-4 flex items-center justify-between">
        {hasLink ? (
          <a href={paper.link} target={paper.link.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700">
            Read <ArrowUpRight size={15} />
          </a>
        ) : (
          <span className="inline-flex items-center rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500">Soon</span>
        )}
        <button onClick={() => setOpen(!open)} aria-expanded={open} className="inline-flex items-center gap-1 text-sm font-semibold text-amber-800 hover:text-amber-900">
          {open ? "Less info" : "More info"} <ChevronDown size={15} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
    </motion.article>
  );
}

export default function Research() {
  const list = featuredPapers
    .map((id) => papers.find((p) => p.id === id))
    .filter((p): p is Paper => Boolean(p));
  return (
    <section id="research" className="journal-bg relative overflow-hidden py-20 md:py-24">
      <span aria-hidden className="watermark">RESEARCH</span>
      <div className="container-x relative">
        <SectionHeading
          title={<>Research & papers</>}
          subtitle="Selected studies and drafts — examples being replaced with publications."
        />
        <div className="grid gap-6 md:grid-cols-3 md:gap-5">
          {list.map((p, i) => (
            <PaperCard key={p.id} paper={p} tilt={tilts[i % tilts.length]} index={i} />
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-amber-100/80">
          Full publication list coming soon — reach out for drafts and notebooks.
        </p>
      </div>
    </section>
  );
}

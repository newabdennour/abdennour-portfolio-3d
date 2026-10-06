"use client";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Download, MapPin } from "lucide-react";
import { profile } from "@/data/portfolio";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-white pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,rgba(37,99,235,0.07),transparent_70%)]" />
      <HeroCanvas />
      <div className="absolute inset-0 grid-bg opacity-70" />

      <div className="container-x relative z-10 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
          </span>
          Available for AI & Full-Stack missions
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-5 flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"
        >
          <MapPin size={13} className="text-blue-500" />
          {profile.location}
        </motion.p>

        <h1 className="mt-4 font-display font-bold leading-[1.02] tracking-tight">
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12, ease }}
            className="block text-[clamp(2.75rem,7.5vw,5.25rem)] text-slate-900"
          >
            Guerroudj Abdennour
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.24, ease }}
            className="text-gradient-neon block text-[clamp(1.5rem,3.5vw,2.25rem)] font-semibold tracking-tight"
          >
            AI Engineer & Full-Stack Developer
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600"
        >
          I transform complex challenges into elegant{" "}
          <span className="font-semibold text-slate-900">AI-powered solutions</span> — RAG
          systems, LLM apps, mobile experiences and data intelligence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.52, ease }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <a href="#work" className="btn-primary group w-full sm:w-auto">
            View My Work
            <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
          </a>
          <a href={profile.cv} download className="btn-ghost w-full sm:w-auto">
            <Download size={17} />
            Download Resume
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.68, ease }}
          className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4"
        >
          {profile.stats.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-5 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_-14px_rgba(37,99,235,0.3)]"
            >
              <p className="font-display text-3xl font-bold tracking-tight text-slate-900">
                {s.raw ? s.value : `${s.value}${s.suffix}`}
              </p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-widest text-slate-500">{s.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.a
          href="#work"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="mx-auto mt-12 grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition hover:text-blue-600"
          aria-label="Scroll to work"
        >
          <ArrowDown size={17} />
        </motion.a>
      </div>
    </section>
  );
}

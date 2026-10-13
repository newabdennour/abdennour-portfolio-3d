"use client";
import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import Image from "next/image";
import { ArrowDown, CalendarCheck, Download, Github, MapPin } from "lucide-react";
import { profile } from "@/data/portfolio";

const ease = [0.22, 1, 0.36, 1] as const;

function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 16 });
  const sy = useSpring(y, { stiffness: 180, damping: 16 });

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      className="w-full sm:w-auto"
      onMouseMove={(e) => {
        if (reduce || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.18);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

const nowBuilding = [
  { title: "Medical multi-agent RAG platform", desc: "Grounded clinical answers — adaptive agent questioning for healthcare.", tag: "lab · FEMTO-ST" },
  { title: "TEXA — tourism for Algeria", desc: "Multi-agent platform helping tourists discover cultural and natural sites.", tag: "production · Ministry of Tourism" },
  { title: "E-store management app", desc: "Professional mobile app for e-store management at Algérie Poste scale.", tag: "production · Algérie Poste" },
  { title: "Ramy — sentiment intelligence", desc: "LLM-powered opinions, emotions and insights from text.", tag: "enterprise · Ramy" },
];

const indexRows = [
  { k: "now", v: "open for AI & full-stack missions" },
  { k: "focus", v: "RAG systems · LLM apps · mobile AI" },
  { k: "stack", v: "Next.js · Flutter · PyTorch · LangChain" },
  { k: "open to", v: "AI products · RAG systems · engineering projects" },
];

function todayStamp() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
}

export default function Hero() {
  return (
    <section id="top" className="paper-bg relative pt-28 pb-16 md:pt-36 md:pb-20">
      <div className="container-x relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-xs tracking-widest text-slate-500"
        >
          [ lab notes — {todayStamp()} ]
        </motion.p>

        <div className="mt-6 grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="flex flex-wrap items-center gap-5"
            >
              <div className="polaroid w-36 shrink-0 -rotate-3 md:w-44">
                <div className="relative aspect-square overflow-hidden bg-slate-900">
                  <Image
                    src="/profile.png"
                    alt="Portrait of Abdennour Guerroudj"
                    fill
                    sizes="(max-width: 768px) 144px, 176px"
                    className="object-cover"
                    priority
                  />
                </div>
                <p className="font-hand mt-2 text-center text-lg text-slate-700">Abdennour G.</p>
              </div>
              <div className="min-w-0">
                <p className="font-hand text-3xl text-orange-700 md:text-4xl">Hey, I&apos;m Abdennour</p>
                <h1 className="mt-1 font-display text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 md:text-6xl">
                  AI engineer &<br />full-stack developer.
                </h1>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease }}
              className="mt-5 text-sm font-medium text-slate-600"
            >
              {profile.role} · <span className="underline decoration-orange-300 decoration-2 underline-offset-4">{profile.location}</span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              className="mt-4 max-w-xl leading-relaxed text-slate-700"
            >
              I transform complex challenges into elegant{" "}
              <span className="font-semibold text-slate-900">AI-powered solutions</span> — RAG
              systems, LLM apps, mobile experiences and data intelligence.
            </motion.p>

            <motion.dl
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28, ease }}
              className="index-card mt-7 max-w-xl"
            >
              <dt className="index-card-title">index card</dt>
              {indexRows.map((r) => (
                <div key={r.k} className="index-row">
                  <dt>{r.k}</dt>
                  <dd>{r.v}</dd>
                </div>
              ))}
            </motion.dl>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.36, ease }}
              className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Magnetic>
                <a href={`mailto:${profile.email}`} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-700 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(154,52,18,0.6)] transition hover:-translate-y-0.5 hover:bg-orange-800 sm:w-auto">
                  <CalendarCheck size={17} />
                  Schedule a call
                </a>
              </Magnetic>
              <Magnetic>
                <a href={profile.cv} download className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-400 sm:w-auto">
                  <Download size={17} />
                  CV
                </a>
              </Magnetic>
              <Magnetic>
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-400 sm:w-auto">
                  <Github size={17} />
                  GitHub
                </a>
              </Magnetic>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-hand mt-3 text-lg text-slate-500"
            >
              ↩ quickest way to reach me
            </motion.p>
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 24, rotate: 2 }}
            animate={{ opacity: 1, y: 0, rotate: 1.5 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
            className="lined-paper relative mx-auto w-full max-w-md p-6 pt-8 md:mx-0"
            aria-label="What I'm building right now"
          >
            <p className="font-mono text-[11px] tracking-widest text-slate-500">{todayStamp()} · in progress</p>
            <h2 className="font-hand mt-1 text-3xl text-slate-900">What I&apos;m building right now</h2>
            <ul className="mt-5 space-y-5">
              {nowBuilding.map((b) => (
                <li key={b.title} className="border-b border-dashed border-slate-300 pb-4 last:border-0 last:pb-0">
                  <p className="font-semibold text-slate-900">{b.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{b.desc}</p>
                  <p className="mt-1.5 font-mono text-[11px] tracking-wide text-orange-700">{b.tag}</p>
                </li>
              ))}
            </ul>
            <a href="#work" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-slate-900 underline decoration-orange-300 decoration-2 underline-offset-4 hover:text-orange-800">
              See the work below <ArrowDown size={15} />
            </a>
          </motion.aside>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <p className="font-hand text-2xl text-slate-600">what are you looking for?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { label: "Top projects", href: "#work" },
              { label: "Companies", href: "#companies" },
              { label: "Research", href: "#research" },
              { label: "Journey", href: "#journey" },
              { label: "Contact", href: "#contact" },
            ].map((l) => (
              <a key={l.href} href={l.href} className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-orange-400 hover:text-orange-800">
                {l.label}
              </a>
            ))}
          </div>
          <p className="mt-5 flex items-center gap-1.5 text-sm font-medium text-slate-500">
            <MapPin size={14} className="text-orange-600" aria-hidden />
            {profile.location}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

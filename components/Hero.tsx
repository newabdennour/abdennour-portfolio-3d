"use client";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDown, Download, MapPin, Zap, Brain, Layers, Smartphone } from "lucide-react";
import { profile } from "@/data/portfolio";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-9, 9]);

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section id="top" ref={ref} onMouseMove={onMove} className="relative flex min-h-screen items-center justify-center overflow-hidden pt-28 pb-16">
      {/* backdrop layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(99,102,241,0.22),transparent_70%)]" />
      <HeroCanvas />
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-cyan-500/15 blur-[130px] animate-aurora" />
      <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-fuchsia-600/15 blur-[130px] animate-aurora" />

      <motion.div
        style={{ rotateX, rotateY }}
        className="preserve-3d container-x relative z-10 max-w-5xl text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease }}
          className="inline-flex items-center gap-2.5 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-5 py-2 text-sm font-medium text-cyan-200 backdrop-blur-xl shadow-glow"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
          </span>
          <Zap size={14} />
          Available for AI & Full-Stack missions
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-slate-400"
        >
          <MapPin size={13} className="text-fuchsia-300" />
          {profile.location}
        </motion.p>

        <h1 className="mt-4 font-display font-bold leading-[0.95] tracking-tight">
          <motion.span
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease }}
            className="block text-[clamp(3rem,9vw,6.5rem)] text-white drop-shadow-2xl"
          >
            GUERROUDJ
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease }}
            className="shimmer-text block text-[clamp(3rem,9vw,6.5rem)]"
          >
            ABDENNOUR
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease }}
          className="mx-auto mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-slate-300"
        >
          Transforming complex challenges into elegant{" "}
          <span className="font-semibold text-white">AI-powered solutions</span> — RAG
          systems, LLM apps, mobile experiences & data intelligence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#work" className="btn-primary group w-full sm:w-auto">
            View My Work
            <ArrowDown size={17} className="transition-transform group-hover:translate-y-1" />
          </a>
          <a href={profile.cv} download className="btn-ghost w-full sm:w-auto">
            <Download size={17} />
            Download Resume
          </a>
        </motion.div>

        {/* floating chips */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 hidden justify-between lg:flex">
          {[
            { icon: Brain, label: "LLM • RAG", cls: "animate-float -ml-10" },
            { icon: Layers, label: "Next.js • 3D", cls: "animate-float-slow -mr-10" },
          ].map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.2 }}
              className={`glass flex items-center gap-2 rounded-2xl px-4 py-3 text-sm text-white/85 shadow-card ${c.cls}`}
              style={{ transform: `translateZ(70px)` }}
            >
              <c.icon size={16} className="text-cyan-300" />
              {c.label}
            </motion.div>
          ))}
        </div>

        {/* stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease }}
          className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4"
        >
          {profile.stats.map((s, i) => (
            <div key={i} className="glass group rounded-2xl px-4 py-5 transition-all duration-300 hover:scale-[1.04] hover:border-cyan-400/30 hover:shadow-glow" style={{ transform: "translateZ(40px)" }}>
              <p className="font-display text-3xl font-bold text-white">
                {s.raw ? s.value : `${s.value}${s.suffix}`}
              </p>
              <p className="mt-1 text-xs uppercase tracking-widest text-slate-400">{s.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.a
          href="#work"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="mx-auto mt-12 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/5 text-white/60 backdrop-blur-xl hover:text-white"
          aria-label="Scroll"
        >
          <ArrowDown size={18} />
        </motion.a>

        <div className="mt-6 flex items-center justify-center gap-2 text-slate-500">
          <Smartphone size={13} />
          <span className="text-xs tracking-wide">Scroll to explore the 3D universe</span>
        </div>
      </motion.div>
    </section>
  );
}

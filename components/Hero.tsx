"use client";
import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, Download, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { profile } from "@/data/portfolio";

const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as const;

function CountUp({ value, suffix = "", raw = false }: { value: number; suffix?: string; raw?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || !ref.current) return;
    if (reduce) {
      ref.current.textContent = raw ? String(value) : `${value}${suffix}`;
      return;
    }
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current)
          ref.current.textContent = raw ? String(Math.round(v)) : `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, suffix, raw]);

  return <span ref={ref}>{raw ? "0" : `0${suffix}`}</span>;
}

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

export default function Hero() {
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const yRaw = useTransform(scrollY, [0, 600], reduce ? [0, 0] : [0, 80]);
  const opacityRaw = useTransform(scrollY, [0, 500], reduce ? [1, 1] : [1, 0.25]);
  const y = useSpring(yRaw, { stiffness: 120, damping: 24, mass: 0.6 });
  const opacity = useSpring(opacityRaw, { stiffness: 120, damping: 24 });
  return (
    <section id="top" className="relative bg-white pt-32 pb-20 md:pt-40 md:pb-28">

      <motion.div style={{ y, opacity }} className="container-x relative z-10 max-w-4xl text-center">
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
            className="block text-[clamp(1.5rem,3.5vw,2.25rem)] font-semibold tracking-tight text-blue-700"
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
          <Magnetic>
            <a href="#work" className="btn-primary btn-shine group w-full sm:w-auto">
              View My Work
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </a>
          </Magnetic>
          <Magnetic>
            <a href={profile.cv} download className="btn-ghost w-full sm:w-auto">
              <Download size={17} />
              Download Resume
            </a>
          </Magnetic>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.62 }}
          className="mt-5 flex items-center justify-center gap-1.5 text-sm font-medium text-slate-500"
        >
          <MapPin size={14} className="text-blue-500" aria-hidden />
          {profile.location}
        </motion.p>

        <div className="mx-auto mt-10 grid max-w-4xl items-center gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.68, ease }}
              className="mx-auto mt-0 max-w-3xl"
            >
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200/70 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.12)] md:grid-cols-4">
            {profile.stats.map((s, i) => (
              <div key={i} className="bg-white px-4 py-5 text-center">
                <dd className="font-display text-3xl font-bold tracking-tight text-slate-900">
                  <CountUp value={s.value} suffix={s.suffix} raw={s.raw} />
                </dd>
                <dt className="mt-1 text-[11px] font-medium uppercase tracking-widest text-slate-500">
                  {s.label}
                </dt>
              </div>
            ))}
            </dl>
            </motion.div>
          </div>
          <Hero3D />
        </div>

        <motion.a
          href="#work"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="mx-auto mt-12 grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition hover:text-blue-600"
          aria-label="Scroll to work"
        >
          <ArrowDown size={17} />
        </motion.a>
      </motion.div>
    </section>
  );
}

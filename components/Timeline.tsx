"use client";
import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { Award, ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { timeline } from "@/data/portfolio";

export default function Timeline() {
  const lineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ["start 0.8", "end 0.55"],
  });
  return (
    <section id="journey" className="relative bg-white/80 py-24 backdrop-blur-sm">
      <div className="container-x relative">
        <SectionHeading
          title={<>Certifications & Experience</>}
          subtitle="Validated by industry leaders — telecoms, energy, academia and global platforms. Click any card to view the certificate."
        />

        <div ref={lineRef} className="relative mx-auto max-w-3xl">
          <div className="absolute bottom-0 left-6 top-0 w-px bg-slate-200 md:left-1/2 md:-translate-x-1/2" />
          <motion.div
            aria-hidden
            style={{ scaleY: scrollYProgress }}
            className="absolute bottom-0 left-6 top-0 w-px origin-top bg-gradient-to-b from-blue-600 via-indigo-500 to-violet-600 md:left-1/2 md:-translate-x-1/2"
          />
          <div className="space-y-4">
            {timeline.map((t, i) => (
              <motion.a
                key={t.title}
                href={t.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.3) }}
                className={`group relative flex items-center gap-4 rounded-2xl bg-white p-5 pl-6 shadow-[0_10px_28px_-16px_rgba(15,23,42,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-16px_rgba(37,99,235,0.3)] md:w-[calc(50%-2rem)] ${
                  i % 2 === 0 ? "md:mr-auto" : "md:ml-auto"
                }`}
              >
                <span className={`absolute top-1/2 hidden h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-blue-600 ring-4 ring-blue-100 md:block ${
                  i % 2 === 0 ? "-right-[2.4rem]" : "-left-[2.4rem]"
                }`} />
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <Award size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-blue-600">{t.year} — {t.company}</span>
                  <span className="mt-0.5 block font-display text-[15px] font-bold leading-snug tracking-tight text-slate-900 text-balance">
                    {t.title}
                  </span>
                </span>
                <ArrowUpRight size={16} className="shrink-0 text-slate-300 transition-all group-hover:text-blue-600" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

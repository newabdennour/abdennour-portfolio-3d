"use client";
import { motion } from "framer-motion";
import { Award, ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { timeline } from "@/data/portfolio";

export default function Timeline() {
  return (
    <section id="journey" className="relative bg-white py-24">
      <div className="container-x relative">
        <SectionHeading
          eyebrow="Credentials"
          title={<>Certifications & Experience</>}
          subtitle="Validated by industry leaders — telecoms, energy, academia and global platforms. Click any card to view the certificate."
        />

        <div className="relative mx-auto max-w-3xl">
          <div className="absolute bottom-0 left-6 top-0 w-px bg-gradient-to-b from-blue-500 via-indigo-400 to-violet-400 md:left-1/2 md:-translate-x-1/2" />
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
                className={`group relative flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 pl-6 shadow-[0_8px_24px_-14px_rgba(15,23,42,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_40px_-16px_rgba(37,99,235,0.3)] md:w-[calc(50%-2rem)] ${
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
                  <span className="mt-0.5 block truncate font-display text-[15px] font-bold tracking-tight text-slate-900">
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

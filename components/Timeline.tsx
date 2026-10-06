"use client";
import { motion } from "framer-motion";
import { Award, ExternalLink, BadgeCheck } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { timeline } from "@/data/portfolio";

export default function Timeline() {
  return (
    <section id="journey" className="relative py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_30%,rgba(34,211,238,0.08),transparent_70%)]" />
      <div className="container-x relative">
        <SectionHeading
          eyebrow="Credentials"
          title={<>Certifications & <span className="text-gradient-neon">Experience</span></>}
          subtitle="Validated by industry leaders — telecoms, energy, academia and global platforms. Click any card to view the certificate."
        />

        <div className="relative mx-auto max-w-3xl">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400 via-violet-400 to-fuchsia-400 opacity-40 md:-translate-x-1/2" />
          <div className="space-y-5">
            {timeline.map((t, i) => (
              <motion.a
                key={t.title}
                href={t.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30, x: i % 2 === 0 ? -24 : 24 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: Math.min(i * 0.05, 0.3) }}
                whileHover={{ scale: 1.02 }}
                className={`group relative flex items-center gap-5 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-5 backdrop-blur-xl transition-all hover:border-cyan-400/30 hover:shadow-glow md:w-[calc(50%-2rem)] ${
                  i % 2 === 0 ? "md:mr-auto" : "md:ml-auto"
                }`}
              >
                <span className={`absolute top-1/2 hidden h-3 w-3 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-400 shadow-glow md:block ${
                  i % 2 === 0 ? "-right-[2.35rem]" : "-left-[2.35rem]"
                }`} style={{ transform: "translateY(-50%)" }} />
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-500/25 to-violet-500/25 text-cyan-300 ring-1 ring-white/10 transition-all group-hover:from-cyan-400 group-hover:to-violet-500 group-hover:text-white">
                  <Award size={22} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400/12 border border-cyan-400/25 px-2.5 py-0.5 text-[11px] font-bold text-cyan-200">
                    <BadgeCheck size={11} /> {t.year} — {t.company}
                  </span>
                  <span className="mt-1.5 block truncate font-display text-base font-bold text-white group-hover:text-cyan-100">
                    {t.title}
                  </span>
                </span>
                <ExternalLink size={16} className="shrink-0 text-slate-500 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan-300" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

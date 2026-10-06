"use client";
import { motion } from "framer-motion";
import { Brain, Code2, Cpu, Database, Globe, Smartphone } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { skills } from "@/data/portfolio";

const expertise = [
  { icon: Brain, title: "LLM Engineering", desc: "RAG pipelines, agents, evaluation harnesses" },
  { icon: Code2, title: "Full-Stack Web", desc: "Next.js, APIs, vector search, realtime UX" },
  { icon: Smartphone, title: "Mobile AI", desc: "Flutter apps with cloud intelligence" },
  { icon: Database, title: "Data Science", desc: "Forecasting, ensembles, signal processing" },
  { icon: Cpu, title: "ML Systems", desc: "Training loops, optimization, deployment" },
  { icon: Globe, title: "Cloud & DevOps", desc: "Scalable hosting, CI/CD, observability" },
];

export default function About() {
  return (
    <section id="about" className="relative bg-slate-50 py-24">
      <div className="container-x relative">
        <SectionHeading
          eyebrow="About"
          title={<>Engineering intelligence into products</>}
          subtitle="I bridge AI research and shippable software — focused on quality, speed and measurable outcomes."
        />

        <div className="grid gap-5 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.1)] lg:col-span-2"
          >
            <h3 className="font-display text-2xl font-bold tracking-tight text-slate-900">Hello — I&apos;m Abdennour</h3>
            <p className="mt-4 leading-relaxed text-slate-600">
              Passionate AI engineer and full-stack developer transforming complex challenges
              into innovative, scalable solutions — from retrieval-augmented generation to
              3D mobile experiences.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              With a strong foundation in machine learning, software architecture and
              user-centered design, I bridge the gap between theoretical AI concepts and
              practical, real-world applications for ministries, telecoms and startups.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["RAG", "Agents", "Next.js", "Flutter", "Whisper", "FAISS", "Gemini", "PyTorch"].map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl bg-slate-900 p-8 text-white shadow-[0_20px_50px_-20px_rgba(15,23,42,0.5)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Core strengths</p>
            <div className="mt-5 space-y-4">
              {skills.slice(0, 4).map((s) => (
                <div key={s.name}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-100">{s.name}</span>
                    <span className="font-display font-bold text-blue-300">{s.level}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-blue-400 to-violet-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {expertise.map((e, i) => (
            <motion.div
              key={e.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.07 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-16px_rgba(37,99,235,0.3)]"
            >
              <span className="inline-grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <e.icon size={20} />
              </span>
              <h4 className="mt-4 font-display text-base font-bold tracking-tight text-slate-900">{e.title}</h4>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{e.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.1)]">
          <h3 className="font-display text-lg font-bold tracking-tight text-slate-900">Technical proficiency</h3>
          <div className="mt-6 grid gap-x-8 gap-y-5 md:grid-cols-2">
            {skills.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-800">
                    {s.name}
                    <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">{s.tag}</span>
                  </span>
                  <span className="font-display font-bold text-blue-600">{s.level}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

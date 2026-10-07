"use client";
import { motion } from "framer-motion";
import { Brain, Code2, Cpu, Database, Globe, Smartphone } from "lucide-react";
import SectionHeading from "./SectionHeading";

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
    <section id="about" className="relative bg-slate-50/80 py-24 backdrop-blur-sm">
      <div className="container-x relative">
        <SectionHeading
          title={<>Engineering intelligence into products</>}
          subtitle="I bridge AI research and shippable software — focused on quality, speed and measurable outcomes."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl bg-white p-8 shadow-[0_10px_28px_-14px_rgba(15,23,42,0.14)] sm:p-10"
        >
          <h3 className="font-display text-2xl font-bold tracking-tight text-slate-900">Hello — I&apos;m Abdennour</h3>
          <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">
            Passionate AI engineer and full-stack developer transforming complex challenges
            into innovative, scalable solutions — from retrieval-augmented generation to
            3D mobile experiences.
          </p>
          <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">
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

        <div className="mt-5 overflow-hidden rounded-2xl bg-white shadow-[0_10px_28px_-14px_rgba(15,23,42,0.14)]">
          <ul className="grid gap-px bg-slate-200/70 sm:grid-cols-2 lg:grid-cols-3">
            {expertise.map((e, i) => (
              <motion.li
                key={e.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.07 }}
                className="bg-white p-6 transition-colors duration-300 hover:bg-blue-50/60"
              >
                <span className="inline-grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <e.icon size={20} />
                </span>
                <h4 className="mt-4 font-display text-base font-bold tracking-tight text-slate-900">{e.title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{e.desc}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

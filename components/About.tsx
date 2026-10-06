"use client";
import { motion } from "framer-motion";
import { Brain, Code2, Cpu, Database, Globe, Smartphone } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { skills } from "@/data/portfolio";

const expertise = [
  { icon: Brain, title: "LLM Engineering", desc: "RAG pipelines, agents, fine-tuning & eval harnesses", grad: "from-cyan-400 to-blue-600" },
  { icon: Code2, title: "Full-Stack Web", desc: "Next.js 14, APIs, vector search & realtime UX", grad: "from-violet-400 to-purple-600" },
  { icon: Smartphone, title: "Mobile AI", desc: "Flutter apps with on-device + cloud intelligence", grad: "from-fuchsia-400 to-pink-600" },
  { icon: Database, title: "Data Science", desc: "Forecasting, ensembles & signal processing", grad: "from-emerald-400 to-teal-600" },
  { icon: Cpu, title: "ML Systems", desc: "Training loops, optimization & deployment", grad: "from-amber-400 to-orange-600" },
  { icon: Globe, title: "Cloud & DevOps", desc: "Scalable hosting, CI/CD & observability", grad: "from-sky-400 to-indigo-600" },
];

export default function About() {
  return (
    <section id="about" className="relative py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_20%_40%,rgba(139,92,246,0.1),transparent_70%)]" />
      <div className="container-x relative">
        <SectionHeading
          eyebrow="About"
          title={<>Engineering intelligence <span className="text-gradient-neon">into products</span></>}
          subtitle="I bridge cutting-edge AI research and shippable software — obsessed with speed, polish and measurable outcomes."
        />

        <div className="grid gap-6 md:grid-cols-3 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 md:col-span-2 relative overflow-hidden group"
          >
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/15 blur-[80px] transition-all group-hover:bg-cyan-500/25" />
            <h3 className="font-display text-2xl font-bold text-white">Hello — I&apos;m Abdennour</h3>
            <p className="mt-4 leading-relaxed text-slate-300">
              Passionate AI engineer and full-stack developer transforming complex challenges
              into innovative, scalable solutions. My work focuses on leveraging cutting-edge
              technologies — from retrieval-augmented generation to 3D mobile experiences —
              to create meaningful impact.
            </p>
            <p className="mt-4 leading-relaxed text-slate-400">
              With a strong foundation in machine learning, software architecture and
              user-centered design, I bridge the gap between theoretical AI concepts and
              practical, real-world applications for ministries, telecoms, and startups.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["RAG", "Agents", "Next.js", "Flutter", "Whisper", "FAISS", "Gemini", "PyTorch"].map((t) => (
                <span key={t} className="chip text-slate-200">✦ {t}</span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-8 shadow-glow-lg"
          >
            <div className="absolute inset-0 grid-bg opacity-40" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 animate-spin rounded-full border border-dashed border-white/30" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 animate-spin-reverse rounded-full border border-white/20" />
            <p className="relative text-xs font-bold uppercase tracking-[0.3em] text-white/70">Core stack</p>
            <p className="relative mt-3 font-display text-4xl font-bold leading-tight text-white">
              Python<br />97%<br />
              <span className="text-lg font-medium text-white/80">AI Engineering 94%</span>
            </p>
            <div className="relative mt-6 space-y-2.5">
              {skills.slice(0, 3).map((s) => (
                <div key={s.name}>
                  <div className="mb-1 flex justify-between text-xs font-semibold text-white/90">
                    <span>{s.name}</span><span>{s.level}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mb-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {expertise.map((e, i) => (
            <motion.div
              key={e.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.08 }}
              whileHover={{ y: -6, scale: 1.015 }}
              className="glass group rounded-3xl p-6 transition-all hover:border-cyan-400/25 hover:shadow-glow"
            >
              <span className={`inline-grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${e.grad} text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                <e.icon size={20} />
              </span>
              <h4 className="mt-4 font-display text-lg font-bold text-white">{e.title}</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{e.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="glass rounded-3xl p-8">
          <h3 className="font-display text-xl font-bold text-white">Technical proficiency</h3>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {skills.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-slate-200">
                    {s.name} <span className="ml-2 rounded-full bg-white/8 border border-white/10 px-2 py-0.5 text-[11px] text-slate-400">{s.tag}</span>
                  </span>
                  <span className="font-display text-sm font-bold text-cyan-300">{s.level}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/8">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.3, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 shadow-glow"
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

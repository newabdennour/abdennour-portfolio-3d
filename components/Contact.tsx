"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mail, Github, Linkedin, CheckCircle2, Loader2 } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { profile } from "@/data/portfolio";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const validate = () => {
    const e = { name: "", email: "", message: "" };
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email is invalid";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return !e.name && !e.email && !e.message;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    }, 1200);
  };

  const cards = [
    { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}`, grad: "from-cyan-500 to-blue-600" },
    { icon: Github, label: "GitHub", value: "@AbdennourGuerroudj", href: profile.github, grad: "from-slate-600 to-slate-800" },
    { icon: Linkedin, label: "LinkedIn", value: "Abdennour Guerroudj", href: profile.linkedin, grad: "from-blue-600 to-indigo-700" },
  ];

  return (
    <section id="contact" className="relative overflow-hidden py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0628] to-void" />
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/12 blur-[160px]" />
      <div className="container-x relative">
        <SectionHeading
          eyebrow="Contact"
          title={<>Let&apos;s build <span className="text-gradient-neon">something epic</span></>}
          subtitle="Have an AI product, RAG system or standout experience in mind? My inbox is always open."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass-deep rounded-3xl p-8 shadow-card"
            noValidate
          >
            {(["name", "email", "message"] as const).map((f) => (
              <div key={f} className="mb-5">
                <label className="mb-2 block text-sm font-semibold capitalize text-slate-200">{f}</label>
                {f === "message" ? (
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your project..."
                    className={`w-full resize-none rounded-2xl border bg-white/5 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400/60 focus:shadow-glow ${errors.message ? "border-red-500/70" : "border-white/10"}`}
                  />
                ) : (
                  <input
                    type={f === "email" ? "email" : "text"}
                    value={form[f]}
                    onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                    placeholder={f === "name" ? "Your name" : "your.email@example.com"}
                    className={`w-full rounded-2xl border bg-white/5 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400/60 focus:shadow-glow ${errors[f] ? "border-red-500/70" : "border-white/10"}`}
                  />
                )}
                {errors[f] && <p className="mt-1.5 text-xs font-medium text-red-400">{errors[f]}</p>}
              </div>
            ))}
            <button type="submit" disabled={status === "sending"} className="btn-primary w-full disabled:opacity-60">
              {status === "sending" ? (
                <><Loader2 size={17} className="animate-spin" /> Sending...</>
              ) : status === "sent" ? (
                <><CheckCircle2 size={17} /> Message Sent — I&apos;ll reply soon!</>
              ) : (
                <><Send size={17} /> Send Message</>
              )}
            </button>
            <AnimatePresence>
              {status === "sent" && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-center text-sm font-medium text-emerald-300"
                >
                  Thanks for reaching out — this demo stores nothing, but please email me directly at {profile.email}.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <div className="glass rounded-3xl p-7">
              <h3 className="font-display text-xl font-bold text-white">Contact information</h3>
              <p className="mt-2 text-slate-400">Prefer direct channels? Reach me here — I reply within 24h.</p>
            </div>
            {cards.map((c) => (
              <motion.a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                whileHover={{ x: 6, scale: 1.01 }}
                className="glass group flex items-center gap-4 rounded-3xl p-5 transition-all hover:border-cyan-400/30 hover:shadow-glow"
              >
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${c.grad} text-white shadow-lg`}>
                  <c.icon size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-white">{c.label}</span>
                  <span className="block truncate text-sm text-slate-400 group-hover:text-slate-200">{c.value}</span>
                </span>
              </motion.a>
            ))}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-600 via-indigo-600 to-fuchsia-600 p-7 shadow-glow-lg">
              <div className="absolute inset-0 grid-bg opacity-30" />
              <p className="relative font-display text-2xl font-bold text-white">Have a role or freelance mission?</p>
              <p className="relative mt-2 text-white/80">Download my resume and let&apos;s talk this week.</p>
              <a href={profile.cv} download className="relative mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:scale-105">
                Download CV
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

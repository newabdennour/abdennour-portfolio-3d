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
      setTimeout(() => setStatus("idle"), 4500);
    }, 1100);
  };

  const cards = [
    { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { icon: Github, label: "GitHub", value: "@AbdennourGuerroudj", href: profile.github },
    { icon: Linkedin, label: "LinkedIn", value: "Abdennour Guerroudj", href: profile.linkedin },
  ];

  const inputCls = (bad: boolean) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
      bad ? "border-red-400" : "border-slate-200"
    }`;

  return (
    <section id="contact" className="relative bg-slate-50/80 py-24 backdrop-blur-sm">
      <div className="container-x relative">
        <SectionHeading
          title={<>Let&apos;s work together</>}
          subtitle="Have an AI product, RAG system or standout experience in mind? My inbox is always open."
        />

        <div className="grid gap-5 lg:grid-cols-5">
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl bg-white p-7 shadow-[0_10px_28px_-14px_rgba(15,23,42,0.14)] lg:col-span-3"
            noValidate
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="mb-1.5 block text-sm font-semibold text-slate-700">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className={inputCls(!!errors.name)}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "contact-name-error" : undefined}
                />
                {errors.name && <p id="contact-name-error" role="alert" className="mt-1.5 text-xs font-medium text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-1.5 block text-sm font-semibold text-slate-700">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className={inputCls(!!errors.email)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "contact-email-error" : undefined}
                />
                {errors.email && <p id="contact-email-error" role="alert" className="mt-1.5 text-xs font-medium text-red-600">{errors.email}</p>}
              </div>
            </div>
            <div className="mt-5">
              <label htmlFor="contact-message" className="mb-1.5 block text-sm font-semibold text-slate-700">Message</label>
              <textarea
                id="contact-message"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell me about your project..."
                className={`${inputCls(!!errors.message)} resize-none`}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "contact-message-error" : undefined}
              />
              {errors.message && <p id="contact-message-error" role="alert" className="mt-1.5 text-xs font-medium text-red-600">{errors.message}</p>}
            </div>
            <button type="submit" disabled={status === "sending"} className="btn-primary btn-shine mt-6 w-full disabled:opacity-60">
              {status === "sending" ? (
                <><Loader2 size={17} className="animate-spin" /> Sending...</>
              ) : status === "sent" ? (
                <><CheckCircle2 size={17} /> Message sent successfully</>
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
                  className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-700"
                >
                  Thank you — please also reach me directly at {profile.email}.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-4 lg:col-span-2"
          >
            {cards.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl bg-white p-5 shadow-[0_10px_28px_-16px_rgba(15,23,42,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-16px_rgba(37,99,235,0.3)]"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-900 text-white transition-colors group-hover:bg-blue-600">
                  <c.icon size={19} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-slate-900">{c.label}</span>
                  <span className="block truncate text-sm text-slate-500">{c.value}</span>
                </span>
              </a>
            ))}
            <div className="rounded-2xl bg-slate-900 p-7 text-white">
              <p className="font-display text-xl font-bold tracking-tight">Prefer the short version?</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Download my resume and let&apos;s schedule a call this week.
              </p>
              <a href={profile.cv} download className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-blue-50">
                Download CV
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

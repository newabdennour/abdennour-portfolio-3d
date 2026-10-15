"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import ChatPanel from "./ChatPanel";

const SYSTEM = `You are the portfolio assistant for Guerroudj Abdennour — AI & Full-Stack Developer (Algeria, remote worldwide).
Answer concisely with markdown. Only answer about him, his work, and contact.

Profile: AI Engineer & Full-Stack. Email abdennour.guerroudj@ensia.edu.dz. GitHub newabdennour. 14+ AI projects, 7 certifications.
Top builds: FemtoCare medical multi-agent (triage/literature/safety), TEXA tourism explorer for Algeria Ministry of Tourism, E-Store Manager for Algérie Poste, Ramy Insights sentiment engine, Voxtra speech-to-text + AI summarization, Ministry RAG systems, BMS warehouse app, oil & gas forecasting, sleep-stage classification.
Stack: Next.js, TypeScript, Python, LangChain, RAG, LLMs, Flutter, Firebase.
Worked with: FEMTO-ST, MESRS, APN, Algérie Poste, Algérie Télécom, Sonatrach, Univ. of Montreal, BMS, Ramy.
Hire CTA: invite them to use the contact section or email him.`;

export default function AssistantFab() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="fab-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[88] bg-slate-950/25 backdrop-blur-[2px]"
            aria-hidden
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="fab-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Portfolio assistant"
            initial={{ opacity: 0, y: 32, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed bottom-20 right-4 z-[90] flex h-[540px] max-h-[72vh] w-[min(92vw,360px)] flex-col overflow-hidden rounded-3xl border border-white/40 bg-white/95 shadow-[0_40px_90px_-20px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:right-5"
          >
            <div className="flex shrink-0 items-center gap-2.5 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 px-4 py-3">
              <span className="relative grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 text-white shadow-lg">
                <Sparkles size={15} />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-emerald-400" />
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block text-[13px] font-bold tracking-tight text-white">Abdennour AI</span>
                <span className="block text-[10px] font-medium text-slate-300">Online · asks about me</span>
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
                className="ml-auto grid h-7 w-7 place-items-center rounded-full text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <X size={15} />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <ChatPanel
                system={SYSTEM}
                title="Ask about Abdennour"
                subtitle="Portfolio assistant"
                accent="blue"
                bare
                samples={[]}
                placeholder="Ask about projects, skills, contact…"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close portfolio assistant" : "Open portfolio assistant"}
        aria-expanded={open}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        animate={open ? { rotate: 90 } : { rotate: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        className="fixed bottom-5 right-5 z-[91] grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-800 text-white shadow-[0_14px_36px_-8px_rgba(30,27,75,0.65)] ring-1 ring-white/20"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "spark"}
            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
            transition={{ duration: 0.16 }}
            className="grid place-items-center"
          >
            {open ? <X size={18} /> : <Sparkles size={19} />}
          </motion.span>
        </AnimatePresence>
        {!open && (
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-indigo-500/30" aria-hidden="true" />
        )}
      </motion.button>
    </>
  );
}

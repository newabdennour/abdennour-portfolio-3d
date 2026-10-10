"use client";
import { useEffect, useState } from "react";
import { Bot, X } from "lucide-react";
import ChatPanel from "./ChatPanel";

const SYSTEM = `You are the portfolio assistant for Guerroudj Abdennour — AI & Full-Stack Developer (Algeria, remote worldwide).
Answer concisely with markdown. Only answer about him, his work, and contact.

Profile: AI Engineer & Full-Stack. Email guerroudjabdennour1@gmail.com. GitHub AbdennourGuerroudj. 14+ AI projects, 7 certifications.
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
  }, [open ]);

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-[90] h-[520px] max-h-[70vh] w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_30px_80px_-20px_rgba(15,23,42,0.5)]">
          <button
            onClick={() => setOpen(false)}
            aria-label="Close assistant"
            className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            <X size={16} />
          </button>
          <ChatPanel
            system={SYSTEM}
            title="Ask about Abdennour"
            subtitle="Portfolio assistant"
            accent="blue"
            placeholder="Ask about projects, skills, contact…"
            samples={["What are his top AI projects?", "What certifications does he have?", "How do I contact him?"]}
          />
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close portfolio assistant" : "Open portfolio assistant"}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-[80] grid h-14 w-14 place-items-center rounded-full bg-slate-900 text-white shadow-[0_16px_40px_-10px_rgba(15,23,42,0.6)] transition hover:bg-slate-700"
      >
        {open ? <X size={22} /> : <Bot size={24} />}
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" aria-hidden="true" />
        )}
      </button>
    </>
  );
}

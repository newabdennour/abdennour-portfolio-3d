"use client";
import { Github, Linkedin, Mail, ArrowUp, Heart } from "lucide-react";
import { profile } from "@/data/portfolio";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/8 bg-black/40 py-12 backdrop-blur-xl">
      <div className="container-x">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <p className="font-display text-xl font-bold text-white">{profile.name}</p>
            <p className="mt-1 text-sm text-slate-400">AI Engineer & Full-Stack Developer — crafting intelligent experiences.</p>
          </div>
          <div className="flex items-center gap-3">
            {[
              { icon: Github, href: profile.github, label: "GitHub" },
              { icon: Linkedin, href: profile.linkedin, label: "LinkedIn" },
              { icon: Mail, href: `mailto:${profile.email}`, label: "Email" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition-all hover:scale-110 hover:border-cyan-400/40 hover:text-white hover:shadow-glow"
              >
                <s.icon size={18} />
              </a>
            ))}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 text-white shadow-glow transition hover:scale-110"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/8 pt-6 text-xs text-slate-500 md:flex-row">
          <p>© 2026 {profile.name}. All rights reserved.</p>
          <p className="inline-flex items-center gap-1.5">
            Built with <Heart size={12} className="text-fuchsia-400" /> Next.js • Three.js • Framer Motion
          </p>
        </div>
      </div>
    </footer>
  );
}

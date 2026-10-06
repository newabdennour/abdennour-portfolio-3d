"use client";
import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";
import { profile } from "@/data/portfolio";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10">
      <div className="container-x">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <p className="font-display text-lg font-bold tracking-tight text-slate-900">{profile.name}</p>
            <p className="mt-1 text-sm text-slate-500">AI Engineer & Full-Stack Developer</p>
          </div>
          <div className="flex items-center gap-2.5">
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
                className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-500 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600"
              >
                <s.icon size={17} />
              </a>
            ))}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white transition hover:bg-blue-600"
            >
              <ArrowUp size={17} />
            </button>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-slate-100 pt-6 text-xs text-slate-400 md:flex-row">
          <p>© 2026 {profile.name}. All rights reserved.</p>
          <p>Built with Next.js · Three.js · Space Grotesk</p>
        </div>
      </div>
    </footer>
  );
}

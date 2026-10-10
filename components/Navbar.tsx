"use client";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Work", href: "#work" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      <motion.div className="fixed left-0 top-0 z-[90] h-[2px] w-full origin-left bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600" style={{ scaleX: progress }} />
      <header className={`fixed inset-x-0 top-0 z-[85] transition-all duration-300 ${scrolled ? "py-3" : "py-4"}`}>
        <div className="container-x">
          <nav
            aria-label="Primary"
            className={`flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-300 ${
              scrolled
                ? "border border-slate-200 bg-white/85 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.15)] backdrop-blur-xl"
                : "border border-transparent bg-transparent"
            }`}
          >
            <a href="#top" className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 font-display text-lg font-bold text-white">
                G
              </span>
              <span className="leading-tight">
                <span className="block font-display text-sm font-bold tracking-wide text-slate-900">
                  GUERROUDJ ABDENNOUR
                </span>
                <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-blue-600">
                  AI Engineer
                </span>
              </span>
            </a>

            <div className="hidden items-center gap-1 md:flex">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#contact"
                className="ml-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Hire Me
              </a>
            </div>

            <button
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 md:hidden"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </nav>

          {open && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl md:hidden"
            >
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-1 rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Hire Me
              </a>
            </motion.div>
          )}
        </div>
      </header>
    </>
  );
}

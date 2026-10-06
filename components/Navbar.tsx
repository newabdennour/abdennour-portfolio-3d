"use client";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";

const links = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
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

  return (
    <>
      <motion.div className="fixed left-0 top-0 z-[90] h-[2px] w-full origin-left bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400" style={{ scaleX: progress }} />
      <header
        className={`fixed inset-x-0 top-0 z-[85] transition-all duration-500 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <div className="container-x">
          <nav
            className={`flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500 ${
              scrolled ? "glass shadow-card" : "border border-transparent"
            }`}
          >
            <a href="#top" className="group flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 font-display text-lg font-bold text-white shadow-glow transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                G
              </span>
              <span className="leading-tight">
                <span className="block font-display text-sm font-bold tracking-wide text-white">
                  GUERROUDJ ABDENNOUR
                </span>
                <span className="block text-[11px] uppercase tracking-[0.24em] text-cyan-300/80">
                  AI Engineer
                </span>
              </span>
            </a>

            <div className="hidden items-center gap-1 md:flex">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#contact"
                className="ml-2 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-950 transition hover:scale-105 hover:shadow-glow"
              >
                <Sparkles size={15} />
                Hire Me
              </a>
            </div>

            <button
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white md:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </nav>

          {open && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass mt-2 flex flex-col gap-1 rounded-2xl p-3 md:hidden"
            >
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/10"
                >
                  {l.label}
                </a>
              ))}
            </motion.div>
          )}
        </div>
      </header>
    </>
  );
}

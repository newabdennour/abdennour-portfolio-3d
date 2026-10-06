"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let v = 0;
    const t = setInterval(() => {
      v += Math.random() * 22 + 8;
      if (v >= 100) {
        v = 100;
        clearInterval(t);
        setTimeout(() => setDone(true), 450);
      }
      setProgress(Math.min(100, Math.floor(v)));
    }, 160);
    return () => clearInterval(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0, scale: 1.08, filter: "blur(12px)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void"
        >
          <div className="absolute inset-0 grid-bg opacity-60" />
          <div className="absolute h-72 w-72 rounded-full bg-violet-600/25 blur-[120px] animate-aurora" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative text-center"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-cyan-300">
              Initializing experience
            </p>
            <h1 className="mt-3 font-display text-5xl md:text-7xl font-bold text-white">
              GA<span className="text-gradient-neon">.</span>
            </h1>
            <div className="mx-auto mt-8 h-[3px] w-56 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-3 font-mono text-sm text-slate-500">{progress}%</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

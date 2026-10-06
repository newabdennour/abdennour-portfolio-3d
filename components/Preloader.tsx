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
        setTimeout(() => setDone(true), 400);
      }
      setProgress(Math.min(100, Math.floor(v)));
    }, 150);
    return () => clearInterval(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative text-center"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-blue-600">
              Guerroudj Abdennour
            </p>
            <h1 className="mt-3 font-display text-5xl md:text-6xl font-bold tracking-tight text-slate-900">
              Portfolio<span className="text-blue-600">.</span>
            </h1>
            <div className="mx-auto mt-8 h-[3px] w-56 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-3 font-mono text-sm text-slate-400">{progress}%</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorGlow() {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 120, damping: 20 });
  const sy = useSpring(y, { stiffness: 120, damping: 20 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const leave = () => setVisible(false);
    window.addEventListener("mousemove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  return (
    <>
      {/* large ambient glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed z-[5] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 md:opacity-100"
        style={{
          x: sx,
          y: sy,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, rgba(56,189,248,0.13) 0%, rgba(139,92,246,0.1) 32%, transparent 65%)",
          opacity: visible ? 1 : 0,
        }}
      />
      {/* tiny dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[80] hidden h-2 w-2 rounded-full bg-cyan-300 shadow-glow md:block"
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      />
    </>
  );
}

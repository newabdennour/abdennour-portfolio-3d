"use client";
import { useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";

export function useGlobalScrollSprings(): {
  scrollYProgress: MotionValue<number>;
  heroProgress: MotionValue<number>;
} {
  const { scrollY, scrollYProgress } = useScroll();
  const heroRaw = useTransform(scrollY, [0, 700], [0, 1]);
  const heroProgress = useSpring(heroRaw, { stiffness: 90, damping: 24 });
  return { scrollYProgress, heroProgress };
}

"use client";
import { useEffect } from "react";

// Always start at the top on (re)load instead of the browser
// restoring the previous scroll position mid-page.
// NOTE: layout.tsx also injects a <head> script that sets
// history.scrollRestoration = "manual" before paint — this component
// is the second layer (instant scroll + bfcache/hash handling).
export default function ScrollTop() {
  useEffect(() => {
    try {
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    } catch {
      /* noop */
    }

    const top = () => {
      // Temporarily disable CSS smooth-scroll so the reset is instant,
      // otherwise `scroll-behavior: smooth` animates from mid-page.
      const html = document.documentElement;
      const prev = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      } catch {
        window.scrollTo(0, 0);
      }
      html.style.scrollBehavior = prev;
    };

    // If URL has no hash, force top and drop any stale hash.
    // If it HAS a hash (#work etc.), respect it — that's intentional navigation.
    if (!window.location.hash) {
      top();
      // Re-apply after hydration/layout shift (images, dynamic imports).
      requestAnimationFrame(() => requestAnimationFrame(top));
      const onLoad = () => top();
      const onPageShow = (e: PageTransitionEvent) => {
        if (e.persisted && !window.location.hash) top();
      };
      window.addEventListener("load", onLoad);
      window.addEventListener("pageshow", onPageShow as EventListener);
      return () => {
        window.removeEventListener("load", onLoad);
        window.removeEventListener("pageshow", onPageShow as EventListener);
      };
    }
  }, []);
  return null;
}

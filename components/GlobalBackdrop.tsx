"use client";
import { useEffect, useState } from "react";

export function useWebGLAllowed() {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    // All 3D showcases are now static — keep WebGL off for speed.
    setAllowed(false);
  }, []);
  return allowed;
}

export default function GlobalBackdrop() {
  // Static CSS gradient only — no WebGL Canvas, no network, instant paint.
  return <div aria-hidden className="webgl-fallback pointer-events-none fixed inset-0 -z-10" />;
}

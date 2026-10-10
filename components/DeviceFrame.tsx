"use client";
import { Suspense, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, PresentationControls, ContactShadows } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { useWebGLAllowed } from "./GlobalBackdrop";

function useShowCanvas() {
  const allowed = useWebGLAllowed();
  const reduce = useReducedMotion();
  const [inView, setInView] = useState(false);
  const [glLost, setGlLost] = useState(false);
  const lostCount = useRef(0);
  // Context loss unmounts the Canvas (freeing the slot); retry remount a few
  // times with backoff so transient loss self-heals instead of staying dead.
  useEffect(() => {
    if (!glLost || lostCount.current >= 3) return;
    lostCount.current += 1;
    const t = setTimeout(() => setGlLost(false), 2500 * lostCount.current);
    return () => clearTimeout(t);
  }, [glLost]);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches
  );
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onR = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onR);
    const el = ref.current;
    let io: IntersectionObserver | null = null;
    if (el) {
      io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
      io.observe(el);
    }
    return () => { window.removeEventListener("resize", onR); io?.disconnect(); };
  }, []);
  const show = allowed && !reduce && !glLost && inView && !isMobile;
  return { ref, show, setGlLost };
}

const YAW_LIMIT = 0.52; // ±30° user drag + ±10° sway = ±40° total, never 360°
const FREE_ZONE = 0.17; // ±10° hands-free sway
const PITCH_LIMIT = 0.35;
const DRAG_YAW_SPEED = 0.008;
const DRAG_PITCH_SPEED = 0.005;
const BUTTON_STEP = 0.26;

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

type SpinControls = {
  yawRef: React.MutableRefObject<number>;
  pitchRef: React.MutableRefObject<number>;
  pausedRef: React.MutableRefObject<boolean>;
  draggingRef: React.MutableRefObject<boolean>;
  paused: boolean;
  setPaused: (v: boolean | ((p: boolean) => boolean)) => void;
  setDragging: (v: boolean) => void;
  rotateBy: (dx: number, dy?: number) => void;
};

const SpinCtx = createContext<SpinControls | null>(null);

function useSpin() {
  return useContext(SpinCtx);
}

function useCreateSpinControls(): SpinControls {
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const [paused, setPausedState] = useState(false);
  const setPaused = useCallback((v: boolean | ((p: boolean) => boolean)) => {
    setPausedState((prev) => {
      const next = typeof v === "function" ? (v as (p: boolean) => boolean)(prev) : v;
      pausedRef.current = next;
      return next;
    });
  }, []);
  const setDragging = useCallback((v: boolean) => {
    draggingRef.current = v;
  }, []);
  const rotateBy = useCallback((dx: number, dy = 0) => {
    yawRef.current = clamp(yawRef.current + dx, -YAW_LIMIT, YAW_LIMIT);
    pitchRef.current = clamp(pitchRef.current + dy, -PITCH_LIMIT, PITCH_LIMIT);
  }, []);
  return useMemo(
    () => ({ yawRef, pitchRef, pausedRef, draggingRef, paused, setPaused, setDragging, rotateBy }),
    [paused, setPaused, setDragging, rotateBy]
  );
}

// Screen-level drag-to-rotate. The drei Html overlay sits above the canvas and
// swallows every pointer event, so canvas-level controls go dead once the UI
// mounts. This wrapper rotates on drags that start on non-interactive
// background, while inputs/buttons/links and vertical scroll regions behave
// natively (vertical drags inside scrollable areas scroll; horizontal drags
// anywhere rotate).
function ScreenDrag({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const spin = useSpin();
  const gesture = useRef<{ x: number; y: number; yaw: number; pitch: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  if (!spin) {
    return <div className={className} style={style}>{children}</div>;
  }
  const controls = spin;
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    suppressClick.current = false;
    gesture.current = { x: e.clientX, y: e.clientY, yaw: controls.yawRef.current, pitch: controls.pitchRef.current, moved: false };
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g) return;
    const dx = e.clientX - g.x;
    const dy = e.clientY - g.y;
    if (!g.moved) {
      if (Math.hypot(dx, dy) < 8) return;
      const target = e.target as Element | null;
      const interactive = target?.closest?.("input,textarea,select,button,a,[contenteditable],[data-nodrag]") ?? null;
      if (interactive) {
        const root = e.currentTarget;
        let sp: Element | null = interactive;
        let scrollEl: Element | null = null;
        while (sp && sp !== root) {
          const cs = window.getComputedStyle(sp);
          if ((cs.overflowY === "auto" || cs.overflowY === "scroll") && sp.scrollHeight > sp.clientHeight + 4) {
            scrollEl = sp;
            break;
          }
          sp = sp.parentElement;
        }
        if (scrollEl && Math.abs(dy) >= Math.abs(dx)) {
          gesture.current = null; // native vertical scroll wins
          return;
        }
      }
      g.moved = true;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // noop: capture is best-effort
      }
      controls.setDragging(true);
    }
    if (e.pointerType === "mouse" && e.buttons === 0 && !g.moved) return;
    controls.yawRef.current = clamp(g.yaw + dx * DRAG_YAW_SPEED, -YAW_LIMIT, YAW_LIMIT);
    controls.pitchRef.current = clamp(g.pitch - dy * DRAG_PITCH_SPEED, -PITCH_LIMIT, PITCH_LIMIT);
  };
  const end = () => {
    const g = gesture.current;
    if (g?.moved) suppressClick.current = true;
    gesture.current = null;
    controls.setDragging(false);
  };
  return (
    <div
      className={className ? `screendrag-root ${className}` : "screendrag-root"}
      style={{ ...style, touchAction: "pan-y", userSelect: "none" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={end}
      onPointerCancel={end}
      onLostPointerCapture={end}
      onClickCapture={(e) => {
        if (suppressClick.current) {
          suppressClick.current = false;
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      onDragStart={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
}

// Small overlay controls: explicit rotation buttons + auto-spin toggle.
// Rendered outside the Canvas so Html can never swallow them.
function FrameControls({ label }: { label: string }) {
  const spin = useSpin();
  if (!spin) return null;
  const btn =
    "pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full text-base leading-none text-white/90 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/80 active:bg-white/20";
  return (
    <div className="pointer-events-none absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-0.5 rounded-full border border-white/10 bg-slate-900/70 px-1 py-0.5 shadow-lg backdrop-blur">
      <button
        type="button"
        aria-label={`Rotate ${label} left`}
        title="Rotate left"
        className={btn}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          spin.rotateBy(-BUTTON_STEP);
        }}
      >
        ‹
      </button>
      <button
        type="button"
        aria-label={`Rotate ${label} right`}
        title="Rotate right"
        className={btn}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          spin.rotateBy(BUTTON_STEP);
        }}
      >
        ›
      </button>
      <button
        type="button"
        aria-label={spin.paused ? `Resume ${label} auto-spin` : `Pause ${label} auto-spin`}
        aria-pressed={spin.paused}
        title={spin.paused ? "Resume auto-spin" : "Pause auto-spin"}
        className={btn}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          spin.setPaused((p) => !p);
        }}
      >
        <span aria-hidden="true" className="text-xs">{spin.paused ? "▶" : "⏸"}</span>
      </button>
    </div>
  );
}

function Shell({ height, chrome, scene, label }: { height: string; chrome: ReactNode; scene: ReactNode; label: string }) {
  const { ref, show, setGlLost } = useShowCanvas();
  const spinControls = useCreateSpinControls();
  return (
    <div ref={ref} aria-label={label} className={`relative mx-auto w-full ${height}`}>
      {show ? (
        <SpinCtx.Provider value={spinControls}>
          <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.6, 7.4], fov: 45 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} onCreated={({ gl }) => {
            gl.domElement.addEventListener("webglcontextlost", (e) => { e.preventDefault(); setGlLost(true); });
          }}>
            <ambientLight intensity={1} />
            <directionalLight position={[4, 5, 6]} intensity={1} />
            <Suspense fallback={null}>
              <PresentationControls enabled global={false} snap cursor speed={1.1} polar={[-0.25, 0.25]} azimuth={[-0.15, 0.15]} config={{ mass: 1, tension: 170, friction: 26 }}>
                {scene}
              </PresentationControls>
              <ContactShadows position={[0, -2.2, 0]} opacity={0.25} scale={12} blur={2.4} far={5} resolution={256} color="#0f172a" />
            </Suspense>
          </Canvas>
          <FrameControls label={label} />
        </SpinCtx.Provider>
      ) : (
        chrome
      )}
    </div>
  );
}

function SlowSpin({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const spin = useSpin();
  useFrame((state) => {
    if (!ref.current || document.hidden) return;
    const paused = spin?.pausedRef.current ?? false;
    const dragging = spin?.draggingRef.current ?? false;
    // Gentle hands-free sway inside the ±10° free zone; user drag adds yaw
    // clamped to ±40°. No unbounded spinning — the device never turns away.
    const sway = !paused && !dragging ? Math.sin(state.clock.elapsedTime * 0.35) * FREE_ZONE : 0;
    ref.current.rotation.y = sway + (spin?.yawRef.current ?? 0);
    ref.current.rotation.x = spin?.pitchRef.current ?? 0;
  });
  return <group ref={ref}>{children}</group>;
}

export function BrowserFrame({ children, label }: { children: ReactNode; label: string }) {
  const screen = (
    <ScreenDrag className="overflow-hidden rounded-lg bg-white shadow-2xl" style={{ width: 980, height: 600 }}>
      <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-100 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-2 flex-1 truncate rounded-md bg-white px-2 py-0.5 text-[10px] text-slate-400">{label}</span>
        <span className="hidden select-none text-[10px] uppercase tracking-widest text-slate-400 md:inline">drag to rotate</span>
      </div>
      <div style={{ height: 560 }} className="overflow-hidden">{children}</div>
    </ScreenDrag>
  );
  return (
    <Shell
      height="h-[420px] md:h-[520px]"
      label={label}
      chrome={<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">{screen}</div>}
      scene={
        <SlowSpin>
          <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.6}>
            <Html transform position={[0, 0.2, 0]} distanceFactor={1.6} occlude="blending">
              {screen}
            </Html>
          </Float>
        </SlowSpin>
      }
    />
  );
}

export function MonitorFrame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <Shell
      height="h-[440px] md:h-[560px]"
      label={label}
      chrome={
        <div className="overflow-hidden rounded-2xl bg-slate-900 p-2 shadow-xl">
          <div className="overflow-hidden rounded-xl bg-white">{children}</div>
          <div className="mx-auto mt-2 h-8 w-24 rounded-b-xl bg-slate-700" />
        </div>
      }
      scene={
        <SlowSpin>
          <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.5}>
            <mesh position={[0, 0.35, -0.12]}>
              <boxGeometry args={[7.4, 4.7, 0.18]} />
              <meshStandardMaterial color="#0f172a" roughness={0.4} />
            </mesh>
            <mesh position={[0, -2.5, -0.1]}>
              <boxGeometry args={[0.5, 1.4, 0.3]} />
              <meshStandardMaterial color="#1e293b" roughness={0.5} />
            </mesh>
            <mesh position={[0, -3.2, 0.1]}>
              <boxGeometry args={[2.6, 0.18, 1.2]} />
              <meshStandardMaterial color="#1e293b" roughness={0.5} />
            </mesh>
            <Html transform position={[0, 0.35, 0]} distanceFactor={1.6} occlude="blending">
              <ScreenDrag className="overflow-hidden rounded-lg bg-slate-900 p-2 shadow-2xl" style={{ width: 1060 }}>
                <div className="flex items-center justify-center gap-2 px-2 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                  <span className="select-none text-[10px] uppercase tracking-widest text-slate-400">drag to rotate</span>
                </div>
                <div style={{ width: 1044, height: 640 }} className="overflow-hidden bg-white">{children}</div>
                <div className="flex items-center justify-center px-2 py-1.5">
                  <span className="h-1 w-16 rounded-full bg-slate-700" />
                </div>
              </ScreenDrag>
            </Html>
          </Float>
        </SlowSpin>
      }
    />
  );
}

export function PhoneFrame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <Shell
      height="h-[560px] md:h-[640px]"
      label={label}
      chrome={
        <div className="mx-auto w-[300px] overflow-hidden rounded-[2rem] bg-slate-900 p-2 shadow-xl">
          <div className="max-h-[560px] overflow-y-auto rounded-[1.6rem] bg-white">{children}</div>
        </div>
      }
      scene={
        <SlowSpin>
          <Float speed={1.3} rotationIntensity={0.3} floatIntensity={0.7}>
            <mesh>
              <boxGeometry args={[2.5, 5.1, 0.28]} />
              <meshStandardMaterial color="#0f172a" roughness={0.35} />
            </mesh>
            <mesh position={[0, 2.32, 0.1]}>
              <boxGeometry args={[1.1, 0.22, 0.05]} />
              <meshStandardMaterial color="#020617" roughness={0.4} />
            </mesh>
            <Html transform position={[0, -0.05, 0.02]} distanceFactor={1.35} occlude="blending">
              <ScreenDrag className="overflow-hidden rounded-[2rem] bg-slate-900 p-2 shadow-2xl" style={{ width: 390 }}>
                <div className="flex items-center justify-center gap-2 px-2 py-2">
                  <span className="h-1.5 w-16 rounded-full bg-slate-700" />
                </div>
                <div style={{ width: 374, height: 760 }} className="overflow-hidden rounded-[1.4rem] bg-white">{children}</div>
                <div className="flex items-center justify-center px-2 py-2">
                  <span className="h-1 w-24 rounded-full bg-slate-700" />
                </div>
              </ScreenDrag>
            </Html>
          </Float>
        </SlowSpin>
      }
    />
  );
}

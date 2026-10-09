"use client";
import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, PresentationControls, ContactShadows } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { useWebGLAllowed } from "./GlobalBackdrop";

function useShowCanvas() {
  const allowed = useWebGLAllowed();
  const reduce = useReducedMotion();
  const [inView, setInView] = useState(true);
  const [glLost, setGlLost] = useState(false);
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
  return { ref, show: allowed && !reduce && !glLost && inView && !isMobile, setGlLost };
}

function Shell({ height, chrome, scene, label }: { height: string; chrome: ReactNode; scene: ReactNode; label: string }) {
  const { ref, show, setGlLost } = useShowCanvas();
  return (
    <div ref={ref} aria-label={label} className={`relative mx-auto w-full ${height}`}>
      {show ? (
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.6, 7.4], fov: 45 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => { e.preventDefault(); setGlLost(true); });
        }}>
          <ambientLight intensity={1} />
          <directionalLight position={[4, 5, 6]} intensity={1} />
          <Suspense fallback={null}>
            <PresentationControls enabled global={false} snap cursor speed={1.1} polar={[-0.3, 0.3]} azimuth={[-0.6, 0.6]} config={{ mass: 1, tension: 170, friction: 26 }}>
              {scene}
            </PresentationControls>
            <ContactShadows position={[0, -2.2, 0]} opacity={0.25} scale={12} blur={2.4} far={5} resolution={256} color="#0f172a" />
          </Suspense>
        </Canvas>
      ) : (
        chrome
      )}
    </div>
  );
}

function SlowSpin({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (!ref.current || document.hidden) return;
    ref.current.rotation.y += dt * 0.08 + state.pointer.x * dt * 0.05;
  });
  return <group ref={ref}>{children}</group>;
}

export function BrowserFrame({ children, label }: { children: ReactNode; label: string }) {
  const screen = (
    <div style={{ width: 980, height: 600 }} className="overflow-hidden rounded-lg bg-white shadow-2xl">
      <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-100 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-2 flex-1 truncate rounded-md bg-white px-2 py-0.5 text-[10px] text-slate-400">{label}</span>
      </div>
      <div style={{ height: 560 }} className="overflow-hidden">{children}</div>
    </div>
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
              <div style={{ width: 1060, height: 640 }} className="overflow-hidden bg-white">{children}</div>
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
              <div style={{ width: 390, height: 760 }} className="overflow-hidden bg-white">{children}</div>
            </Html>
          </Float>
        </SlowSpin>
      }
    />
  );
}

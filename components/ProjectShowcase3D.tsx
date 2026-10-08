"use client";
import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Float, ContactShadows, PresentationControls, useTexture, Edges } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import type { Project } from "@/data/portfolio";
import { useWebGLAllowed } from "./GlobalBackdrop";

function Ring({ projects, activeId, onPick }: { projects: Project[]; activeId: number | null; onPick: (p: Project) => void }) {
  const group = useRef<THREE.Group>(null);
  const urls = projects.map((p) => p.image);
  const textures = useTexture(urls);
  const [hovered, setHovered] = useState<number | null>(null);
  const arr = Array.isArray(textures) ? textures : [textures];
  arr.forEach((t) => {
    const tex = t as THREE.Texture;
    tex.colorSpace = THREE.SRGBColorSpace;
  });
  useFrame((state, dt) => {
    if (!group.current || document.hidden) return;
    const dragging = hovered !== null;
    if (!dragging) group.current.rotation.y += dt * 0.12;
    group.current.rotation.y += state.pointer.x * dt * 0.05;
  });
  const n = projects.length;
  return (
    <group ref={group}>
      {projects.map((p, i) => {
        const a = (i / n) * Math.PI * 2;
        const x = Math.sin(a) * 3.2;
        const z = Math.cos(a) * 3.2;
        const isActive = p.id === activeId || hovered === p.id;
        return (
          <Float key={p.id} speed={1.2} rotationIntensity={0.25} floatIntensity={0.7}>
            <mesh
              position={[x, 0, z]}
              rotation={[0, a, 0]}
              scale={isActive ? 1.18 : 1}
              onPointerOver={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHovered(p.id); document.body.style.cursor = "pointer"; }}
              onPointerOut={() => { setHovered(null); document.body.style.cursor = "auto"; }}
              onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onPick(p); }}
            >
              <planeGeometry args={[2, 1.3]} />
              <meshBasicMaterial map={arr[i] as THREE.Texture} toneMapped={false} />
              {isActive ? <Edges scale={1.02} threshold={15} color="#2563eb" /> : null}
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

export default function ProjectShowcase3D({ projects, activeId, onPick }: { projects: Project[]; activeId: number | null; onPick: (p: Project) => void }): JSX.Element | null {
  const allowed = useWebGLAllowed();
  const reduce = useReducedMotion();
  const [inView, setInView] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const featured = projects.filter((p) => p.featured).slice(0, 5);
  const [glLost, setGlLost] = useState(false);
  // Self-unmount fix: ALWAYS render the wrapper div with its reserved height
  // classes (the observer target stays mounted); gate ONLY the Canvas.
  const show = allowed && !reduce && inView && !glLost && featured.length > 0;
  return (
    <div ref={wrapRef} aria-hidden={false} className="showcase-3d relative mx-auto mb-10 h-[380px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 md:h-[440px]">
      {show ? (
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.4, 7.5], fov: 48 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} onCreated={({ gl }) => {
        const el = gl.domElement;
        el.addEventListener("webglcontextlost", (e) => { e.preventDefault(); setGlLost(true); });
      }}>
        <ambientLight intensity={1} />
        <directionalLight position={[4, 5, 6]} intensity={1} />
        <Suspense fallback={null}>
          <PresentationControls enabled global={false} snap cursor speed={1.2} polar={[-0.35, 0.35]} azimuth={[-Math.PI, Math.PI]} config={{ mass: 1, tension: 170, friction: 26 }}>
            <Ring projects={featured} activeId={activeId} onPick={onPick} />
          </PresentationControls>
          <ContactShadows position={[0, -1.4, 0]} opacity={0.28} scale={12} blur={2.4} far={5} resolution={256} color="#0f172a" />
        </Suspense>
      </Canvas>
      ) : null}
      <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-xs font-medium text-slate-400">Drag to spin · Click a panel to open details</p>
    </div>
  );
}

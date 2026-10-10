"use client";
import { Suspense, useRef, useState, useEffect, useMemo, Component, type ReactNode } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, PresentationControls, useTexture, Edges } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { useWebGLAllowed } from "./GlobalBackdrop";

function getInitialFromUrl(url: string): string {
  try {
    const base = decodeURI(url).split("/").pop()?.trim() ?? "";
    const m = base.match(/[A-Za-z0-9]/);
    return m ? m[0].toUpperCase() : "?";
  } catch {
    return "?";
  }
}

function makeFallbackTexture(letter: string): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 336;
  const ctx = c.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#334155";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "bold 170px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText((letter || "?").slice(0, 1).toUpperCase(), c.width / 2, c.height / 2 + 8);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

class TileErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {}
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function LogoFallbackMesh({ position, rotation, scale, letter, onOver, onOut }: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  letter: string;
  onOver: (e: ThreeEvent<PointerEvent>) => void;
  onOut: () => void;
}) {
  const tex = useMemo(() => makeFallbackTexture(letter), [letter]);
  useEffect(() => () => { tex.dispose(); }, [tex]);
  return (
    <mesh position={position} rotation={rotation} scale={scale} onPointerOver={onOver} onPointerOut={onOut}>
      <planeGeometry args={[1.7, 1.1]} />
      <meshBasicMaterial map={tex} toneMapped={false} transparent />
    </mesh>
  );
}

function LogoTile({ url, position, rotation, scale, hovered, onOver, onOut }: {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  hovered: boolean;
  onOver: (e: ThreeEvent<PointerEvent>) => void;
  onOut: () => void;
}) {
  const texture = useTexture(encodeURI(url)) as THREE.Texture;
  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
  }, [texture]);
  return (
    <mesh position={position} rotation={rotation} scale={scale} onPointerOver={onOver} onPointerOut={onOut}>
      <planeGeometry args={[1.7, 1.1]} />
      <meshBasicMaterial map={texture} toneMapped={false} transparent />
      {hovered ? <Edges scale={1.02} threshold={15} color="#b45309" /> : null}
    </mesh>
  );
}

function Ring({ logos }: { logos: string[] }) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  useFrame((state, dt) => {
    if (!group.current || document.hidden) return;
    if (hovered === null) group.current.rotation.y += dt * 0.15;
    group.current.rotation.y += state.pointer.x * dt * 0.04;
  });
  const n = logos.length;
  return (
    <group ref={group}>
      {logos.map((url, i) => {
        const a = (i / n) * Math.PI * 2;
        const position: [number, number, number] = [Math.sin(a) * 3.6, 0, Math.cos(a) * 3.6];
        const rotation: [number, number, number] = [0, a, 0];
        const scale = hovered === i ? 1.18 : 1;
        const isHovered = hovered === i;
        const onOver = (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHovered(i); };
        const onOut = () => setHovered(null);
        const letter = getInitialFromUrl(url);
        const fallback = (
          <LogoFallbackMesh position={position} rotation={rotation} scale={scale} letter={letter} onOver={onOver} onOut={onOut} />
        );
        return (
          <TileErrorBoundary key={url} fallback={fallback}>
            <Suspense fallback={fallback}>
              <LogoTile url={url} position={position} rotation={rotation} scale={scale} hovered={isHovered} onOver={onOver} onOut={onOut} />
            </Suspense>
          </TileErrorBoundary>
        );
      })}
    </group>
  );
}

export default function CompanyRing({ logos }: { logos: string[] }) {
  const allowed = useWebGLAllowed();
  const reduce = useReducedMotion();
  const [inView, setInView] = useState(true);
  const [glLost, setGlLost] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches);
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const show = allowed && !reduce && !glLost && inView && !isMobile;
  return (
    <div ref={wrapRef} className="relative mx-auto h-[380px] w-full overflow-hidden rounded-2xl border border-[#e5ddcc] bg-[#fffdf6] max-sm:h-[320px] md:h-[420px]">
      {show && (
        <Suspense fallback={<div className="h-[380px] w-full rounded-2xl border border-[#e5ddcc] bg-[#fffdf6] max-sm:h-[320px] md:h-[420px] animate-pulse" />}>
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.4, 8], fov: 48 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => { e.preventDefault(); setGlLost(true); });
        }}>
          <ambientLight intensity={1} />
          <directionalLight position={[4, 5, 6]} intensity={1} />
          <Suspense fallback={null}>
            <PresentationControls enabled global={false} snap cursor speed={1.2} polar={[-0.35, 0.35]} azimuth={[-Math.PI, Math.PI]} config={{ mass: 1, tension: 170, friction: 26 }}>
              <Ring logos={logos} />
            </PresentationControls>
            <ContactShadows position={[0, -1.2, 0]} opacity={0.25} scale={13} blur={2.4} far={5} resolution={256} color="#0f172a" />
          </Suspense>
        </Canvas>
        </Suspense>
      )}
      {show && <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-xs font-medium text-slate-400">Drag to spin</p>}
    </div>
  );
}

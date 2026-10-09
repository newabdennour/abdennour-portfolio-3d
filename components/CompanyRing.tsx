"use client";
import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, PresentationControls, useTexture, Edges } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { useWebGLAllowed } from "./GlobalBackdrop";

function Ring({ logos }: { logos: string[] }) {
  const group = useRef<THREE.Group>(null);
  const textures = useTexture(logos);
  const [hovered, setHovered] = useState<number | null>(null);
  const arr = (Array.isArray(textures) ? textures : [textures]) as THREE.Texture[];
  useEffect(() => {
    arr.forEach((t) => { t.colorSpace = THREE.SRGBColorSpace; });
  }, [arr]);
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
        return (
          <mesh
            key={url}
            position={[Math.sin(a) * 3.6, 0, Math.cos(a) * 3.6]}
            rotation={[0, a, 0]}
            scale={hovered === i ? 1.18 : 1}
            onPointerOver={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHovered(i); }}
            onPointerOut={() => setHovered(null)}
          >
            <planeGeometry args={[1.7, 1.1]} />
            <meshBasicMaterial map={arr[i]} toneMapped={false} transparent />
            {hovered === i ? <Edges scale={1.02} threshold={15} color="#b45309" /> : null}
          </mesh>
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
      )}
      {show && <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-xs font-medium text-slate-400">Drag to spin</p>}
    </div>
  );
}

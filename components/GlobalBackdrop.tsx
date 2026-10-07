"use client";
import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

export function useWebGLAllowed() {
  const [allowed, setAllowed] = useState(true);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return void setAllowed(false);
    // @ts-expect-error saveData
    if (navigator?.connection?.saveData) return void setAllowed(false);
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl");
      if (!gl) setAllowed(false);
    } catch { setAllowed(false); }
  }, []);
  return allowed;
}

function Particles({ count = 1200 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
    }
    return arr;
  }, [count]);
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", fn, { passive: true });
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  useFrame((state, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.02;
    ref.current.rotation.x += ((mouse.current.y * 0.15) - ref.current.rotation.x) * 0.03;
    ref.current.rotation.y += ((mouse.current.x * 0.2) - 0) * 0.002;
    const scroll = Math.min(window.scrollY / window.innerHeight, 1);
    (ref.current.material as THREE.PointsMaterial).opacity = 0.55 - scroll * 0.3;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#2563eb" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Shapes() {
  return (
    <>
      <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
        <mesh position={[-3.2, 0.8, -2]} rotation={[0.4, 0.5, 0]}>
          <icosahedronGeometry args={[0.9, 1]} />
          <meshBasicMaterial color="#2563eb" wireframe transparent opacity={0.18} />
        </mesh>
      </Float>
      <Float speed={1.1} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[3.4, -0.6, -2.5]} rotation={[0.2, 0.8, 0.1]}>
          <icosahedronGeometry args={[1.1, 1]} />
          <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.15} />
        </mesh>
      </Float>
    </>
  );
}

export default function GlobalBackdrop() {
  const allowed = useWebGLAllowed();
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > window.innerHeight * 3);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!allowed || hidden) return <div aria-hidden className="webgl-fallback" />;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 6], fov: 55 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} onCreated={({ gl }) => {
        const el = gl.domElement;
        el.addEventListener("webglcontextlost", (e) => { e.preventDefault(); setHidden(true); });
      }}>
        <Suspense fallback={null}>
          <Particles />
          <Shapes />
        </Suspense>
      </Canvas>
      <div className="webgl-fallback absolute inset-0" />
    </div>
  );
}

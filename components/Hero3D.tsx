"use client";
import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows, PresentationControls, MeshDistortMaterial } from "@react-three/drei";
import { motion, useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { useGlobalScrollSprings } from "./ScrollRig";
import { useWebGLAllowed } from "./GlobalBackdrop";

function Rig({ heroProgress }: { heroProgress: import("framer-motion").MotionValue<number> }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (!ref.current || document.hidden) return;
    const p = heroProgress.get();
    const { pointer, clock } = state;
    const t = clock.getElapsedTime();
    ref.current.rotation.y += dt * (0.25 + p * 0.6);
    ref.current.rotation.x += ((pointer.y * 0.3 + p * 0.9) - ref.current.rotation.x) * 0.05;
    ref.current.position.y += ((Math.sin(t * 0.8) * 0.08 - p * 1.4) - ref.current.position.y) * 0.06;
    const s = 1 - p * 0.35;
    ref.current.scale.setScalar(s);
  });
  return (
    <group ref={ref}>
      <Float speed={1.6} rotationIntensity={0.7} floatIntensity={1.1}>
        <mesh>
          <torusKnotGeometry args={[0.85, 0.26, 128, 32]} />
          <MeshDistortMaterial color="#2563eb" roughness={0.25} metalness={0.15} distort={0.35} speed={2} transparent opacity={0.92} />
        </mesh>
      </Float>
      <Float speed={1.1} rotationIntensity={0.5} floatIntensity={0.9}>
        <mesh position={[1.5, -0.7, -1]} rotation={[0.4, 0.6, 0]}>
          <icosahedronGeometry args={[0.45, 1]} />
          <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.5} />
        </mesh>
      </Float>
    </group>
  );
}

export default function Hero3D() {
  const allowed = useWebGLAllowed();
  const reduce = useReducedMotion();
  const { heroProgress } = useGlobalScrollSprings();
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = document.getElementById("top");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  if (!allowed || reduce || !visible) return null;
  return (
    <motion.div aria-hidden className="hero-3d pointer-events-auto relative h-[240px] w-full md:h-[300px]">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5.2], fov: 50 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 4, 5]} intensity={1.1} />
        <Suspense fallback={null}>
          <PresentationControls enabled global={false} snap cursor speed={1} polar={[-0.5, 0.5]} config={{ mass: 1, tension: 170, friction: 26 }}>
            <Rig heroProgress={heroProgress} />
          </PresentationControls>
          <ContactShadows position={[0, -1.6, 0]} opacity={0.32} scale={8} blur={2.2} far={4} resolution={256} color="#0f172a" />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}

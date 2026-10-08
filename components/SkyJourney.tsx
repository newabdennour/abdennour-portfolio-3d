"use client";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sky, Sparkles } from "@react-three/drei";
import { useReducedMotion, useScroll, useSpring, type MotionValue } from "framer-motion";
import * as THREE from "three";
import { useWebGLAllowed } from "./GlobalBackdrop";
import type { JourneyTheme } from "@/data/portfolio";

const THEMES: Record<JourneyTheme, { line: [string, string]; fog: string; bg: string }> = {
  playful: { line: ["#2563eb", "#8b5cf6"], fog: "#eef4ff", bg: "linear-gradient(180deg,#dbeafe 0%,#eef2ff 45%,#ffffff 100%)" },
  academic: { line: ["#d97706", "#0d9488"], fog: "#fdf8ec", bg: "linear-gradient(180deg,#fef3c7 0%,#fdf8ec 50%,#ffffff 100%)" },
};

function makeCloudTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 128;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, 256, 128);
  const blobs: [number, number, number][] = [[70, 80, 42], [120, 66, 52], [175, 78, 44], [100, 90, 48], [150, 92, 40]];
  for (const [x, y, r] of blobs) {
    const g = ctx.createRadialGradient(x, y, 4, x, y, r);
    g.addColorStop(0, "rgba(255,255,255,0.95)");
    g.addColorStop(0.7, "rgba(255,255,255,0.55)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const CLOUDS: { pos: [number, number, number]; scale: number; speed: number }[] = [
  { pos: [-6, 3.5, -6], scale: 5, speed: 0.12 },
  { pos: [5.5, 2, -8], scale: 6.5, speed: 0.09 },
  { pos: [0, -1, -5], scale: 4, speed: 0.15 },
  { pos: [-4, -4.5, -7], scale: 7, speed: 0.07 },
  { pos: [6, -3, -4], scale: 4.5, speed: 0.13 },
  { pos: [-7, 0.5, -9], scale: 8, speed: 0.06 },
  { pos: [3, 5, -10], scale: 7.5, speed: 0.08 },
  { pos: [-2, -8, -6], scale: 5.5, speed: 0.1 },
  { pos: [7, -7, -8], scale: 6, speed: 0.09 },
  { pos: [-5, -11, -5], scale: 4.5, speed: 0.12 },
];

function Clouds() {
  const tex = useMemo(() => makeCloudTexture(), []);
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useEffect(() => () => tex.dispose(), [tex]);
  useFrame((state, dt) => {
    if (document.hidden) return;
    const px = state.pointer.x;
    refs.current.forEach((m, i) => {
      if (!m) return;
      m.position.x += (CLOUDS[i].speed * dt + px * dt * 0.15);
      if (m.position.x > 11) m.position.x = -11;
    });
  });
  return (
    <group>
      {CLOUDS.map((c, i) => (
        <mesh key={i} ref={(m) => { refs.current[i] = m; }} position={c.pos} scale={[c.scale, c.scale * 0.5, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={tex} transparent depthWrite={false} opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function journeyCurve(stops: number): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < stops; i++) {
    const t = stops === 1 ? 0 : i / (stops - 1);
    pts.push(new THREE.Vector3(Math.sin(t * Math.PI * 2.5) * 2.2, 4 - t * 18, 0));
  }
  return new THREE.CatmullRomCurve3(pts);
}

function LineAndRig({ curve, progress, colors }: {
  curve: THREE.CatmullRomCurve3;
  progress: MotionValue<number>;
  colors: [string, string];
}) {
  const headRef = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => {
    const g = new THREE.TubeGeometry(curve, 220, 0.045, 8, false);
    const count = g.index ? g.index.count : g.attributes.position.count;
    const arr = new Float32Array(count * 3);
    const cA = new THREE.Color(colors[0]);
    const cB = new THREE.Color(colors[1]);
    const pos = g.attributes.position;
    for (let i = 0; i < count; i++) {
      const vi = g.index ? g.index.getX(i) : i;
      const c = cA.clone().lerp(cB, THREE.MathUtils.clamp(1 - (pos.getY(vi) + 14) / 18, 0, 1));
      arr[i * 3] = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    }
    g.setAttribute("color", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [curve, colors]);
  useEffect(() => () => geo.dispose(), [geo]);
  const total = geo.index ? geo.index.count : geo.attributes.position.count;
  useFrame((state, dt) => {
    if (document.hidden) return;
    const p = THREE.MathUtils.clamp(progress.get(), 0, 1);
    geo.setDrawRange(0, Math.floor(p * total));
    const t = p * 0.999;
    const pos = curve.getPoint(t);
    const ahead = curve.getPoint(Math.min(t + 0.04, 1));
    if (headRef.current) {
      headRef.current.position.copy(pos);
      const s = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.18;
      headRef.current.scale.setScalar(s);
    }
    const camPos = pos.clone().add(new THREE.Vector3(0, 0.4, 8.2));
    camPos.x += state.pointer.x * 0.5;
    camPos.y += state.pointer.y * 0.3;
    state.camera.position.lerp(camPos, 1 - Math.exp(-4 * dt));
    state.camera.lookAt(ahead.x, ahead.y, 0);
  });
  return (
    <>
      <mesh geometry={geo}>
        <meshBasicMaterial vertexColors toneMapped={false} />
      </mesh>
      <mesh ref={headRef}>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshBasicMaterial color={colors[1]} toneMapped={false} />
      </mesh>
    </>
  );
}

export default function SkyJourney({ id, theme, stops, renderPanel }: {
  id: string;
  theme: JourneyTheme;
  stops: number;
  renderPanel: (index: number, progress: MotionValue<number>) => React.ReactNode;
}) {
  const allowed = useWebGLAllowed();
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [glLost, setGlLost] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 22 });
  const t = THEMES[theme];
  const curve = useMemo(() => journeyCurve(Math.max(stops, 1)), [stops]);
  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const el = trackRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const showCanvas = allowed && !reduce && !glLost && inView && !isMobile;
  return (
    <div id={id} ref={trackRef} className="journey-track relative" style={{ background: t.bg }}>
      <div className="sticky top-[8vh] h-[84vh] overflow-hidden">
        {showCanvas && (
          <Canvas dpr={[1, 1.5]} camera={{ position: [0, 4.4, 8.2], fov: 50 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} onCreated={({ gl }) => {
            gl.domElement.addEventListener("webglcontextlost", (e) => { e.preventDefault(); setGlLost(true); });
          }}>
            <fog attach="fog" args={[t.fog, 9, 22]} />
            <ambientLight intensity={1.1} />
            <directionalLight position={[4, 6, 6]} intensity={1} />
            <Suspense fallback={null}>
              <Sky sunPosition={[60, 25, -80]} turbidity={4} rayleigh={1.2} />
              <Clouds />
              <Sparkles count={70} scale={[14, 20, 4]} size={2.5} speed={0.25} opacity={0.5} color="#ffffff" />
              <LineAndRig curve={curve} progress={progress} colors={t.line} />
            </Suspense>
          </Canvas>
        )}
      </div>
      <div className="journey-stops relative z-10 -mt-[84vh]">
        {Array.from({ length: stops }, (_, i) => (
          <div key={i} className="flex min-h-[84vh] items-center px-4 py-10 md:px-10">
            <div className={`w-full md:w-[46%] ${i % 2 === 0 ? "md:mr-auto md:ml-[4%]" : "md:ml-auto md:mr-[4%]"}`}>
              {renderPanel(i, progress)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

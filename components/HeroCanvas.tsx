"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function Starfield({ count = 1400 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 9 + Math.random() * 22;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.02;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.08;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color="#7dd3fc" transparent opacity={0.75} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function CoreShape() {
  const mesh = useRef<THREE.Mesh>(null);
  const wire = useRef<THREE.Mesh>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const mx = state.pointer.x * 0.5;
    const my = state.pointer.y * 0.35;
    if (mesh.current) {
      mesh.current.rotation.y = t * 0.18 + mx;
      mesh.current.rotation.x = t * 0.12 + my;
      mesh.current.position.y = Math.sin(t * 0.9) * 0.15;
    }
    if (wire.current) {
      wire.current.rotation.y = -t * 0.1 + mx * 1.2;
      wire.current.rotation.z = t * 0.08;
    }
    if (ring1.current) {
      ring1.current.rotation.x = Math.PI / 2.4 + Math.sin(t * 0.4) * 0.15 + my * 0.4;
      ring1.current.rotation.y = t * 0.25;
    }
    if (ring2.current) {
      ring2.current.rotation.x = Math.PI / 1.7 + Math.cos(t * 0.3) * 0.15;
      ring2.current.rotation.z = -t * 0.18;
    }
  });

  return (
    <Float speed={1.6} rotationIntensity={0.4} floatIntensity={1.1}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.55, 1]} />
        <meshStandardMaterial color="#1a1440" metalness={0.9} roughness={0.18} flatShading />
      </mesh>
      <mesh ref={wire} scale={1.56}>
        <icosahedronGeometry args={[1.55, 1]} />
        <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.28} />
      </mesh>
      <mesh ref={ring1}>
        <torusGeometry args={[2.7, 0.015, 16, 180]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.7} />
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[3.3, 0.012, 16, 180]} />
        <meshBasicMaterial color="#e879f9" transparent opacity={0.4} />
      </mesh>
    </Float>
  );
}

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(220 * 3);
    for (let i = 0; i < 220; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, []);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      pos.setY(i, pos.getY(i) + Math.sin(state.clock.elapsedTime * 1.4 + i) * 0.0009);
    }
    pos.needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.09} color="#e879f9" transparent opacity={0.65} depthWrite={false} />
    </points>
  );
}

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 45 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[6, 6, 4]} intensity={1.6} color="#7dd3fc" />
        <pointLight position={[-6, -3, 3]} intensity={30} color="#a855f7" />
        <pointLight position={[4, -4, 2]} intensity={18} color="#22d3ee" />
        <Starfield />
        <CoreShape />
        <Particles />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#030014_82%)]" />
    </div>
  );
}

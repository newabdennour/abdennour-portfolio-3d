"use client";
import { Component, Suspense, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { JourneyTheme } from "@/data/portfolio";

// Models: CC0 by Quaternius (https://quaternius.com), via Poly Pizza (https://poly.pizza), Public Domain CC0.

class ModelBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function ProceduralPlane({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current || document.hidden) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 1.4) * 0.25;
    ref.current.rotation.z = Math.sin(t * 0.9) * 0.12 + state.pointer.x * 0.2;
    ref.current.rotation.y = Math.sin(t * 0.5) * 0.2;
  });
  return (
    <group ref={ref} position={position}>
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh rotation={[0, 0, -0.2]}>
          <coneGeometry args={[0.28, 1.1, 4]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} flatShading />
        </mesh>
        <mesh position={[0, 0.02, 0.1]} rotation={[Math.PI / 2, 0, Math.PI / 4]}>
          <planeGeometry args={[0.7, 0.5]} />
          <meshStandardMaterial color="#bfdbfe" roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.02, -0.35]} rotation={[Math.PI / 2, 0, Math.PI / 4]}>
          <planeGeometry args={[0.34, 0.24]} />
          <meshStandardMaterial color="#93c5fd" roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
      </Float>
    </group>
  );
}

function ProceduralBalloon({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current || document.hidden) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 0.7 + 2) * 0.3;
    ref.current.rotation.y += 0.0015;
    ref.current.rotation.z = state.pointer.x * 0.1;
  });
  return (
    <group ref={ref} position={position}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={1}>
        <mesh>
          <sphereGeometry args={[0.55, 24, 24]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.45} />
        </mesh>
        <mesh position={[0, -0.85, 0]}>
          <boxGeometry args={[0.28, 0.24, 0.28]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
          <meshStandardMaterial color="#57534e" roughness={0.8} />
        </mesh>
      </Float>
    </group>
  );
}

function GlbFlyer({ url, position, scale }: { url: string; position: [number, number, number]; scale: number }) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current || document.hidden) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 1.1) * 0.25;
    ref.current.rotation.y += 0.002;
    ref.current.rotation.z = state.pointer.x * 0.15;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      <Float speed={1.3} rotationIntensity={0.3} floatIntensity={0.9}>
        <primitive object={scene.clone()} />
      </Float>
    </group>
  );
}

export default function FlyingObjects({ theme }: { theme: JourneyTheme }) {
  const playful = theme === "playful";
  const planePos: [number, number, number] = playful ? [-3.4, 2.2, -1.5] : [-3.6, 1.4, -2];
  const balloonPos: [number, number, number] = playful ? [3.6, -2.5, -2.5] : [3.8, -3.5, -3];
  return (
    <group>
      <ModelBoundary fallback={<ProceduralPlane position={planePos} />}>
        <Suspense fallback={<ProceduralPlane position={planePos} />}>
          <GlbFlyer url="/models/paper-plane.glb" position={planePos} scale={playful ? 1 : 0.8} />
        </Suspense>
      </ModelBoundary>
      <ModelBoundary fallback={<ProceduralBalloon position={balloonPos} />}>
        <Suspense fallback={<ProceduralBalloon position={balloonPos} />}>
          <GlbFlyer url="/models/hot-air-balloon.glb" position={balloonPos} scale={playful ? 1.1 : 0.9} />
        </Suspense>
      </ModelBoundary>
    </group>
  );
}

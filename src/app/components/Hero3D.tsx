'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FloatingParticles() {
  const mesh = useRef<THREE.Points>(null);
  const count = 1500;

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      sz[i] = Math.random() * 3 + 0.5;
    }
    return [pos, sz];
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.02;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.03;
    const pointer = state.pointer;
    mesh.current.rotation.x += pointer.y * 0.05;
    mesh.current.rotation.y += pointer.x * 0.05;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#6366f1"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function GlowSphere({ position, color, scale }: { position: [number, number, number]; color: string; scale: number }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.3;
    mesh.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * 0.3 + position[1]) * 0.2;
  });

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[scale, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.08} />
    </mesh>
  );
}

export default function Hero3D() {
  return (
    <div className="hero-3d-container">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <FloatingParticles />
        <GlowSphere position={[-3, 1, -2]} color="#2563EB" scale={1.5} />
        <GlowSphere position={[3, -1, -3]} color="#7C3AED" scale={1.2} />
        <GlowSphere position={[0, 2, -4]} color="#06B6D4" scale={1} />
        <GlowSphere position={[-2, -2, -2]} color="#8B5CF6" scale={0.8} />
      </Canvas>
    </div>
  );
}

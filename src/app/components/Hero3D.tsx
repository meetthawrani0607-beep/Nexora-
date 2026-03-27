'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ─── Floating Particles with Connection Lines ─── */
function ParticleNetwork() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const count = 60;

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
      vel[i * 3] = (Math.random() - 0.5) * 0.003;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    return { positions: pos, velocities: vel };
  }, []);

  const linePositions = useMemo(() => new Float32Array(count * count * 6), []);
  const lineColors = useMemo(() => new Float32Array(count * count * 6), []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

    // Update particle positions
    for (let i = 0; i < count; i++) {
      posArray[i * 3] += velocities[i * 3];
      posArray[i * 3 + 1] += velocities[i * 3 + 1];
      posArray[i * 3 + 2] += velocities[i * 3 + 2];

      // Bounce
      if (Math.abs(posArray[i * 3]) > 6) velocities[i * 3] *= -1;
      if (Math.abs(posArray[i * 3 + 1]) > 4) velocities[i * 3 + 1] *= -1;
      if (posArray[i * 3 + 2] > 1 || posArray[i * 3 + 2] < -5) velocities[i * 3 + 2] *= -1;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Draw connection lines
    if (linesRef.current) {
      let lineIdx = 0;
      const maxDist = 2.0;
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = posArray[i * 3] - posArray[j * 3];
          const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
          const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < maxDist) {
            const alpha = 1 - dist / maxDist;
            linePositions[lineIdx * 6] = posArray[i * 3];
            linePositions[lineIdx * 6 + 1] = posArray[i * 3 + 1];
            linePositions[lineIdx * 6 + 2] = posArray[i * 3 + 2];
            linePositions[lineIdx * 6 + 3] = posArray[j * 3];
            linePositions[lineIdx * 6 + 4] = posArray[j * 3 + 1];
            linePositions[lineIdx * 6 + 5] = posArray[j * 3 + 2];
            // Gradient: blue to purple
            const c = alpha * 0.25;
            lineColors[lineIdx * 6] = 0.15 * alpha;
            lineColors[lineIdx * 6 + 1] = 0.25 * alpha;
            lineColors[lineIdx * 6 + 2] = 0.9 * alpha;
            lineColors[lineIdx * 6 + 3] = 0.5 * alpha;
            lineColors[lineIdx * 6 + 4] = 0.15 * alpha;
            lineColors[lineIdx * 6 + 5] = 0.85 * alpha;
            lineIdx++;
          }
        }
      }
      linesRef.current.geometry.setDrawRange(0, lineIdx * 2);
      linesRef.current.geometry.attributes.position.needsUpdate = true;
      linesRef.current.geometry.attributes.color.needsUpdate = true;
    }

    // Gentle mouse-following rotation
    if (pointsRef.current) {
      pointsRef.current.rotation.y += (state.pointer.x * 0.05 - pointsRef.current.rotation.y) * 0.01;
      pointsRef.current.rotation.x += (state.pointer.y * 0.03 - pointsRef.current.rotation.x) * 0.01;
    }
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions.slice(), 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#6366f1"
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </>
  );
}

/* ─── Background Star Dust ─── */
function StarDust() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 8;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.005;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#4455aa" transparent opacity={0.4}
        sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

/* ─── Export ─── */
export default function Hero3D() {
  return (
    <div className="hero-3d-container">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ParticleNetwork />
        <StarDust />
      </Canvas>
    </div>
  );
}

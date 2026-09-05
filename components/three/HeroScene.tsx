import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Edges } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';

// three cannot read CSS custom properties — these mirror --color-signal and a
// lighter edge tint from index.css. Change both together.
const SIGNAL = '#35dce8';
const EDGE = '#a8f0f7';

// Fixed shard placements around the core (deterministic — no Math.random).
const SHARDS: { pos: [number, number, number]; size: number }[] = [
  { pos: [1.9, 0.5, 0.2], size: 0.24 },
  { pos: [-1.75, -0.4, 0.5], size: 0.17 },
  { pos: [0.3, -1.85, -0.4], size: 0.2 },
  { pos: [-0.5, 1.8, 0.3], size: 0.15 },
  { pos: [1.3, -1.1, -0.6], size: 0.13 },
];

// The reactor: a flat-shaded low-poly icosahedron with lit facet edges, a
// glowing inner core, and a faint wireframe shell. Rotates toward the pointer.
const Core: React.FC<{ reduced: boolean }> = ({ reduced }) => {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current || reduced) return;
    group.current.rotation.y += delta * 0.16;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      state.pointer.y * 0.35,
      0.05
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      state.pointer.x * -0.2,
      0.05
    );
  });

  return (
    <group ref={group}>
      <Float speed={reduced ? 0 : 1.2} rotationIntensity={0.5} floatIntensity={0.6}>
        <mesh>
          <icosahedronGeometry args={[1.3, 0]} />
          <meshStandardMaterial
            color={SIGNAL}
            emissive={SIGNAL}
            emissiveIntensity={0.18}
            metalness={0.5}
            roughness={0.3}
            flatShading
          />
          <Edges threshold={12} color={EDGE} />
        </mesh>
        <mesh scale={0.55}>
          <icosahedronGeometry args={[1.3, 0]} />
          <meshBasicMaterial color="#e6feff" />
        </mesh>
        <mesh scale={1.42}>
          <icosahedronGeometry args={[1.3, 1]} />
          <meshBasicMaterial color={SIGNAL} wireframe transparent opacity={0.08} />
        </mesh>
      </Float>
    </group>
  );
};

// Small shards orbiting the core in a slowly-rotating group.
const Shards: React.FC<{ reduced: boolean }> = ({ reduced }) => {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current && !reduced) group.current.rotation.y += delta * 0.22;
  });
  return (
    <group ref={group}>
      {SHARDS.map((s, i) => (
        <Float key={i} speed={reduced ? 0 : 2.2} rotationIntensity={1.2} floatIntensity={1}>
          <mesh position={s.pos} rotation={[i, i * 0.7, 0]}>
            <octahedronGeometry args={[s.size, 0]} />
            <meshStandardMaterial
              color={SIGNAL}
              emissive={SIGNAL}
              emissiveIntensity={0.35}
              metalness={0.5}
              roughness={0.35}
              flatShading
            />
            <Edges color={EDGE} />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

// CSS-only stand-in for reduced-motion and for WebGL failure. Purely
// decorative — the stack list it used to carry now lives beside the canvas in
// the Identity module, where a screen reader can actually read it.
const StaticCore: React.FC = () => (
  <div className="relative flex h-full w-full items-center justify-center" aria-hidden>
    <div className="h-48 w-48 rounded-full bg-signal/10 blur-2xl" />
    <div className="absolute h-36 w-36 rounded-full border border-signal/30 bg-signal/5" />
    <div className="absolute h-20 w-20 rounded-full border border-signal/50" />
    <div className="absolute h-2.5 w-2.5 rounded-full bg-signal" />
  </div>
);

class SceneBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <StaticCore /> : this.props.children;
  }
}

const HeroScene: React.FC = () => {
  const reduced = useReducedMotion() ?? false;

  if (reduced) return <StaticCore />;

  return (
    <SceneBoundary>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 4.8], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.45} />
        <pointLight position={[5, 5, 5]} intensity={70} color={SIGNAL} />
        <pointLight position={[-6, -4, -3]} intensity={30} color="#ffffff" />
        <pointLight position={[0, 3, -5]} intensity={20} color={EDGE} />
        <Suspense fallback={null}>
          <Core reduced={reduced} />
          <Shards reduced={reduced} />
          <Sparkles count={60} scale={7} size={2} speed={0.3} color={SIGNAL} opacity={0.5} />
        </Suspense>
      </Canvas>
    </SceneBoundary>
  );
};

export default HeroScene;

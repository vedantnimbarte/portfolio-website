import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Edges, Html } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';

const ACCENT = '#fbbf24';
const EDGE = '#fde68a';
const STACK = ['React', 'TypeScript', 'Rust', 'Node.js', 'Python', 'AWS', 'Docker', 'Three.js'];

// Fixed shard placements around the core (deterministic — no Math.random).
const SHARDS: { pos: [number, number, number]; size: number }[] = [
  { pos: [1.9, 0.5, 0.2], size: 0.24 },
  { pos: [-1.75, -0.4, 0.5], size: 0.17 },
  { pos: [0.3, -1.85, -0.4], size: 0.2 },
  { pos: [-0.5, 1.8, 0.3], size: 0.15 },
  { pos: [1.3, -1.1, -0.6], size: 0.13 },
];

// Tech-stack pills orbiting the core, hidden when they pass behind it (occlude).
const TechLabels: React.FC = () => {
  const ring = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ring.current) ring.current.rotation.y -= delta * 0.12;
  });
  const radius = 2.4;
  return (
    <group ref={ring} rotation={[0.4, 0, 0]}>
      {STACK.map((tech, i) => {
        const a = (i / STACK.length) * Math.PI * 2;
        return (
          <Html
            key={tech}
            position={[Math.cos(a) * radius, 0, Math.sin(a) * radius]}
            center
            occlude
            zIndexRange={[10, 0]}
          >
            <span className="whitespace-nowrap rounded-full border border-accent/30 bg-black/60 px-2.5 py-1 font-mono text-[11px] text-accent/90 backdrop-blur-sm">
              {tech}
            </span>
          </Html>
        );
      })}
    </group>
  );
};

// Faceted amber "compiled artifact": a flat-shaded low-poly icosahedron with
// lit facet edges, a glowing inner core, and a faint wireframe shell.
// Rotates toward the pointer.
const Crystal: React.FC<{ reduced: boolean }> = ({ reduced }) => {
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
        {/* Faceted body */}
        <mesh>
          <icosahedronGeometry args={[1.3, 0]} />
          <meshStandardMaterial
            color={ACCENT}
            emissive={ACCENT}
            emissiveIntensity={0.18}
            metalness={0.5}
            roughness={0.3}
            flatShading
          />
          <Edges threshold={12} color={EDGE} />
        </mesh>
        {/* Inner glow */}
        <mesh scale={0.55}>
          <icosahedronGeometry args={[1.3, 0]} />
          <meshBasicMaterial color="#fff7e0" />
        </mesh>
        {/* Wireframe shell */}
        <mesh scale={1.42}>
          <icosahedronGeometry args={[1.3, 1]} />
          <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.08} />
        </mesh>
      </Float>
    </group>
  );
};

// Small crystal shards orbiting the core in a slowly-rotating group.
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
              color={ACCENT}
              emissive={ACCENT}
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

// Lightweight CSS glow — used for reduced-motion and WebGL-unavailable fallback.
const StaticCore: React.FC = () => (
  <div className="relative flex h-full w-full items-center justify-center" aria-hidden>
    <div className="h-56 w-56 rounded-full bg-accent/15 blur-2xl" />
    <div className="absolute h-40 w-40 rounded-full border border-accent/30 bg-accent/10 shadow-[0_0_80px_rgba(251,191,36,0.25)]" />
    <div className="absolute h-24 w-24 rounded-full bg-accent/20 blur-md" />
    <div className="absolute flex max-w-[16rem] flex-wrap justify-center gap-2">
      {STACK.map((tech) => (
        <span key={tech} className="rounded-full border border-accent/30 bg-black/60 px-2.5 py-1 font-mono text-[11px] text-accent/90">
          {tech}
        </span>
      ))}
    </div>
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
        <pointLight position={[5, 5, 5]} intensity={70} color={ACCENT} />
        <pointLight position={[-6, -4, -3]} intensity={30} color="#ffffff" />
        <pointLight position={[0, 3, -5]} intensity={20} color={EDGE} />
        <Suspense fallback={null}>
          <Crystal reduced={reduced} />
          <Shards reduced={reduced} />
          <TechLabels />
          <Sparkles count={70} scale={7} size={2.2} speed={0.35} color={ACCENT} opacity={0.6} />
        </Suspense>
      </Canvas>
    </SceneBoundary>
  );
};

export default HeroScene;

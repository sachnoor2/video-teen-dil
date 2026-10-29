import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";
import { rayGradient, sandSkin, waterGradient } from "./materials";

export type Mood = "day" | "dusk" | "storm" | "night";

const MOODS: Record<
  Mood,
  {
    water: string;
    top: string;
    fog: string;
    fogDensity: number;
    amb: number;
    sun: number;
    sunColour: string;
    hemi: number;
    rim: number;
    rays: number;
  }
> = {
  day: { water: "#0a4a70", top: "#2b93bd", fog: "#0a4a70", fogDensity: 0.062, amb: 0.8, sun: 2.2, sunColour: "#dff4ff", hemi: 0.75, rim: 0.6, rays: 0.6 },
  dusk: { water: "#08344f", top: "#1d6f96", fog: "#08344f", fogDensity: 0.075, amb: 0.62, sun: 1.5, sunColour: "#9fd6ef", hemi: 0.55, rim: 0.55, rays: 0.4 },
  storm: { water: "#04121c", top: "#1a5d78", fog: "#06222f", fogDensity: 0.085, amb: 0.55, sun: 1.0, sunColour: "#9cc4d8", hemi: 0.4, rim: 0.4, rays: 0.18 },
  night: { water: "#030e1a", top: "#0e3f60", fog: "#05192b", fogDensity: 0.08, amb: 0.5, sun: 0.85, sunColour: "#84b3d4", hemi: 0.35, rim: 0.38, rays: 0.14 },
};

const seedRand = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
};

const Kelp: React.FC<{ x: number; z: number; height: number; phase: number }> = ({ x, z, height, phase }) => {
  const frame = useCurrentFrame();
  const seg = 5;
  const segLen = height / seg;
  return (
    <group position={[x, -3.2, z]}>
      {Array.from({ length: seg }).map((_, i) => {
        const sway = Math.sin(frame * 0.045 + phase + i * 0.7) * 0.16;
        return (
          <group key={i} position={[0, i * segLen, 0]} rotation={[0, 0, sway * (1 + i * 0.4)]}>
            <mesh position={[0, segLen / 2, 0]} scale={[0.34 - i * 0.045, segLen, 0.07]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color={i % 2 ? "#2f7d5f" : "#28684f"} roughness={0.85} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

const Bubbles: React.FC<{ count?: number; speed?: number }> = ({ count = 46, speed = 1 }) => {
  const frame = useCurrentFrame();
  const items = useMemo(() => {
    const rand = seedRand(97);
    return Array.from({ length: count }).map(() => ({
      x: (rand() - 0.5) * 22,
      z: (rand() - 0.5) * 14 - 2,
      r: 0.05 + rand() * 0.14,
      offset: rand() * 12,
      period: 9 + rand() * 7,
      drift: 0.4 + rand() * 0.8,
    }));
  }, [count]);

  return (
    <group>
      {items.map((b, i) => {
        const t = ((frame * 0.03 * speed + b.offset) % b.period) / b.period;
        const y = -3.1 + t * 9;
        const wobble = Math.sin(frame * 0.05 * b.drift + i) * 0.22;
        return (
          <mesh key={i} position={[b.x + wobble, y, b.z]} scale={b.r}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial
              color="#cdf3ff"
              transparent
              opacity={0.42}
              roughness={0.1}
              metalness={0}
              emissive="#7fd4ef"
              emissiveIntensity={0.18}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export const World: React.FC<{ mood: Mood }> = ({ mood }) => {
  const frame = useCurrentFrame();
  const m = MOODS[mood];
  const sand = useMemo(() => sandSkin(), []);
  const ray = useMemo(() => rayGradient(), []);
  const sky = useMemo(() => waterGradient(m.top, m.water), [m.top, m.water]);

  const rocks = useMemo(() => {
    const rand = seedRand(53);
    return Array.from({ length: 9 }).map(() => ({
      x: (rand() - 0.5) * 26,
      z: -4 - rand() * 10,
      s: 0.8 + rand() * 1.9,
      rot: rand() * Math.PI,
    }));
  }, []);

  const kelps = useMemo(() => {
    const rand = seedRand(29);
    return Array.from({ length: 14 }).map(() => ({
      x: (rand() - 0.5) * 26,
      z: -3 - rand() * 8,
      h: 1.8 + rand() * 2.6,
      phase: rand() * 6,
    }));
  }, []);

  return (
    <>
      <color attach="background" args={[m.water]} />
      <fogExp2 attach="fog" args={[m.fog, m.fogDensity]} />
      <mesh>
        <sphereGeometry args={[95, 24, 16]} />
        <meshBasicMaterial map={sky} side={THREE.BackSide} fog={false} depthWrite={false} />
      </mesh>

      <hemisphereLight args={["#bfe9ff", "#123047", m.hemi]} />
      <ambientLight intensity={m.amb} color="#cfe9ff" />
      <directionalLight position={[4, 12, 6]} intensity={m.sun} color={m.sunColour} />
      <pointLight position={[-6, 2, 4]} intensity={m.rim} color="#4fa8e0" distance={26} />
      <pointLight position={[0, 2.4, 8]} intensity={1.5} color="#cfe9ff" distance={30} />
      <pointLight position={[5, -1, -6]} intensity={m.rim * 0.7} color="#f0b429" distance={24} />

      {/* sea floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.4, 0]}>
        <planeGeometry args={[260, 260]} />
        <meshStandardMaterial map={sand} color="#b9a687" roughness={1} metalness={0} />
      </mesh>
      {/* dunes */}
      {[
        [-7, -8, 3.4, 0.7],
        [8, -10, 4.2, 0.8],
        [0, -14, 6, 1.1],
        [-12, -3, 2.6, 0.5],
      ].map(([x, z, r, h], i) => (
        <mesh key={i} position={[x, -3.5, z]} scale={[r, h, r * 0.8]}>
          <sphereGeometry args={[1, 20, 12]} />
          <meshStandardMaterial color="#cbab80" roughness={1} />
        </mesh>
      ))}

      {/* rocks */}
      {rocks.map((r, i) => (
        <mesh key={i} position={[r.x, -3.2 + r.s * 0.5, r.z]} rotation={[0.1, r.rot, 0.06]} scale={[r.s, r.s * 1.15, r.s]}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color={i % 3 === 0 ? "#2f5468" : "#24455a"} roughness={0.95} flatShading />
        </mesh>
      ))}

      {kelps.map((k, i) => (
        <Kelp key={i} x={k.x} z={k.z} height={k.h} phase={k.phase} />
      ))}

      <Bubbles count={64} />

      {/* light shafts */}
      {m.rays > 0.05
        ? [0, 1, 2, 3].map((i) => (
            <mesh
              key={i}
              position={[-9 + i * 6 + Math.sin(frame * 0.01 + i) * 0.5, 3.2, -6 - i * 1.5]}
              rotation={[0.12, 0.2 - i * 0.1, 0.06]}
            >
              <planeGeometry args={[3.6, 14]} />
              <meshBasicMaterial
                map={ray}
                transparent
                opacity={m.rays}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))
        : null}
    </>
  );
};

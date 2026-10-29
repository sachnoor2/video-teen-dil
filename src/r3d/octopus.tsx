import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";
import { contactShadow, octopusSkin } from "./materials";
import { useMouth } from "./voice";

export type Pose = "idle" | "talk" | "happy" | "scared" | "sad" | "squeeze";

const POSES: Record<
  Pose,
  {
    bodyY: number;
    bodyScale: [number, number, number];
    curl: number;
    curlAmp: number;
    spread: number;
    tilt: number;
    eyeWide: number;
    headPitch: number;
    mouthBase: number;
  }
> = {
  idle: { bodyY: 0.15, bodyScale: [0.94, 1.12, 0.9], curl: 0.4, curlAmp: 0.16, spread: 0.1, tilt: 0.62, eyeWide: 1, headPitch: 0.06, mouthBase: 0.18 },
  talk: { bodyY: 0.18, bodyScale: [0.96, 1.1, 0.92], curl: 0.46, curlAmp: 0.2, spread: 0.14, tilt: 0.66, eyeWide: 1, headPitch: 0.02, mouthBase: 0.2 },
  happy: { bodyY: 0.24, bodyScale: [0.9, 1.06, 0.86], curl: 0.5, curlAmp: 0.24, spread: 0.22, tilt: 0.9, eyeWide: 1, headPitch: -0.06, mouthBase: 0.5 },
  scared: { bodyY: 0.1, bodyScale: [0.8, 1.0, 0.76], curl: 0.62, curlAmp: 0.1, spread: 0.02, tilt: 0.35, eyeWide: 1.35, headPitch: 0.12, mouthBase: 0.35 },
  sad: { bodyY: 0.05, bodyScale: [0.82, 1.06, 0.78], curl: 0.16, curlAmp: 0.07, spread: 0.05, tilt: 0.4, eyeWide: 0.9, headPitch: 0.3, mouthBase: 0.1 },
  squeeze: { bodyY: 0.3, bodyScale: [0.3, 1.85, 0.3], curl: 0.05, curlAmp: 0.02, spread: 0.0, tilt: 0.12, eyeWide: 1, headPitch: 0.0, mouthBase: 0.1 },
};

const SEGMENTS = 6;
const ARMS = 8;

const ArmSegment: React.FC<{
  i: number;
  arm: number;
  frame: number;
  pose: (typeof POSES)[Pose];
  radius: number;
  length: number;
  colour: THREE.Color;
  dark: THREE.Color;
}> = ({ i, arm, frame, pose, radius, length, colour, dark }) => {
  const wobble = Math.sin(frame * 0.16 + arm * 0.9 + i * 0.62);
  const curl = pose.curl + wobble * pose.curlAmp * (0.6 + i * 0.12);
  const twist = Math.sin(frame * 0.11 + arm * 1.4 + i * 0.3) * 0.09;
  const r0 = radius * (1 - i / (SEGMENTS + 1));
  const r1 = radius * (1 - (i + 1) / (SEGMENTS + 1));

  return (
    <group position={[0, i === 0 ? 0 : -length, 0]} rotation={[curl, 0, twist]}>
      <mesh position={[0, -length * 0.52, 0]}>
        <cylinderGeometry args={[r1 * 0.94, r0 * 1.06, length * 1.22, 12, 1]} />
        <meshStandardMaterial color={i < 3 ? colour : dark} roughness={0.62} metalness={0.02} />
      </mesh>
      {i < SEGMENTS - 1 ? (
        <ArmSegment
          i={i + 1}
          arm={arm}
          frame={frame}
          pose={pose}
          radius={radius}
          length={length}
          colour={colour}
          dark={dark}
        />
      ) : null}
    </group>
  );
};

export const Octo3D: React.FC<{
  position?: [number, number, number];
  scale?: number;
  pose?: Pose;
  phase?: number;
  tint?: string;
  hearts?: "red" | "blue" | "stop";
  lookAtX?: number;
}> = ({ position = [0, 0, 0], scale = 1, pose = "idle", phase = 0, tint, hearts, lookAtX = 0 }) => {
  const frame = useCurrentFrame();
  const mouth = useMouth();
  const p = POSES[pose];

  const skin = useMemo(() => octopusSkin(tint ?? "#ff7f4d", "rgba(206,84,40,.22)", true), [tint]);
  const shadow = useMemo(() => contactShadow(), []);

  const bodyColour = useMemo(() => new THREE.Color(tint ?? "#ff7f4d"), [tint]);
  const armDark = useMemo(() => bodyColour.clone().multiplyScalar(0.72), [bodyColour]);

  const mantle = useMemo(() => {
    const profile: [number, number][] = [
      [0.5, -1.2],
      [0.82, -0.95],
      [1.0, -0.55],
      [1.03, 0.0],
      [0.97, 0.5],
      [0.74, 0.92],
      [0.42, 1.16],
      [0.06, 1.26],
    ];
    return profile.map(([r, y]) => new THREE.Vector2(r, y));
  }, []);

  const bob = Math.sin(frame * 0.06 + phase) * 0.09;
  const sway = Math.sin(frame * 0.045 + phase) * 0.06;

  // blink every couple of seconds, offset per character
  const cyc = (frame + phase * 53) % 132;
  const blink = pose === "happy" ? 1 : cyc < 7 ? Math.sin((cyc / 7) * Math.PI) : 0;

  const eyeR = 0.27 * p.eyeWide;
  const talkMouth = pose === "talk" ? mouth : p.mouthBase;
  const mouthOpen = Math.max(0.06, p.mouthBase * 0.4 + talkMouth * 0.9);

  return (
    <group position={position} scale={scale}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.05, 0]}>
        <planeGeometry args={[4.2, 4.2]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} opacity={0.55} />
      </mesh>

      <group position={[0, p.bodyY + bob, 0]} rotation={[p.headPitch, sway, 0]}>
        {/* mantle */}
        <mesh scale={p.bodyScale} rotation={[0.06, 0, 0]}>
          <sphereGeometry args={[1, 40, 30]} />
          <meshStandardMaterial map={skin} color="#ffffff" roughness={0.55} metalness={0.03} emissive="#3a1508" emissiveIntensity={0.35} />
        </mesh>

        {/* eyes */}
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.33 * p.bodyScale[0], 0.22 * p.bodyScale[1], 0.66 * p.bodyScale[2]]}>
            <mesh>
              <sphereGeometry args={[eyeR, 22, 18]} />
              <meshStandardMaterial color="#f4f9fc" roughness={0.25} metalness={0} />
            </mesh>
            <mesh position={[side * 0.03 + lookAtX * 0.05, pose === "sad" ? -0.05 : 0.0, eyeR * 0.72]}>
              <sphereGeometry args={[eyeR * (pose === "scared" ? 0.36 : 0.45), 18, 14]} />
              <meshStandardMaterial color="#0b2233" roughness={0.2} />
            </mesh>
            {/* eyelid */}
            <mesh
              visible={blink > 0.06}
              position={[0, (1 - blink) * eyeR * 1.05, 0]}
              scale={[1.04, Math.max(0.06, blink), 1.04]}
            >
              <sphereGeometry args={[eyeR * 1.02, 20, 16]} />
              <meshStandardMaterial color={bodyColour} roughness={0.6} />
            </mesh>
          </group>
        ))}

        {/* mouth */}
        <mesh position={[0, -0.24 * p.bodyScale[1], 0.7 * p.bodyScale[2]]} scale={[0.22, mouthOpen * 0.55, 0.16]}>
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial color="#5c1a10" roughness={0.7} />
        </mesh>

        {/* arms */}
        {Array.from({ length: ARMS }).map((_, a) => (
          <group key={a} rotation={[0, (a / ARMS) * Math.PI * 2 + 0.2, 0]}>
            <group position={[0.5 * p.bodyScale[0], -0.55 * p.bodyScale[1], 0]} rotation={[0, 0, -p.tilt]}>
              <ArmSegment
                i={0}
                arm={a}
                frame={frame}
                pose={p}
                radius={0.23}
                length={0.46}
                colour={bodyColour}
                dark={armDark}
              />
            </group>
          </group>
        ))}

        {/* hearts */}
        {hearts
          ? [0, 1, 2].map((i) => {
              const beat = 1 + Math.max(0, Math.sin(frame * 0.42 + i * 0.6)) * 0.22;
              const stopped = hearts === "stop" && i === 2;
              const colour = hearts === "blue" ? "#4fa8e0" : stopped ? "#5b6472" : "#ef4444";
              return (
                <mesh
                  key={i}
                  position={[-0.78 + i * 0.78, 1.12 + (i === 1 ? 0.14 : 0), -0.45]}
                  scale={stopped ? 0.13 : 0.16 * beat}
                >
                  <sphereGeometry args={[1, 18, 14]} />
                  <meshStandardMaterial
                    color={colour}
                    emissive={colour}
                    emissiveIntensity={stopped ? 0.05 : 0.45}
                    roughness={0.35}
                  />
                </mesh>
              );
            })
          : null}
      </group>
    </group>
  );
};

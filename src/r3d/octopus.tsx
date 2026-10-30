import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";
import { contactShadow, octopusSkin } from "./materials";
import type { Pose } from "./rig";
import { useMouth } from "./voice";

const SEGMENTS = 6;
const ARMS = 8;

const ArmSegment: React.FC<{
  i: number;
  arm: number;
  frame: number;
  pose: Pose;
  radius: number;
  length: number;
  colour: THREE.Color;
  dark: THREE.Color;
}> = ({ i, arm, frame, pose, radius, length, colour, dark }) => {
  const wobble = Math.sin(frame * 0.22 + arm * 0.9 + i * 0.62);
  const curl = pose.armCurl + wobble * pose.armWave * (0.6 + i * 0.14);
  const twist = Math.sin(frame * 0.15 + arm * 1.4 + i * 0.3) * 0.09;
  const r0 = radius * (1 - i / (SEGMENTS + 1));
  const r1 = radius * (1 - (i + 1) / (SEGMENTS + 1));

  return (
    <group position={[0, i === 0 ? 0 : -length, 0]} rotation={[curl, 0, twist]}>
      <mesh position={[0, -length * 0.52, 0]}>
        <cylinderGeometry args={[r1 * 0.94, r0 * 1.06, length * 1.22, 12, 1]} />
        <meshStandardMaterial color={i < 3 ? colour : dark} roughness={0.62} metalness={0.02} />
      </mesh>
      {i < SEGMENTS - 1 ? (
        <ArmSegment i={i + 1} arm={arm} frame={frame} pose={pose} radius={radius} length={length} colour={colour} dark={dark} />
      ) : null}
    </group>
  );
};

export const Octo3D: React.FC<{
  position?: [number, number, number];
  scale?: number;
  pose: Pose;
  talking?: boolean;
  phase?: number;
  tint?: string;
  hearts?: "red" | "blue" | "stop";
}> = ({ position = [0, 0, 0], scale = 1, pose, talking = false, phase = 0, tint, hearts }) => {
  const frame = useCurrentFrame();
  const env = useMouth();

  const skin = useMemo(() => octopusSkin(tint ?? "#ff7f4d", "rgba(206,84,40,.22)", true), [tint]);
  const shadow = useMemo(() => contactShadow(), []);
  const bodyColour = useMemo(() => new THREE.Color(tint ?? "#ff7f4d"), [tint]);
  const armDark = useMemo(() => bodyColour.clone().multiplyScalar(0.72), [bodyColour]);

  const jaw = talking ? Math.max(0.06, env) : pose.jaw;
  const tremble = pose.tremble * Math.sin(frame * 2.3) * 0.03;
  const blinkCyc = (frame + phase * 53) % 132;
  const blink = blinkCyc < 7 ? Math.sin((blinkCyc / 7) * Math.PI) : 0;
  const lid = Math.min(1.6, Math.max(0.06, pose.eyeOpen * (1 - blink)));

  return (
    <group position={position} scale={scale}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.05, 0]}>
        <planeGeometry args={[4.2, 4.2]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} opacity={0.55} />
      </mesh>

      <group position={[tremble, pose.y, 0]} scale={[pose.sx, pose.sy, pose.sx]} rotation={[0, 0, pose.lean + tremble]}>
        {/* mantle */}
        <mesh rotation={[pose.headPitch, pose.headYaw, 0]}>
          <sphereGeometry args={[1, 40, 30]} />
          <meshStandardMaterial
            map={skin}
            color="#ffffff"
            roughness={0.55}
            metalness={0.03}
            emissive="#3a1508"
            emissiveIntensity={0.35}
          />
        </mesh>

        {/* eyes */}
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.31, 0.22, 0.68]} rotation={[0, 0, pose.brow * -0.35 * side]}>
            <mesh scale={[1, Math.min(1.25, lid), 1]}>
              <sphereGeometry args={[0.27, 22, 18]} />
              <meshStandardMaterial color="#f4f9fc" roughness={0.25} />
            </mesh>
            <mesh position={[side * 0.03, 0, 0.19]} scale={Math.min(1.2, lid)}>
              <sphereGeometry args={[0.12, 18, 14]} />
              <meshStandardMaterial color="#0b2233" roughness={0.2} />
            </mesh>
            {/* lid */}
            <mesh visible={lid < 0.9} position={[0, (1 - lid) * 0.3, 0]} scale={[1.05, Math.max(0.06, 1 - lid + 0.06), 1.05]}>
              <sphereGeometry args={[0.28, 20, 16]} />
              <meshStandardMaterial color={bodyColour} roughness={0.6} />
            </mesh>
          </group>
        ))}

        {/* mouth */}
        <mesh position={[0, -0.24, 0.72]} scale={[0.22, jaw * 0.55, 0.16]}>
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial color="#5c1a10" roughness={0.7} />
        </mesh>

        {/* arms */}
        {Array.from({ length: ARMS }).map((_, a) => (
          <group key={a} rotation={[0, (a / ARMS) * Math.PI * 2 + 0.2, 0]}>
            <group position={[0.5, -0.55, 0]} rotation={[0, 0, -pose.armSpread]}>
              <ArmSegment i={0} arm={a} frame={frame} pose={pose} radius={0.23} length={0.46} colour={bodyColour} dark={armDark} />
            </group>
          </group>
        ))}

        {hearts
          ? [0, 1, 2].map((i) => {
              const beat = 1 + Math.max(0, Math.sin(frame * 0.42 + i * 0.6)) * 0.22;
              const stopped = hearts === "stop" && i === 2;
              const colour = hearts === "blue" ? "#4fa8e0" : stopped ? "#5b6472" : "#ef4444";
              return (
                <mesh key={i} position={[-0.78 + i * 0.78, 1.12 + (i === 1 ? 0.14 : 0), -0.45]} scale={stopped ? 0.13 : 0.16 * beat}>
                  <sphereGeometry args={[1, 18, 14]} />
                  <meshStandardMaterial color={colour} emissive={colour} emissiveIntensity={stopped ? 0.05 : 0.45} roughness={0.35} />
                </mesh>
              );
            })
          : null}
      </group>
    </group>
  );
};

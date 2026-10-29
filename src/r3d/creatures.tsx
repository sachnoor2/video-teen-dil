import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";
import { contactShadow, shellSkin } from "./materials";

const netTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const c = canvas.getContext("2d");
  if (c) {
    c.clearRect(0, 0, 512, 512);
    c.strokeStyle = "rgba(232,244,252,.85)";
    c.lineWidth = 5;
    for (let i = 0; i <= 512; i += 46) {
      c.beginPath();
      c.moveTo(i, 0);
      c.lineTo(i + 40, 512);
      c.stroke();
      c.beginPath();
      c.moveTo(0, i);
      c.lineTo(512, i + 40);
      c.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
};

/* ------------------------------------------------------------------ fish */
export const Fish3D: React.FC<{
  position?: [number, number, number];
  scale?: number;
  colour?: string;
  stripe?: boolean;
  faceLeft?: boolean;
  phase?: number;
  speed?: number;
}> = ({ position = [0, 0, 0], scale = 1, colour = "#ff8a3d", stripe = false, faceLeft = false, phase = 0, speed = 1 }) => {
  const frame = useCurrentFrame();
  const beat = Math.sin(frame * 0.5 * speed + phase);
  const bob = Math.sin(frame * 0.08 + phase) * 0.12;
  const col = useMemo(() => new THREE.Color(colour), [colour]);
  const dark = useMemo(() => col.clone().multiplyScalar(0.62), [col]);

  return (
    <group position={[position[0], position[1] + bob, position[2]]} scale={scale} rotation={[0, faceLeft ? Math.PI : 0, beat * 0.06]}>
      {/* body */}
      <mesh scale={[1.05, 0.68, 0.46]}>
        <sphereGeometry args={[1, 28, 20]} />
        <meshStandardMaterial color={col} roughness={0.42} metalness={0.06} />
      </mesh>
      {/* belly highlight */}
      <mesh position={[0, -0.16, 0.06]} scale={[0.86, 0.42, 0.44]}>
        <sphereGeometry args={[1, 20, 14]} />
        <meshStandardMaterial color="#fff2e2" roughness={0.5} opacity={0.85} transparent />
      </mesh>
      {/* tail */}
      <group position={[-1.02, 0, 0]} rotation={[0, 0, beat * 0.5]}>
        <mesh position={[-0.3, 0, 0]} scale={[0.34, 0.5, 0.06]}>
          <coneGeometry args={[1, 1, 4]} />
          <meshStandardMaterial color={dark} roughness={0.5} />
        </mesh>
      </group>
      {/* dorsal fin */}
      <mesh position={[-0.05, 0.55, 0]} scale={[0.42, 0.36, 0.05]}>
        <coneGeometry args={[1, 1, 4]} />
        <meshStandardMaterial color={dark} roughness={0.5} />
      </mesh>
      {/* stripes */}
      {stripe
        ? [0.18, -0.24].map((sx) => (
            <mesh key={sx} position={[sx, 0, 0]} scale={[0.09, 0.66, 0.47]}>
              <sphereGeometry args={[1, 16, 12]} />
              <meshStandardMaterial color="#fffdf6" roughness={0.45} />
            </mesh>
          ))
        : null}
      {/* eyes */}
      {[1, -1].map((side) => (
        <group key={side} position={[0.62, 0.14, side * 0.3]}>
          <mesh>
            <sphereGeometry args={[0.13, 16, 12]} />
            <meshStandardMaterial color="#f7fbfd" roughness={0.2} />
          </mesh>
          <mesh position={[0.06, 0, side * 0.08]}>
            <sphereGeometry args={[0.07, 12, 10]} />
            <meshStandardMaterial color="#0b2233" roughness={0.15} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/* ---------------------------------------------------------------- turtle */
export const Turtle3D: React.FC<{
  position?: [number, number, number];
  scale?: number;
  phase?: number;
  faceLeft?: boolean;
}> = ({ position = [0, 0, 0], scale = 1, phase = 0, faceLeft = false }) => {
  const frame = useCurrentFrame();
  const shell = useMemo(() => shellSkin(), []);
  const shadow = useMemo(() => contactShadow(), []);
  const paddle = Math.sin(frame * 0.09 + phase);
  const bob = Math.sin(frame * 0.05 + phase) * 0.1;

  return (
    <group position={[position[0], position[1] + bob, position[2]]} scale={scale} rotation={[0, faceLeft ? Math.PI : 0, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.95, 0]}>
        <planeGeometry args={[4.6, 4.6]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} opacity={0.4} />
      </mesh>
      {/* shell */}
      <mesh scale={[1.25, 0.66, 1.35]}>
        <sphereGeometry args={[1, 32, 22]} />
        <meshStandardMaterial map={shell} color="#ffffff" roughness={0.72} />
      </mesh>
      {/* plastron */}
      <mesh position={[0, -0.42, 0]} scale={[1.1, 0.22, 1.2]}>
        <sphereGeometry args={[1, 22, 16]} />
        <meshStandardMaterial color="#c9d8a8" roughness={0.75} />
      </mesh>
      {/* neck + head */}
      <group position={[1.12, 0.06, 0]} rotation={[0, 0, -0.12 + Math.sin(frame * 0.06 + phase) * 0.08]}>
        <mesh position={[0.22, 0, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.19, 0.5, 0.19]}>
          <cylinderGeometry args={[1, 1, 1, 14]} />
          <meshStandardMaterial color="#9fbf7a" roughness={0.68} />
        </mesh>
        <mesh position={[0.55, 0.02, 0]} scale={[0.42, 0.36, 0.38]}>
          <sphereGeometry args={[1, 24, 18]} />
          <meshStandardMaterial color="#a9c884" roughness={0.66} />
        </mesh>
        {[1, -1].map((side) => (
          <group key={side} position={[0.74, 0.1, side * 0.22]}>
            <mesh>
              <sphereGeometry args={[0.1, 14, 12]} />
              <meshStandardMaterial color="#0b2233" roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>
      {/* flippers */}
      {[
        [0.75, 0.02, 0.95, 0.5],
        [0.75, 0.02, -0.95, -0.5],
        [-0.72, 0.02, 0.9, 0.35],
        [-0.72, 0.02, -0.9, -0.35],
      ].map(([fx, fy, fz, rot], i) => (
        <group key={i} position={[fx, fy, fz]} rotation={[paddle * (i < 2 ? 0.5 : 0.35), 0, rot]}>
          <mesh position={[fz > 0 ? 0.18 : -0.18, 0, fz > 0 ? 0.32 : -0.32]} scale={[0.5, 0.12, 0.34]}>
            <sphereGeometry args={[1, 18, 12]} />
            <meshStandardMaterial color="#8fae6c" roughness={0.7} />
          </mesh>
        </group>
      ))}
      {/* tail */}
      <mesh position={[-1.28, -0.06, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.14, 0.34, 0.14]}>
        <coneGeometry args={[1, 1, 10]} />
        <meshStandardMaterial color="#8fae6c" roughness={0.7} />
      </mesh>
    </group>
  );
};

/* ------------------------------------------------------------- barracuda */
export const Barracuda3D: React.FC<{
  position?: [number, number, number];
  scale?: number;
  faceLeft?: boolean;
  phase?: number;
}> = ({ position = [0, 0, 0], scale = 1, faceLeft = false, phase = 0 }) => {
  const frame = useCurrentFrame();
  const undulate = Math.sin(frame * 0.14 + phase);
  const beat = Math.sin(frame * 0.34 + phase);

  return (
    <group
      position={position}
      scale={scale}
      rotation={[0, faceLeft ? Math.PI : 0, undulate * 0.05]}
    >
      {/* body */}
      <mesh scale={[2.15, 0.44, 0.36]}>
        <sphereGeometry args={[1, 30, 20]} />
        <meshStandardMaterial color="#a8bfd0" roughness={0.34} metalness={0.28} />
      </mesh>
      {/* snout */}
      <mesh position={[2.05, 0.02, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[0.24, 0.8, 0.24]}>
        <coneGeometry args={[1, 1, 14]} />
        <meshStandardMaterial color="#b9cddb" roughness={0.32} metalness={0.3} />
      </mesh>
      {/* jaw + teeth */}
      <mesh position={[1.55, -0.1, 0]} scale={[0.5, 0.06, 0.24]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#7b93a6" roughness={0.5} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[1.25 + i * 0.16, -0.02, 0.12]} scale={[0.045, 0.12, 0.045]}>
          <coneGeometry args={[1, 1, 6]} />
          <meshStandardMaterial color="#fffdf6" roughness={0.4} />
        </mesh>
      ))}
      {/* dorsal + tail */}
      <mesh position={[-0.1, 0.5, 0]} scale={[0.42, 0.34, 0.05]}>
        <coneGeometry args={[1, 1, 4]} />
        <meshStandardMaterial color="#7b93a6" roughness={0.5} />
      </mesh>
      <group position={[-2.05, 0, 0]} rotation={[0, 0, beat * 0.42]}>
        <mesh position={[-0.34, 0, 0]} scale={[0.42, 0.52, 0.05]}>
          <coneGeometry args={[1, 1, 4]} />
          <meshStandardMaterial color="#8ba5b8" roughness={0.45} />
        </mesh>
      </group>
      {/* eyes */}
      {[1, -1].map((side) => (
        <group key={side} position={[1.62, 0.14, side * 0.2]}>
          <mesh>
            <sphereGeometry args={[0.12, 16, 12]} />
            <meshStandardMaterial color="#f7fbfd" roughness={0.2} />
          </mesh>
          <mesh position={[0.04, 0, side * 0.07]}>
            <sphereGeometry args={[0.065, 12, 10]} />
            <meshStandardMaterial color="#0b2233" roughness={0.15} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/* ------------------------------------------------------------------ crab */
export const Crab3D: React.FC<{
  position?: [number, number, number];
  scale?: number;
  phase?: number;
}> = ({ position = [0, 0, 0], scale = 1, phase = 0 }) => {
  const frame = useCurrentFrame();
  const scuttle = Math.sin(frame * 0.3 + phase);
  return (
    <group position={position} scale={scale} rotation={[0, Math.sin(frame * 0.05 + phase) * 0.3, 0]}>
      <mesh scale={[0.78, 0.42, 0.66]}>
        <sphereGeometry args={[1, 24, 18]} />
        <meshStandardMaterial color="#d94a3d" roughness={0.55} />
      </mesh>
      {/* eye stalks */}
      {[1, -1].map((side) => (
        <group key={side} position={[0.3, 0.34, side * 0.2]}>
          <mesh position={[0, 0.16, 0]} scale={[0.05, 0.34, 0.05]}>
            <cylinderGeometry args={[1, 1, 1, 8]} />
            <meshStandardMaterial color="#c13f34" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.36, 0]}>
            <sphereGeometry args={[0.1, 14, 12]} />
            <meshStandardMaterial color="#fffdf6" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.36, 0.07]}>
            <sphereGeometry args={[0.05, 10, 8]} />
            <meshStandardMaterial color="#0b2233" />
          </mesh>
        </group>
      ))}
      {/* claws */}
      {[1, -1].map((side) => (
        <group key={side} position={[0.62, 0.1, side * 0.42]} rotation={[0, 0, scuttle * 0.2 * side]}>
          <mesh scale={[0.3, 0.2, 0.2]}>
            <sphereGeometry args={[1, 16, 12]} />
            <meshStandardMaterial color="#e0584a" roughness={0.5} />
          </mesh>
          <mesh position={[0.3, 0.06, 0]} rotation={[0, 0, -0.5]} scale={[0.26, 0.09, 0.12]}>
            <coneGeometry args={[1, 1, 10]} />
            <meshStandardMaterial color="#c13f34" roughness={0.5} />
          </mesh>
        </group>
      ))}
      {/* legs */}
      {[0, 1, 2].map((i) =>
        [1, -1].map((side) => (
          <mesh
            key={`${i}-${side}`}
            position={[-0.15 - i * 0.22, -0.05, side * 0.55]}
            rotation={[side * (0.5 + i * 0.12), 0, scuttle * 0.16 * (i % 2 ? 1 : -1)]}
            scale={[0.05, 0.5, 0.05]}
          >
            <cylinderGeometry args={[1, 0.7, 1, 8]} />
            <meshStandardMaterial color="#b8402f" roughness={0.6} />
          </mesh>
        )),
      )}
    </group>
  );
};

/* ----------------------------------------------------------------- props */
export const Net3D: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  size?: [number, number];
  opacity?: number;
}> = ({ position = [0, 0, 0], rotation = [0, 0, 0], size = [11, 8], opacity = 0.95 }) => {
  const tex = useMemo(() => netTexture(), []);
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[size[0], size[1], 1, 1]} />
      <meshStandardMaterial map={tex} transparent opacity={opacity} side={THREE.DoubleSide} roughness={0.9} depthWrite={false} />
    </mesh>
  );
};

export const RockGap3D: React.FC<{ position?: [number, number, number]; scale?: number }> = ({
  position = [0, 0, 0],
  scale = 1,
}) => {
  const rand = useMemo(() => {
    let s = 11;
    return () => {
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    };
  }, []);
  const rocks = useMemo(
    () =>
      [
        [-1.5, 0, 0, 1.5],
        [1.5, 0, 0, 1.5],
      ].map(([x, , z, r]) => ({ x, z, r, rot: rand() * Math.PI })),
    [rand],
  );
  return (
    <group position={position} scale={scale}>
      {rocks.map((r, i) => (
        <mesh key={i} position={[r.x, 0, r.z]} rotation={[0.2, r.rot, 0.1]} scale={[r.r, r.r * 1.5, r.r]}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color="#2f5468" roughness={0.95} flatShading />
        </mesh>
      ))}
    </group>
  );
};

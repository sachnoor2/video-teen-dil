import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { World, type Mood } from "./world";

export type Cam = {
  from: [number, number, number];
  to?: [number, number, number];
  target: [number, number, number];
  fov?: number;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const CameraRig: React.FC<{ cam: Cam; dur: number }> = ({ cam, dur }) => {
  const frame = useCurrentFrame();
  const { camera } = useThree();
  const t = interpolate(frame, [0, Math.max(1, dur - 1)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const to = cam.to ?? cam.from;
  const drift = Math.sin(frame * 0.05) * 0.06;
  const pos: [number, number, number] = [
    lerp(cam.from[0], to[0], t) + drift,
    lerp(cam.from[1], to[1], t) + Math.sin(frame * 0.04) * 0.05,
    lerp(cam.from[2], to[2], t),
  ];
  camera.position.set(pos[0], pos[1], pos[2]);
  camera.lookAt(cam.target[0], cam.target[1], cam.target[2]);
  const persp = camera as unknown as { fov: number; updateProjectionMatrix: () => void };
  const fov = cam.fov ?? 42;
  if (persp.fov !== fov) {
    persp.fov = fov;
    persp.updateProjectionMatrix();
  }
  return null;
};

export const Stage3D: React.FC<{
  cam: Cam;
  dur: number;
  mood: Mood;
  children: React.ReactNode;
  ui?: React.ReactNode;
}> = ({ cam, dur, mood, children, ui }) => {
  const { width, height } = useVideoConfig();
  return (
    <div style={{ position: "absolute", inset: 0, background: "#030e1a" }}>
      <ThreeCanvas
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        dpr={1}
      >
        <CameraRig cam={cam} dur={dur} />
        <World mood={mood} />
        {children}
      </ThreeCanvas>
      {ui ? <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>{ui}</div> : null}
    </div>
  );
};

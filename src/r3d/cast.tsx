import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Barracuda3D, Crab3D, Fish3D, Net3D, RockGap3D, Turtle3D } from "./creatures";
import { Octo3D } from "./octopus";
import type { CastItem, Prop } from "../shots";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const CastMember: React.FC<{ c: CastItem; dur: number }> = ({ c, dur }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, Math.max(1, dur - 1)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const to = c.to ?? c.at;
  const pos: [number, number, number] = [lerp(c.at[0], to[0], t), lerp(c.at[1], to[1], t), lerp(c.at[2], to[2], t)];

  switch (c.kind) {
    case "octo":
      return (
        <Octo3D
          position={pos}
          scale={c.scale ?? 1}
          pose={c.pose ?? "idle"}
          phase={c.phase ?? 0}
          tint={c.tint}
          hearts={c.hearts}
        />
      );
    case "fish":
      return (
        <Fish3D
          position={pos}
          scale={c.scale ?? 0.5}
          colour={c.colour}
          stripe={c.stripe}
          faceLeft={c.faceLeft}
          phase={c.phase ?? 0}
        />
      );
    case "turtle":
      return <Turtle3D position={pos} scale={c.scale ?? 0.6} phase={c.phase ?? 0} faceLeft={c.faceLeft} />;
    case "barracuda":
      return <Barracuda3D position={pos} scale={c.scale ?? 0.5} phase={c.phase ?? 0} faceLeft={c.faceLeft} />;
    case "crab":
      return <Crab3D position={pos} scale={c.scale ?? 0.6} phase={c.phase ?? 0} />;
    default:
      return null;
  }
};

export const Prop3D: React.FC<{ p: Prop; kind: "net" | "gap"; dur: number }> = ({ p, kind, dur }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, Math.max(1, dur - 1)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const to = p.to ?? p.at;
  const pos: [number, number, number] = [lerp(p.at[0], to[0], t), lerp(p.at[1], to[1], t), lerp(p.at[2], to[2], t)];

  if (kind === "net") {
    return (
      <Net3D
        position={pos}
        rotation={p.rot ?? [0, 0, 0]}
        opacity={p.opacity ?? 0.9}
        size={[9 * (p.scale ?? 1), 7 * (p.scale ?? 1)]}
      />
    );
  }
  return <RockGap3D position={pos} scale={p.scale ?? 1} />;
};

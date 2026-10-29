import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { body, display, theme } from "./theme";

/* Text overlay. It sits in DOM above the WebGL canvas, so it stays crisp and
   can never be moved by the 3D camera. */

export const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);

export const Say: React.FC<{
  name: string;
  text: string;
  colour?: string;
  x?: number;
  y?: number;
  w?: number;
  delay?: number;
  tail?: "left" | "right";
}> = ({ name, text, colour = theme.coral, x = 140, y = 104, w = 820, delay = 5, tail = "left" }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        opacity: t,
        transform: `translateY(${(1 - t) * 26}px) scale(${0.96 + 0.04 * t})`,
      }}
    >
      <div
        style={{
          display: "inline-block",
          background: colour,
          color: "#fffdf6",
          fontFamily: display,
          fontWeight: 700,
          fontSize: 32,
          padding: "4px 22px 8px",
          borderRadius: 999,
          marginBottom: 12,
          boxShadow: "0 10px 22px rgba(0,0,0,.35)",
        }}
      >
        {name}
      </div>
      <div
        style={{
          position: "relative",
          background: theme.paper,
          borderRadius: 32,
          padding: "28px 38px 32px",
          fontFamily: body,
          fontWeight: 500,
          fontSize: 44,
          lineHeight: 1.5,
          color: theme.ink,
          boxShadow: "0 26px 54px rgba(0,0,0,.38), inset 0 -8px 0 rgba(0,0,0,.05)",
        }}
      >
        {text}
        <div
          style={{
            position: "absolute",
            bottom: -16,
            left: tail === "left" ? 66 : undefined,
            right: tail === "right" ? 66 : undefined,
            width: 40,
            height: 40,
            background: theme.paper,
            transform: "rotate(45deg)",
            borderRadius: 8,
          }}
        />
      </div>
    </div>
  );
};

export const Narr: React.FC<{ text: string; delay?: number }> = ({ text, delay = 4 }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 74,
        display: "flex",
        justifyContent: "center",
        opacity: t,
        transform: `translateY(${(1 - t) * 22}px)`,
      }}
    >
      <div
        style={{
          maxWidth: 1460,
          background: "rgba(3,20,34,.78)",
          border: "2px solid rgba(253,230,138,.34)",
          borderRadius: 28,
          padding: "24px 44px 28px",
          fontFamily: body,
          fontWeight: 500,
          fontSize: 42,
          lineHeight: 1.45,
          color: theme.cream,
          textAlign: "center",
          boxShadow: "0 22px 46px rgba(0,0,0,.45)",
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const TitleCard: React.FC<{ main: string; sub?: string }> = ({ main, sub }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t2 = interpolate(frame, [14, 34], [0, 0.95], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 120,
        textAlign: "center",
        opacity: t,
        transform: `translateY(${(1 - t) * 30}px)`,
      }}
    >
      <div
        style={{
          fontFamily: body,
          fontWeight: 700,
          fontSize: 158,
          lineHeight: 1.08,
          color: theme.gold,
          textShadow: "0 8px 0 rgba(120,60,10,.35), 0 24px 54px rgba(0,0,0,.6), 0 0 90px rgba(253,230,138,.5)",
        }}
      >
        {main}
      </div>
      {sub ? (
        <div
          style={{
            marginTop: 4,
            fontFamily: body,
            fontWeight: 600,
            fontSize: 50,
            color: theme.cream,
            opacity: t2,
            textShadow: "0 6px 22px rgba(0,0,0,.6)",
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};

export const Bar: React.FC = () => {
  const frame = useCurrentFrame();
  return null;
};

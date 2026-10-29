import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { body, display, theme } from "./theme";

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

export const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);

export const easeOut = (t: number): number => Easing.out(Easing.cubic)(clamp01(t));

export const enter = (frame: number, delay = 0, len = 20): number => easeOut((frame - delay) / len);

export const bob = (frame: number, amp = 12, period = 70, phase = 0): number =>
  Math.sin((frame / period) * Math.PI * 2 + phase) * amp;

export const shade = (hex: string, amt: number): string => {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
  const b = Math.max(0, Math.min(255, (n & 255) + amt));
  return `rgb(${r},${g},${b})`;
};

/* ------------------------------------------------------------------ */
/* 3D stage                                                            */
/* ------------------------------------------------------------------ */

export const Stage: React.FC<{
  yaw?: number;
  pitch?: number;
  zoom?: number;
  /** Text lives here, outside the perspective space, so it can never be
   *  magnified or shifted off frame by a depth layer. */
  ui?: React.ReactNode;
  children: React.ReactNode;
}> = ({ yaw = 0, pitch = 0, zoom = 0, ui, children }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: theme.waterDeep }}>
    <div
      style={{
        position: "absolute",
        inset: 0,
        perspective: 1500,
        perspectiveOrigin: "50% 45%",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: `translateZ(${zoom}px) rotateX(${pitch}deg) rotateY(${yaw}deg)`,
        }}
      >
        {children}
      </div>
    </div>
    {ui ? <div style={{ position: "absolute", inset: 0, zIndex: 20 }}>{ui}</div> : null}
  </div>
);

export const Layer: React.FC<{
  z: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ z, children, style }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      transformStyle: "preserve-3d",
      transform: `translateZ(${z}px)`,
      ...style,
    }}
  >
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* sea                                                                 */
/* ------------------------------------------------------------------ */

const MOODS = {
  day: { top: "#1b7fa8", mid: "#0b4f74", deep: "#03203a", shaft: 0.8 },
  dusk: { top: "#14597f", mid: "#083a5c", deep: "#021627", shaft: 0.5 },
  storm: { top: "#123b52", mid: "#07202f", deep: "#01080f", shaft: 0.22 },
  night: { top: "#0a3358", mid: "#05203c", deep: "#010d1c", shaft: 0.3 },
} as const;

export const Sea: React.FC<{ mood?: keyof typeof MOODS }> = ({ mood = "day" }) => {
  const frame = useCurrentFrame();
  const pal = MOODS[mood];

  return (
    <>
      <Layer z={-1500}>
        {/* This layer sits 1500px back, so perspective shrinks it by half.
            Scaling it back up keeps it full-bleed without a giant raster layer. */}
        <div
          style={{
            position: "absolute",
            inset: -40,
            transform: "scale(2.12)",
            transformOrigin: "50% 45%",
            background: `linear-gradient(180deg, ${pal.top} 0%, ${pal.mid} 42%, ${pal.deep} 100%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: -40,
            transform: "scale(2.12)",
            transformOrigin: "50% 45%",
            background:
              "radial-gradient(ellipse at 50% -8%, rgba(195,242,255,.34), rgba(195,242,255,0) 58%)",
          }}
        />
      </Layer>

      {/* far reef ridge */}
      <Layer z={-620}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              bottom: -220,
              left: -120 + i * 380,
              width: 520,
              height: 420 + (i % 3) * 130,
              borderRadius: "50% 50% 0 0 / 70% 70% 0 0",
              background: `linear-gradient(180deg, ${shade(pal.mid, 34)}, ${pal.mid} 60%, ${pal.deep})`,
              opacity: 0.9,
            }}
          />
        ))}
      </Layer>

      {/* mid rocks + kelp */}
      <Layer z={-340}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={`r${i}`}
            style={{
              position: "absolute",
              bottom: -140,
              left: 60 + i * 520,
              width: 330,
              height: 300 + (i % 2) * 90,
              borderRadius: "46% 54% 8% 8% / 60% 58% 6% 6%",
              background:
                "radial-gradient(ellipse at 34% 12%, #55899f 0%, #2f5468 34%, #17323f 74%, #0a1e2a 100%)",
              boxShadow:
                "inset 0 4px 0 rgba(198,240,255,.16), inset -18px -20px 44px rgba(0,0,0,.45), 0 30px 60px rgba(0,0,0,.45)",
            }}
          />
        ))}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const sway = Math.sin(frame / 34 + i * 1.1) * 12;
          return (
            <div
              key={`k${i}`}
              style={{
                position: "absolute",
                bottom: -60,
                left: 120 + i * 320,
                width: 34,
                height: 300 + (i % 3) * 110,
                borderRadius: 24,
                background: `linear-gradient(180deg, #2f7d5f, #10402f)`,
                transformOrigin: "bottom center",
                transform: `rotate(${sway}deg)`,
                opacity: 0.9,
              }}
            />
          );
        })}
      </Layer>

      {/* sand floor */}
      <Layer z={-520}>
        <div
          style={{
            position: "absolute",
            left: -260,
            right: -260,
            bottom: -140,
            height: 620,
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(255,214,150,.24) 0%, rgba(255,214,150,.10) 42%, rgba(255,214,150,0) 72%)",
          }}
        />
      </Layer>
    </>
  );
};

export const Bubbles: React.FC<{ n?: number; z?: number; speed?: number }> = ({
  n = 26,
  z = 330,
  speed = 1,
}) => {
  const frame = useCurrentFrame();
  return (
    <Layer z={z}>
      {Array.from({ length: n }).map((_, i) => {
        const s1 = ((i * 9301 + 49297) % 233280) / 233280;
        const s2 = ((i * 7919 + 104729) % 233280) / 233280;
        const size = 8 + s1 * 26;
        const x = 30 + s2 * 1860;
        const period = 230 + s1 * 210;
        const prog = ((frame * speed + s2 * period) % period) / period;
        const y = 1180 - prog * 1280;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 32% 28%, rgba(255,255,255,.9), rgba(205,245,255,.16) 62%, rgba(255,255,255,0) 74%)",
              border: "1.5px solid rgba(225,250,255,.34)",
              opacity: 0.16 + s1 * 0.32,
              transform: `translateX(${Math.sin((frame + i * 13) / 30) * 14}px)`,
            }}
          />
        );
      })}
    </Layer>
  );
};

export const Vignette: React.FC<{ strength?: number; z?: number; color?: string }> = ({
  strength = 0.55,
  z = 420,
  color = "0,0,0",
}) => (
  <Layer z={z}>
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse at 50% 45%, rgba(${color},0) 38%, rgba(${color},${strength}) 100%)`,
      }}
    />
  </Layer>
);

/* ------------------------------------------------------------------ */
/* Moti the octopus                                                    */
/* ------------------------------------------------------------------ */

const Eyes: React.FC<{ mood: "calm" | "happy" | "scared" | "sad" }> = ({ mood }) => {
  const frame = useCurrentFrame();
  if (mood === "happy") {
    return (
      <>
        {[34, 66].map((lx) => (
          <div
            key={lx}
            style={{
              position: "absolute",
              left: `${lx}%`,
              top: "36%",
              width: 52,
              height: 30,
              marginLeft: -26,
              borderTop: "9px solid #0b2233",
              borderRadius: "60% 60% 0 0 / 100% 100% 0 0",
            }}
          />
        ))}
      </>
    );
  }
  const scared = mood === "scared";
  const sad = mood === "sad";
  return (
    <>
      {[34, 66].map((lx) => (
        <div
          key={lx}
          style={{
            position: "absolute",
            left: `${lx}%`,
            top: "30%",
            width: scared ? 60 : 52,
            height: scared ? 60 : 50,
            marginLeft: scared ? -30 : -26,
            borderRadius: "50%",
            background: "radial-gradient(circle at 40% 32%, #ffffff, #dbe9f2)",
            boxShadow: "inset 0 5px 10px rgba(0,0,0,.22)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: scared ? 12 : 18,
              height: scared ? 12 : 18,
              marginLeft: scared ? -6 : -9,
              marginTop: sad ? -2 : -9,
              borderRadius: "50%",
              background: "#0b2233",
              transform: `translate(${Math.sin(frame / 44) * 3}px, ${sad ? 6 : 0}px)`,
            }}
          />
        </div>
      ))}
    </>
  );
};

export const Octo: React.FC<{
  x?: number;
  y?: number;
  z?: number;
  scale?: number;
  mood?: "calm" | "happy" | "scared" | "sad";
  flat?: number;
  tint?: string;
  showHearts?: boolean;
}> = ({ x = 0, y = 0, z = 0, scale = 1, mood = "calm", flat = 0, tint, showHearts = false }) => {
  const frame = useCurrentFrame();
  const body = tint ?? theme.moti;
  const w = 214 * (1 - 0.62 * flat);
  const h = 250 * (1 + 0.7 * flat);
  const breathe = 1 + Math.sin(frame / 24) * 0.016;
  const floatY = Math.sin(frame / 46) * 10;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 0,
        height: 0,
        transformStyle: "preserve-3d",
        transform: `translate3d(${x}px, ${y + floatY}px, ${z}px) scale(${scale})`,
      }}
    >
      {/* cast shadow on the sea floor */}
      <div
        style={{
          position: "absolute",
          left: -150,
          top: 300,
          width: 300,
          height: 54,
          borderRadius: "50%",
          background: "rgba(0,0,0,.32)",
          filter: "blur(16px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transformStyle: "preserve-3d",
          transform: `scale(${breathe}) rotateY(${Math.sin(frame / 62) * 11}deg)`,
        }}
      >
        {/* arms */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = -104 + i * 29.5;
          const wig = Math.sin(frame / 13 + i * 0.85) * (mood === "scared" ? 16 : 10);
          const len = 178 - Math.abs(i - 3.5) * 12;
          const armW = 26 * (1 - flat * 0.45);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                top: h * 0.5,
                width: armW,
                height: len,
                marginLeft: -armW / 2,
                transformOrigin: "top center",
                transform: `rotate(${a + wig}deg) rotateX(${Math.sin(frame / 17 + i) * 14}deg)`,
                borderRadius: "45% 45% 55% 55% / 16% 16% 84% 84%",
                background: `linear-gradient(180deg, ${body} 0%, ${shade(body, -22)} 58%, ${shade(body, -46)} 100%)`,
                boxShadow: "inset -6px 0 12px rgba(0,0,0,.24), 0 10px 20px rgba(0,0,0,.18)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: -1,
                  top: len * 0.5,
                  width: armW * 1.06,
                  height: len * 0.64,
                  borderRadius: "50% 50% 66% 66% / 24% 24% 76% 76%",
                  transformOrigin: "top center",
                  transform: `rotate(${wig * 1.5}deg)`,
                  background: `linear-gradient(180deg, ${shade(body, -34)}, ${shade(body, -56)})`,
                }}
              />
            </div>
          );
        })}

        {/* mantle / head */}
        <div
          style={{
            position: "absolute",
            left: -w / 2,
            top: -h * 0.44,
            width: w,
            height: h,
            borderRadius: "50% 50% 44% 44% / 56% 56% 44% 44%",
            background: `radial-gradient(circle at 34% 24%, ${shade(body, 62)} 0%, ${body} 40%, ${shade(body, -34)} 76%, ${shade(body, -58)} 100%)`,
            boxShadow:
              "inset -22px -26px 52px rgba(0,0,0,.4), inset 16px 14px 34px rgba(255,255,255,.22), 0 30px 52px rgba(0,0,0,.35)",
            overflow: "hidden",
          }}
        >
          {/* the pearl spots he is named for */}
          {[
            [26, 30],
            [58, 20],
            [44, 48],
            [72, 54],
            [18, 60],
            [38, 72],
          ].map(([sx, sy], i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${sx}%`,
                top: `${sy}%`,
                width: 15,
                height: 15,
                borderRadius: "50%",
                background: "radial-gradient(circle at 35% 30%, #ffffff, rgba(255,255,255,.35))",
                opacity: 0.45,
              }}
            />
          ))}
          <Eyes mood={mood} />
        </div>

        {showHearts &&
          [0, 1, 2].map((i) => (
            <Heart
              key={i}
              x={-96 + i * 96}
              y={-h * 0.62}
              size={i === 2 ? 62 : 74}
              delay={i * 5}
              colour={theme.coral}
            />
          ))}
      </div>
    </div>
  );
};

export const Heart: React.FC<{
  x: number;
  y: number;
  size: number;
  delay?: number;
  colour?: string;
  dim?: boolean;
}> = ({ x, y, size, delay = 0, colour = "#ef4444", dim = false }) => {
  const frame = useCurrentFrame();
  const beat = 1 + Math.max(0, Math.sin((frame - delay) / 7)) * 0.16;
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y,
        width: size,
        height: size,
        transform: `scale(${beat})`,
        opacity: dim ? 0.28 : 1,
        filter: dim ? "grayscale(1)" : "drop-shadow(0 8px 16px rgba(0,0,0,.35))",
      }}
    >
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <path
          d="M16 29S3 20.5 3 11.6C3 6.9 6.7 3.4 11 3.4c2.4 0 4.2 1.1 5 2.4.8-1.3 2.6-2.4 5-2.4 4.3 0 8 3.5 8 8.2C29 20.5 16 29 16 29z"
          fill={colour}
          stroke="rgba(0,0,0,.22)"
          strokeWidth="1"
        />
        <ellipse cx="10.5" cy="9.5" rx="2.6" ry="1.9" fill="rgba(255,255,255,.55)" transform="rotate(-25 10.5 9.5)" />
      </svg>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* other creatures                                                     */
/* ------------------------------------------------------------------ */

export const Fish: React.FC<{
  x?: number;
  y?: number;
  z?: number;
  scale?: number;
  colour?: string;
  stripe?: boolean;
  flip?: boolean;
  phase?: number;
}> = ({ x = 0, y = 0, z = 0, scale = 1, colour = theme.chimti, stripe = false, flip = false, phase = 0 }) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 16 + phase);
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transformStyle: "preserve-3d",
        transform: `translate3d(${x}px, ${y + sway * 10}px, ${z}px) scale(${scale}) scaleX(${flip ? -1 : 1}) rotate(${sway * 3}deg)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -84,
          top: 4,
          width: 86,
          height: 78,
          clipPath: "polygon(100% 50%, 0% 0%, 20% 50%, 0% 100%)",
          background: `linear-gradient(180deg, ${shade(colour, 18)}, ${shade(colour, -46)})`,
          transformOrigin: "right center",
          transform: `rotate(${sway * 9}deg)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -76,
          top: -46,
          width: 176,
          height: 94,
          borderRadius: "50% 50% 50% 50% / 56% 56% 44% 44%",
          background: `radial-gradient(circle at 38% 28%, ${shade(colour, 74)}, ${colour} 44%, ${shade(colour, -50)} 100%)`,
          boxShadow: "inset -12px -14px 26px rgba(0,0,0,.3), 0 16px 26px rgba(0,0,0,.25)",
          overflow: "hidden",
        }}
      >
        {stripe && (
          <>
            <div
              style={{
                position: "absolute",
                left: "30%",
                top: "-8%",
                width: 17,
                height: "116%",
                background: "#fffdf6",
                borderRadius: 10,
                transform: "rotate(7deg)",
                opacity: 0.95,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: "58%",
                top: "-8%",
                width: 17,
                height: "116%",
                background: "#fffdf6",
                borderRadius: 10,
                transform: "rotate(7deg)",
                opacity: 0.95,
              }}
            />
          </>
        )}
        <div
          style={{
            position: "absolute",
            left: "78%",
            top: "26%",
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "#08202f",
          }}
        />
      </div>
    </div>
  );
};

export const Turtle: React.FC<{
  x?: number;
  y?: number;
  z?: number;
  scale?: number;
  phase?: number;
}> = ({ x = 0, y = 0, z = 0, scale = 1, phase = 0 }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 52 + phase) * 12;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transformStyle: "preserve-3d",
        transform: `translate3d(${x}px, ${y + drift}px, ${z}px) scale(${scale}) rotate(${drift * 0.2}deg) rotateY(${Math.sin(frame / 70 + phase) * 10}deg)`,
      }}
    >
      {/* flippers */}
      {[
        [-70, 40, -24],
        [70, 40, 24],
        [-60, 130, 18],
        [60, 130, -18],
      ].map(([fx, fy, rot], i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: fx,
            top: fy,
            width: 96,
            height: 52,
            borderRadius: "50%",
            background: `linear-gradient(180deg, ${shade(theme.dadiSkin, 14)}, ${shade(theme.dadiSkin, -40)})`,
            transform: `rotate(${rot + Math.sin(frame / 22 + i) * 8}deg)`,
            boxShadow: "inset -6px -6px 14px rgba(0,0,0,.24)",
          }}
        />
      ))}
      {/* shell */}
      <div
        style={{
          position: "absolute",
          left: -130,
          top: -10,
          width: 262,
          height: 178,
          borderRadius: "50% 50% 46% 46% / 58% 58% 42% 42%",
          background: `radial-gradient(circle at 36% 24%, ${shade(theme.dadi, 60)}, ${theme.dadi} 46%, ${shade(theme.dadi, -46)} 100%)`,
          boxShadow: "inset -20px -22px 44px rgba(0,0,0,.42), 0 26px 44px rgba(0,0,0,.35)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.3,
            background:
              "repeating-linear-gradient(60deg, rgba(0,0,0,.5) 0 4px, rgba(0,0,0,0) 4px 46px), repeating-linear-gradient(-60deg, rgba(0,0,0,.5) 0 4px, rgba(0,0,0,0) 4px 46px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "18%",
            top: "10%",
            width: "44%",
            height: "36%",
            borderRadius: "50%",
            background: "rgba(255,255,255,.18)",
            filter: "blur(6px)",
          }}
        />
      </div>
      {/* head */}
      <div
        style={{
          position: "absolute",
          left: 118,
          top: 26,
          width: 96,
          height: 90,
          borderRadius: "50% 50% 46% 46% / 54% 54% 46% 46%",
          background: `radial-gradient(circle at 34% 28%, ${shade(theme.dadiSkin, 50)}, ${theme.dadiSkin} 52%, ${shade(theme.dadiSkin, -46)} 100%)`,
          boxShadow: "inset -8px -10px 22px rgba(0,0,0,.3)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 26,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#08202f",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 44,
            top: 28,
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#fff",
          }}
        />
      </div>
    </div>
  );
};

export const Barracuda: React.FC<{
  x?: number;
  y?: number;
  z?: number;
  scale?: number;
  flip?: boolean;
  phase?: number;
}> = ({ x = 0, y = 0, z = 0, scale = 1, flip = false, phase = 0 }) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 18 + phase);
  const c = theme.toothu;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transformStyle: "preserve-3d",
        transform: `translate3d(${x}px, ${y + sway * 8}px, ${z}px) scale(${scale}) scaleX(${flip ? -1 : 1}) rotate(${sway * 2.5}deg) rotateY(${Math.sin(frame / 66 + phase) * 9}deg)`,
      }}
    >
      {/* tail */}
      <div
        style={{
          position: "absolute",
          left: -158,
          top: 6,
          width: 96,
          height: 84,
          clipPath: "polygon(100% 50%, 0% 0%, 22% 50%, 0% 100%)",
          background: `linear-gradient(180deg, ${shade(c, 10)}, ${shade(c, -58)})`,
          transformOrigin: "right center",
          transform: `rotate(${sway * 10}deg)`,
        }}
      />
      {/* dorsal fin */}
      <div
        style={{
          position: "absolute",
          left: -10,
          top: -50,
          width: 120,
          height: 54,
          clipPath: "polygon(0% 100%, 42% 0%, 100% 100%)",
          background: `linear-gradient(180deg, ${shade(c, 4)}, ${shade(c, -52)})`,
        }}
      />
      {/* body */}
      <div
        style={{
          position: "absolute",
          left: -150,
          top: -48,
          width: 330,
          height: 100,
          clipPath: "polygon(0% 44%, 10% 12%, 62% 4%, 100% 44%, 100% 58%, 62% 96%, 10% 88%)",
          background: `linear-gradient(180deg, ${shade(c, 66)} 0%, ${c} 42%, ${shade(c, -62)} 100%)`,
          boxShadow: "inset -14px -16px 30px rgba(0,0,0,.3)",
        }}
      />
      {/* jaw line + teeth */}
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 2,
          width: 92,
          height: 4,
          background: "rgba(0,0,0,.28)",
          transform: "rotate(2deg)",
        }}
      />
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 118 + i * 20,
            top: 4,
            width: 0,
            height: 0,
            borderLeft: "7px solid transparent",
            borderRight: "7px solid transparent",
            borderTop: "14px solid #fffdf6",
          }}
        />
      ))}
      {/* eye */}
      <div
        style={{
          position: "absolute",
          left: 130,
          top: -26,
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: "radial-gradient(circle at 40% 34%, #ffffff, #dbe9f2)",
          boxShadow: "inset 0 3px 6px rgba(0,0,0,.3)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 9,
            top: 9,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#08202f",
          }}
        />
      </div>
    </div>
  );
};

export const Crab: React.FC<{ x?: number; y?: number; z?: number; scale?: number }> = ({
  x = 0,
  y = 0,
  z = 0,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const c = theme.crab;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transformStyle: "preserve-3d",
        transform: `translate3d(${x}px, ${y + Math.sin(frame / 20) * 5}px, ${z}px) scale(${scale})`,
      }}
    >
      {[-1, 1].map((side) =>
        [0, 1, 2].map((i) => (
          <div
            key={`${side}-${i}`}
            style={{
              position: "absolute",
              left: side < 0 ? -86 : 56,
              top: 26 + i * 22,
              width: 46,
              height: 9,
              borderRadius: 6,
              background: shade(c, -34),
              transform: `rotate(${side * (18 + i * 14) + Math.sin(frame / 16 + i) * 6}deg)`,
            }}
          />
        )),
      )}
      <div
        style={{
          position: "absolute",
          left: -62,
          top: -30,
          width: 124,
          height: 82,
          borderRadius: "50% 50% 44% 44% / 58% 58% 42% 42%",
          background: `radial-gradient(circle at 36% 26%, ${shade(c, 62)}, ${c} 46%, ${shade(c, -50)} 100%)`,
          boxShadow: "inset -10px -12px 24px rgba(0,0,0,.35), 0 14px 22px rgba(0,0,0,.3)",
        }}
      >
        {[34, 66].map((lx) => (
          <div
            key={lx}
            style={{
              position: "absolute",
              left: `${lx}%`,
              top: "24%",
              width: 14,
              height: 20,
              marginLeft: -7,
              borderRadius: "50%",
              background: "#fffdf6",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 3,
                top: 5,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#08202f",
              }}
            />
          </div>
        ))}
      </div>
      {[-1, 1].map((side) => (
        <div
          key={side}
          style={{
            position: "absolute",
            left: side < 0 ? -118 : 74,
            top: -52,
            width: 44,
            height: 40,
            borderRadius: "46% 46% 40% 40%",
            background: `radial-gradient(circle at 36% 26%, ${shade(c, 52)}, ${c} 52%, ${shade(c, -46)})`,
            transform: `rotate(${side * (12 + Math.sin(frame / 14) * 12)}deg)`,
          }}
        />
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* props                                                               */
/* ------------------------------------------------------------------ */

export const Net: React.FC<{
  x?: number;
  y?: number;
  z?: number;
  w?: number;
  h?: number;
  rotate?: number;
  opacity?: number;
}> = ({ x = 0, y = 0, z = 0, w = 1100, h = 620, rotate = 0, opacity = 0.9 }) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      width: w,
      height: h,
      marginLeft: -w / 2,
      marginTop: -h / 2,
      opacity,
      transformStyle: "preserve-3d",
      transform: `translate3d(${x}px, ${y}px, ${z}px) rotateX(18deg) rotateZ(${rotate}deg)`,
    }}
  >
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <pattern id="mesh" width="52" height="52" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
          <path d="M0 0 H52 M0 0 V52" stroke="rgba(228,240,248,.55)" strokeWidth="3" fill="none" />
        </pattern>
      </defs>
      <path
        d={`M0 ${h * 0.16} Q ${w / 2} -20 ${w} ${h * 0.16} L ${w} ${h * 0.86} Q ${w / 2} ${h + 20} 0 ${h * 0.86} Z`}
        fill="url(#mesh)"
        stroke="rgba(236,246,252,.8)"
        strokeWidth="7"
      />
    </svg>
  </div>
);

export const RockGap: React.FC<{ x?: number; y?: number; z?: number; scale?: number }> = ({
  x = 0,
  y = 0,
  z = 0,
  scale = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      transformStyle: "preserve-3d",
      transform: `translate3d(${x}px, ${y}px, ${z}px) scale(${scale})`,
    }}
  >
    {[
      [-260, -210, 300, 420],
      [150, -230, 300, 440],
    ].map(([rx, ry, rw, rh], i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: rx,
          top: ry,
          width: rw,
          height: rh,
          borderRadius: "44% 56% 18% 18% / 46% 54% 12% 12%",
          background: "radial-gradient(ellipse at 34% 12%, #55899f 0%, #2f5468 36%, #17323f 76%, #0a1e2a 100%)",
          boxShadow: "inset -18px -18px 40px rgba(0,0,0,.4), 0 26px 46px rgba(0,0,0,.4)",
        }}
      />
    ))}
    <div
      style={{
        position: "absolute",
        left: 26,
        top: 20,
        width: 26,
        height: 300,
        borderRadius: 20,
        background: "linear-gradient(180deg, rgba(180,240,255,.55), rgba(180,240,255,.05))",
        filter: "blur(3px)",
      }}
    />
  </div>
);

/* ------------------------------------------------------------------ */
/* text                                                                */
/* ------------------------------------------------------------------ */

export const Title: React.FC<{ main: string; sub?: string; delay?: number }> = ({
  main,
  sub,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const t = enter(frame, delay, 22);
  const t2 = enter(frame, delay + 14, 22);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 120,
        textAlign: "center",
        transform: `translateY(${(1 - t) * 40}px) scale(${0.92 + 0.08 * t})`,
        opacity: t,
      }}
    >
      <div
        style={{
          fontFamily: body,
          fontWeight: 700,
          fontSize: 150,
          lineHeight: 1.05,
          color: theme.gold,
          textShadow:
            "0 8px 0 rgba(120,60,10,.35), 0 22px 50px rgba(0,0,0,.55), 0 0 90px rgba(253,230,138,.45)",
          letterSpacing: "0.02em",
        }}
      >
        {main}
      </div>
      {sub && (
        <div
          style={{
            marginTop: 18,
            fontFamily: body,
            fontWeight: 600,
            fontSize: 54,
            color: theme.cream,
            opacity: t2 * 0.95,
            transform: `translateY(${(1 - t2) * 24}px)`,
            textShadow: "0 6px 22px rgba(0,0,0,.55)",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
};

export const Say: React.FC<{
  name: string;
  text: string;
  colour?: string;
  x?: number;
  y?: number;
  w?: number;
  delay?: number;
  tail?: "left" | "right";
  z?: number;
}> = ({ name, text, colour = theme.coral, x = 140, y = 96, w = 820, delay = 6, tail = "left", z = 0 }) => {
  const frame = useCurrentFrame();
  const t = enter(frame, delay, 16);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        transformStyle: "preserve-3d",
        transform: `translate3d(0, ${(1 - t) * 34}px, ${z}px) scale(${0.94 + 0.06 * t})`,
        opacity: t,
      }}
    >
      <div
        style={{
          display: "inline-block",
          background: colour,
          color: "#fffdf6",
          fontFamily: display,
          fontWeight: 700,
          fontSize: 34,
          padding: "4px 24px 8px",
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
          borderRadius: 34,
          padding: "30px 40px 34px",
          fontFamily: body,
          fontWeight: 500,
          fontSize: 46,
          lineHeight: 1.5,
          color: theme.ink,
          boxShadow: "0 26px 54px rgba(0,0,0,.38), inset 0 -8px 0 rgba(0,0,0,.05)",
        }}
      >
        {text}
        <div
          style={{
            position: "absolute",
            bottom: -18,
            left: tail === "left" ? 70 : undefined,
            right: tail === "right" ? 70 : undefined,
            width: 42,
            height: 42,
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
  const t = enter(frame, delay, 18);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 78,
        display: "flex",
        justifyContent: "center",
        transform: `translateY(${(1 - t) * 26}px)`,
        opacity: t,
      }}
    >
      <div
        style={{
          maxWidth: 1480,
          background: "rgba(3,20,34,.78)",
          border: "2px solid rgba(253,230,138,.34)",
          borderRadius: 30,
          padding: "26px 46px 30px",
          fontFamily: body,
          fontWeight: 500,
          fontSize: 44,
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

export const Fade: React.FC<{ children: React.ReactNode; len?: number }> = ({ children, len = 14 }) => {
  const frame = useCurrentFrame();
  return <div style={{ opacity: enter(frame, 0, len) }}>{children}</div>;
};

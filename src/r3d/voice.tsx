import React from "react";
import { useCurrentFrame } from "remotion";

/** The narration envelope for the current scene, so mouths move with the voice. */
export const VoiceContext = React.createContext<{ env: string; offset: number }>({ env: "", offset: 0 });

export const useMouth = (): number => {
  const frame = useCurrentFrame();
  const { env, offset } = React.useContext(VoiceContext);
  if (!env) return 0.25;
  const i = Math.max(0, Math.min(env.length - 1, Math.round(frame + offset)));
  const v = parseInt(env[i] ?? "0", 10);
  return Number.isFinite(v) ? v / 9 : 0;
};

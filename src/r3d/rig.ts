/**
 * Character rig.
 *
 * A pose is a small set of numbers. An action is a list of keyed poses with
 * easing, so movement is authored the way animation is actually authored:
 * anticipation → action → follow-through, with squash and stretch on impact.
 */

export type Pose = {
  y: number; // body offset
  sx: number; // horizontal scale (squash)
  sy: number; // vertical scale (stretch)
  lean: number; // body rotation
  headPitch: number;
  headYaw: number;
  armCurl: number;
  armSpread: number;
  armWave: number;
  eyeOpen: number; // 0 shut .. 1 open .. 1.5 shocked
  brow: number; // -1 angry .. 1 worried
  jaw: number; // mouth when not speaking
  tremble: number;
};

export const BASE: Pose = {
  y: 0,
  sx: 1,
  sy: 1,
  lean: 0,
  headPitch: 0.05,
  headYaw: 0,
  armCurl: 0.4,
  armSpread: 0.62,
  armWave: 0.16,
  eyeOpen: 1,
  brow: 0,
  jaw: 0,
  tremble: 0,
};

type Ease = "linear" | "in" | "out" | "inOut" | "snap";

const ease = (name: Ease, t: number): number => {
  const c = t < 0 ? 0 : t > 1 ? 1 : t;
  switch (name) {
    case "linear":
      return c;
    case "in":
      return c * c * c;
    case "out":
      return 1 - Math.pow(1 - c, 3);
    case "inOut":
      return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
    case "snap":
      // very fast out, then a little overshoot: the "pop" of a cartoon take
      return 1 - Math.pow(1 - c, 5) + Math.sin(c * Math.PI) * 0.06;
    default:
      return c;
  }
};

export type Key = { f: number; p: Partial<Pose>; e?: Ease };
export type Action = { frames: number; keys: Key[] };

export const ACTIONS: Record<string, Action> = {
  /** a startled take: crouch, pop up, settle */
  gasp: {
    frames: 26,
    keys: [
      { f: 0, p: {} },
      { f: 3, p: { y: -0.12, sy: 0.9, sx: 1.06, eyeOpen: 0.7, armCurl: 0.6, armSpread: 0.45 }, e: "out" },
      { f: 7, p: { y: 0.34, sy: 1.16, sx: 0.88, eyeOpen: 1.5, brow: 0.9, armSpread: 1.15, armCurl: 0.15, jaw: 0.55 }, e: "snap" },
      { f: 14, p: { y: 0.1, sy: 0.98, sx: 1.02, eyeOpen: 1.3, brow: 0.7, armSpread: 1.0, armCurl: 0.25, jaw: 0.2 }, e: "out" },
      { f: 26, p: { y: 0, sy: 1, sx: 1, eyeOpen: 1.1, brow: 0.3, armSpread: 0.7, armCurl: 0.38 }, e: "inOut" },
    ],
  },
  /** arm thrust at something, with overshoot */
  point: {
    frames: 22,
    keys: [
      { f: 0, p: {} },
      { f: 3, p: { armCurl: 0.15, armSpread: 0.4, lean: -0.06, y: -0.04 }, e: "in" },
      { f: 7, p: { armCurl: -0.15, armSpread: 1.25, lean: 0.1, y: 0.1, eyeOpen: 1.15, sy: 1.05 }, e: "snap" },
      { f: 22, p: { armCurl: 0.3, armSpread: 0.8, lean: 0.02, y: 0 }, e: "inOut" },
    ],
  },
  /** knocked back */
  recoil: {
    frames: 18,
    keys: [
      { f: 0, p: {} },
      { f: 4, p: { y: 0.18, lean: -0.35, sx: 1.14, sy: 0.9, eyeOpen: 1.4, armSpread: 1.0, jaw: 0.4 }, e: "snap" },
      { f: 10, p: { y: 0.02, lean: -0.12, sx: 0.98, sy: 1.02, eyeOpen: 1.15 }, e: "out" },
      { f: 18, p: { y: 0, lean: 0, sx: 1, sy: 1, eyeOpen: 1 }, e: "inOut" },
    ],
  },
  /** shrinking away from danger */
  cower: {
    frames: 34,
    keys: [
      { f: 0, p: {} },
      { f: 6, p: { y: -0.28, sy: 0.82, sx: 1.1, eyeOpen: 1.35, brow: 1, armCurl: 1.0, armSpread: 0.15, headPitch: 0.25 }, e: "out" },
      { f: 34, p: { y: -0.26, sy: 0.84, sx: 1.08, eyeOpen: 1.3, brow: 1, armCurl: 0.95, armSpread: 0.18, headPitch: 0.22, tremble: 0.5 }, e: "linear" },
    ],
  },
  /** horizontal stretch and go */
  dash: {
    frames: 24,
    keys: [
      { f: 0, p: {} },
      { f: 3, p: { sx: 1.18, sy: 0.86, y: -0.06, armCurl: 0.9 }, e: "in" },
      { f: 8, p: { sx: 0.72, sy: 1.35, y: 0.1, armCurl: 0.05, armSpread: 0.3, eyeOpen: 1.2 }, e: "snap" },
      { f: 24, p: { sx: 0.86, sy: 1.16, y: 0.06, armCurl: 0.15, armSpread: 0.35 }, e: "linear" },
    ],
  },
  /** flattened thin to slip through a gap */
  squeeze: {
    frames: 46,
    keys: [
      { f: 0, p: {} },
      { f: 8, p: { sx: 0.5, sy: 1.5, armCurl: 0.05, armSpread: 0.1, eyeOpen: 0.9 }, e: "inOut" },
      { f: 34, p: { sx: 0.42, sy: 1.62, armCurl: 0.02, armSpread: 0.08, eyeOpen: 0.7 }, e: "linear" },
      { f: 46, p: { sx: 0.8, sy: 1.2, armCurl: 0.2, armSpread: 0.3, eyeOpen: 1 }, e: "out" },
    ],
  },
  /** two bounces of joy */
  cheer: {
    frames: 40,
    keys: [
      { f: 0, p: {} },
      { f: 4, p: { y: -0.16, sy: 0.88, sx: 1.1, armCurl: 0.9 }, e: "in" },
      { f: 10, p: { y: 0.42, sy: 1.14, sx: 0.9, armCurl: -0.2, armSpread: 1.3, eyeOpen: 0.2 }, e: "snap" },
      { f: 18, p: { y: 0.05, sy: 0.96, sx: 1.04, armCurl: 0.2, armSpread: 1.1, eyeOpen: 0.2 }, e: "in" },
      { f: 24, p: { y: 0.3, sy: 1.08, sx: 0.94, armCurl: -0.1, armSpread: 1.25, eyeOpen: 0.2 }, e: "out" },
      { f: 40, p: { y: 0, sy: 1, sx: 1, armCurl: 0.3, armSpread: 0.9, eyeOpen: 0.6 }, e: "inOut" },
    ],
  },
  /** laughing, leaning back */
  laugh: {
    frames: 34,
    keys: [
      { f: 0, p: {} },
      { f: 5, p: { lean: -0.16, headPitch: -0.2, jaw: 0.7, eyeOpen: 0.15, y: 0.06 }, e: "out" },
      { f: 12, p: { lean: -0.1, headPitch: -0.12, jaw: 0.35, eyeOpen: 0.15, y: 0.0 }, e: "inOut" },
      { f: 18, p: { lean: -0.16, headPitch: -0.2, jaw: 0.65, eyeOpen: 0.15, y: 0.06 }, e: "inOut" },
      { f: 34, p: { lean: 0, headPitch: 0.05, jaw: 0, eyeOpen: 1, y: 0 }, e: "out" },
    ],
  },
  /** pulling and twisting against something stuck */
  struggle: {
    frames: 44,
    keys: [
      { f: 0, p: {} },
      { f: 6, p: { lean: -0.22, armCurl: 0.05, armSpread: 0.35, y: -0.1, sy: 0.94, jaw: 0.3 }, e: "out" },
      { f: 14, p: { lean: 0.2, armCurl: 0.75, armSpread: 0.5, y: 0.06, sy: 1.06, jaw: 0.45 }, e: "inOut" },
      { f: 22, p: { lean: -0.2, armCurl: 0.1, armSpread: 0.3, y: -0.08, sy: 0.95, jaw: 0.3 }, e: "inOut" },
      { f: 30, p: { lean: 0.18, armCurl: 0.8, armSpread: 0.55, y: 0.04, sy: 1.05, jaw: 0.5 }, e: "inOut" },
      { f: 44, p: { lean: 0, armCurl: 0.4, armSpread: 0.62, y: 0 }, e: "out" },
    ],
  },
  /** quick agreement */
  nod: {
    frames: 20,
    keys: [
      { f: 0, p: {} },
      { f: 4, p: { headPitch: 0.3, y: -0.06, sy: 0.96 }, e: "in" },
      { f: 9, p: { headPitch: -0.06, y: 0.05, sy: 1.03 }, e: "out" },
      { f: 20, p: { headPitch: 0.05, y: 0, sy: 1 }, e: "inOut" },
    ],
  },
  /** turns away, hurt */
  turnAway: {
    frames: 30,
    keys: [
      { f: 0, p: {} },
      { f: 8, p: { headYaw: -0.7, headPitch: 0.28, lean: -0.12, armCurl: 0.7, armSpread: 0.3, eyeOpen: 0.7, brow: 0.6 }, e: "out" },
      { f: 30, p: { headYaw: -0.5, headPitch: 0.22, lean: -0.08, armCurl: 0.65, armSpread: 0.32, eyeOpen: 0.75, brow: 0.5 }, e: "linear" },
    ],
  },
  /** a sharp double take */
  doubleTake: {
    frames: 22,
    keys: [
      { f: 0, p: {} },
      { f: 3, p: { headYaw: 0.5, eyeOpen: 0.8 }, e: "out" },
      { f: 6, p: { headYaw: -0.2, eyeOpen: 0.6 }, e: "linear" },
      { f: 10, p: { headYaw: 0.7, eyeOpen: 1.5, y: 0.2, sy: 1.1, sx: 0.92, armSpread: 1.1, jaw: 0.5 }, e: "snap" },
      { f: 22, p: { headYaw: 0.2, eyeOpen: 1.2, y: 0.05, sy: 1.02, sx: 0.99, armSpread: 0.8 }, e: "out" },
    ],
  },
};

export type Cue = { at: number; action: keyof typeof ACTIONS };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const evalAction = (action: Action, local: number): Pose => {
  const keys = action.keys;
  if (local <= keys[0].f) return { ...BASE, ...keys[0].p };
  const last = keys[keys.length - 1];
  if (local >= last.f) return { ...BASE, ...last.p };
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (local >= a.f && local <= b.f) {
      const t = ease(b.e ?? "inOut", (local - a.f) / Math.max(1, b.f - a.f));
      const pa: Pose = { ...BASE, ...a.p };
      const pb: Pose = { ...BASE, ...b.p };
      const out: Pose = { ...BASE };
      (Object.keys(BASE) as (keyof Pose)[]).forEach((k) => {
        out[k] = lerp(pa[k], pb[k], t);
      });
      return out;
    }
  }
  return BASE;
};

/** Which action is running at this frame, if any. */
export const activeCue = (frame: number, cues: Cue[] = []): { action: Action; local: number } | null => {
  let best: { action: Action; local: number } | null = null;
  for (const c of cues) {
    if (frame >= c.at) {
      const action = ACTIONS[c.action];
      const local = frame - c.at;
      if (action && local <= action.frames) best = { action, local };
    }
  }
  return best;
};

/** Blend the running action over the character's resting pose. */
export const resolvePose = (frame: number, cues: Cue[] = [], rest: Partial<Pose> = {}): Pose => {
  const base: Pose = { ...BASE, ...rest };
  const active = activeCue(frame, cues);
  if (!active) return base;
  const p = evalAction(active.action, active.local);
  // weight the action in and out so it never snaps to the base pose
  const w = active.local < 2 ? active.local / 2 : 1;
  const out: Pose = { ...base };
  (Object.keys(base) as (keyof Pose)[]).forEach((k) => {
    out[k] = lerp(base[k], p[k], w);
  });
  return out;
};

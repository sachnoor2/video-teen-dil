import type { Mood } from "./r3d/world";
import type { Cam } from "./r3d/stage";
import type { Cue, Pose } from "./r3d/rig";

export type CastItem = {
  kind: "octo" | "fish" | "turtle" | "barracuda" | "crab";
  who?: "moti" | "chimti" | "dadi" | "toothu" | "kekda";
  at: [number, number, number];
  to?: [number, number, number];
  scale?: number;
  colour?: string;
  stripe?: boolean;
  faceLeft?: boolean;
  phase?: number;
  hearts?: "red" | "blue" | "stop";
  tint?: string;
  cues?: Cue[];
  rest?: Partial<Pose>;
};

export type Prop = {
  at: [number, number, number];
  to?: [number, number, number];
  rot?: [number, number, number];
  opacity?: number;
  scale?: number;
};

export type Shot = {
  cam: Cam;
  mood: Mood;
  cast: CastItem[];
  net?: Prop;
  gap?: Prop;
  shake?: number;
  punch?: number;
};

export type Scene = { shots: Shot[]; title?: { main: string; sub?: string } };

const WIDE: Cam = { from: [0, 1.9, 11.5], to: [0, 1.3, 9.4], target: [0, 0.15, 0], fov: 44 };
const MED: Cam = { from: [0, 1.25, 7.8], to: [0, 1.0, 6.5], target: [0, 0.1, 0], fov: 44 };
const CLOSE: Cam = { from: [0.6, 1.0, 4.8], to: [0.2, 0.85, 4.1], target: [0, 0.35, 0], fov: 40 };
const BIG: Cam = { from: [0.3, 0.9, 3.5], to: [0.1, 0.85, 3.0], target: [0, 0.4, 0], fov: 38 };
const LOW: Cam = { from: [0, -0.1, 6.6], to: [0, 0.35, 5.4], target: [0, 0.75, 0], fov: 46 };
const HIGH: Cam = { from: [0.4, 4.6, 8.8], to: [0, 3.9, 7.6], target: [0, -0.2, 0], fov: 46 };
const OTS_L: Cam = { from: [-3.8, 1.6, 5.6], to: [-3.0, 1.45, 4.7], target: [0.4, 0.25, 0], fov: 42 };
const OTS_R: Cam = { from: [3.8, 1.6, 5.6], to: [3.0, 1.45, 4.7], target: [-0.4, 0.25, 0], fov: 42 };
const ORBIT: Cam = { from: [-4.4, 2.2, 5.2], to: [4.0, 1.5, 5.0], target: [0, 0.1, 0], fov: 44 };
const TURTLE: Cam = { from: [3.4, 1.5, 5.4], to: [2.6, 1.35, 4.6], target: [1.6, 0.15, 0], fov: 42 };
const FISH: Cam = { from: [-3.2, 1.5, 5.2], to: [-2.5, 1.35, 4.5], target: [-1.4, 0.55, 0], fov: 42 };
const CRAB: Cam = { from: [2.4, 0.4, 4.2], to: [1.9, 0.35, 3.6], target: [1.2, -0.35, 0], fov: 40 };

const M = (cues: Cue[] = [], extra: Partial<CastItem> = {}): CastItem => ({ kind: "octo", who: "moti", at: [0, 0, 0], cues, ...extra });
const C = (cues: Cue[] = [], extra: Partial<CastItem> = {}): CastItem => ({
  kind: "fish",
  who: "chimti",
  at: [-2.1, 0.85, -0.3],
  scale: 0.5,
  colour: "#ff8a3d",
  stripe: true,
  phase: 1.1,
  cues,
  ...extra,
});
const D = (cues: Cue[] = [], extra: Partial<CastItem> = {}): CastItem => ({
  kind: "turtle",
  who: "dadi",
  at: [2.7, 0.35, -0.6],
  scale: 0.62,
  faceLeft: true,
  phase: 0.7,
  cues,
  ...extra,
});
const T = (cues: Cue[] = [], extra: Partial<CastItem> = {}): CastItem => ({
  kind: "barracuda",
  who: "toothu",
  at: [2.9, 0.75, -0.9],
  scale: 0.52,
  faceLeft: true,
  phase: 0.4,
  cues,
  ...extra,
});
const K = (cues: Cue[] = [], extra: Partial<CastItem> = {}): CastItem => ({
  kind: "crab",
  who: "kekda",
  at: [1.3, -0.8, 0.5],
  scale: 0.55,
  phase: 0.8,
  cues,
  ...extra,
});

const ROCK = (opacity = 0.5, y = 1.0): Prop => ({ at: [0, y, 1.5], rot: [0.06, 0, -0.04], opacity, scale: 0.85 });
const GAP: Prop = { at: [0, -0.4, -0.6], scale: 0.85 };

export const SCENES: Record<string, Scene> = {
  "01-open": {
    title: { main: "तीन दिल" },
    shots: [
      { cam: MED, mood: "day", cast: [M([{ at: 6, action: "point" }, { at: 46, action: "gasp" }])] },
      { cam: BIG, mood: "day", cast: [M([{ at: 4, action: "doubleTake" }])] },
    ],
  },
  "02-hide": {
    shots: [
      { cam: WIDE, mood: "day", cast: [M(), C([{ at: 3, action: "dash" }], { at: [-5.5, 0.9, -1], to: [-2.1, 0.85, -0.3] })] },
      { cam: FISH, mood: "day", cast: [M(), C([{ at: 5, action: "gasp" }])] },
    ],
  },
  "03-count": { shots: [{ cam: FISH, mood: "day", cast: [C([{ at: 4, action: "nod" }, { at: 22, action: "nod" }]), M([], { at: [-3.2, 0, -1.4], scale: 0.9 })] }] },
  "04-stone": {
    shots: [
      { cam: MED, mood: "day", cast: [M([{ at: 8, action: "squeeze" }], { tint: "#3f6478" })] },
      { cam: CLOSE, mood: "day", cast: [M([], { tint: "#3f6478", rest: { armCurl: 0.12, armSpread: 0.18, y: -0.1 } })] },
    ],
  },
  "05-found": {
    shots: [
      { cam: FISH, mood: "day", cast: [M([], { tint: "#3f6478", rest: { armCurl: 0.12, armSpread: 0.18 } }), C([{ at: 2, action: "doubleTake" }])] },
      { cam: CLOSE, mood: "day", cast: [M([{ at: 3, action: "gasp" }], { tint: "#3f6478" })] },
    ],
  },
  "06-wind": { shots: [{ cam: CLOSE, mood: "day", cast: [M([{ at: 6, action: "turnAway" }])] }] },
  "07-hawa": { shots: [{ cam: FISH, mood: "day", cast: [C([{ at: 2, action: "doubleTake" }]), M([], { at: [-3.4, 0, -1.2], scale: 0.9 })] }] },
  "08-slow": { shots: [{ cam: BIG, mood: "day", cast: [M([{ at: 4, action: "turnAway" }], { rest: { eyeOpen: 0.7 } })] }] },
  "09-mock": {
    shots: [
      { cam: OTS_L, mood: "dusk", cast: [M([{ at: 4, action: "cower" }]), T([{ at: 2, action: "laugh" }])], shake: 0.02 },
      { cam: MED, mood: "dusk", cast: [M([], { rest: { eyeOpen: 0.8, brow: 0.4 } }), T([{ at: 5, action: "dash" }])] },
    ],
  },
  "10-jab": {
    shots: [
      { cam: MED, mood: "dusk", cast: [M([{ at: 4, action: "point" }]), T()], punch: 0.6 },
      { cam: BIG, mood: "dusk", cast: [M([{ at: 3, action: "point" }])] },
    ],
  },
  "11-teeth": {
    shots: [
      { cam: OTS_R, mood: "dusk", cast: [M([{ at: 2, action: "recoil" }]), T([{ at: 3, action: "dash" }], { at: [2.9, 0.75, -0.9], to: [1.6, 0.6, 0.3] })], shake: 0.05, punch: 1 },
      { cam: CLOSE, mood: "dusk", cast: [M([{ at: 2, action: "cower" }])] },
    ],
  },
  "12-knot": { shots: [{ cam: CLOSE, mood: "dusk", cast: [M([{ at: 4, action: "point" }], { rest: { eyeOpen: 1.1 } }), T([], { at: [3.2, 0.7, -1.4], scale: 0.45 })] }] },
  "13-explain": {
    shots: [
      { cam: MED, mood: "day", cast: [M([], { hearts: "red" }), D([{ at: 4, action: "nod" }])] },
      { cam: TURTLE, mood: "day", cast: [M([], { hearts: "red" }), D([], { at: [2.2, 0.35, -0.4] })] },
    ],
  },
  "14-hope": { shots: [{ cam: CLOSE, mood: "day", cast: [M([{ at: 3, action: "cheer" }], { hearts: "red" })] }] },
  "15-nope": {
    shots: [
      { cam: TURTLE, mood: "day", cast: [M([{ at: 10, action: "cower" }]), D([{ at: 3, action: "nod" }])] },
      { cam: CLOSE, mood: "day", cast: [M([], { rest: { eyeOpen: 0.7, brow: 0.7, armCurl: 0.7, armSpread: 0.3 } })] },
    ],
  },
  "16-deadpan": {
    shots: [
      { cam: BIG, mood: "day", cast: [M([{ at: 5, action: "turnAway" }])] },
      { cam: MED, mood: "day", cast: [M([], { rest: { eyeOpen: 0.55, armCurl: 0.75, armSpread: 0.25 } }), D([{ at: 10, action: "laugh" }])] },
    ],
  },
  "17-blue": { shots: [{ cam: CLOSE, mood: "night", cast: [M([{ at: 4, action: "nod" }], { hearts: "blue" }), D([], { at: [2.8, 0.3, -1.2] })] }] },
  "18-special": { shots: [{ cam: BIG, mood: "night", cast: [M([{ at: 3, action: "gasp" }], { hearts: "blue" })] }] },
  "19-dadi2": { shots: [{ cam: TURTLE, mood: "day", cast: [D([{ at: 3, action: "nod" }]), M([], { at: [-1.6, 0, 0.2] })] }] },
  "20-taste": { shots: [{ cam: FISH, mood: "day", cast: [C([{ at: 2, action: "recoil" }]), M([], { at: [-2.8, 0, -0.4], scale: 0.9 })] }] },
  "21-salt": { shots: [{ cam: CLOSE, mood: "day", cast: [M([{ at: 5, action: "turnAway" }]), C([], { at: [-2.0, 1.0, 0.2] })] }] },
  "22-fish": { shots: [{ cam: FISH, mood: "day", cast: [C([{ at: 2, action: "cheer" }], { rest: { eyeOpen: 1.3 } }), M([], { at: [-3.0, 0, -1] })] }] },
  "23-warn": {
    shots: [
      { cam: MED, mood: "dusk", cast: [M(), D([{ at: 4, action: "point" }])], net: { at: [0, 6.4, -3], rot: [0.25, 0, 0.06], opacity: 0.22 } },
      { cam: LOW, mood: "dusk", cast: [M([{ at: 8, action: "nod" }]), D([], { at: [2.4, 0.3, -0.6] })], net: { at: [0, 6.0, -3], rot: [0.25, 0, 0.06], opacity: 0.2 } },
    ],
  },
  "24-jinx": { shots: [{ cam: FISH, mood: "day", cast: [C([{ at: 2, action: "cheer" }]), M()] }] },
  "25-net": {
    shots: [
      {
        cam: WIDE,
        mood: "storm",
        cast: [C([{ at: 2, action: "gasp" }], { rest: { eyeOpen: 1.4 } }), M([{ at: 4, action: "gasp" }]), { kind: "fish", at: [-4.6, 1.3, -2], scale: 0.34, colour: "#f7c948", phase: 1.4 }],
        net: { at: [0, 6.2, -1.2], to: [0, 1.0, -1.2], rot: [0.12, 0, -0.05] },
        shake: 0.09,
        punch: 1.4,
      },
      { cam: HIGH, mood: "storm", cast: [M([{ at: 3, action: "cower" }]), C([], { at: [-1.2, 0.9, 0.6] })], net: { at: [0, 0.9, -1.0], rot: [0.1, 0, -0.04] }, shake: 0.03 },
    ],
  },
  "26-flee": { shots: [{ cam: OTS_L, mood: "storm", cast: [T([{ at: 2, action: "dash" }], { at: [1.6, 0.9, -1.6], to: [4.6, 1.2, -2.4] }), M([], { rest: { eyeOpen: 1.3 } })], shake: 0.04 }] },
  "27-help": { shots: [{ cam: MED, mood: "storm", cast: [M([{ at: 2, action: "point" }]), T([], { at: [4.2, 1.1, -2.2], scale: 0.45 })] }] },
  "28-nope2": { shots: [{ cam: OTS_R, mood: "storm", cast: [T([{ at: 3, action: "dash" }], { at: [3.0, 1.0, -1.8], to: [6.4, 1.3, -3.2] }), M([{ at: 2, action: "recoil" }])], shake: 0.03 }] },
  "29-stuck": { shots: [{ cam: CLOSE, mood: "storm", cast: [C([{ at: 2, action: "struggle" }], { at: [-0.4, 0.9, 0.7] }), M([{ at: 6, action: "gasp" }], { at: [-2.6, 0, 0.2] })], net: ROCK(0.55, 0.6) }] },
  "30-calm": { shots: [{ cam: MED, mood: "storm", cast: [M([{ at: 3, action: "nod" }], { at: [-1.4, 0, 0.4] }), C([], { at: [0.6, 0.9, 0.9], scale: 0.55 })], net: ROCK(0.5, 0.7) }] },
  "31-shaking": { shots: [{ cam: FISH, mood: "storm", cast: [C([{ at: 2, action: "struggle" }], { at: [0.4, 0.9, 1.0] }), M([], { at: [-2.8, 0, 0.4], scale: 0.85 })], net: ROCK(0.45, 0.8) }] },
  "32-plan": {
    shots: [
      { cam: MED, mood: "dusk", cast: [M([{ at: 5, action: "nod" }, { at: 40, action: "point" }], { at: [-0.6, 0, 0] })], gap: { at: [3.0, -0.6, 0.2], scale: 0.9 } },
      { cam: CLOSE, mood: "dusk", cast: [M([{ at: 2, action: "point" }], { rest: { eyeOpen: 1.15, brow: -0.3 } })] },
    ],
  },
  "33-squeeze": {
    shots: [
      { cam: CLOSE, mood: "dusk", cast: [M([{ at: 2, action: "squeeze" }], { at: [-3.4, 0.1, 0], to: [3.0, 0.1, 0], scale: 0.9 })], gap: GAP },
      { cam: LOW, mood: "storm", cast: [M([{ at: 3, action: "squeeze" }], { at: [1.2, 0.1, 0.8], scale: 0.95 }), { kind: "crab", at: [-1.9, -0.7, 0.4], scale: 0.5 }], net: ROCK(0.5, 1.2) },
    ],
  },
  "34-crab": { shots: [{ cam: CRAB, mood: "storm", cast: [K([{ at: 2, action: "doubleTake" }, { at: 40, action: "point" }]), M([], { at: [-1.6, 0, 0.8], scale: 0.8 })], net: ROCK(0.4, 1.4) }] },
  "35-notstone": { shots: [{ cam: MED, mood: "storm", cast: [M([{ at: 3, action: "turnAway" }], { at: [-1.2, 0, 0.6], scale: 0.85 }), K([], { rest: { eyeOpen: 1.3 } })], net: ROCK(0.42, 1.2) }] },
  "36-crab2": { shots: [{ cam: CRAB, mood: "storm", cast: [K([{ at: 2, action: "point" }]), M([], { at: [-1.8, 0, 0.8], scale: 0.8 })] }] },
  "37-eight": {
    shots: [
      { cam: MED, mood: "storm", cast: [M([{ at: 2, action: "struggle" }])], net: ROCK(0.5, 0.9), shake: 0.03 },
      { cam: LOW, mood: "storm", cast: [M([{ at: 2, action: "struggle" }, { at: 44, action: "cheer" }])], net: ROCK(0.45, 1.0), punch: 0.8 },
    ],
  },
  "38-hurry": { shots: [{ cam: FISH, mood: "storm", cast: [C([{ at: 2, action: "struggle" }], { at: [0.6, 0.9, 1.0] }), M([{ at: 3, action: "nod" }], { at: [-2.2, 0, 0.5], scale: 0.9 })], net: ROCK(0.55, 1.1), shake: 0.04 }] },
  "39-open": { shots: [{ cam: LOW, mood: "storm", cast: [M([{ at: 2, action: "struggle" }, { at: 34, action: "cheer" }])], net: { at: [0, 1.4, 1.2], to: [0, 2.6, 1.2], rot: [0.1, 0, 0.05], opacity: 0.7 }, punch: 1 }] },
  "40-free": {
    shots: [
      { cam: MED, mood: "day", cast: [M([{ at: 2, action: "cheer" }]), C([{ at: 1, action: "dash" }], { at: [-1.0, 1.2, 0.8], to: [-2.4, 1.3, 0.2] })], punch: 0.9 },
      { cam: FISH, mood: "day", cast: [M([], { rest: { eyeOpen: 0.5 } }), C([{ at: 2, action: "cheer" }], { at: [-1.5, 1.2, 0.5] })] },
    ],
  },
  "41-sorry": {
    shots: [
      { cam: OTS_L, mood: "day", cast: [T([{ at: 4, action: "turnAway" }], { at: [2.4, 0.7, -0.7], scale: 0.5 }), M()] },
      { cam: MED, mood: "day", cast: [T([], { rest: { eyeOpen: 0.6, headYaw: -0.4 }, at: [2.2, 0.6, -0.9] }), M([{ at: 8, action: "nod" }])] },
    ],
  },
  "42-okay": { shots: [{ cam: MED, mood: "day", cast: [M([{ at: 3, action: "nod" }]), T([], { at: [2.4, 0.7, -0.8], scale: 0.5 })] }] },
  "43-really": { shots: [{ cam: OTS_L, mood: "day", cast: [T([{ at: 2, action: "doubleTake" }], { at: [2.2, 0.7, -0.6], scale: 0.5 }), M()] }] },
  "44-looking": { shots: [{ cam: BIG, mood: "day", cast: [M([{ at: 3, action: "nod" }], { rest: { eyeOpen: 0.8 } })] }] },
  "45-dadi3": { shots: [{ cam: TURTLE, mood: "day", cast: [D([{ at: 3, action: "nod" }]), M([], { at: [-1.4, 0, 0.2] })] }] },
  "46-win": {
    shots: [
      {
        cam: WIDE,
        mood: "dusk",
        cast: [
          M([{ at: 2, action: "cheer" }], { hearts: "red" }),
          C([{ at: 3, action: "cheer" }], { at: [-2.6, 1.2, 0.4], to: [-1.2, 1.5, 0.4] }),
          D([{ at: 6, action: "nod" }], { at: [3.0, 0.3, -1.4] }),
        ],
        punch: 0.7,
      },
      { cam: ORBIT, mood: "dusk", cast: [M([{ at: 4, action: "cheer" }], { hearts: "red" }), T([], { at: [3.8, 1.1, -2.8], scale: 0.4 })] },
    ],
  },
  "47-again": { shots: [{ cam: FISH, mood: "day", cast: [C([{ at: 2, action: "cheer" }]), M()] }] },
  "48-nope3": { shots: [{ cam: MED, mood: "day", cast: [M([{ at: 5, action: "turnAway" }]), C([], { at: [-2.0, 1.0, 0.2] })] }] },
  "49-end": {
    shots: [
      { cam: BIG, mood: "dusk", cast: [M([{ at: 3, action: "nod" }], { rest: { eyeOpen: 0.75 } })] },
      { cam: WIDE, mood: "dusk", cast: [M([{ at: 2, action: "cheer" }], { hearts: "red" }), C([{ at: 8, action: "cheer" }], { at: [-2.4, 1.0, 0.2] }), D([], { at: [3.2, 0.3, -1.6] })] },
    ],
  },
  "08a-moti2": { shots: [{ cam: BIG, mood: "day", cast: [M([{ at: 3, action: "turnAway" }])] }] },
  "12a-toothu2": { shots: [{ cam: OTS_L, mood: "dusk", cast: [T([{ at: 2, action: "point" }]), M([{ at: 3, action: "cower" }])] }] },
  "12b-moti3": { shots: [{ cam: BIG, mood: "dusk", cast: [M([{ at: 3, action: "nod" }], { rest: { eyeOpen: 0.85 } })] }] },
  "16a-dadi": { shots: [{ cam: TURTLE, mood: "day", cast: [D([{ at: 3, action: "nod" }]), M([], { at: [-1.6, 0, 0.2] })] }] },
  "19a-chimti": { shots: [{ cam: FISH, mood: "day", cast: [C([{ at: 2, action: "cheer" }]), M([], { at: [-3.0, 0, -1] })] }] },
  "22a-moti": { shots: [{ cam: CLOSE, mood: "day", cast: [M([{ at: 4, action: "turnAway" }]), C([], { at: [-2.0, 1.0, 0.2] })] }] },
  "22b-chimti": { shots: [{ cam: FISH, mood: "day", cast: [C([{ at: 2, action: "recoil" }, { at: 20, action: "dash" }], { rest: { eyeOpen: 1.4 } }), M()] }] },
  "31a-moti": { shots: [{ cam: MED, mood: "storm", cast: [M([{ at: 4, action: "nod" }], { at: [-1.2, 0, 0.4] }), C([{ at: 2, action: "struggle" }], { at: [0.4, 0.9, 1.0] })], net: ROCK(0.5, 0.8) }] },
  "36a-kekda": { shots: [{ cam: CRAB, mood: "storm", cast: [K([{ at: 2, action: "doubleTake" }]), M([], { at: [-1.8, 0, 0.8], scale: 0.8 })] }] },
  "39a-chimti": { shots: [{ cam: FISH, mood: "storm", cast: [C([{ at: 2, action: "cheer" }], { at: [0.8, 1.0, 0.9] }), M([], { at: [-1.8, 0, 0.6], scale: 0.9 })], punch: 0.8 }] },
  "44a-toothu": { shots: [{ cam: OTS_L, mood: "day", cast: [T([{ at: 2, action: "doubleTake" }], { at: [2.2, 0.7, -0.6], scale: 0.5 }), M()] }] },
  "44b-moti": { shots: [{ cam: BIG, mood: "day", cast: [M([{ at: 3, action: "nod" }], { rest: { eyeOpen: 0.7 } })] }] },
  "46a-dadi": { shots: [{ cam: TURTLE, mood: "dusk", cast: [D([{ at: 3, action: "nod" }]), M([], { at: [-1.4, 0, 0.2] })] }] },
};

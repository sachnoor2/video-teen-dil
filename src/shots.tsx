import type { Mood } from "./r3d/world";
import type { Cam } from "./r3d/stage";
import type { Pose } from "./r3d/octopus";

export type CastItem = {
  kind: "octo" | "fish" | "turtle" | "barracuda" | "crab";
  at: [number, number, number];
  to?: [number, number, number];
  scale?: number;
  pose?: Pose;
  colour?: string;
  stripe?: boolean;
  faceLeft?: boolean;
  phase?: number;
  hearts?: "red" | "blue" | "stop";
  tint?: string;
};

export type Prop = { at: [number, number, number]; to?: [number, number, number]; rot?: [number, number, number]; opacity?: number; scale?: number };

export type Shot = {
  cam: Cam;
  mood: Mood;
  cast: CastItem[];
  net?: Prop;
  gap?: Prop;
  bubble?: { name: string; text: string; colour?: string; tail?: "left" | "right" };
  caption?: string;
  title?: { main: string; sub?: string };
};

export type Scene = { shots: Shot[] };

/* camera presets ---------------------------------------------------- */
const WIDE: Cam = { from: [0, 1.9, 11.5], to: [0, 1.3, 9.4], target: [0, 0.15, 0], fov: 44 };
const MED: Cam = { from: [0, 1.25, 7.8], to: [0, 1.0, 6.5], target: [0, 0.1, 0], fov: 44 };
const CLOSE: Cam = { from: [0.6, 1.0, 4.8], to: [0.2, 0.85, 4.1], target: [0, 0.35, 0], fov: 40 };
const LOW: Cam = { from: [0, -0.1, 6.6], to: [0, 0.35, 5.4], target: [0, 0.75, 0], fov: 46 };
const HIGH: Cam = { from: [0.4, 4.6, 8.8], to: [0, 3.9, 7.6], target: [0, -0.2, 0], fov: 46 };
const OTS_L: Cam = { from: [-3.8, 1.6, 5.6], to: [-3.0, 1.45, 4.7], target: [0.4, 0.25, 0], fov: 42 };
const OTS_R: Cam = { from: [3.8, 1.6, 5.6], to: [3.0, 1.45, 4.7], target: [-0.4, 0.25, 0], fov: 42 };
const ORBIT: Cam = { from: [-4.4, 2.2, 5.2], to: [4.0, 1.5, 5.0], target: [0, 0.1, 0], fov: 44 };
const TURTLE_SHOT: Cam = { from: [3.4, 1.5, 5.4], to: [2.6, 1.35, 4.6], target: [1.6, 0.15, 0], fov: 42 };
const FISH_SHOT: Cam = { from: [-3.2, 1.5, 5.2], to: [-2.5, 1.35, 4.5], target: [-1.4, 0.55, 0], fov: 42 };

/* recurring staging ------------------------------------------------ */
const OCTO = (pose: Pose = "idle", extra: Partial<CastItem> = {}): CastItem => ({
  kind: "octo",
  at: [0, 0, 0],
  pose,
  ...extra,
});
const TURTLE = (extra: Partial<CastItem> = {}): CastItem => ({
  kind: "turtle",
  at: [2.7, 0.35, -0.6],
  scale: 0.62,
  faceLeft: true,
  phase: 0.7,
  ...extra,
});
const BARRACUDA = (extra: Partial<CastItem> = {}): CastItem => ({
  kind: "barracuda",
  at: [2.9, 0.75, -0.9],
  scale: 0.52,
  faceLeft: true,
  phase: 0.4,
  ...extra,
});
const CHIMTI = (extra: Partial<CastItem> = {}): CastItem => ({
  kind: "fish",
  at: [-2.1, 0.85, -0.3],
  scale: 0.5,
  colour: "#ff8a3d",
  stripe: true,
  phase: 1.1,
  ...extra,
});

export const SCENES: Record<string, Scene> = {
  "01-title": {
    shots: [
      {
        cam: WIDE,
        mood: "day",
        cast: [OCTO("idle", { at: [0, 0, 0] })],
        title: { main: "तीन दिल", sub: "एक छोटे ऑक्टोपस की कहानी" },
      },
      { cam: CLOSE, mood: "day", cast: [OCTO("idle", { at: [0, 0.1, 0] })] },
    ],
  },
  "02-reef": {
    shots: [
      {
        cam: WIDE,
        mood: "day",
        cast: [
          OCTO("idle"),
          { kind: "fish", at: [5.2, 1.4, -2], to: [-5.4, 1.1, -2], scale: 0.42, colour: "#f7c948", faceLeft: true, phase: 0.3 },
        ],
        caption: "लाल चट्टानों के बीच रहता था मोती।",
      },
      {
        cam: MED,
        mood: "day",
        cast: [
          OCTO("idle"),
          { kind: "fish", at: [-5, 0.9, -1], to: [5, 1.2, -1], scale: 0.38, colour: "#2dd4bf", phase: 2.1 },
        ],
      },
    ],
  },
  "03-morning": {
    shots: [
      { cam: MED, mood: "day", cast: [OCTO("idle")], bubble: { name: "मोती", text: "कोई मुझे देखे, तो मैं पत्थर बन जाता हूँ।" } },
      {
        cam: CLOSE,
        mood: "day",
        cast: [OCTO("idle", { tint: "#3f6478" })],
        gap: { at: [-2.6, 0.2, -1.6], scale: 0.7 },
      },
    ],
  },
  "04-friend": {
    shots: [
      {
        cam: MED,
        mood: "day",
        cast: [OCTO("happy"), CHIMTI({ at: [-2.2, 0.9, -0.2] })],
        bubble: { name: "चिमटी", text: "मोती! आज तुम किस रंग के हो? मुझे तुम्हारा हर रंग पसंद है।", colour: "#c2410c" },
      },
      { cam: FISH_SHOT, mood: "day", cast: [OCTO("happy"), CHIMTI({ at: [-1.6, 0.95, 0.4] })] },
    ],
  },
  "05-hearts": {
    shots: [
      { cam: MED, mood: "dusk", cast: [OCTO("talk", { hearts: "red" })], bubble: { name: "मोती", text: "मेरे तीन दिल हैं! एक यहाँ, दो यहाँ।" } },
      { cam: CLOSE, mood: "dusk", cast: [OCTO("talk", { hearts: "red" })] },
    ],
  },
  "06-mock": {
    shots: [
      { cam: OTS_L, mood: "dusk", cast: [OCTO("sad"), BARRACUDA()], bubble: { name: "टूथू", text: "तुम इस समुद्र के सबसे बेतुके जीव हो!", colour: "#3d6a80" } },
      { cam: MED, mood: "dusk", cast: [OCTO("sad"), BARRACUDA({ at: [2.6, 0.8, -1.4] })] },
    ],
  },
  "07-dadi": {
    shots: [
      {
        cam: MED,
        mood: "day",
        cast: [OCTO("idle"), TURTLE()],
        bubble: { name: "दादी कछुई", text: "दो दिल गलफड़ों को खून पहुँचाते हैं। तीसरा दिल बाकी शरीर को।", colour: "#5f7f45" },
      },
      { cam: TURTLE_SHOT, mood: "day", cast: [OCTO("idle"), TURTLE({ at: [2.2, 0.35, -0.4] })] },
    ],
  },
  "08-blood": {
    shots: [
      {
        cam: CLOSE,
        mood: "night",
        cast: [OCTO("talk", { hearts: "blue" })],
        bubble: { name: "दादी कछुई", text: "तेरा खून नीला है, क्योंकि उसमें लोहे की जगह ताँबा है।", colour: "#5f7f45" },
      },
      { cam: ORBIT, mood: "night", cast: [OCTO("talk", { hearts: "blue" }), TURTLE({ at: [2.9, 0.3, -1.2] })] },
    ],
  },
  "09-taste": {
    shots: [
      { cam: LOW, mood: "day", cast: [OCTO("talk")], bubble: { name: "मोती", text: "मेरे हाथ चख भी सकते हैं! हज़ारों स्वाद केंद्र।" } },
      { cam: CLOSE, mood: "day", cast: [OCTO("happy")] },
    ],
  },
  "10-arms": {
    shots: [
      { cam: HIGH, mood: "dusk", cast: [OCTO("talk")], bubble: { name: "मोती", text: "आठ हाथ, और हर हाथ पर चूसने वाले कप।" } },
      { cam: LOW, mood: "dusk", cast: [OCTO("talk")] },
    ],
  },
  "11-stop": {
    shots: [
      {
        cam: CLOSE,
        mood: "dusk",
        cast: [OCTO("talk", { hearts: "stop" })],
        bubble: { name: "दादी कछुई", text: "तेज़ तैरने पर तीसरा दिल रुक जाता है। इसीलिए तू रेंगता है।", colour: "#5f7f45" },
      },
      { cam: MED, mood: "dusk", cast: [OCTO("idle"), TURTLE({ at: [2.8, 0.3, -1] })] },
    ],
  },
  "12-warning": {
    shots: [
      {
        cam: MED,
        mood: "dusk",
        cast: [OCTO("idle"), TURTLE()],
        net: { at: [0, 6.2, -3], rot: [0.25, 0, 0.06], opacity: 0.25 },
        bubble: { name: "दादी कछुई", text: "जाल में जितना हिलोगे, उतना उलझोगे। शांत रहना, और रास्ता ढूँढना।", colour: "#5f7f45" },
      },
      { cam: LOW, mood: "dusk", cast: [OCTO("idle"), TURTLE({ at: [2.4, 0.3, -0.6] })] },
    ],
  },
  "13-storm": {
    shots: [
      {
        cam: WIDE,
        mood: "storm",
        cast: [
          OCTO("scared"),
          { kind: "fish", at: [-1.2, 1.1, 0.6], scale: 0.4, colour: "#ff8a3d", stripe: true, phase: 0.6 },
          { kind: "fish", at: [1.1, 1.4, 0.4], scale: 0.34, colour: "#f7c948", phase: 1.9 },
        ],
        net: { at: [0, 5.6, -1.4], to: [0, 0.9, -1.4], rot: [0.12, 0, -0.05] },
        caption: "उस रात जाल चट्टानों पर गिरा।",
      },
      { cam: HIGH, mood: "storm", cast: [OCTO("scared"), { kind: "fish", at: [1.9, 1.5, 0.2], scale: 0.36, colour: "#ff8a3d", stripe: true, phase: 2.4 }], net: { at: [0, 0.9, -1.4], rot: [0.12, 0, -0.05] } },
    ],
  },
  "14-trapped": {
    shots: [
      {
        cam: MED,
        mood: "storm",
        cast: [OCTO("scared", { at: [-2.4, 0.1, 0.4], scale: 0.9 }), { kind: "fish", at: [0.3, 0.9, 0.9], scale: 0.42, colour: "#ff8a3d", stripe: true, phase: 0.5 }],
        net: { at: [0, 0.6, 0.2], rot: [0.1, 0, 0.04] },
        bubble: { name: "चिमटी", text: "मोती! मैं फँस गई! रस्सी मेरे पंखों में उलझ गई है!", colour: "#c2410c" },
      },
      { cam: CLOSE, mood: "storm", cast: [{ kind: "fish", at: [0.1, 0.85, 1.2], scale: 0.5, colour: "#ff8a3d", stripe: true, phase: 1.3 }], net: { at: [0, 0.5, 0.4], rot: [0.08, 0, -0.03] } },
    ],
  },
  "15-flee": {
    shots: [
      {
        cam: OTS_R,
        mood: "storm",
        cast: [OCTO("scared", { at: [-1.6, 0.1, 0] }), BARRACUDA({ at: [1.6, 0.9, -1.6] })],
        bubble: { name: "टूथू", text: "मैं यहाँ नहीं रुकता। यह जाल मेरे दाँतों से बड़ा है!", colour: "#3d6a80" },
      },
      { cam: WIDE, mood: "storm", cast: [OCTO("scared"), BARRACUDA({ at: [3.4, 1.2, -2], to: [8, 1.6, -3] })] },
    ],
  },
  "16-plan": {
    shots: [
      {
        cam: MED,
        mood: "dusk",
        cast: [OCTO("talk", { at: [-0.8, 0, 0] })],
        gap: { at: [2.6, -0.4, -1.4], scale: 0.8 },
        bubble: { name: "मोती", text: "मेरे पास हड्डियाँ नहीं हैं। जिस छेद से मछली नहीं निकले, उससे मैं निकलूँगा।" },
      },
      { cam: CLOSE, mood: "dusk", cast: [OCTO("talk", { at: [0, 0, 0] })] },
    ],
  },
  "17-squeeze": {
    shots: [
      {
        cam: CLOSE,
        mood: "dusk",
        cast: [OCTO("squeeze", { at: [-3.2, 0.2, 0], to: [3.2, 0.2, 0], scale: 0.85 })],
        gap: { at: [0, -0.4, -1.2], scale: 0.85 },
        caption: "मोती रस्सी जैसा पतला होकर अंदर सरक गया।",
      },
      { cam: MED, mood: "dusk", cast: [OCTO("squeeze", { at: [1.6, 0.2, 0.6], scale: 0.9 })], gap: { at: [0, -0.4, -1.2], scale: 0.85 } },
    ],
  },
  "18-inside": {
    shots: [
      {
        cam: LOW,
        mood: "storm",
        cast: [OCTO("scared", { at: [0, 0.1, 0.6] })],
        net: { at: [0, 0.4, 1.6], rot: [0, 0, 0.05], opacity: 0.9, scale: 1.2 },
        bubble: { name: "मोती", text: "अंधेरा था। मैंने हाथों से गाँठ पहचानी। हर गाँठ का एक सिरा होता है।" },
      },
      { cam: CLOSE, mood: "storm", cast: [OCTO("scared", { at: [0, 0.15, 0.4] })], net: { at: [0, 0.3, 1.4], rot: [0, 0, -0.04], opacity: 0.85, scale: 1.1 } },
    ],
  },
  "19-colour": {
    shots: [
      {
        cam: MED,
        mood: "dusk",
        cast: [OCTO("talk", { tint: "#3f6478" }), { kind: "crab", at: [2.4, -0.5, 0.2], scale: 0.6, phase: 0.8 }],
        gap: { at: [-2.8, -0.4, -1.8], scale: 0.7 },
        bubble: { name: "मोती", text: "मैंने रंग बदला। केकड़े ने मुझे नहीं पहचाना।" },
      },
      { cam: CLOSE, mood: "dusk", cast: [OCTO("talk", { tint: "#3f6478" })] },
    ],
  },
  "20-arms-work": {
    shots: [
      {
        cam: MED,
        mood: "dusk",
        cast: [OCTO("talk")],
        net: { at: [0, 0.6, 1.2], rot: [0.06, 0, -0.04], opacity: 0.6, scale: 0.9 },
        bubble: { name: "मोती", text: "आठ हाथ, आठ काम। दो ने रस्सी पकड़ी, दो ने गाँठ खोली।" },
      },
      { cam: LOW, mood: "dusk", cast: [OCTO("talk")], net: { at: [0, 0.8, 1.6], rot: [0.04, 0, 0.03], opacity: 0.45, scale: 0.8 } },
    ],
  },
  "21-hearts-work": {
    shots: [
      { cam: CLOSE, mood: "dusk", cast: [OCTO("talk", { hearts: "red" })], caption: "तीनों दिल ज़ोर से धड़के — वह थका नहीं।" },
      { cam: MED, mood: "dusk", cast: [OCTO("talk", { hearts: "red" })] },
    ],
  },
  "22-pulling": {
    shots: [
      {
        cam: LOW,
        mood: "storm",
        cast: [
          OCTO("scared", { at: [-1.8, 0.1, 0.6] }),
          { kind: "fish", at: [0.6, 1.0, 1.0], scale: 0.36, colour: "#ff8a3d", stripe: true, phase: 1.7 },
        ],
        net: { at: [0, 0.9, 1.2], to: [0, 3.4, 1.2], rot: [0.1, 0, 0.06], opacity: 0.9 },
        caption: "तभी जाल ऊपर खिंचने लगा। मोती के पास कुछ ही पल थे।",
      },
      { cam: WIDE, mood: "storm", cast: [OCTO("scared")], net: { at: [0, 4.2, 0.5], rot: [0.14, 0, -0.05], opacity: 0.7 } },
    ],
  },
  "23-free": {
    shots: [
      {
        cam: MED,
        mood: "day",
        cast: [OCTO("happy"), { kind: "fish", at: [-1.9, 1.15, 0.2], scale: 0.5, colour: "#ff8a3d", stripe: true, phase: 0.4 }],
        bubble: { name: "चिमटी", text: "मैं निकल गई! मोती, तुम अजीब नहीं हो!", colour: "#c2410c" },
      },
      { cam: FISH_SHOT, mood: "day", cast: [OCTO("happy"), { kind: "fish", at: [-1.3, 1.2, 0.6], scale: 0.55, colour: "#ff8a3d", stripe: true, phase: 1.6 }] },
    ],
  },
  "24-sorry": {
    shots: [
      {
        cam: OTS_L,
        mood: "day",
        cast: [OCTO("idle"), BARRACUDA({ at: [2.4, 0.7, -0.7], scale: 0.5 })],
        bubble: { name: "टूथू", text: "माफ़ी माँगता हूँ। तुम्हारे तीन दिलों ने वह किया, जो मेरे दाँत नहीं कर सके।", colour: "#3d6a80" },
      },
      { cam: MED, mood: "day", cast: [OCTO("idle"), BARRACUDA({ at: [2.2, 0.6, -0.9] })] },
    ],
  },
  "25-celebrate": {
    shots: [
      {
        cam: WIDE,
        mood: "dusk",
        cast: [
          OCTO("happy", { hearts: "red" }),
          { kind: "fish", at: [-2.6, 1.2, 0.4], to: [-1.2, 1.5, 0.4], scale: 0.4, colour: "#f7c948", phase: 0.5 },
          { kind: "fish", at: [2.4, 1.0, 0.6], to: [1.0, 1.4, 0.6], scale: 0.36, colour: "#2dd4bf", phase: 1.8 },
          { kind: "fish", at: [-0.4, 2.0, -0.6], to: [0.6, 1.7, -0.6], scale: 0.32, colour: "#ff8a3d", stripe: true, phase: 3.1 },
        ],
        caption: "उस रात पूरी चट्टान गाती रही।",
      },
      { cam: ORBIT, mood: "dusk", cast: [OCTO("happy", { hearts: "red" }), BARRACUDA({ at: [3.6, 1.1, -2.6], scale: 0.4 })] },
    ],
  },
  "26-proud": {
    shots: [
      {
        cam: MED,
        mood: "day",
        cast: [OCTO("happy"), TURTLE()],
        bubble: { name: "दादी कछुई", text: "तीन दिल, नीला खून, आठ हाथ। यह गलती नहीं है। यह डिज़ाइन है।", colour: "#5f7f45" },
      },
      { cam: TURTLE_SHOT, mood: "day", cast: [OCTO("happy"), TURTLE({ at: [2.3, 0.35, -0.5] })] },
    ],
  },
  "27-recap": {
    shots: [
      {
        cam: WIDE,
        mood: "dusk",
        cast: [OCTO("happy", { hearts: "red" }), TURTLE({ at: [2.9, 0.3, -1.4] }), CHIMTI({ at: [-2.5, 1.0, -0.4] })],
        caption: "हर अजीब चीज़, किसी न किसी दिन, किसी की जान बचाती है।",
      },
      { cam: CLOSE, mood: "dusk", cast: [OCTO("happy", { hearts: "red" })] },
    ],
  },
};

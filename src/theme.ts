import { loadFont as loadBaloo } from "@remotion/google-fonts/Baloo2";
import { loadFont as loadNoto } from "@remotion/google-fonts/NotoSansDevanagari";

// Devanagari display + body faces. Without these the runner falls back to a font
// with no Devanagari glyphs and every caption renders as boxes.
const baloo = loadBaloo("normal", {
  weights: ["400", "600", "700", "800"],
  subsets: ["devanagari", "latin"],
});

const noto = loadNoto("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["devanagari", "latin"],
});

export const display = baloo.fontFamily;
export const body = noto.fontFamily;

export const theme = {
  // water
  waterTop: "#1b7fa8",
  waterMid: "#0b4f74",
  waterDeep: "#03203a",
  // ink / paper
  ink: "#08202f",
  cream: "#fff7ea",
  paper: "#fffdf6",
  // characters
  moti: "#f4703f",
  motiDark: "#a83c15",
  dadi: "#5f7f45",
  dadiSkin: "#9fbf7a",
  chimti: "#ff8a3d",
  toothu: "#a8bfd0",
  crab: "#d94a3d",
  // accents
  coral: "#f97316",
  coralDeep: "#c2410c",
  gold: "#fde68a",
  goldDeep: "#f0b429",
  teal: "#2dd4bf",
  blue: "#4fa8e0",
  sand: "#ffd9a0",
  rock: "#2a4a5e",
  rockLight: "#3d6a80",
} as const;

import raw from "./manifest.json";

export type SceneTiming = {
  id: string;
  audio: string;
  character: string;
  seconds: number;
  frames: number;
  env?: string;
};

export type Manifest = {
  fps: number;
  engine: string;
  lang: string;
  totalSeconds: number;
  totalFrames: number;
  scenes: SceneTiming[];
};

export const manifest = raw as Manifest;

import * as THREE from "three";

/** Deterministic pseudo-random, so a texture is identical on every render. */
const rng = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
};

const paint = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void): THREE.CanvasTexture => {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (ctx) draw(ctx);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

const blob = (c: CanvasRenderingContext2D, x: number, y: number, r: number, colour: string) => {
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, colour);
  g.addColorStop(1, "rgba(0,0,0,0)");
  c.fillStyle = g;
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fill();
};

/** Octopus skin: warm base, darker mottling, the pearl spots he is named for. */
export const octopusSkin = (base: string, dark: string, spots = true): THREE.CanvasTexture =>
  paint(512, 512, (c) => {
    c.fillStyle = base;
    c.fillRect(0, 0, 512, 512);
    const rand = rng(7);
    for (let i = 0; i < 120; i++) {
      const x = rand() * 512;
      const y = rand() * 512;
      blob(c, x, y, 14 + rand() * 34, dark);
    }
    if (spots) {
      for (let i = 0; i < 54; i++) {
        const x = rand() * 512;
        const y = rand() * 512;
        blob(c, x, y, 7 + rand() * 10, "rgba(255,255,255,.85)");
      }
    }
  });

/** Turtle shell: olive plates. */
export const shellSkin = (): THREE.CanvasTexture =>
  paint(512, 512, (c) => {
    c.fillStyle = "#5f7f45";
    c.fillRect(0, 0, 512, 512);
    const rand = rng(19);
    for (let i = 0; i < 120; i++) {
      blob(c, rand() * 512, rand() * 512, 20 + rand() * 40, "rgba(40,60,28,.55)");
    }
    c.strokeStyle = "rgba(24,40,16,.7)";
    c.lineWidth = 7;
    for (let x = 0; x <= 512; x += 128) {
      c.beginPath();
      c.moveTo(x, 0);
      c.lineTo(x, 512);
      c.stroke();
    }
    for (let y = 0; y <= 512; y += 128) {
      c.beginPath();
      c.moveTo(0, y);
      c.lineTo(512, y);
      c.stroke();
    }
    for (let x = 0; x <= 512; x += 128) {
      for (let y = 0; y <= 512; y += 128) {
        blob(c, x + 64, y + 64, 46, "rgba(150,190,110,.35)");
      }
    }
  });

export const sandSkin = (): THREE.CanvasTexture =>
  paint(512, 512, (c) => {
    c.fillStyle = "#c9a273";
    c.fillRect(0, 0, 512, 512);
    const rand = rng(31);
    for (let i = 0; i < 2600; i++) {
      const v = 150 + Math.floor(rand() * 80);
      c.fillStyle = `rgba(${v},${v - 20},${v - 60},${0.18 + rand() * 0.3})`;
      c.fillRect(rand() * 512, rand() * 512, 2 + rand() * 4, 2 + rand() * 4);
    }
  });

/** Soft vertical falloff used for the light shafts. */
export const rayGradient = (): THREE.CanvasTexture =>
  paint(64, 512, (c) => {
    const g = c.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, "rgba(210,245,255,.85)");
    g.addColorStop(0.55, "rgba(190,235,255,.28)");
    g.addColorStop(1, "rgba(190,235,255,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, 64, 512);
    const side = c.createLinearGradient(0, 0, 64, 0);
    side.addColorStop(0, "rgba(0,0,0,1)");
    side.addColorStop(0.5, "rgba(0,0,0,0)");
    side.addColorStop(1, "rgba(0,0,0,1)");
    c.globalCompositeOperation = "destination-out";
    c.fillStyle = side;
    c.fillRect(0, 0, 64, 512);
  });

/** Soft round shadow used under characters instead of a shadow map. */
export const contactShadow = (): THREE.CanvasTexture =>
  paint(128, 128, (c) => {
    const g = c.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(0,0,0,.55)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, 128, 128);
  });

/** Vertical water gradient used on a big backdrop sphere. */
export const waterGradient = (top: string, bottom: string): THREE.CanvasTexture =>
  paint(8, 256, (c) => {
    const g = c.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, top);
    g.addColorStop(0.55, bottom);
    g.addColorStop(1, bottom);
    c.fillStyle = g;
    c.fillRect(0, 0, 8, 256);
  });

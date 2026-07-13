// Procedural programmer-art textures (no asset files) — generated at boot into
// small offscreen buffers, keyed by the map's `palette` (docs/08, docs/11).
// Walls are indexed by tile id; sprites by entity `type`.

import { rgba } from './framebuffer';
import { Rng } from '../core/rng';

export const TEX_SIZE = 64;

export interface Texture {
  width: number;
  height: number;
  /** Packed ABGR; a=0 means transparent (used by sprites). */
  data: Uint32Array;
}

interface Palette {
  ceiling: number;
  floor: number;
  /** Base color per wall tile id (index 1..n). Index 0 unused (empty tile). */
  walls: number[];
  door: number;
  accent: number;
}

const PALETTES: Record<string, Palette> = {
  // Session Archive — solemn cool blue (docs/01).
  'cool-blue': {
    ceiling: rgba(10, 14, 28),
    floor: rgba(18, 22, 40),
    walls: [0, rgba(40, 60, 110), rgba(56, 80, 140)],
    door: rgba(90, 150, 210),
    accent: rgba(124, 255, 178),
  },
  // Working Directory — unstable green terminal (docs/01, docs/08 neon).
  'working-directory': {
    ceiling: rgba(6, 10, 8),
    floor: rgba(12, 20, 16),
    walls: [0, rgba(30, 70, 50), rgba(44, 92, 66)],
    door: rgba(70, 200, 130),
    accent: rgba(124, 255, 178),
  },
};

function palette(name: string): Palette {
  return PALETTES[name] ?? PALETTES['working-directory']!;
}

function empty(w: number, h: number): Texture {
  return { width: w, height: h, data: new Uint32Array(w * h) };
}

/** Small deterministic per-channel jitter so flat surfaces get texture. */
function jitter(color: number, d: number): number {
  const r = Math.max(0, Math.min(255, (color & 0xff) + d));
  const g = Math.max(0, Math.min(255, ((color >> 8) & 0xff) + d));
  const b = Math.max(0, Math.min(255, ((color >> 16) & 0xff) + d));
  return rgba(r, g, b);
}

/** Brick-ish wall texture with mortar lines and grain. */
function makeWall(base: number, mortar: number, rng: Rng): Texture {
  const t = empty(TEX_SIZE, TEX_SIZE);
  const brickH = 16;
  const brickW = 32;
  for (let y = 0; y < TEX_SIZE; y++) {
    const row = Math.floor(y / brickH);
    const offset = (row % 2) * (brickW / 2);
    for (let x = 0; x < TEX_SIZE; x++) {
      const inMortarY = y % brickH < 2;
      const inMortarX = (x + offset) % brickW < 2;
      let c: number;
      if (inMortarY || inMortarX) {
        c = mortar;
      } else {
        c = jitter(base, rng.int(-12, 12));
      }
      t.data[y * TEX_SIZE + x] = c;
    }
  }
  return t;
}

/** Door texture: paneled slab with a bright frame. */
function makeDoor(base: number, frame: number): Texture {
  const t = empty(TEX_SIZE, TEX_SIZE);
  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      const edge = x < 4 || x >= TEX_SIZE - 4 || y < 4 || y >= TEX_SIZE - 4;
      const panel = x > 12 && x < TEX_SIZE - 12 && y > 12 && y < TEX_SIZE - 12;
      t.data[y * TEX_SIZE + x] = edge ? frame : panel ? jitter(base, 18) : base;
    }
  }
  return t;
}

/** Radial glow sprite (Session Anchor / pickup). cx,cy center, r radius. */
function makeGlow(color: number, r: number): Texture {
  const size = 48;
  const t = empty(size, size);
  const cx = size / 2;
  const cy = size / 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d > r) continue;
      const k = 1 - d / r;
      const rr = Math.min(255, (color & 0xff) * (0.4 + k));
      const gg = Math.min(255, ((color >> 8) & 0xff) * (0.4 + k));
      const bb = Math.min(255, ((color >> 16) & 0xff) * (0.4 + k));
      const a = Math.min(255, Math.floor(k * 320));
      t.data[y * size + x] = rgba(rr | 0, gg | 0, bb | 0, a);
    }
  }
  return t;
}

/** A little humanoid blob sprite (Hallucination Bot placeholder). */
function makeBot(color: number): Texture {
  const size = 48;
  const t = empty(size, size);
  const put = (x: number, y: number, c: number): void => {
    if (x >= 0 && x < size && y >= 0 && y < size) t.data[y * size + x] = c;
  };
  const eye = rgba(255, 60, 90);
  // Body ellipse.
  for (let y = 10; y < 44; y++) {
    for (let x = 12; x < 36; x++) {
      const nx = (x - 24) / 12;
      const ny = (y - 27) / 17;
      if (nx * nx + ny * ny <= 1) put(x, y, jitter(color, ((x + y) % 5) - 2));
    }
  }
  // Head.
  for (let y = 2; y < 16; y++) {
    for (let x = 17; x < 31; x++) {
      const nx = (x - 24) / 7;
      const ny = (y - 9) / 7;
      if (nx * nx + ny * ny <= 1) put(x, y, jitter(color, 8));
    }
  }
  // Glowing eyes.
  put(21, 9, eye);
  put(22, 9, eye);
  put(26, 9, eye);
  put(27, 9, eye);
  return t;
}

export interface TextureSet {
  ceiling: number;
  floor: number;
  /** Wall texture per tile id; index 0 is a dummy. */
  walls: Texture[];
  door: Texture;
  sprites: Map<string, Texture>;
}

/** Build all textures for a given palette name. Deterministic (seeded). */
export function buildTextures(paletteName: string): TextureSet {
  const p = palette(paletteName);
  const rng = new Rng(0x5eed ^ paletteName.length);
  const mortar = jitter(p.floor, -6);

  const walls: Texture[] = [empty(TEX_SIZE, TEX_SIZE)];
  for (let i = 1; i < p.walls.length; i++) {
    walls.push(makeWall(p.walls[i]!, mortar, rng));
  }

  const sprites = new Map<string, Texture>();
  sprites.set('session-anchor', makeGlow(rgba(90, 160, 255), 22));
  sprites.set('pickup', makeGlow(p.accent, 16));
  sprites.set('hallucination-bot', makeBot(rgba(150, 90, 200)));
  sprites.set('gate-node', makeGlow(rgba(255, 180, 80), 22));
  // Fallback marker for any unknown entity type.
  sprites.set('__default', makeGlow(rgba(200, 200, 200), 18));

  return {
    ceiling: p.ceiling,
    floor: p.floor,
    walls,
    door: makeDoor(p.door, p.accent),
    sprites,
  };
}

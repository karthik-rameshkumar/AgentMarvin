// Headless single-frame renderer — a screenshot/smoke tool for CI and manual
// sanity checks. Reuses the real engine modules (the framebuffer is just a
// Uint32Array) to rasterize one frame and encode it to PNG, no browser needed.
//
//   npx vite-node scripts/render-frame.ts [outfile.png]

import { readFileSync, writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { SCREEN_W, SCREEN_H } from '../src/render/framebuffer';
import { buildTextures } from '../src/render/textures';
import { renderWalls } from '../src/render/raycaster';
import { renderSprites, type SpriteInstance } from '../src/render/sprites';
import { drawDebug } from '../src/render/hud';
import { parseMap, World } from '../src/world/map';
import { createEntities, entitySprites } from '../src/world/entities';
import type { Player } from '../src/world/types';

const outFile = process.argv[2] ?? 'frame.png';
const FOV = 0.66;

const map = parseMap(JSON.parse(readFileSync('public/maps/episode1-lost-sessions.json', 'utf8')));
const world = new World(map);
const tex = buildTextures(map.palette);
const entities = createEntities(map);

// Stand in the A->B corridor looking east into the bot room, and pre-expose the
// bots so the frame exercises the real/fake tint + fade paths.
for (const e of entities) {
  if (e.type === 'hallucination-bot') e.exposed = true;
}
const sprites: SpriteInstance[] = entitySprites(entities, tex, 0.2);
// A translucent ghost mid-replay, to exercise the alpha path.
sprites.push({ pos: { x: 14, y: 6.5 }, texture: tex.sprites.get('ghost')!, alpha: 0.55 });

const player: Player = {
  pos: { x: 9.5, y: 6.5 },
  dir: { x: 1, y: 0 },
  plane: { x: 0, y: FOV },
};

// Open the corridor doors so the bot room is visible.
world.openDoorAt(8, 6);

const buf = new Uint32Array(SCREEN_W * SCREEN_H);
const fb = {
  buf,
  width: SCREEN_W,
  height: SCREEN_H,
  setPixel(x: number, y: number, c: number): void {
    if (x >= 0 && x < SCREEN_W && y >= 0 && y < SCREEN_H) buf[y * SCREEN_W + x] = c;
  },
} as unknown as import('../src/render/framebuffer').Framebuffer;

const depth = new Float32Array(SCREEN_W);
renderWalls(fb, player, world.solidAt, tex, depth);
renderSprites(fb, player, sprites, depth);
drawDebug(fb, 60, player.pos.x, player.pos.y);

writeFileSync(outFile, encodePng(buf, SCREEN_W, SCREEN_H));
console.log(`wrote ${outFile} (${SCREEN_W}x${SCREEN_H})`);

// --- minimal PNG encoder (RGBA, no external deps) ---
function encodePng(abgr: Uint32Array, w: number, h: number): Buffer {
  // Raw scanlines: 1 filter byte (0) + w*4 RGBA bytes per row.
  const raw = Buffer.alloc(h * (1 + w * 4));
  let p = 0;
  for (let y = 0; y < h; y++) {
    raw[p++] = 0; // filter: none
    for (let x = 0; x < w; x++) {
      const c = abgr[y * w + x]!;
      raw[p++] = c & 0xff; // R
      raw[p++] = (c >> 8) & 0xff; // G
      raw[p++] = (c >> 16) & 0xff; // B
      raw[p++] = (c >> 24) & 0xff || 255; // A (force opaque)
    }
  }
  const idat = deflateSync(raw);
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])) >>> 0, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]!;
    for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1;
  }
  return c ^ 0xffffffff;
}

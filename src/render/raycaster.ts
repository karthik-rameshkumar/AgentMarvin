// DDA raycaster (docs/11). Renders textured wall columns into the framebuffer and
// writes a per-column depth buffer so sprites.ts can occlude billboards correctly.
//
// `castRay` is a pure function (grid solidity is injected) so it can be unit-tested
// without a browser.

import { Framebuffer, SCREEN_W, SCREEN_H, shade } from './framebuffer';
import { TEX_SIZE, type TextureSet } from './textures';
import type { Player } from '../world/types';

/** Sentinel tile id returned by `solidAt` for a closed door. */
export const DOOR_TILE = 99;

export interface RayHit {
  /** Perpendicular distance to the wall (avoids fisheye). */
  dist: number;
  /** 0 = hit an x-side (E/W face), 1 = hit a y-side (N/S face). */
  side: 0 | 1;
  /** The solid tile id that was hit (wall id, or DOOR_TILE). */
  tileId: number;
  /** Where along the wall face the ray hit, in [0,1). */
  wallX: number;
  mapX: number;
  mapY: number;
}

/**
 * March a single ray via DDA. `solidAt(x,y)` returns 0 if passable, else the solid
 * tile id. Returns null if no wall is hit within `maxSteps`.
 */
export function castRay(
  solidAt: (x: number, y: number) => number,
  posX: number,
  posY: number,
  rayDirX: number,
  rayDirY: number,
  maxSteps = 128,
): RayHit | null {
  let mapX = Math.floor(posX);
  let mapY = Math.floor(posY);

  const deltaDistX = rayDirX === 0 ? Infinity : Math.abs(1 / rayDirX);
  const deltaDistY = rayDirY === 0 ? Infinity : Math.abs(1 / rayDirY);

  let stepX: number;
  let stepY: number;
  let sideDistX: number;
  let sideDistY: number;

  if (rayDirX < 0) {
    stepX = -1;
    sideDistX = (posX - mapX) * deltaDistX;
  } else {
    stepX = 1;
    sideDistX = (mapX + 1 - posX) * deltaDistX;
  }
  if (rayDirY < 0) {
    stepY = -1;
    sideDistY = (posY - mapY) * deltaDistY;
  } else {
    stepY = 1;
    sideDistY = (mapY + 1 - posY) * deltaDistY;
  }

  let side: 0 | 1 = 0;
  for (let i = 0; i < maxSteps; i++) {
    if (sideDistX < sideDistY) {
      sideDistX += deltaDistX;
      mapX += stepX;
      side = 0;
    } else {
      sideDistY += deltaDistY;
      mapY += stepY;
      side = 1;
    }

    const tileId = solidAt(mapX, mapY);
    if (tileId > 0) {
      const dist =
        side === 0
          ? sideDistX - deltaDistX
          : sideDistY - deltaDistY;
      let wallX =
        side === 0 ? posY + dist * rayDirY : posX + dist * rayDirX;
      wallX -= Math.floor(wallX);
      return { dist: Math.max(1e-4, dist), side, tileId, wallX, mapX, mapY };
    }
  }
  return null;
}

/** Distance shading factor in (0,1]; nearer = brighter. */
function fog(dist: number): number {
  return Math.max(0.15, Math.min(1, 1 / (1 + dist * 0.18)));
}

/**
 * Render the wall layer. Fills ceiling/floor, then casts one ray per screen
 * column. `depth` is filled with each column's perpendicular distance.
 */
export function renderWalls(
  fb: Framebuffer,
  player: Player,
  solidAt: (x: number, y: number) => number,
  tex: TextureSet,
  depth: Float32Array,
): void {
  const halfH = SCREEN_H >> 1;

  // Flat ceiling (top half) and floor (bottom half).
  for (let y = 0; y < halfH; y++) {
    const row = y * SCREEN_W;
    fb.buf.fill(tex.ceiling, row, row + SCREEN_W);
  }
  for (let y = halfH; y < SCREEN_H; y++) {
    const row = y * SCREEN_W;
    fb.buf.fill(tex.floor, row, row + SCREEN_W);
  }

  for (let x = 0; x < SCREEN_W; x++) {
    const cameraX = (2 * x) / SCREEN_W - 1;
    const rayDirX = player.dir.x + player.plane.x * cameraX;
    const rayDirY = player.dir.y + player.plane.y * cameraX;

    const hit = castRay(solidAt, player.pos.x, player.pos.y, rayDirX, rayDirY);
    if (!hit) {
      depth[x] = Infinity;
      continue;
    }
    depth[x] = hit.dist;

    const lineHeight = Math.floor(SCREEN_H / hit.dist);
    let drawStart = -(lineHeight >> 1) + halfH;
    let drawEnd = (lineHeight >> 1) + halfH;

    const texture = hit.tileId === DOOR_TILE ? tex.door : tex.walls[hit.tileId] ?? tex.walls[1]!;

    let texX = Math.floor(hit.wallX * TEX_SIZE);
    if (hit.side === 0 && rayDirX > 0) texX = TEX_SIZE - texX - 1;
    if (hit.side === 1 && rayDirY < 0) texX = TEX_SIZE - texX - 1;

    const step = TEX_SIZE / lineHeight;
    // Texture coordinate at the (clamped) top of the column.
    let texPos = (drawStart - halfH + (lineHeight >> 1)) * step;
    if (drawStart < 0) {
      texPos += -drawStart * step;
      drawStart = 0;
    }
    if (drawEnd > SCREEN_H) drawEnd = SCREEN_H;

    const shadeT = fog(hit.dist) * (hit.side === 1 ? 0.72 : 1);
    const col = texX;
    for (let y = drawStart; y < drawEnd; y++) {
      const texY = Math.min(TEX_SIZE - 1, texPos | 0);
      texPos += step;
      const c = texture.data[texY * TEX_SIZE + col]!;
      fb.buf[y * SCREEN_W + x] = shade(c, shadeT);
    }
  }
}

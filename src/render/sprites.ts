// Billboarded sprite rendering (docs/11). Sprites are projected with the inverse
// camera matrix, z-sorted far-to-near, and clipped per-column against the wall
// depth buffer so they're correctly occluded by geometry. Transparent texels
// (alpha 0) are skipped.

import { Framebuffer, SCREEN_W, SCREEN_H, shade } from './framebuffer';
import type { Texture } from './textures';
import type { Player, Vec2 } from '../world/types';

export interface SpriteInstance {
  pos: Vec2;
  texture: Texture;
}

/** Distance shading factor, matching the wall fog curve. */
function fog(dist: number): number {
  return Math.max(0.25, Math.min(1, 1 / (1 + dist * 0.18)));
}

export function renderSprites(
  fb: Framebuffer,
  player: Player,
  sprites: SpriteInstance[],
  depth: Float32Array,
): void {
  if (sprites.length === 0) return;

  // Sort by squared distance, far first (painter's order).
  const order = sprites
    .map((s, i) => {
      const dx = s.pos.x - player.pos.x;
      const dy = s.pos.y - player.pos.y;
      return { i, d2: dx * dx + dy * dy };
    })
    .sort((a, b) => b.d2 - a.d2);

  const invDet =
    1 / (player.plane.x * player.dir.y - player.dir.x * player.plane.y);
  const halfH = SCREEN_H >> 1;

  for (const { i } of order) {
    const sprite = sprites[i]!;
    const spriteX = sprite.pos.x - player.pos.x;
    const spriteY = sprite.pos.y - player.pos.y;

    // Camera-space transform. transformY is the depth (forward distance).
    const transformX =
      invDet * (player.dir.y * spriteX - player.dir.x * spriteY);
    const transformY =
      invDet * (-player.plane.y * spriteX + player.plane.x * spriteY);

    if (transformY <= 0.05) continue; // behind camera / too close

    const screenX = Math.floor((SCREEN_W / 2) * (1 + transformX / transformY));

    const spriteH = Math.abs(Math.floor(SCREEN_H / transformY));
    const spriteW = spriteH; // sprites authored square

    // Unclipped top of the sprite column; used as the texture-mapping origin.
    const spriteTop = halfH - (spriteH >> 1);
    let drawStartY = spriteTop;
    let drawEndY = (spriteH >> 1) + halfH;
    if (drawStartY < 0) drawStartY = 0;
    if (drawEndY > SCREEN_H) drawEndY = SCREEN_H;

    let drawStartX = -(spriteW >> 1) + screenX;
    let drawEndX = (spriteW >> 1) + screenX;
    if (drawStartX < 0) drawStartX = 0;
    if (drawEndX > SCREEN_W) drawEndX = SCREEN_W;

    const tw = sprite.texture.width;
    const th = sprite.texture.height;
    const shadeT = fog(transformY);
    const startXOffset = -(spriteW >> 1) + screenX;

    for (let x = drawStartX; x < drawEndX; x++) {
      // Occlusion: skip stripes hidden behind nearer walls.
      if (transformY >= depth[x]!) continue;
      const texX = Math.floor(((x - startXOffset) * tw) / spriteW);
      if (texX < 0 || texX >= tw) continue;

      for (let y = drawStartY; y < drawEndY; y++) {
        const texY = Math.floor(((y - spriteTop) * th) / spriteH);
        if (texY < 0 || texY >= th) continue;
        const c = sprite.texture.data[texY * tw + texX]!;
        if ((c >>> 24) === 0) continue; // transparent
        fb.buf[y * SCREEN_W + x] = shade(c, shadeT);
      }
    }
  }
}

// Entities for M0 are static billboards (no AI — that's M1). This module turns
// the map's authored entities into renderable sprite instances, resolving each
// entity `type` to a procedural texture from the TextureSet.

import type { GameMap, Vec2 } from './types';
import type { TextureSet } from '../render/textures';
import type { SpriteInstance } from '../render/sprites';

export interface Entity {
  type: string;
  pos: Vec2;
}

export function createEntities(map: GameMap): Entity[] {
  return (map.entities ?? []).map((e) => ({
    type: e.type,
    // Center entities in their tile.
    pos: { x: e.at[0] + 0.5, y: e.at[1] + 0.5 },
  }));
}

/** Resolve entities to draw-ready sprite instances (texture per type). */
export function spriteInstances(entities: Entity[], tex: TextureSet): SpriteInstance[] {
  const fallback = tex.sprites.get('__default')!;
  return entities.map((e) => ({
    pos: e.pos,
    texture: tex.sprites.get(e.type) ?? fallback,
  }));
}

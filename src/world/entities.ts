// Entities carry per-type runtime state (M1). This module owns the Entity shape,
// builds them from the map, and resolves each to a draw-ready sprite instance with
// state-driven alpha/tint (fading dispelled bots, exposed real/fake tints).

import type { GameMap, GateDecision, Vec2 } from './types';
import type { TextureSet } from '../render/textures';
import type { SpriteInstance } from '../render/sprites';
import { rgba } from '../render/framebuffer';

export interface Entity {
  type: string;
  pos: Vec2;
  /** Present/alive in the world; false once dispelled (bot) or taken (pickup). */
  alive: boolean;
  /** Dispel/spawn animation, 1 = fully present, 0 = gone. */
  fade: number;
  // hallucination-bot
  real?: boolean;
  exposed?: boolean;
  // session-anchor
  sessionId?: string;
  replayed?: boolean;
  // pickup
  item?: string;
  // gate-node
  requiresEvidence?: number;
  soundDecision?: GateDecision;
  // rubber-duck / readme
  hint?: string;
  used?: boolean;
}

export function createEntities(map: GameMap): Entity[] {
  return (map.entities ?? []).map((e) => ({
    type: e.type,
    pos: { x: e.at[0] + 0.5, y: e.at[1] + 0.5 },
    alive: true,
    fade: 1,
    real: e.real,
    exposed: false,
    sessionId: e.sessionId,
    replayed: false,
    item: e.item,
    requiresEvidence: e.requiresEvidence,
    soundDecision: e.soundDecision,
    hint: e.hint,
    used: false,
  }));
}

/** Tint applied to a scanned/exposed bot: green if real, red if hallucinated. */
function exposedTint(real: boolean | undefined): number {
  return real ? rgba(120, 255, 150) : rgba(255, 90, 110);
}

/** Build sprite instances for the currently-visible entities. */
export function entitySprites(entities: Entity[], tex: TextureSet, time: number): SpriteInstance[] {
  const fallback = tex.sprites.get('__default')!;
  const out: SpriteInstance[] = [];
  for (const e of entities) {
    if (!e.alive && e.fade <= 0) continue;
    const inst: SpriteInstance = {
      pos: e.pos,
      texture: tex.sprites.get(e.type) ?? fallback,
    };
    if (e.fade < 1) inst.alpha = e.fade;
    if (e.type === 'hallucination-bot' && e.exposed) {
      inst.tint = exposedTint(e.real);
      // Fakes flicker while dissolving.
      if (!e.real) inst.alpha = (inst.alpha ?? 1) * (0.55 + 0.45 * Math.sin(time * 18));
    }
    out.push(inst);
  }
  return out;
}

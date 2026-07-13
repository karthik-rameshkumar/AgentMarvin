// Weapon system (docs/03). Marvin's arsenal is a detective's toolkit — the M1
// weapons (Context Scanner, Session Replayer) gather truth, they don't deal
// damage (Trust over Violence). This module owns ownership/selection and the
// shared WeaponContext + target-picking the individual weapons act through.

import type { Entity } from '../world/entities';
import type { MapSession, Player, WeaponId } from '../world/types';
import type { World } from '../world/map';
import type { Trust } from '../mechanics/trust';
import type { Evidence } from '../mechanics/evidence';
import type { Audio } from '../audio/audio';

/** The slice of game state a weapon needs to act. Passed in by game.ts. */
export interface WeaponContext {
  player: Player;
  entities: Entity[];
  world: World;
  trust: Trust;
  evidence: Evidence;
  sessions: MapSession[];
  audio: Audio;
  spawnGhost(session: MapSession): void;
  narrate(text: string): void;
}

export const WEAPON_NAMES: Record<WeaponId, string> = {
  'context-scanner': 'Context Scanner',
  'session-replayer': 'Session Replayer',
};

const SLOTS: Record<number, WeaponId> = {
  1: 'context-scanner',
  2: 'session-replayer',
};

export class WeaponSystem {
  private owned = new Set<WeaponId>(['context-scanner']);
  current: WeaponId = 'context-scanner';

  has(id: WeaponId): boolean {
    return this.owned.has(id);
  }

  give(id: WeaponId): boolean {
    if (this.owned.has(id)) return false;
    this.owned.add(id);
    this.current = id; // auto-equip on pickup
    return true;
  }

  /** Select by number key (1/2). Ignores unowned slots. */
  selectSlot(n: number): void {
    const id = SLOTS[n];
    if (id && this.owned.has(id)) this.current = id;
  }

  name(): string {
    return WEAPON_NAMES[this.current];
  }
}

/** A unique key for evidence/dedup, from an entity's tile position. */
export function entityKey(e: Entity): string {
  return `${Math.floor(e.pos.x)},${Math.floor(e.pos.y)}`;
}

/**
 * Nearest alive entity of `types` within `range` and inside the forward cone
 * (dot(dir, toEntity) >= cosTol). Returns null if none.
 */
export function pickTarget(
  ctx: WeaponContext,
  types: string[],
  range: number,
  cosTol: number,
): Entity | null {
  const { player } = ctx;
  let best: Entity | null = null;
  let bestDist = Infinity;
  for (const e of ctx.entities) {
    if (!e.alive || !types.includes(e.type)) continue;
    const dx = e.pos.x - player.pos.x;
    const dy = e.pos.y - player.pos.y;
    const dist = Math.hypot(dx, dy);
    if (dist > range || dist < 1e-4) continue;
    const dot = (dx / dist) * player.dir.x + (dy / dist) * player.dir.y;
    if (dot < cosTol) continue;
    if (dist < bestDist) {
      bestDist = dist;
      best = e;
    }
  }
  return best;
}

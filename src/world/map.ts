// World: wraps a loaded GameMap with runtime state (door open/closed) and the
// queries the raycaster and collision need. Faithful to the doc-11 JSON schema.

import type { GameMap, TileId, Vec2 } from './types';
import { DOOR_TILE } from '../render/raycaster';

interface DoorState {
  open: boolean;
  label?: string;
  locked: boolean;
}

/** Parse + lightly validate a raw JSON object into a GameMap. Throws on bad shape. */
export function parseMap(raw: unknown): GameMap {
  const m = raw as Partial<GameMap>;
  if (!m || typeof m !== 'object') throw new Error('map: not an object');
  if (!m.grid || !Array.isArray(m.grid.tiles)) throw new Error('map: missing grid.tiles');
  const { width, height, tiles } = m.grid;
  if (typeof width !== 'number' || typeof height !== 'number') {
    throw new Error('map: grid width/height must be numbers');
  }
  if (tiles.length !== width * height) {
    throw new Error(`map: grid has ${tiles.length} tiles, expected ${width * height}`);
  }
  if (typeof m.id !== 'string' || typeof m.region !== 'string' || typeof m.palette !== 'string') {
    throw new Error('map: id/region/palette must be strings');
  }
  return m as GameMap;
}

const key = (x: number, y: number): string => `${x},${y}`;

export class World {
  readonly map: GameMap;
  private readonly doors = new Map<string, DoorState>();

  constructor(map: GameMap) {
    this.map = map;
    for (const d of map.doors ?? []) {
      this.doors.set(key(d.at[0], d.at[1]), {
        open: false,
        label: d.label,
        locked: d.locked ?? false,
      });
    }
  }

  get width(): number {
    return this.map.grid.width;
  }
  get height(): number {
    return this.map.grid.height;
  }

  /** Raw grid tile id; treats out-of-bounds as solid wall id 1. */
  tileAt(x: number, y: number): TileId {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return 1;
    return this.map.grid.tiles[y * this.width + x] ?? 0;
  }

  /**
   * Solidity query for the raycaster/collision: 0 if passable, else the solid
   * tile id (wall id, or DOOR_TILE for a closed door).
   */
  solidAt = (x: number, y: number): number => {
    const door = this.doors.get(key(x, y));
    if (door) return door.open ? 0 : DOOR_TILE;
    return this.tileAt(x, y);
  };

  /** True if a circle-body cannot occupy tile (x,y). */
  isBlocked(x: number, y: number): boolean {
    return this.solidAt(Math.floor(x), Math.floor(y)) > 0;
  }

  /**
   * Try to open a door directly in front of `pos` facing `dir` (within ~1 tile).
   * Returns 'opened' | 'locked' | 'none' so callers can play the right SFX.
   * M0: `locked` doors still open (lock/evidence logic is an M1 concern) but we
   * surface the state so the hook is ready.
   */
  tryOpenDoor(pos: Vec2, dir: Vec2): 'opened' | 'locked' | 'none' {
    const tx = Math.floor(pos.x + dir.x * 0.8);
    const ty = Math.floor(pos.y + dir.y * 0.8);
    const door = this.doors.get(key(tx, ty));
    if (!door || door.open) return 'none';
    door.open = true;
    return door.locked ? 'locked' : 'opened';
  }
}

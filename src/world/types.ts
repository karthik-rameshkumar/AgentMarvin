// Shared types for AgentMarvin M0.
// The map schema mirrors docs/11-technical-spec.md exactly so later milestones
// (Sessions, Trails, Gates) need no format change. Fields not used in M0 are
// parsed and kept but otherwise inert.

/** A 2D grid position in tile coordinates. */
export type Vec2 = { x: number; y: number };

/** Tile ids used by the raycaster. 0 = empty/floor; >0 = solid wall variants. */
export type TileId = number;

export interface MapGrid {
  width: number;
  height: number;
  /** Row-major array of length width*height. */
  tiles: TileId[];
}

export interface MapDoor {
  /** [x, y] tile the door occupies. */
  at: [number, number];
  label?: string;
  /** M0: doors open on interact regardless of `locked`. Lock logic lands in M1. */
  locked?: boolean;
  opensVia?: string;
}

/** Entity as authored in the map JSON. `type` drives which sprite is drawn. */
export interface MapEntity {
  type: string;
  /** [x, y] in tile coordinates (may be fractional). */
  at: [number, number];
  /** Whether a hallucination is real (M1 mechanic); parsed now, unused in M0. */
  real?: boolean;
  item?: string;
  sessionId?: string;
  requiresEvidence?: number;
}

/** Recorded action log for a Session ghost. Parsed but unused in M0. */
export interface MapSession {
  id: string;
  actions: unknown[];
}

/** Lineage edge for the Trail Beacon. Parsed but unused in M0. */
export interface MapTrail {
  effect: string;
  causes: string[];
}

/** Optional player start (extension to the doc-11 schema). */
export interface MapSpawn {
  at: [number, number];
  /** Facing angle in radians (0 = +x). Defaults to 0. */
  angle?: number;
}

/** The on-disk level format (docs/11-technical-spec.md#map-data-format-json). */
export interface GameMap {
  id: string;
  region: string;
  palette: string;
  grid: MapGrid;
  spawn?: MapSpawn;
  doors?: MapDoor[];
  entities?: MapEntity[];
  sessions?: MapSession[];
  trails?: MapTrail[];
  trustStart?: number;
}

/** Runtime player state (position + facing). */
export interface Player {
  /** World position in tile units (e.g. 3.5 = middle of tile 3). */
  pos: Vec2;
  /** Facing direction unit vector. */
  dir: Vec2;
  /** Camera plane, perpendicular to dir; its length sets the FOV. */
  plane: Vec2;
}

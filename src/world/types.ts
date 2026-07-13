// Shared, dependency-light data types for AgentMarvin.
// The map schema mirrors docs/11-technical-spec.md. GameState lives in
// core/game.ts (not here) to keep this module free of import cycles.

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
  /** Punny branch label shown as a toast on open (docs/10). */
  label?: string;
  locked?: boolean;
  opensVia?: string;
  /** A false door (docs/05): only appears/blocks while Trust distortion is active. */
  false?: boolean;
}

/** A binding production decision at a Gate (docs/02 §5). */
export type GateDecision = 'promote' | 'reject' | 'hold';

/** Weapon slots implemented in M1. */
export type WeaponId = 'context-scanner' | 'session-replayer';

/** Entity as authored in the map JSON. `type` drives which sprite is drawn. */
export interface MapEntity {
  type: string;
  /** [x, y] in tile coordinates (may be fractional). */
  at: [number, number];
  /** Hallucination Bot: whether it is real (vs. a fake to expose). */
  real?: boolean;
  /** pickup: the WeaponId it grants. */
  item?: string;
  /** session-anchor: which session log it replays. */
  sessionId?: string;
  /** gate-node: minimum evidence + the sound decision (docs/02 §5). */
  requiresEvidence?: number;
  soundDecision?: GateDecision;
  /** rubber-duck / readme: the hint or note text (docs/10). */
  hint?: string;
}

/** One recorded event in a Session log (docs/02 §1; replayed through the sim). */
export type SessionEvent =
  | { t: number; kind: 'move'; x: number; y: number; dirX: number; dirY: number }
  | { t: number; kind: 'door'; at: [number, number] }
  | { t: number; kind: 'say'; text: string };

/** Recorded action log for a Session ghost. */
export interface MapSession {
  id: string;
  actions: SessionEvent[];
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

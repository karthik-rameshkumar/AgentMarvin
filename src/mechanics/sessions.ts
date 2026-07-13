// Sessions (docs/02 §1) — replay a recorded action log as a translucent ghost that
// re-performs history. `poseAt` / `discreteEventsBetween` are pure (unit-tested);
// the Ghost class wraps them with a clock and fires door/say callbacks.

import type { MapSession, SessionEvent, Vec2 } from '../world/types';

export interface Pose {
  x: number;
  y: number;
  dirX: number;
  dirY: number;
}

/** Move keyframes only, in time order. */
function moveKeys(log: MapSession): Extract<SessionEvent, { kind: 'move' }>[] {
  return log.actions.filter((e): e is Extract<SessionEvent, { kind: 'move' }> => e.kind === 'move');
}

/** Total duration = timestamp of the last event (0 if none). */
export function duration(log: MapSession): number {
  return log.actions.reduce((m, e) => Math.max(m, e.t), 0);
}

/** Interpolated pose at time `t` (pure). Clamps to the first/last keyframe. */
export function poseAt(log: MapSession, t: number): Pose {
  const keys = moveKeys(log);
  if (keys.length === 0) return { x: 0, y: 0, dirX: 1, dirY: 0 };
  if (t <= keys[0]!.t) return poseOf(keys[0]!);
  const last = keys[keys.length - 1]!;
  if (t >= last.t) return poseOf(last);
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i]!;
    const b = keys[i + 1]!;
    if (t >= a.t && t <= b.t) {
      const span = b.t - a.t || 1;
      const k = (t - a.t) / span;
      return {
        x: lerp(a.x, b.x, k),
        y: lerp(a.y, b.y, k),
        dirX: lerp(a.dirX, b.dirX, k),
        dirY: lerp(a.dirY, b.dirY, k),
      };
    }
  }
  return poseOf(last);
}

/** Non-move events whose timestamp falls in (t0, t1] (pure). */
export function discreteEventsBetween(
  log: MapSession,
  t0: number,
  t1: number,
): Exclude<SessionEvent, { kind: 'move' }>[] {
  return log.actions.filter(
    (e): e is Exclude<SessionEvent, { kind: 'move' }> =>
      e.kind !== 'move' && e.t > t0 && e.t <= t1,
  );
}

function poseOf(k: Extract<SessionEvent, { kind: 'move' }>): Pose {
  return { x: k.x, y: k.y, dirX: k.dirX, dirY: k.dirY };
}
function lerp(a: number, b: number, k: number): number {
  return a + (b - a) * k;
}

export interface GhostCallbacks {
  onDoor(at: [number, number]): void;
  onSay(text: string): void;
  onDone(log: MapSession): void;
}

/** A live replay of a Session. Read-only in the world; harmless to the player. */
export class Ghost {
  readonly pos: Vec2 = { x: 0, y: 0 };
  readonly dir: Vec2 = { x: 1, y: 0 };
  done = false;
  private elapsed = 0;
  private readonly total: number;

  constructor(
    readonly log: MapSession,
    private readonly cb: GhostCallbacks,
  ) {
    this.total = duration(log);
    const p = poseAt(log, 0);
    this.pos.x = p.x;
    this.pos.y = p.y;
    this.dir.x = p.dirX;
    this.dir.y = p.dirY;
  }

  /** Advance the ghost; fires door/say events crossed this step. */
  update(dt: number): void {
    if (this.done) return;
    const prev = this.elapsed;
    this.elapsed = Math.min(this.total, this.elapsed + dt);

    for (const e of discreteEventsBetween(this.log, prev, this.elapsed)) {
      if (e.kind === 'door') this.cb.onDoor(e.at);
      else if (e.kind === 'say') this.cb.onSay(e.text);
    }

    const p = poseAt(this.log, this.elapsed);
    this.pos.x = p.x;
    this.pos.y = p.y;
    this.dir.x = p.dirX;
    this.dir.y = p.dirY;

    if (this.elapsed >= this.total) {
      this.done = true;
      this.cb.onDone(this.log);
    }
  }

  /** 0..1 replay progress. */
  progress(): number {
    return this.total === 0 ? 1 : this.elapsed / this.total;
  }
}

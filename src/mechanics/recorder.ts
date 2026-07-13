// Session recorder (dev tool, docs/11) — the authentic way to author ghosts.
// Enable with ?record in the URL; it captures the player's pose at a fixed rate
// plus door/say events into a MapSession, then exports JSON to paste into a map's
// `sessions[]`. The sampling core is pure so it can be round-trip tested.

import type { MapSession, Player, SessionEvent } from '../world/types';

const SAMPLE_HZ = 10; // pose keyframes per second

export class Recorder {
  active = false;
  private id = 'recorded';
  private actions: SessionEvent[] = [];
  private clock = 0;
  private sinceSample = 0;

  /** Is recording available this session? (gated by ?record) */
  static isEnabled(): boolean {
    return typeof location !== 'undefined' && new URLSearchParams(location.search).has('record');
  }

  start(id = 'recorded'): void {
    this.id = id;
    this.actions = [];
    this.clock = 0;
    this.sinceSample = 1 / SAMPLE_HZ; // sample immediately
    this.active = true;
  }

  /** Call each sim tick with the current player pose. */
  sample(dt: number, player: Player): void {
    if (!this.active) return;
    this.clock += dt;
    this.sinceSample += dt;
    if (this.sinceSample >= 1 / SAMPLE_HZ) {
      this.sinceSample = 0;
      this.actions.push({
        t: round(this.clock),
        kind: 'move',
        x: round(player.pos.x),
        y: round(player.pos.y),
        dirX: round(player.dir.x),
        dirY: round(player.dir.y),
      });
    }
  }

  /** Record a discrete door event at the current time. */
  door(at: [number, number]): void {
    if (this.active) this.actions.push({ t: round(this.clock), kind: 'door', at });
  }

  /** Record a narration line at the current time. */
  say(text: string): void {
    if (this.active) this.actions.push({ t: round(this.clock), kind: 'say', text });
  }

  stop(): MapSession {
    this.active = false;
    return { id: this.id, actions: this.actions };
  }

  toJSON(): string {
    return JSON.stringify({ id: this.id, actions: this.actions }, null, 2);
  }

  /** Trigger a browser download of the recorded log (no-op outside the browser). */
  download(): void {
    if (typeof document === 'undefined') return;
    const blob = new Blob([this.toJSON()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.id}.session.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

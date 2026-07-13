import { describe, it, expect } from 'vitest';
import { poseAt, duration, discreteEventsBetween, Ghost } from '../src/mechanics/sessions';
import { Recorder } from '../src/mechanics/recorder';
import type { MapSession, Player } from '../src/world/types';

const log: MapSession = {
  id: 'g1',
  actions: [
    { t: 0, kind: 'move', x: 0, y: 0, dirX: 1, dirY: 0 },
    { t: 2, kind: 'move', x: 4, y: 0, dirX: 1, dirY: 0 },
    { t: 1, kind: 'say', text: 'halfway' },
    { t: 1.5, kind: 'door', at: [4, 0] },
  ],
};

describe('poseAt (pure interpolation)', () => {
  it('clamps before the first / after the last keyframe', () => {
    expect(poseAt(log, -1).x).toBe(0);
    expect(poseAt(log, 99).x).toBe(4);
  });

  it('interpolates linearly between keyframes', () => {
    expect(poseAt(log, 1).x).toBeCloseTo(2, 5); // halfway between x0 and x4
  });

  it('duration is the last timestamp', () => {
    expect(duration(log)).toBe(2);
  });
});

describe('discreteEventsBetween', () => {
  it('returns non-move events in (t0,t1]', () => {
    const evs = discreteEventsBetween(log, 0.5, 1.6);
    expect(evs.map((e) => e.kind).sort()).toEqual(['door', 'say']);
  });
});

describe('Ghost', () => {
  it('fires door/say events and completes', () => {
    const doors: [number, number][] = [];
    const says: string[] = [];
    let done = false;
    const g = new Ghost(log, {
      onDoor: (at) => doors.push(at),
      onSay: (t) => says.push(t),
      onDone: () => {
        done = true;
      },
    });
    for (let i = 0; i < 25; i++) g.update(0.1); // 2.5s > duration
    expect(doors).toEqual([[4, 0]]);
    expect(says).toEqual(['halfway']);
    expect(done).toBe(true);
    expect(g.progress()).toBe(1);
  });
});

describe('Recorder round-trip', () => {
  it('captures poses that poseAt can reproduce', () => {
    const rec = new Recorder();
    rec.start('rt');
    const player: Player = { pos: { x: 0, y: 0 }, dir: { x: 1, y: 0 }, plane: { x: 0, y: 0.66 } };
    // Walk +x at 10 units/s for ~1s, sampling each 0.1s tick.
    for (let i = 0; i < 10; i++) {
      player.pos.x += 1;
      rec.sample(0.1, player);
    }
    const out = rec.stop();
    expect(out.id).toBe('rt');
    const moves = out.actions.filter((a) => a.kind === 'move');
    expect(moves.length).toBeGreaterThan(5);
    // The recorded log should reproduce a monotonically increasing x.
    const p0 = poseAt(out, 0);
    const p1 = poseAt(out, duration(out));
    expect(p1.x).toBeGreaterThan(p0.x);
  });
});

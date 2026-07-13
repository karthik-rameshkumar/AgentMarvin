// Headless integration test of the Episode 1 teach chain (docs/06/07), driving the
// real game systems with stubbed DOM/audio. Proves: replay a Session → ghost opens
// the LOCKED door → evidence is awarded → the Gate decision moves Trust and wins.

import { describe, it, expect } from 'vitest';
import { parseMap } from '../src/world/map';
import { createGame, updateGame, type GameDeps } from '../src/core/game';
import type { Action, Input } from '../src/core/input';
import type { GateDecision } from '../src/world/types';
import rawMap from '../public/maps/episode1-lost-sessions.json';

/** Minimal Input stand-in: press() queues a one-shot edge for the next tick. */
class FakeInput {
  private pressed = new Set<Action>();
  isDown(): boolean {
    return false;
  }
  wasPressed(a: Action): boolean {
    if (this.pressed.has(a)) {
      this.pressed.delete(a);
      return true;
    }
    return false;
  }
  consumeMouseDx(): number {
    return 0;
  }
  press(a: Action): void {
    this.pressed.add(a);
  }
}

function stubDeps(): { deps: GameDeps; gate: { cb: ((d: GateDecision) => void) | null } } {
  const noop = (): void => {};
  const audio = new Proxy({}, { get: () => noop });
  const hud = {
    setWeapon: noop,
    setTrust: noop,
    setEvidence: noop,
    setGlitch: noop,
    toast: noop,
    showReveal: noop,
    hideReveal: noop,
  };
  const gateRef: { cb: ((d: GateDecision) => void) | null } = { cb: null };
  const gateui = {
    isOpen: false,
    show(_c: number, _r: number, cb: (d: GateDecision) => void) {
      this.isOpen = true;
      gateRef.cb = cb;
    },
    hide() {
      this.isOpen = false;
    },
  };
  const map = parseMap(rawMap);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { deps: { map, audio, hud, gateui } as any as GameDeps, gate: gateRef };
}

describe('Episode 1 — Sessions → Gate teach chain', () => {
  it('replays a Session that opens the locked door and awards evidence', () => {
    const { deps } = stubDeps();
    const game = createGame(deps);
    const input = new FakeInput();

    // Locked release door starts solid.
    expect(game.world.solidAt(29, 6)).toBeGreaterThan(0);

    // Equip the Session Replayer and stand facing the anchor at (23,6).
    game.weapons.give('session-replayer');
    game.player.pos = { x: 22, y: 6.5 };
    game.player.dir = { x: 1, y: 0 };

    input.press('fire'); // replay the session
    updateGame(game, input as unknown as Input, 1 / 60);
    expect(game.ghosts.length).toBe(1);

    // Let the ghost finish its ~3.8s replay.
    for (let i = 0; i < 300; i++) updateGame(game, input as unknown as Input, 1 / 60);

    expect(game.world.solidAt(29, 6)).toBe(0); // ghost opened the locked door
    expect(game.evidence.count).toBeGreaterThanOrEqual(1); // replay yielded evidence
    expect(game.ghosts.length).toBe(0); // ghost finished and was removed
  });

  it('a sound, evidence-backed Gate decision raises Trust and wins', () => {
    const { deps, gate } = stubDeps();
    const game = createGame(deps);
    const input = new FakeInput();

    // Seed evidence + a Trust hit so we can observe the Gate's positive delta.
    game.evidence.add('session:wd-ghost-1');
    game.trust.change(-30); // 100 -> 70
    const before = game.trust.value;

    // Stand at the Gate node (35,6) and interact to open the console.
    game.player.pos = { x: 34, y: 6.5 };
    game.player.dir = { x: 1, y: 0 };
    input.press('interact');
    updateGame(game, input as unknown as Input, 1 / 60);
    expect(gate.cb).toBeTypeOf('function');

    // Commit the sound decision (map soundDecision = 'promote').
    gate.cb!('promote');
    expect(game.won).toBe(true);
    expect(game.trust.value).toBeGreaterThan(before);
  });

  it('a YOLO merge (promote, no evidence) is possible and tanks Trust', () => {
    const { deps, gate } = stubDeps();
    const game = createGame(deps);
    const input = new FakeInput();

    game.player.pos = { x: 34, y: 6.5 };
    game.player.dir = { x: 1, y: 0 };
    input.press('interact');
    updateGame(game, input as unknown as Input, 1 / 60);

    const before = game.trust.value;
    gate.cb!('promote'); // zero evidence
    expect(game.trust.value).toBeLessThan(before);
    expect(game.won).toBe(true);
  });
});

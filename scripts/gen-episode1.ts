// Generates public/maps/episode1-lost-sessions.json (docs/06 Episode 1).
// Reproducible authoring: carve rooms/corridors, place doors/entities, and the
// ghost Session log, then write the doc-11 JSON. Run: npx vite-node scripts/gen-episode1.ts

import { writeFileSync } from 'node:fs';

const W = 40;
const H = 14;
const tiles: number[] = new Array(W * H).fill(1); // 1 = wall

const carve = (x0: number, y0: number, x1: number, y1: number, v = 0): void => {
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) tiles[y * W + x] = v;
};

// Rooms (interior floor).
carve(2, 2, 7, 11); //  A  Working Directory (spawn, easter eggs)
carve(11, 2, 17, 11); // B  Hallucination Bots (scanner puzzle)
carve(21, 2, 28, 11); // C  Session Archive (anchor + replayer + locked door)
carve(32, 2, 37, 11); // D  Production (Gate)
// Corridors between rooms at eye level (2 tiles tall).
carve(8, 6, 10, 7); //  A -> B
carve(18, 6, 20, 7); // B -> C
carve(29, 6, 31, 7); // C -> D

const map = {
  id: '1',
  region: 'session-archive',
  palette: 'cool-blue',
  grid: { width: W, height: H, tiles },
  spawn: { at: [3, 6], angle: 0 },
  doors: [
    { at: [8, 6], label: 'main' },
    { at: [18, 6], label: 'feature/exit' },
    // The key puzzle: locked — only the Session ghost opens it.
    { at: [29, 6], label: 'release', locked: true },
    // A false door: only appears in the east wall of room B during distortion.
    { at: [18, 4], label: 'wip/do-not-merge', false: true },
  ],
  entities: [
    // Room A — tone (docs/10).
    { type: 'readme', at: [6, 3], hint: "Sessions replay history. History doesn't hallucinate." },
    { type: 'rubber-duck', at: [3, 9], hint: 'Quack. When lost, replay what actually happened.' },
    // Room B — bots (2 fake, 1 real) crowding a tempting wrong exit.
    { type: 'hallucination-bot', at: [15, 3], real: false },
    { type: 'hallucination-bot', at: [16, 4], real: false },
    { type: 'hallucination-bot', at: [15, 9], real: true },
    // Room C — the Sessions teach moment.
    { type: 'session-anchor', at: [23, 6], sessionId: 'wd-ghost-1' },
    { type: 'pickup', item: 'session-replayer', at: [22, 8] },
    // Room D — the training Gate.
    { type: 'gate-node', at: [35, 6], requiresEvidence: 1, soundDecision: 'promote' },
  ],
  sessions: [
    {
      id: 'wd-ghost-1',
      actions: [
        { t: 0.0, kind: 'move', x: 23.5, y: 6.5, dirX: 1, dirY: 0 },
        { t: 1.4, kind: 'move', x: 26.0, y: 6.5, dirX: 1, dirY: 0 },
        { t: 2.8, kind: 'move', x: 28.5, y: 6.5, dirX: 1, dirY: 0 },
        { t: 3.0, kind: 'say', text: 'the release door — right here.' },
        { t: 3.1, kind: 'door', at: [29, 6] },
        { t: 3.8, kind: 'move', x: 30.5, y: 6.5, dirX: 1, dirY: 0 },
      ],
    },
  ],
  trustStart: 100,
};

const out = 'public/maps/episode1-lost-sessions.json';
writeFileSync(out, JSON.stringify(map, null, 2) + '\n');
console.log(`wrote ${out} (${W}x${H}, ${map.entities.length} entities)`);

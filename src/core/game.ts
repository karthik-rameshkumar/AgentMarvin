// Game orchestration (M1). Owns the mutable GameState and the per-tick update +
// render. main.ts bootstraps this; the individual systems (trust, evidence,
// sessions, gates, weapons) live in mechanics/ and weapons/ and are driven here.

import type { GameMap, MapSession, Player, Vec2, WeaponId } from '../world/types';
import { World } from '../world/map';
import { createEntities, entitySprites, type Entity } from '../world/entities';
import { buildTextures, type TextureSet } from '../render/textures';
import { renderWalls } from '../render/raycaster';
import { renderSprites, type SpriteInstance } from '../render/sprites';
import { applyDistortion } from '../render/distortion';
import type { Framebuffer } from '../render/framebuffer';
import type { Hud } from '../render/hud';
import type { GateUI } from '../render/gateui';
import { Trust } from '../mechanics/trust';
import { Evidence } from '../mechanics/evidence';
import { Ghost } from '../mechanics/sessions';
import { Recorder } from '../mechanics/recorder';
import { evaluateGate, type GateOutcome } from '../mechanics/gates';
import { WeaponSystem, WEAPON_NAMES, type WeaponContext } from '../weapons/weapons';
import { scannerPrimary, scannerAlt } from '../weapons/contextScanner';
import { replayerPrimary, replayerAlt } from '../weapons/sessionReplayer';
import type { Input } from './input';
import type { Audio } from '../audio/audio';
import { REVEAL_LINES } from '../campaign/episode1';

const MOVE_SPEED = 3.2;
const BODY_RADIUS = 0.2;
const FOV = 0.66;
const PICKUP_RANGE = 0.6;
const INTERACT_RANGE = 1.8;
const INTERACT_COS = Math.cos((55 * Math.PI) / 180);

export interface GameDeps {
  map: GameMap;
  audio: Audio;
  hud: Hud;
  gateui: GateUI;
}

export interface GameState {
  map: GameMap;
  world: World;
  player: Player;
  tex: TextureSet;
  entities: Entity[];
  trust: Trust;
  evidence: Evidence;
  weapons: WeaponSystem;
  ghosts: Ghost[];
  recorder: Recorder;
  audio: Audio;
  hud: Hud;
  gateui: GateUI;
  time: number;
  footstepTimer: number;
  won: boolean;
}

export function createGame(deps: GameDeps): GameState {
  const { map, audio, hud, gateui } = deps;
  const world = new World(map);
  const tex = buildTextures(map.palette);
  const angle = map.spawn?.angle ?? 0;
  const at = map.spawn?.at ?? [1.5, 1.5];
  const player: Player = {
    pos: { x: at[0] + 0.5, y: at[1] + 0.5 },
    dir: { x: Math.cos(angle), y: Math.sin(angle) },
    plane: { x: -Math.sin(angle) * FOV, y: Math.cos(angle) * FOV },
  };

  const game: GameState = {
    map,
    world,
    player,
    tex,
    entities: createEntities(map),
    trust: new Trust(map.trustStart ?? 100),
    evidence: new Evidence(),
    weapons: new WeaponSystem(),
    ghosts: [],
    recorder: new Recorder(),
    audio,
    hud,
    gateui,
    time: 0,
    footstepTimer: 0,
    won: false,
  };

  hud.setWeapon(game.weapons.name());
  syncHud(game);
  return game;
}

// --- per-tick update ---------------------------------------------------------

export function updateGame(game: GameState, input: Input, dt: number): void {
  game.time += dt;
  if (game.recorder.active) game.recorder.sample(dt, game.player);

  // Frozen while the Gate console is open or the slice is won.
  if (game.gateui.isOpen || game.won) return;

  // Look.
  const yaw = input.consumeMouseDx();
  if (yaw !== 0) rotate(game.player, yaw);

  // Move.
  let forward = 0;
  let strafe = 0;
  if (input.isDown('forward')) forward += 1;
  if (input.isDown('back')) forward -= 1;
  if (input.isDown('right')) strafe += 1;
  if (input.isDown('left')) strafe -= 1;
  let moved = false;
  if (forward !== 0 || strafe !== 0) {
    const len = Math.hypot(forward, strafe) || 1;
    const f = (forward / len) * MOVE_SPEED * dt;
    const s = (strafe / len) * MOVE_SPEED * dt;
    const dx = game.player.dir.x * f + game.player.plane.x * s;
    const dy = game.player.dir.y * f + game.player.plane.y * s;
    moved = tryMove(game, dx, dy);
  }
  game.footstepTimer -= dt;
  if (moved && game.footstepTimer <= 0) {
    game.audio.footstep();
    game.footstepTimer = 0.34;
  }

  // Weapon select.
  if (input.wasPressed('weapon1')) game.weapons.selectSlot(1);
  if (input.wasPressed('weapon2')) game.weapons.selectSlot(2);
  game.hud.setWeapon(game.weapons.name());

  // Dev recorder toggle.
  if (input.wasPressed('record')) toggleRecord(game);

  // Fire.
  if (input.wasPressed('fire')) fireWeapon(game, 'primary');
  if (input.wasPressed('altfire')) fireWeapon(game, 'alt');

  // Interact.
  if (input.wasPressed('interact')) interact(game);

  // Ghosts.
  for (const g of game.ghosts) g.update(dt);
  game.ghosts = game.ghosts.filter((g) => !g.done);

  collectPickups(game);
  updateFades(game, dt);
  syncDistortion(game);
  syncHud(game);
}

// --- render ------------------------------------------------------------------

export function renderGame(game: GameState, fb: Framebuffer, depth: Float32Array): void {
  renderWalls(fb, game.player, game.world.solidAt, game.tex, depth);
  const sprites: SpriteInstance[] = entitySprites(game.entities, game.tex, game.time);
  const ghostTex = game.tex.sprites.get('ghost')!;
  for (const g of game.ghosts) {
    sprites.push({ pos: { x: g.pos.x, y: g.pos.y }, texture: ghostTex, alpha: 0.55 });
  }
  renderSprites(fb, game.player, sprites, depth);
  applyDistortion(fb, game.trust.tier, game.time);
}

// --- systems -----------------------------------------------------------------

function makeCtx(game: GameState): WeaponContext {
  return {
    player: game.player,
    entities: game.entities,
    world: game.world,
    trust: game.trust,
    evidence: game.evidence,
    sessions: game.map.sessions ?? [],
    audio: game.audio,
    spawnGhost: (s) => spawnGhost(game, s),
    narrate: (t) => narrate(game, t),
  };
}

function fireWeapon(game: GameState, mode: 'primary' | 'alt'): void {
  const ctx = makeCtx(game);
  switch (game.weapons.current) {
    case 'context-scanner':
      mode === 'primary' ? scannerPrimary(ctx) : scannerAlt(ctx);
      break;
    case 'session-replayer':
      mode === 'primary' ? replayerPrimary(ctx) : replayerAlt(ctx);
      break;
  }
}

function spawnGhost(game: GameState, session: MapSession): void {
  const ghost = new Ghost(session, {
    onDoor: (at) => {
      if (game.world.openDoorAt(at[0], at[1])) {
        game.audio.door();
        narrate(game, "GHOST opened the real door — history doesn't hallucinate.");
      }
    },
    onSay: (text) => narrate(game, `GHOST: ${text}`),
    onDone: (log) => {
      if (game.evidence.add(`session:${log.id}`)) {
        game.audio.evidence();
        game.trust.change(+2, 'session replayed');
        narrate(game, 'Evidence secured from the replay.');
      }
    },
  });
  game.ghosts.push(ghost);
}

function interact(game: GameState): void {
  const { player, world } = game;
  const tx = Math.floor(player.pos.x + player.dir.x * 0.8);
  const ty = Math.floor(player.pos.y + player.dir.y * 0.8);
  const label = world.doorLabelInFront(player.pos, player.dir);
  const r = world.tryOpenDoor(player.pos, player.dir);
  if (r === 'opened') {
    game.audio.door();
    if (game.recorder.active) game.recorder.door([tx, ty]);
    narrate(game, label ? `Opened ${label}` : 'Door opened.');
    return;
  }
  if (r === 'false') {
    game.trust.change(-2, 'false door');
    game.audio.door();
    narrate(game, 'That door was never real.');
    return;
  }
  if (r === 'locked') {
    narrate(game, 'Locked. Find another way — or replay a session.');
    return;
  }

  const e = pickInteractable(game);
  if (!e) return;
  if (e.type === 'rubber-duck') {
    e.used = true;
    narrate(game, e.hint ?? 'The duck stares back. Have you tried replaying a session?');
  } else if (e.type === 'readme') {
    if (!e.used) {
      game.trust.change(+2, 'read the readme');
      e.used = true;
    }
    narrate(game, `README: ${e.hint ?? 'the answer was in the docs all along.'}`);
  } else if (e.type === 'gate-node') {
    openGate(game, e);
  }
}

function openGate(game: GameState, node: Entity): void {
  const required = node.requiresEvidence ?? 1;
  const sound = node.soundDecision ?? 'reject';
  // Release the pointer so the console buttons are clickable.
  if (typeof document !== 'undefined') document.exitPointerLock();
  game.gateui.show(game.evidence.count, required, (decision) => {
    const outcome = evaluateGate(decision, game.evidence.count, required, sound);
    game.trust.change(outcome.trustDelta, 'gate decision');
    game.audio.gate();
    game.gateui.hide();
    endSlice(game, outcome);
  });
}

function endSlice(game: GameState, outcome: GateOutcome): void {
  game.won = true;
  syncHud(game);
  const verdict = outcome.correct
    ? 'You restored trust the right way.'
    : outcome.yolo
      ? 'You shipped without evidence. Classic YOLO merge.'
      : 'The call was made — and Trust took the hit.';
  game.hud.showReveal(outcome.correct ? 'SESSION ARCHIVE STABILIZED' : 'GATE CLOSED', [
    outcome.message,
    '',
    ...REVEAL_LINES,
    '',
    verdict,
  ]);
}

function collectPickups(game: GameState): void {
  for (const e of game.entities) {
    if (!e.alive || e.type !== 'pickup') continue;
    const dx = e.pos.x - game.player.pos.x;
    const dy = e.pos.y - game.player.pos.y;
    if (Math.hypot(dx, dy) > PICKUP_RANGE) continue;
    const wid = e.item as WeaponId | undefined;
    e.alive = false;
    if (wid && game.weapons.give(wid)) {
      game.audio.pickup();
      game.hud.setWeapon(game.weapons.name());
      narrate(game, `Acquired ${WEAPON_NAMES[wid]}. It's equipped — fire it.`);
    }
  }
}

function pickInteractable(game: GameState): Entity | null {
  const { player } = game;
  let best: Entity | null = null;
  let bestDist = Infinity;
  for (const e of game.entities) {
    if (!e.alive) continue;
    if (e.type !== 'rubber-duck' && e.type !== 'readme' && e.type !== 'gate-node') continue;
    const dx = e.pos.x - player.pos.x;
    const dy = e.pos.y - player.pos.y;
    const dist = Math.hypot(dx, dy);
    if (dist > INTERACT_RANGE || dist < 1e-4) continue;
    const dot = (dx / dist) * player.dir.x + (dy / dist) * player.dir.y;
    if (dot < INTERACT_COS) continue;
    if (dist < bestDist) {
      bestDist = dist;
      best = e;
    }
  }
  return best;
}

function updateFades(game: GameState, dt: number): void {
  for (const e of game.entities) {
    if (!e.alive && e.fade > 0) e.fade = Math.max(0, e.fade - dt * 3);
  }
}

function syncDistortion(game: GameState): void {
  const distorted = game.trust.tier !== 'T0';
  game.world.distortionActive = distorted;
  game.hud.setGlitch(distorted);
}

function syncHud(game: GameState): void {
  game.hud.setTrust(game.trust.value, game.trust.tier);
  game.hud.setEvidence(game.evidence.count);
}

function toggleRecord(game: GameState): void {
  if (!Recorder.isEnabled()) return;
  if (game.recorder.active) {
    game.recorder.stop();
    game.recorder.download();
    narrate(game, 'Recording saved to a .session.json download.');
  } else {
    game.recorder.start('recorded');
    narrate(game, 'Recording session — move, then press ` again to save.');
  }
}

function narrate(game: GameState, text: string): void {
  game.hud.toast(text);
}

// --- movement helpers --------------------------------------------------------

function rotate(p: Player, a: number): void {
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  const dx = p.dir.x;
  p.dir.x = dx * cos - p.dir.y * sin;
  p.dir.y = dx * sin + p.dir.y * cos;
  const px = p.plane.x;
  p.plane.x = px * cos - p.plane.y * sin;
  p.plane.y = px * sin + p.plane.y * cos;
}

function tryMove(game: GameState, dx: number, dy: number): boolean {
  const pos: Vec2 = game.player.pos;
  let moved = false;
  const nx = pos.x + dx;
  if (!game.world.isBlocked(nx + Math.sign(dx) * BODY_RADIUS, pos.y)) {
    pos.x = nx;
    moved = moved || dx !== 0;
  }
  const ny = pos.y + dy;
  if (!game.world.isBlocked(pos.x, ny + Math.sign(dy) * BODY_RADIUS)) {
    pos.y = ny;
    moved = moved || dy !== 0;
  }
  return moved;
}

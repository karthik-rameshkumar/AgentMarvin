// AgentMarvin — M0 entry point. Boots the canvas, loads the map, and runs the
// fixed-timestep loop: input → move (with collision) → raycast walls → sprites →
// HUD. See docs/11-technical-spec.md for the module architecture.

import { GameLoop } from './core/loop';
import { Input } from './core/input';
import { Framebuffer } from './render/framebuffer';
import { renderWalls } from './render/raycaster';
import { renderSprites } from './render/sprites';
import { buildTextures } from './render/textures';
import { drawDebug } from './render/hud';
import { parseMap, World } from './world/map';
import { createEntities, spriteInstances } from './world/entities';
import { Audio } from './audio/audio';
import type { Player, Vec2 } from './world/types';

const MOVE_SPEED = 3.2; // tiles / second
const BODY_RADIUS = 0.2;
const FOV = 0.66; // camera-plane half-length (~66° horizontal)

async function main(): Promise<void> {
  const canvas = document.getElementById('screen') as HTMLCanvasElement | null;
  const overlay = document.getElementById('overlay');
  if (!canvas) throw new Error('missing #screen canvas');

  const fb = new Framebuffer(canvas);
  Framebuffer.fitCanvas(canvas);
  window.addEventListener('resize', () => Framebuffer.fitCanvas(canvas));

  // Load level.
  const res = await fetch('/maps/working-directory.json');
  if (!res.ok) throw new Error(`failed to load map: ${res.status}`);
  const map = parseMap(await res.json());
  const world = new World(map);
  const tex = buildTextures(map.palette);
  const entities = createEntities(map);
  const sprites = spriteInstances(entities, tex);

  // Player from spawn.
  const angle = map.spawn?.angle ?? 0;
  const spawnAt = map.spawn?.at ?? [1.5, 1.5];
  const player: Player = {
    pos: { x: spawnAt[0] + 0.5, y: spawnAt[1] + 0.5 },
    dir: { x: Math.cos(angle), y: Math.sin(angle) },
    plane: { x: -Math.sin(angle) * FOV, y: Math.cos(angle) * FOV },
  };

  const audio = new Audio();
  const input = new Input(canvas);
  input.attach();
  input.onFirstLock = () => audio.resume();

  // Show/hide the click-to-start overlay with pointer lock.
  document.addEventListener('pointerlockchange', () => {
    if (!overlay) return;
    overlay.classList.toggle('hidden', input.isLocked);
  });

  const depth = new Float32Array(fb.width);
  let fps = 0;
  let footstepTimer = 0;

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

  function tryMove(pos: Vec2, dx: number, dy: number): boolean {
    let moved = false;
    const nx = pos.x + dx;
    if (!world.isBlocked(nx + Math.sign(dx) * BODY_RADIUS, pos.y)) {
      pos.x = nx;
      moved = moved || dx !== 0;
    }
    const ny = pos.y + dy;
    if (!world.isBlocked(pos.x, ny + Math.sign(dy) * BODY_RADIUS)) {
      pos.y = ny;
      moved = moved || dy !== 0;
    }
    return moved;
  }

  function update(dt: number): void {
    // Mouse look.
    const yaw = input.consumeMouseDx();
    if (yaw !== 0) rotate(player, yaw);

    // Movement relative to facing.
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
      // strafe uses the camera plane direction (perpendicular to dir)
      const dx = player.dir.x * f + player.plane.x * s;
      const dy = player.dir.y * f + player.plane.y * s;
      moved = tryMove(player.pos, dx, dy);
    }

    // Footstep SFX while moving, throttled.
    footstepTimer -= dt;
    if (moved && footstepTimer <= 0) {
      audio.footstep();
      footstepTimer = 0.34;
    }

    // Door interaction.
    if (input.wasPressed('interact')) {
      const result = world.tryOpenDoor(player.pos, player.dir);
      if (result !== 'none') audio.door();
    }
  }

  function render(_alpha: number): void {
    renderWalls(fb, player, world.solidAt, tex, depth);
    renderSprites(fb, player, sprites, depth);
    drawDebug(fb, fps, player.pos.x, player.pos.y);
    fb.present();
  }

  const loop = new GameLoop({
    update,
    render,
    onFps: (v) => {
      fps = v;
    },
  });
  loop.start();
}

void main().catch((err) => {
  console.error(err);
  const overlay = document.getElementById('overlay');
  if (overlay) overlay.textContent = `boot error: ${String(err)}`;
});

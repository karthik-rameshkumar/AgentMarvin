// AgentMarvin — entry point. Boots the canvas + DOM HUD, loads Episode 1, and
// runs the fixed-timestep loop delegating to core/game.ts. See docs/11 for the
// module architecture and docs/06 for the episode.

import { GameLoop } from './core/loop';
import { Input } from './core/input';
import { Framebuffer } from './render/framebuffer';
import { Hud } from './render/hud';
import { GateUI } from './render/gateui';
import { parseMap } from './world/map';
import { createGame, updateGame, renderGame } from './core/game';
import { Audio } from './audio/audio';

const MAP_URL = '/maps/episode1-lost-sessions.json';

async function main(): Promise<void> {
  const canvas = document.getElementById('screen') as HTMLCanvasElement | null;
  const overlay = document.getElementById('overlay');
  if (!canvas) throw new Error('missing #screen canvas');

  const fb = new Framebuffer(canvas);
  Framebuffer.fitCanvas(canvas);
  window.addEventListener('resize', () => Framebuffer.fitCanvas(canvas));

  const res = await fetch(MAP_URL);
  if (!res.ok) throw new Error(`failed to load map: ${res.status}`);
  const map = parseMap(await res.json());

  const audio = new Audio();
  const hud = new Hud();
  const gateui = new GateUI();
  const game = createGame({ map, audio, hud, gateui });

  const input = new Input(canvas);
  input.attach();
  input.onFirstLock = () => audio.resume();

  document.addEventListener('pointerlockchange', () => {
    if (overlay) overlay.classList.toggle('hidden', input.isLocked);
  });

  const depth = new Float32Array(fb.width);

  const loop = new GameLoop({
    update: (dt) => updateGame(game, input, dt),
    render: () => {
      renderGame(game, fb, depth);
      fb.present();
    },
  });
  loop.start();
}

void main().catch((err) => {
  console.error(err);
  const overlay = document.getElementById('overlay');
  if (overlay) overlay.textContent = `boot error: ${String(err)}`;
});

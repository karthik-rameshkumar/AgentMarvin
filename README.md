# AgentMarvin

A retro raycaster FPS that onboards developers to **Entire** by teaching its
primitives (Sessions, Checkpoints, Trails, Runners, Gates) through gameplay.

> **Design & technical spec:** see [`docs/`](./docs/README.md). This README covers
> only running the code.

## Status — Milestone 1: "Lost Sessions" vertical slice

Playable slice of **Episode 1** ([`docs/06`](./docs/06-episodes-and-levels.md)) that
teaches the **Sessions** primitive through play, on top of the M0 raycaster.

Implemented on top of M0:
- **Sessions** — replay recorded action logs as translucent ghosts that open the
  real door and reveal the truth ([`docs/02`](./docs/02-core-mechanics.md))
- **Session recorder** dev tool — add `?record` to the URL, `` ` `` to start/stop;
  exports a `.session.json` (the authentic way to author ghosts)
- **Weapons** — Context Scanner (cone reveal + alt-fire real/fake exposure) and
  Session Replayer ([`docs/03`](./docs/03-weapons.md))
- **Hallucination Bots** — real vs. fake; verify before you act ([`docs/04`](./docs/04-enemies.md))
- **Trust** replaces health, with the T0/T1 distortion layer — false doors +
  framebuffer shimmer + HUD glitch ([`docs/05`](./docs/05-trust-system.md))
- **Evidence → training Gate** — dock evidence, Promote/Reject/Hold; a YOLO merge
  tanks Trust ([`docs/02 §5`](./docs/02-core-mechanics.md))
- Neon-terminal DOM HUD (Trust meter, evidence, weapon, narration toasts, crosshair)
- One connected Episode 1 map ending in a fiction→Entire reveal card

Deferred per the roadmap: Checkpoints/Trails/Runners, distortion tiers T2/T3,
Episodes 2–5, the real live-repo handoff (M6), multiplayer.

## Requirements

- Node 20+ (developed on Node 26) and npm

## Commands

```bash
npm install        # install deps
npm run dev        # dev server → http://localhost:5173  (click to lock mouse)
npm run build      # typecheck (strict) + production bundle to dist/
npm run preview    # serve the production build
npm test           # run the Vitest suite
```

Controls: **WASD** move · **mouse** look · **LMB** use weapon · **RMB** alt-fire ·
**1/2** switch weapons · **E** interact (doors, ducks, README, Gate) · **Esc** release cursor.

The teach moment: reach the Session Archive, pick up the Session Replayer, aim at
the glowing Session Anchor and fire — the ghost replays history and opens the
locked `release` door. Gather evidence, reach the Gate, and decide.

## Headless screenshot

Render a single frame to PNG without a browser (CI smoke / sanity check):

```bash
npx vite-node scripts/render-frame.ts out.png
```

## Layout

```
index.html            # canvas host + click-to-start overlay + neon HUD styles
src/
  core/               # loop, input, rng, game (state + update/render orchestration)
  render/             # framebuffer, raycaster, sprites, textures, distortion, hud, gateui
  world/              # map loader + collision, entities, shared types
  mechanics/          # trust, evidence, sessions, recorder, gates
  weapons/            # weapon system, context scanner, session replayer
  campaign/           # episode 1 script (reveal text)
  audio/              # synthesized Web Audio
  main.ts             # bootstrap + wiring
public/maps/          # level JSON (served statically, editable without rebuild)
test/                 # Vitest: mechanics, raycaster DDA, map loader, Ep1 integration
scripts/              # headless frame renderer + episode-1 map generator
docs/                 # full game design + technical spec
```

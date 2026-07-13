# AgentMarvin

A retro raycaster FPS that onboards developers to **Entire** by teaching its
primitives (Sessions, Checkpoints, Trails, Runners, Gates) through gameplay.

> **Design & technical spec:** see [`docs/`](./docs/README.md). This README covers
> only running the code.

## Status — Milestone 0: Engine Skeleton

The current build is the **M0 engine skeleton** from
[`docs/12-build-plan-roadmap.md`](./docs/12-build-plan-roadmap.md): a Wolfenstein-style
raycaster foundation that later milestones (Sessions, Trust, weapons, Gates) drop into.

Implemented:
- Fixed-timestep game loop (sim @60Hz, decoupled interpolated render) + fps meter
- DDA raycaster: textured walls, per-column depth buffer, distance shading
- Billboarded sprites, z-sorted and occluded by the wall depth buffer
- Procedural (programmer-art) textures, palette-driven per region
- WASD + mouse-look (Pointer Lock) movement with wall collision; doors open on `E`
- JSON map loader faithful to the [doc-11 schema](./docs/11-technical-spec.md#map-data-format-json)
- Synthesized Web Audio: footstep / door / pickup SFX + ambient drone

Not yet built (deferred per the roadmap): Sessions replay, Trust system, weapons,
enemy AI, Gates, distortion tiers, multiplayer.

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

Controls: **WASD** move · **mouse** look · **E** open door · **Esc** release cursor.

## Headless screenshot

Render a single frame to PNG without a browser (CI smoke / sanity check):

```bash
npx vite-node scripts/render-frame.ts out.png
```

## Layout

```
index.html            # canvas host + click-to-start overlay
src/
  core/               # loop, input, rng
  render/             # framebuffer, raycaster, sprites, textures, hud
  world/              # map loader + collision, entities, shared types
  audio/              # synthesized Web Audio
  main.ts             # wires it all together
public/maps/          # level JSON (served statically, editable without rebuild)
test/                 # Vitest: rng, map loader, raycaster DDA
scripts/              # headless frame renderer
docs/                 # full game design + technical spec
```

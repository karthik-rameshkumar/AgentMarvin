# 11 — Technical Specification

> The engineering side of the spec: engine choice, architecture, data formats, and performance targets — concrete enough to scaffold the repo and start the [vertical slice](./12-build-plan-roadmap.md). Design behaviors referenced here are defined in [02-core-mechanics.md](./02-core-mechanics.md) and [05-trust-system.md](./05-trust-system.md).

## Recommended stack: web-first

**TypeScript + HTML5 Canvas raycasting engine, built with Vite. No heavy 3D dependency.**

Rationale:
1. **Instant shareability** — onboarding must start from a URL, no install. A browser build is one link.
2. **Authentic look, cheaply** — a custom raycaster reproduces the Wolfenstein/DOOM 2.5D aesthetic at [320×200](./08-visual-audio-direction.md) with a tiny footprint, and teaches nothing we don't control.
3. **The [final reveal](./07-learning-and-onboarding.md)** — handing off from the game into a *live Entire repository* is trivial in a browser (a link/embed), and is the reason web wins.
4. **Co-op** — [multiplayer](./09-multiplayer.md) can use WebRTC/WebSocket without dedicated servers.

**Alternative (documented, not chosen):** **Godot 4** — better if native desktop/console/Steam distribution becomes a priority; it has solid 2.5D/raycaster support and export pipelines. The design is engine-agnostic; only [11]/[12] change if we switch. Revisit if distribution goals shift.

### Language & tooling
- **TypeScript** (strict), **Vite** dev/build, **Canvas 2D** (or a thin WebGL blit for the final scaled buffer) for the 320×200 framebuffer.
- No game-engine framework; a small hand-rolled loop keeps Movement-First control tight.
- Testing: **Vitest** for pure logic (Trust state machine, evidence/Gate rules, map loading). Rendering verified visually.
- Lint/format: ESLint + Prettier. CI builds the web bundle.

## Architecture (modules)

Keep systems decoupled; the raycaster renders, everything else is plain simulation state.

```
src/
  core/
    loop.ts            # fixed-timestep game loop (sim @ 60Hz, render decoupled)
    input.ts           # keyboard/mouse (+ gamepad); remappable bindings
    rng.ts             # seeded RNG (determinism for co-op + tests)
  render/
    raycaster.ts       # walls (DDA), depth buffer
    sprites.ts         # billboarded sprite draw, z-sorted
    framebuffer.ts     # 320x200 buffer, integer upscale, CRT post-process
    hud.ts             # neon terminal UI, Trust meter, narration
    distortion.ts      # Trust-driven post-process + asset-swap layer
  world/
    map.ts             # tile grid, doors, load from JSON (see format below)
    entities.ts        # ECS-lite: enemies, pickups, anchors, gate nodes
    ai/                # per-enemy behaviors (see 04-enemies.md)
  mechanics/
    sessions.ts        # ghost playback from recorded action logs
    checkpoints.ts     # local-state snapshot/restore (NOT world state)
    trails.ts          # lineage graph + path lighting
    runners.ts         # policy-based scout/eval
    gates.ts           # evidence docking + Promote/Reject/Hold + consequences
    trust.ts           # Trust pool + distortion tier state machine
    evidence.ts        # evidence token model shared by the above
  weapons/             # one module per weapon, thin wrappers over mechanics/
  audio/               # MIDI playback + Trust-reactive mixing
  campaign/
    episodes.ts        # episode/level sequencing, unlocks
    save.ts            # persistence (ties to checkpoints; localStorage/IndexedDB)
  reveal/
    handoff.ts         # final reveal → live Entire repo link/embed
```

### Key architectural decisions
- **Fixed-timestep simulation @ 60Hz**, rendering interpolated — guarantees the Movement-First feel and deterministic co-op/tests.
- **Sim state is serializable plain data** — enables Checkpoints (snapshot local state), Sessions (record/replay action logs), save games, and co-op sync from the same foundation.
- **Sessions = recorded action logs**, not video: each Session is a timestamped list of an agent's inputs/actions replayed through the same sim → cheap, exact, and diff-able (conflict reconciliation).
- **Checkpoints snapshot only local/player state**, deliberately excluding world-shared state (killed enemies, opened Gates) — this *is* the lesson, enforced at the data layer ([02 §2](./02-core-mechanics.md#2-checkpoints--rewind-local-state)).
- **Trust is a state machine** driving a rendering layer, so distortion tiers apply to any region without bespoke art ([05](./05-trust-system.md), [08](./08-visual-audio-direction.md)).

## Map data format (JSON)

Levels are authored as JSON so designers/modders can build without code ([future mod support](./README.md)).

```jsonc
{
  "id": "1-3",
  "region": "session-archive",
  "palette": "cool-blue",
  "grid": {                       // 2D tile array; strings key into tileset
    "width": 24, "height": 24,
    "tiles": [ /* rows of tile ids: wall/floor/door */ ]
  },
  "doors": [
    { "at": [10,4], "label": "feature/exit", "locked": true, "opensVia": "session:sa-ghost-1" }
  ],
  "entities": [
    { "type": "hallucination-bot", "at": [12,8], "real": false },
    { "type": "session-anchor", "at": [3,15], "sessionId": "sa-ghost-1" },
    { "type": "pickup", "item": "session-replayer", "at": [3,16] },
    { "type": "gate-node", "at": [20,20], "requiresEvidence": 1 }
  ],
  "sessions": [                   // recorded action logs for ghosts
    { "id": "sa-ghost-1", "actions": [ /* {t, action, ...} */ ] }
  ],
  "trails": [                     // lineage edges for Trail Beacon
    { "effect": "gate-node@20,20", "causes": ["switch@5,5","switch@7,9"] }
  ],
  "trustStart": 100
}
```

## Save format
- Serialized sim snapshot + campaign progress (unlocks, current episode/level, achievements, duck/README collection).
- Stored in **IndexedDB** (fallback localStorage). Save/quick-resume reuses the Checkpoint snapshot machinery.

## Asset pipeline
- **Sprites/textures:** indexed-color PNGs authored to the [320×200](./08-visual-audio-direction.md) palette; loaded into a texture atlas at boot.
- **Audio:** MIDI (or compact tracker format) played via Web Audio; per-region motif + Trust-reactive variant layers.
- **Fonts:** bitmap monospace for the neon terminal UI.

## Performance targets
- **60 fps** on mid-range laptops and modern mobile browsers.
- Raycast at internal 320×200, integer-scaled — cheap by construction.
- Budget: sim < 4ms, render < 8ms per frame at target. Sprite count capped per view with z-sorted culling.
- Cold load < 3s on broadband (small bundle; lazy-load later episodes' assets).

## Networking (co-op, deferred — [09](./09-multiplayer.md))
- Authoritative-host model over WebRTC data channels (or a thin WebSocket relay).
- Sync entities, Trust, and evidence tokens; deterministic sim + seeded RNG keep drift low at this scale.

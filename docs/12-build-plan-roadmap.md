# 12 — Build Plan & Roadmap

> How to actually build AgentMarvin: a **vertical slice first**, then layer episodes/primitives, then polish and the live handoff. Architecture and stack are in [11-technical-spec.md](./11-technical-spec.md).

## Strategy: prove the loop, then scale it

The riskiest thing about AgentMarvin is not the raycaster — it's whether the **evidence → decision loop** ([02](./02-core-mechanics.md)) is *fun and teaches*. So Milestone 1 builds the smallest thing that exercises that loop end-to-end, and we playtest it before authoring the rest.

---

## Milestone 0 — Engine skeleton (foundation)
**Goal:** something moves on screen at 60fps.
- Vite + TypeScript project; fixed-timestep [loop](./11-technical-spec.md), input, raycaster rendering walls at 320×200 with integer upscale.
- JSON [map loader](./11-technical-spec.md#map-data-format-json); one hand-authored test map.
- Basic sprite billboarding + one placeholder enemy sprite.
- **Exit criteria:** walk a room, see a sprite, hold 60fps.

## Milestone 1 — Vertical slice: "Lost Sessions" core loop ★
**Goal:** the full evidence→Gate loop, playable, teaching Sessions.
Scope (deliberately minimal):
- **Region:** Working Directory → Session Archive (Episode 1 rooms 1-1…1-Gate, [06](./06-episodes-and-levels.md#episode-1--lost-sessions)).
- **Weapons:** Context Scanner + Session Replayer ([03](./03-weapons.md)).
- **Mechanics:** Sessions (record/replay ghosts), Evidence tokens, one **Gate** (training), **Trust** with **T0/T1 only** ([05](./05-trust-system.md)).
- **Enemy:** Hallucination Bots (real vs. fake exposure).
- **Tone:** one README room, one rubber duck, a couple punny branch doors ([10](./10-easter-eggs.md)).
- **Audio/visual:** one region palette, one MIDI track + Trust-reactive variant, T0/T1 distortion.
- **Exit criteria (this is the go/no-go for the whole project):**
  1. A first-time player solves 1-3 using a Session *before* any text explains Sessions.
  2. The Gate decision meaningfully moves Trust and feels consequential.
  3. Playtesters can explain what a Session is afterward.

> Everything past here is "more of a proven thing." If Milestone 1 isn't fun/teaching, iterate here — don't build outward.

## Milestone 2 — Checkpoints & Trust distortion
- **Checkpoint Launcher** + local-vs-world-state lesson (Episode 2, [06](./06-episodes-and-levels.md#episode-2--checkpoint-facility)).
- **Context Rot** enemy; full **distortion tiers T2/T3** ([05](./05-trust-system.md)) and the [distortion rendering layer](./11-technical-spec.md).
- Failure/recovery-to-Checkpoint flow.

## Milestone 3 — Trails
- **Trail Beacon**, lineage graph + path lighting (Episode 3, [06](./06-episodes-and-levels.md#episode-3--trail-network)).
- Regions: Branch Forest, Detached HEAD Wasteland. Enemies: Prompt Injection, Detached HEAD, Infinite Planner.

## Milestone 4 — Runners
- **Runner Drone** + policy system (Safe/Fast/Thorough) (Episode 4, [06](./06-episodes-and-levels.md#episode-4--runner-labs)).
- Enemies: Recursive Agents, Benchmark Goblins, Infinite Retry. Two-policy comparison puzzles.

## Milestone 5 — Gates mastery + YOLO Merge finale
- Full **Gate Generator**, chained Gates, consequence propagation between levels (Episode 5, [06](./06-episodes-and-levels.md#episode-5--production-gates-finale)).
- **YOLO Merge boss** (three phases) + Merge Factory / Production / Origin Server.
- **Two endings** (true / bad).

## Milestone 6 — The Final Reveal & live handoff ★
- Origin Server stabilization → primitive-mapping mirror → **handoff into a live Entire repository** ([07](./07-learning-and-onboarding.md)).
- This is the payoff that justified the web-first choice; in earlier milestones the reveal is a static mock, here it becomes the real link/embed.

## Milestone 7 — Polish & ship
- Full audio pass, all easter eggs/achievements ([10](./10-easter-eggs.md)), accessibility options ([08](./08-visual-audio-direction.md)), performance hardening, cold-load optimization, optional telemetry ([07](./07-learning-and-onboarding.md#measuring-onboarding-success-optional-telemetry)).

## Post-launch (deferred)
- **Co-op multiplayer** ([09](./09-multiplayer.md)) — asymmetric-visibility mode.
- **Mod support** — the JSON map format ([11](./11-technical-spec.md)) is the seam; community repository maps.
- **Future campaigns** (PDF): distributed repositories, autonomous swarms, compliance workflows, enterprise policies.

---

## Explicitly deferred out of the MVP (keep scope honest)
| Deferred | Until | Why |
|---|---|---|
| Episodes 2–5 | M2–M5 | Prove Ep1 loop first |
| Distortion tiers T2/T3 | M2 | T0/T1 proves the concept |
| Multiplayer | Post-launch | Additive filter on solid single-player |
| Mod support | Post-launch | Needs stable map format |
| Live-repo handoff (real) | M6 | Mock is fine until the game earns the reveal |

## Suggested team & sequencing
- Small team viable: 1–2 engineers (engine + mechanics), 1 designer (levels/tuning), 1 artist (sprites/UI), part-time audio.
- **Do not parallelize past Milestone 1** — the vertical slice's playtest result should shape everything after it.

# 09 — Multiplayer (Optional Co-op)

> An **optional** co-op mode built on **asymmetric visibility**: each player can see/act on a different subset of the primitives, so completing objectives *forces communication*. This is a post-MVP feature — deferred in [12-build-plan-roadmap.md](./12-build-plan-roadmap.md). Single-player is the primary experience.

## Design goal

Co-op should teach the *collaborative* truth about Entire: real repositories are worked by many agents/people, and **no single actor sees everything**. By splitting visibility across the [five primitives](./02-core-mechanics.md), the mode makes players narrate their partial views to each other — which is exactly how healthy multi-agent supervision works.

## Roles (asymmetric visibility)

Players pick complementary roles; each "owns" a lens and its weapon(s):

| Role | Sees / can act on | Owns weapon | Blind to |
|---|---|---|---|
| **Historian** | Sessions (history ghosts, conflicts) | Session Replayer | Live forecasts, lineage details |
| **Cartographer** | Trails (lineage graph) | Trail Beacon | History, forecasts |
| **Evaluator** | Runners (policy evals, forecasts) | Runner Drone | History, lineage |
| **Operator** | Gates + Checkpoints (decisions, safety) | Gate Generator, Checkpoint Launcher | Raw evidence sources |

- The **Context Scanner** is shared by all (baseline vision).
- 2-player collapses the four lenses into two (e.g., Historian+Cartographer vs. Evaluator+Operator). Up to 4 for full asymmetry.

## Comms-forcing mechanics

- **Evidence hand-off:** the Operator can only make a sound [Gate](./02-core-mechanics.md#5-gates--enforce-production-decisions-the-ultimate-mechanic) decision using evidence tokens the *other* roles collect — they must describe what they found.
- **Split truth:** in a low-[Trust](./05-trust-system.md) room, a Hallucination may be visible to one role and not another; only by comparing views do players separate real from fake.
- **Locked doors by lens:** some barriers require a Trail *and* a Runner eval *and* a Session — no single player can clear them.
- **Shared Trust pool** (or averaged): a teammate's YOLO decision hurts everyone, mirroring shared production consequences.

## Technical notes (see [11](./11-technical-spec.md))
- **Networking model:** lightweight authoritative host (one client is host) with state sync for entities, Trust, and evidence; the raycaster is deterministic enough for input-lite sync at this scale.
- **Web-first friendly:** WebRTC data channels or a small WebSocket relay; no dedicated servers required for co-op sessions.
- **Scope:** deferred to a post-campaign milestone. The single-player systems (evidence tokens, Trust, primitives) are designed so the visibility split is an *additive filter*, not a rewrite.

## Out of scope (for now)
Competitive/PvP modes, matchmaking, persistent lobbies. Co-op is invite-a-friend, drop-in.

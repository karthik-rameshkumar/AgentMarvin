# Glossary — Entire Term ⇄ In-Game Analog

> **Single source of truth.** Every other document references this table and [02-core-mechanics.md](./02-core-mechanics.md) rather than restating mappings. If a mapping changes, change it here first.

## The Five Primitives

| Entire primitive | One-line real meaning | In-game analog | Weapon | Region that teaches it | Enemy embodying its failure mode |
|---|---|---|---|---|---|
| **Session** | An immutable recording of an agent's actions that can be replayed and inspected. | Ghost playback of a prior agent's run; the player "watches history" to learn the truth. | Session Replayer | Session Archive | Hallucination Bots |
| **Checkpoint** | A saved local state you can rewind to without affecting shared history. | Personal rewind — restore your own position/trust/inventory to a marked moment. | Checkpoint Launcher | Checkpoint Vault | Context Rot |
| **Trail** | The lineage/dependency graph showing how a task or change came to be. | A beam that lights up the causal path between rooms, objects, and events. | Trail Beacon | Trail Network | Detached HEAD |
| **Runner** | An execution environment that evaluates work under a chosen policy. | A deployable drone that scouts ahead under a rule set the player selects. | Runner Drone | Runner Labs | Benchmark Goblins |
| **Gate** | An enforced decision point controlling what reaches production. | The end-of-episode lock: assemble evidence, make the call, live with the consequence. | Gate Generator | Production | YOLO Merge (final boss) |

## Supporting Terms

| Term | Real meaning | In-game analog |
|---|---|---|
| **Repository** | The whole system of record. | The game world — a collapsing virtual Repository. |
| **Working Directory** | Uncommitted local scratch space. | Episode 1 starting region; unstable, ephemeral rooms. |
| **Branch** | A divergent line of work. | Branch Forest; branch-labelled doors that fork the path. |
| **Merge** | Combining branches. | Merge Factory; conflicts manifest as physical hazards. |
| **Origin Server** | The canonical upstream. | The final destination region past Production. |
| **Context** | The information an agent currently holds. | Fuel/visibility resource surfaced by the Context Scanner. |
| **Trust** | Confidence that the system's state is real and correct. | Replaces health (see [05-trust-system.md](./05-trust-system.md)). |
| **Evaluation / Eval** | Judging work against criteria. | Runner scouting result; correct evals restore trust. |
| **YOLO Merge** | Shipping to production with no evidence or gate. | Final boss; the anti-pattern the whole game argues against. |

## Naming Rules (keep docs consistent)
- Primitives are **capitalized** when referring to the Entire concept: Session, Checkpoint, Trail, Runner, Gate.
- Weapons use their full proper names on first mention per doc: Context Scanner, Checkpoint Launcher, Trail Beacon, Session Replayer, Runner Drone, Gate Generator.
- The player character is **Agent Marvin** (or "Marvin"); the platform is **Entire**.

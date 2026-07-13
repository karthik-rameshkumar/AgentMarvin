# 01 — World & Regions

> The Repository is one continuous, collapsing world divided into the **10 themed regions** named in the PDF. Each region introduces or deepens **one Entire concept**. Region order defines the campaign path ([06](./06-episodes-and-levels.md)); concept mappings defer to [glossary.md](./glossary.md).

## The Repository

The game world *is* a Repository — the system of record for millions of autonomous agents, now destabilizing. Geography is metaphor: you literally walk through the structure of version-controlled, agent-driven work. Traversal generally flows from local/ephemeral (Working Directory) toward canonical/permanent (Origin Server), mirroring how work moves from scratch to production.

## Region table

| # | Region | Theme / mood | Concept introduced | Episode | Signature feature |
|---|---|---|---|---|---|
| 1 | **Working Directory** | Unstable scratch space; rooms flicker in/out | (onboarding: movement, Context) | Ep 1 | Ephemeral geometry |
| 2 | **Branch Forest** | Forking wooded corridors | Branches | Ep 3 | Branch-labelled doors that fork the path |
| 3 | **Session Archive** | Solemn hall of recordings | **Sessions** | Ep 1 | Session Anchors / history ghosts |
| 4 | **Checkpoint Vault** | Secure, save-point facility | **Checkpoints** | Ep 2 | Marker pedestals; Context Rot fog |
| 5 | **Trail Network** | Glowing web of causal lines | **Trails** | Ep 3 | Walkable lineage paths |
| 6 | **Runner Labs** | Test chambers & policy consoles; trophy halls of gamed metrics | **Runners** | Ep 4 | Policy-selection drone bays; Benchmark Goblin annexes |
| 7 | **Merge Factory** | Industrial, sparking conflict zones | Merges | Ep 5 | Merge-conflict hazards |
| 8 | **Production** | Bright, high-stakes, alarms | **Gates** (mastery) | Ep 5 | Chained Gate consoles |
| 9 | **Detached HEAD Wasteland** | Warped, unmoored void | (Detached HEAD failure) | Ep 3 | Space distorts near enemies |
| 10 | **Origin Server** | Monumental, canonical, calm | The canonical upstream | Ep 5 end | Site of the final reveal |

> Regions 2 and 9 are traversed *within* the episodes that teach their neighboring primitive (Branch Forest and Detached HEAD Wasteland both sit inside Episode 3). The benchmark trophy halls are a sub-area of **Runner Labs** (region 6), not a separate region. All 10 named regions from the PDF are represented, none added.

## Region → concept flow (the learning spine)

```
Working Directory ─► Session Archive ─► Checkpoint Vault ─► Branch Forest ─►
Trail Network ─► Detached HEAD Wasteland ─► Runner Labs (+benchmarks) ─►
Merge Factory ─► Production ─► Origin Server
     (movement)   (Sessions)    (Checkpoints)   (branches)
     (Trails)     (lineage loss)  (Runners/evals)
     (merges)     (Gates)        (canonical / reveal)
```

## World-state continuity

- The world is **collapsing**, and the player's [Gate decisions](./02-core-mechanics.md#5-gates--enforce-production-decisions-the-ultimate-mechanic) determine *how* it collapses or stabilizes: a bad Promote pushes a corrupted branch downstream, degrading later regions.
- **Trust distortion** ([05](./05-trust-system.md)) is a world-layer that can afflict *any* region, reskinning it with false doors and corrupted maps at low Trust.
- Doors are frequently **branch-labelled**, reinforcing that navigation is a version-control choice.

## Aesthetic per region
See [08-visual-audio-direction.md](./08-visual-audio-direction.md) for the shared 320x200 / neon-terminal treatment. Each region gets a distinct palette and MIDI motif so the player can feel *which part of the Repository* they're in.

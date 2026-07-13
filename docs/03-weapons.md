# 03 — Weapons

> Each weapon is **1:1 with an Entire primitive** (see [glossary.md](./glossary.md)). Rules and behaviors are defined in [02-core-mechanics.md](./02-core-mechanics.md); this document specifies each weapon as a usable tool — slot, inputs, feel, ammo/resource, and upgrades.

## Guiding principle: Trust over Violence

Marvin's arsenal is a **detective's toolkit**, not a soldier's. Five of the six weapons deal **no direct damage** — they reveal, verify, rewind, scout, and decide. The player "wins" fights mostly by *exposing* enemies as false (a hallucinated enemy dispelled by a Session does more than any bullet). This is the deliberate inversion of the genre the game is homaging.

## Weapon slots

| Slot | Weapon | Primitive | Damage? | Core action |
|---|---|---|---|---|
| 1 | Context Scanner | (Context) | Chip damage | Reveal + expose the world |
| 2 | Session Replayer | Session | No | Replay history ghosts |
| 3 | Checkpoint Launcher | Checkpoint | No | Set/rewind local state |
| 4 | Trail Beacon | Trail | No | Trace lineage |
| 5 | Runner Drone | Runner | Indirect | Deploy policy scout |
| 6 | Gate Generator | Gate | Decisive | Make production calls |

---

### Slot 1 — Context Scanner
- **Primitive:** Context (the connective resource; the one "starter" weapon).
- **Primary:** A short-range cone scan that reveals hidden geometry, marks interactables, and does light **chip damage** to enemies (the only weapon that damages directly — kept weak on purpose).
- **Alt-fire:** Focused ping that tags a single enemy, showing whether it is **real or hallucinated** (real enemies persist under a Session replay; hallucinated ones flicker).
- **Resource:** Context meter, regenerates over time; scanning drains it.
- **Upgrades:** Wider cone → wall-penetration ping → "auto-tag" that flags hallucinations passively.
- **Feel:** The always-available tool. First weapon the player gets in Episode 1.

### Slot 2 — Session Replayer
- **Primitive:** Session. See [mechanics §1](./02-core-mechanics.md#1-sessions--replay-historical-actions).
- **Primary:** Fire at a Session Anchor to spawn and play a **history ghost**.
- **Alt-fire:** Scrub — fast-forward/rewind the currently playing ghost to a key moment.
- **Resource:** None (read-only); limited to one active ghost.
- **Upgrades:** Play two ghosts at once (for conflict reconciliation) → "diff view" that highlights where two Sessions diverge.
- **Feel:** A séance tool. Unmistakably non-violent; the drama is in *watching the truth*.

### Slot 3 — Checkpoint Launcher
- **Primitive:** Checkpoint. See [mechanics §2](./02-core-mechanics.md#2-checkpoints--rewind-local-state).
- **Primary:** Drop a Checkpoint marker at your feet.
- **Alt-fire:** Rewind to the most recent valid marker (local state only).
- **Resource:** Up to 3 active markers; markers can rot (Context Rot enemy).
- **Upgrades:** +markers → "clean marker" immune to rot → remote placement.
- **Feel:** A safety net that teaches the *limits* of undo — the world doesn't rewind, only you do.

### Slot 4 — Trail Beacon
- **Primitive:** Trail. See [mechanics §3](./02-core-mechanics.md#3-trails--reveal-task-lineage).
- **Primary:** Fire at any effect to light its lineage path.
- **Alt-fire:** "Graph mode" — zoom out to see the full branch/merge lineage of the current area (used heavily in Branch Forest & Merge Factory).
- **Resource:** Small Context cost per trace.
- **Upgrades:** Longer trails → persistent trails (stay lit) → "stale detection" that dims invalidated branches.
- **Feel:** A lantern for causality.

### Slot 5 — Runner Drone
- **Primitive:** Runner. See [mechanics §4](./02-core-mechanics.md#4-runners--evaluate-environments-under-a-policy).
- **Primary:** Deploy a drone under the selected **policy** (Safe / Fast / Thorough / more later).
- **Alt-fire:** Open the policy radial menu.
- **Resource:** One drone; recharges after return/expiry (~8s).
- **Indirect combat:** A drone can bait or stun enemies while scouting, but never kills — it *evaluates*.
- **Upgrades:** Faster recharge → two simultaneous drones (parallel evals) → unlock Compliance/Cost policies.
- **Feel:** Sending a scout with a rulebook; the choice of rulebook is the gameplay.

### Slot 6 — Gate Generator
- **Primitive:** Gate. See [mechanics §5](./02-core-mechanics.md#5-gates--enforce-production-decisions-the-ultimate-mechanic).
- **Primary:** Project a Gate at a Gate Node and dock collected **evidence tokens**.
- **Alt-fire:** Commit a decision — **Promote / Reject / Hold**.
- **Resource:** Evidence tokens gathered from Sessions/Trails/Runners.
- **The decisive weapon:** This is the only tool that *changes production*. It is the climax weapon and the progression key; acquired last (Episode 5 fully, previews earlier).
- **Feel:** Heavy, ceremonial, consequential — the opposite of a rapid-fire gun.

---

## Acquisition order (mirrors the campaign)

| Episode | Region | Weapon unlocked |
|---|---|---|
| 1 | Working Directory / Session Archive | Context Scanner, Session Replayer |
| 2 | Checkpoint Vault | Checkpoint Launcher |
| 3 | Trail Network | Trail Beacon |
| 4 | Runner Labs | Runner Drone |
| 5 | Production | Gate Generator (full power) |

Each weapon is introduced in the region that teaches its primitive, so **weapon acquisition == concept acquisition**. See [06-episodes-and-levels.md](./06-episodes-and-levels.md).

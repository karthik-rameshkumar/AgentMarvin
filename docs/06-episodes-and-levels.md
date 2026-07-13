# 06 — Episodes & Level Design

> Five episodes, each set in the regions from [01-world-and-regions.md](./01-world-and-regions.md), each teaching exactly **one primitive** from [02-core-mechanics.md](./02-core-mechanics.md) through play before any explanation. Weapon acquisition tracks concept acquisition (see [03-weapons.md](./03-weapons.md)). Every episode ends at a **Gate**.

## Pacing philosophy

Each episode follows the same **learn-through-play arc**:
1. **Encounter** — the level physically presents a problem only the new primitive can solve.
2. **Discover** — the player finds/uses the weapon and solves it *before* any text appears.
3. **Reinforce** — 1–2 rooms deepen the mechanic with variation.
4. **Twist** — a complication (conflict, staleness, a new enemy) forces mastery.
5. **Gate** — an evidence-backed decision closes the episode and gates progression.

Level layouts are described as **beats + a schematic**, not tile-exact maps (those live in the map JSON, see [11-technical-spec.md](./11-technical-spec.md)).

---

## Episode 1 — "Lost Sessions"
**Regions:** Working Directory → Session Archive · **Teaches:** Sessions · **Weapons gained:** Context Scanner, Session Replayer · **New enemy:** Hallucination Bots

| Level | Region | Beat | Concept moment |
|---|---|---|---|
| 1-1 | Working Directory | Wake-up in an unstable scratch space; grab the **Context Scanner**; learn movement, scanning, and that some rooms are ephemeral. | Movement-first; Scanner reveals hidden geometry. |
| 1-2 | Working Directory | First **Hallucination Bots** insist the exit is one way; the *real* exit is elsewhere. Scanner alt-fire tags fakes. | "Verify before you act." |
| 1-3 | Session Archive | Locked path. A **Session Anchor** is nearby; pick up the **Session Replayer**; a ghost opens the way it once did. | Sessions = replay history to find truth. |
| 1-4 | Session Archive | **Conflicting Sessions:** two ghosts disagree on which door is safe. Replay both; the Scanner confirms which enemies are real. | Reconcile history; Trust reward for correct read. |
| 1-Gate | Session Archive | **Gate (training):** dock the one evidence token you gathered; any decision opens the way but the "correct" (evidence-backed) call grants Trust. | First taste of the ultimate mechanic. |

**Schematic (1-3):**
```
[start]──corridor──[locked door]···(leads to 1-4)
   │                    ▲
   └──side room──[Session Anchor]  → replay ghost walks to door, opens it
```

---

## Episode 2 — "Checkpoint Facility"
**Regions:** Checkpoint Vault · **Teaches:** Checkpoints · **Weapon gained:** Checkpoint Launcher · **New enemy:** Context Rot

| Level | Beat | Concept moment |
|---|---|---|
| 2-1 | Get the **Checkpoint Launcher**; a hazard room is impossible without dropping a marker and rewinding after scouting. Sessions and Checkpoints are placed **side by side** to contrast: history you inspect vs. savepoint you control. | The key Sessions↔Checkpoints distinction. |
| 2-2 | **Context Rot** fog corrupts old markers; the player learns to refresh markers and keep moving. | Stale context degrades your safety net. |
| 2-3 | Timed collapse puzzle: set a marker, attempt, rewind, retry — but note **killed enemies stay dead**, teaching that only *local* state rewinds. | Local rewind ≠ world rewind. |
| 2-Gate | A Gate that requires a **minimum of 2 evidence tokens** — the training wheels start coming off. | Evidence thresholds introduced. |

---

## Episode 3 — "Trail Network"
**Regions:** Branch Forest → Trail Network → Detached HEAD Wasteland · **Teaches:** Trails · **Weapon gained:** Trail Beacon · **New enemies:** Prompt Injection, Detached HEAD, Infinite Planner

| Level | Beat | Concept moment |
|---|---|---|
| 3-1 | Branch Forest: **branch-labelled doors** fork the path; get the **Trail Beacon**; trace a locked Gate back to its switches and their order. | Trails reveal lineage/dependencies. |
| 3-2 | **Prompt Injection** poses as a helpful sign; following it wrecks Trust. Scanner tags it; Trail shows the real dependency. | Input provenance / skepticism. |
| 3-3 | Detached HEAD Wasteland: space is warped by **Detached HEAD** enemies; Trail Beacon reattaches them to lineage, un-warping geometry. | Lineage restores order. |
| 3-4 | **Infinite Planner** walls the path with an ever-growing plan; only reaching and forcing its Gate collapses it. | "Make the call." (previews Gate power) |
| 3-Gate | Multi-switch Gate requiring a **traced** evidence chain, not just tokens. | Evidence must be *causally sound*. |

---

## Episode 4 — "Runner Labs"
**Regions:** Runner Labs · **Teaches:** Runners · **Weapon gained:** Runner Drone · **New enemies:** Recursive Agents, Benchmark Goblins, Infinite Retry

| Level | Beat | Concept moment |
|---|---|---|
| 4-1 | Get the **Runner Drone**; a hazard corridor must be scouted; choosing **Safe vs Fast vs Thorough** changes what you learn. | Evaluation under a chosen policy. |
| 4-2 | **Benchmark Goblins** look invincible under Fast eval; a **Thorough** eval exposes their gamed stats. | Criteria determine truth. |
| 4-3 | **Recursive Agents** multiply; a Runner eval finds the root instance to cap the loop. **Infinite Retry** trapped nearby is broken with Checkpoint+decision. | Evaluate to break runaway loops. |
| 4-4 | A puzzle requiring the **same room evaluated under two policies**, comparing results to proceed. | Same input, different eval, different result. |
| 4-Gate | Gate that only accepts evidence gathered under a **specific policy** — wrong-policy evidence is rejected. | Fit-for-purpose evidence. |

---

## Episode 5 — "Production Gates" (finale)
**Regions:** Merge Factory → Production → Origin Server · **Teaches:** Gates (mastery) · **Weapon gained:** Gate Generator (full) · **Enemies:** Merge Goblins + all prior + **YOLO Merge boss**

| Level | Beat | Concept moment |
|---|---|---|
| 5-1 | Merge Factory: **Merge Goblins** create conflict hazards; Trail + Gate to reject bad branches. Full **Gate Generator** acquired. | Merges & rejection. |
| 5-2 | **Chained Gates:** a sequence of production decisions where each depends on the last; wrong early calls corrupt later rooms (visible consequence). | Decisions compound. |
| 5-3 | Production approach: pressure mounts, the world begs Marvin to ship. Distortion is high; only verified truth navigates. | Resisting pressure. |
| 5-Boss | **The YOLO Merge** three-phase fight ([see 04](./04-enemies.md#-final-boss--the-yolo-merge-episode-5)): Chaos → Lineage → the Gate. Rejecting the YOLO Merge with full evidence = true ending. | The thesis, made playable. |
| 5-End | Origin Server stabilizes → **final reveal** transitions into a live Entire repository ([07](./07-learning-and-onboarding.md)). | Fiction → platform. |

**Two endings:**
- **True ending:** evidence-backed rejection of the YOLO Merge → Origin restored → live-repo reveal.
- **Bad ending:** hitting "MERGE NOW" → corrupted Origin Server, a darkly comic "you shipped it" screen, and a prompt to retry the Gate. Reinforces the lesson without a hard fail.

---

## Cross-episode systems
- **Trust** ([05](./05-trust-system.md)) persists and its distortion tiers ramp across episodes.
- **Weapons** carry forward; later levels assume mastery of earlier primitives (a Trail puzzle in Ep 5 assumes Ep 3 fluency).
- **Easter eggs** ([10](./10-easter-eggs.md)) are seeded in every region to reward exploration.

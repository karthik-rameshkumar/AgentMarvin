# 04 — Enemies

> Every enemy **embodies a real failure mode** of unsupervised AI agents. Defeating one is usually about *exposing or countering* that failure mode with the right primitive — reinforcing [Trust over Violence](./00-vision-and-pillars.md). Primitive counters reference [02-core-mechanics.md](./02-core-mechanics.md) and [glossary.md](./glossary.md).

## Enemy roster (10 + final boss)

| # | Enemy | Failure mode it embodies | Best countered by | First appears |
|---|---|---|---|---|
| 1 | Hallucination Bots | Confidently asserting things that never happened | Session Replayer (they vanish under real history) | Ep 1 |
| 2 | Merge Goblins | Reckless merges that corrupt shared state | Trail Beacon + Gate (reject the bad branch) | Ep 5 / Merge Factory |
| 3 | Context Rot | Slow decay of stale context/state | Checkpoint Launcher (fresh markers) | Ep 2 |
| 4 | Infinite Planner | Analysis paralysis; never acts | Gate decision (force a call) | Ep 3 |
| 5 | Recursive Agents | Spawning copies of themselves unboundedly | Runner Drone (evaluate & cap the loop) | Ep 4 |
| 6 | Benchmark Goblins | Gaming metrics; looking good on paper only | Runner Drone (Thorough policy exposes them) | Ep 4 |
| 7 | Prompt Injection | Hijacking instructions from untrusted input | Context Scanner alt-fire (tag the fake) | Ep 3 |
| 8 | Detached HEAD | Lost lineage; working with no connection to origin | Trail Beacon (reattach to lineage) | Ep 3 / Detached HEAD Wasteland |
| 9 | Infinite Retry | Repeating a failing action forever | Checkpoint + Gate (break the loop, decide) | Ep 4 |
| 10 | (mini) Corrupted Maps | Distortion spawned by low Trust | Restore Trust (see [05](./05-trust-system.md)) | Any (Trust-driven) |
| ★ | **YOLO Merge** | Shipping to production with no evidence or gate | Gate Generator, fully powered | Ep 5 finale |

---

## Behavior detail

### 1. Hallucination Bots
Fast, chattering sprites that assert false objectives ("The exit is THIS way!") and spawn fake doors. **They are only sometimes real.** The Context Scanner ping or a Session replay reveals which are hallucinated — those cannot actually harm you and dispel when confronted with history. Shooting a hallucinated bot with the Context Scanner *wastes Trust*; exposing it costs nothing. **The lesson: verify before you act.**

### 2. Merge Goblins
Bruisers of the Merge Factory. They drag conflicting branches together, creating hazard zones. Trace their Trail to find which branch is corrupt, then use a Gate to **reject** it — brute force barely dents them. Reckless players who just shoot cause more conflicts.

### 3. Context Rot
A creeping, corrosive fog that **degrades your Checkpoint markers** and dims the map. Doesn't attack directly; it erodes your safety net. Counter by refreshing markers and moving; upgraded "clean markers" resist it.

### 4. Infinite Planner
A stationary, monologuing entity surrounded by an ever-growing plan diagram that walls off the path. It never attacks — it just *expands forever*. The only way past is to reach the Gate it guards and **force a decision**, collapsing its analysis. Embodies "just make the call."

### 5. Recursive Agents
Spawn duplicates of themselves on a timer; killing one spawns two (classic). You cannot out-shoot them. Deploy a Runner Drone to **evaluate and identify the root instance**, then cap the loop — pure combat loses.

### 6. Benchmark Goblins
Look powerful and flaunt high "scores," but a **Thorough Runner policy** reveals they're hollow — their stats are gamed. Under Fast eval they seem unbeatable; under Thorough eval their weakness is exposed. Teaches that evaluation criteria matter.

### 7. Prompt Injection
Disguises itself as a friendly NPC or a legitimate objective marker, feeding false instructions that, if followed, drain Trust or lead into traps. The Context Scanner alt-fire **tags it as untrusted input**. Teaches input provenance/skepticism.

### 8. Detached HEAD
Roams the Detached HEAD Wasteland — a floating, unmoored agent with no connection to origin, warping space around it. The Trail Beacon can **reattach it to a lineage**, neutralizing it and restoring the region's geometry.

### 9. Infinite Retry
Loops the same failing attack endlessly, sometimes trapping the player in a retry loop with it. Break the pattern with a Checkpoint rewind + a decisive Gate action. Teaches "stop retrying, escalate a decision."

### 10. Corrupted Maps (Trust-driven hazard)
Not a spawned enemy but a **distortion effect** at low Trust: false doors, mislabeled branches, phantom enemies. Fully specified in [05-trust-system.md](./05-trust-system.md). Included here because it *behaves* like an adversary. Cured by restoring Trust.

---

## ★ Final Boss — The YOLO Merge (Episode 5)

The culmination of every failure mode. The YOLO Merge is a colossal entity that wants to **ship everything to production instantly, with no evidence and no Gate**. The arena constantly offers Marvin a giant, tempting **"MERGE NOW"** button (instant Promote, zero evidence) — pressing it is instant loss disguised as instant win.

**Fight structure (three phases):**
1. **Chaos** — the boss floods the arena with Hallucination Bots and Merge Goblins; use Sessions/Scanner to separate real threats from noise while gathering evidence tokens.
2. **Lineage** — the boss hides its weak point; Trail Beacon graph-mode exposes the corrupt branch feeding it. Runner evals (Thorough) confirm the true target.
3. **The Gate** — with enough verified evidence docked, Marvin projects the final Gate and **rejects the YOLO Merge**, forcing a proper, evidence-backed production decision. The world stabilizes; Trust is restored; the [final reveal](./07-learning-and-onboarding.md) begins.

**Anti-lesson made playable:** at any moment the player *can* hit MERGE NOW and "beat" the fight faster — into a bad ending (corrupted Origin Server). Only the evidence-backed Gate yields the true ending. This is the entire thesis of AgentMarvin in one encounter.

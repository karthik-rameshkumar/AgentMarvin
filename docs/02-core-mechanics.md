# 02 — Core Mechanics

> This is the **heart of the spec**. It defines the five primitives as precise gameplay systems. The canonical mapping table lives in [glossary.md](./glossary.md); this document owns the *rules, numbers, and behaviors*. Weapons ([03](./03-weapons.md)), enemies ([04](./04-enemies.md)), episodes ([06](./06-episodes-and-levels.md)), and learning ([07](./07-learning-and-onboarding.md)) all defer to what is written here.

## Design intent

Every mechanic must satisfy two constraints from the [design pillars](./00-vision-and-pillars.md):
1. **Learn Through Play** — the player uses the mechanic correctly *before* any text explains it. The level geometry teaches.
2. **Trust over Violence** — the mechanic gathers information or verifies reality; it does not primarily deal damage. Power comes from knowing what is true.

All five primitives share a common spec format below: *real concept → in-game verb → input → cost → cooldown → what it reveals/changes → scaling → failure if misused.*

---

## 1. Sessions — "Replay historical actions"

- **Real concept:** An immutable recording of a prior agent's run that can be replayed and inspected.
- **In-game verb:** *Replay.* Marvin summons a translucent **ghost** of an agent that previously moved through this space and re-performs its exact actions.
- **Input:** Equip Session Replayer; fire at a Session Anchor (glowing recording node embedded in the world).
- **Cost:** Free to view; costs nothing but *time* (the ghost plays in real time, and enemies do not pause).
- **Cooldown:** None, but only one ghost may play at a time.
- **Reveals/changes:** Ghosts open doors they opened, trip traps they tripped, and speak logged lines. They reveal hidden routes, expose which enemies are *hallucinated* (a real Session never interacted with them), and betray the true cause of a room's collapse. **Sessions are read-only** — the ghost cannot be harmed and cannot harm Marvin; it is history, not a threat.
- **Scaling:** Later levels have *conflicting* Sessions (two ghosts that disagree). The player must replay both and reconcile which is trustworthy — feeding the Trust system.
- **Failure if misused:** Acting on a hallucinated enemy (attacking something no Session ever touched) drains Trust.

## 2. Checkpoints — "Rewind local state"

- **Real concept:** A saved local state you can return to without rewriting shared history.
- **In-game verb:** *Set* and *Rewind.* Marvin drops a Checkpoint marker, then can later snap back to that exact state — position, Trust level, ammo/context, and any puzzle progress that is *local*.
- **Input:** Checkpoint Launcher primary fire = set marker; alt-fire = rewind to most recent marker.
- **Cost:** Setting is cheap (limited number of active markers, default 3). Rewinding **does not restore the world's shared state** — enemies you killed stay dead, Gates you opened stay open — only *your* local state rewinds. This distinction is the whole lesson.
- **Cooldown:** ~2s between rewinds to prevent thrash.
- **Reveals/changes:** Enables risk-taking: scout a dangerous room, then rewind your Trust/position if it goes badly. Puzzle use: rewind to re-attempt a timed sequence.
- **Scaling:** Later regions introduce **Context Rot** that corrupts old markers (see [enemies](./04-enemies.md)); markers must be refreshed or they rewind you to a *distorted* state.
- **Failure if misused:** Relying on a rotted marker rewinds you into a low-Trust distortion.

> **Sessions vs Checkpoints — the key contrast the game teaches:** a Session is *shared, immutable history you inspect*; a Checkpoint is *your private, disposable savepoint you control*. Level 2-1 deliberately places them side by side so the player feels the difference.

## 3. Trails — "Reveal task lineage"

- **Real concept:** The lineage/dependency graph explaining how a state came to be.
- **In-game verb:** *Trace.* Firing the Trail Beacon lights a glowing line from an object/event back through every cause that produced it.
- **Input:** Trail Beacon fired at any "effect" (a locked door, a corrupted terminal, a boss weak point).
- **Cost:** Small Context cost per trace.
- **Cooldown:** ~3s.
- **Reveals/changes:** Turns invisible dependency chains into a walkable path of light. A locked door's Trail leads to the three switches that gate it and the order they must fire. A boss's Trail reveals which upstream node must be destroyed first.
- **Scaling:** Trails branch and loop in later regions (Branch Forest, Merge Factory). The player learns to read a lineage graph — forks, merges, and dead branches — which is the literal Entire mental model.
- **Failure if misused:** Following a *stale* Trail (one invalidated by a merge) leads into a trap room; the fix is to re-trace.

## 4. Runners — "Evaluate environments under a policy"

- **Real concept:** An execution environment that evaluates work under a chosen policy.
- **In-game verb:** *Deploy & Evaluate.* Marvin launches a **Runner Drone** that scouts ahead autonomously under a **policy the player selects** before launch.
- **Input:** Runner Drone; a radial menu picks the policy: **Safe** (avoids hazards, slow, thorough), **Fast** (rushes, ignores side rooms), or **Thorough** (maps everything, triggers more enemies). More policies unlock later.
- **Cost:** Cooldown-gated; the drone is a limited, recharging resource.
- **Cooldown:** Drone must return or expire before redeploy (~8s).
- **Reveals/changes:** The drone reports back an **evaluation** of the space ahead — hazards, hidden loot, enemy counts — *filtered by the chosen policy*. Choosing the right policy for the situation is the skill. A Fast policy misses the trap a Thorough policy would have flagged.
- **Scaling:** Later puzzles require running the *same* room under *two* policies and comparing results (teaching that evaluation depends on criteria). Some Gates only accept evidence gathered under a specific policy.
- **Failure if misused:** Trusting a Fast eval where a Thorough one was needed → you walk into the missed hazard → Trust loss.

## 5. Gates — "Enforce production decisions" (the ultimate mechanic)

- **Real concept:** An enforced decision point controlling what reaches production.
- **In-game verb:** *Decide.* At a Gate, Marvin must **assemble evidence** (from Sessions, Trails, and Runner evals) and then make a binding call: **Promote**, **Reject**, or **Hold**.
- **Input:** Gate Generator projects the Gate; the player docks collected evidence tokens into the Gate console, then commits a decision.
- **Cost:** A wrong decision costs significant Trust and *alters the next level* (a bad Promote ships a corrupted branch into the following region, making it harder).
- **Cooldown:** One-shot per Gate; decisions are **irreversible without a Checkpoint** — reinforcing the difference between local rewind and production consequence.
- **Reveals/changes:** Gates are the **progression mechanic** — every episode ends at one, and later episodes chain multiple Gates. A correct decision, backed by sufficient evidence, opens the path to the next region and restores Trust.
- **Scaling:** Early Gates accept any decision (training wheels). Mid-game Gates require a *minimum evidence threshold* or they refuse to open. The final Gate (Episode 5) is the **YOLO Merge** encounter: the world screams at you to ship without evidence, and resisting that pressure is the climax.
- **Failure if misused:** A YOLO decision (Promote with zero evidence) is always available and always tempting — it's fast — but tanks Trust and spawns the consequences the whole game warns about.

---

## How the mechanics interlock

The five primitives form an **evidence pipeline**, which is the core loop:

```
Sessions (what happened)  ─┐
Trails   (why it happened) ─┼──►  Evidence tokens  ──►  Gate decision  ──►  Progression
Runners  (what will happen)─┘                              ▲
                                                           │
Checkpoints (undo YOUR mistakes while gathering) ──────────┘
```

1. **Explore** a region and hit obstacles (locked Gates, hallucinated enemies, collapsed routes).
2. **Investigate** with Sessions (history), Trails (causality), and Runners (forecast) to collect **evidence tokens**.
3. **Protect yourself** with Checkpoints while investigating risky areas.
4. **Decide** at the Gate. Good evidence + right call → Trust up, path opens. YOLO → Trust down, world distorts.
5. The next region **reflects your decisions** (the world state is a consequence of your Gates).

This loop is the mental model of Entire, delivered without a single tutorial popup. See [07-learning-and-onboarding.md](./07-learning-and-onboarding.md) for the explicit gameplay→understanding mapping.

# 07 — Learning & Onboarding Arc

> AgentMarvin's real deliverable is **understanding**. This document maps each gameplay moment to the real Entire mental model it builds, and specifies the **final reveal** that pivots from fiction to the live platform. Mechanics defer to [02](./02-core-mechanics.md); terms to [glossary.md](./glossary.md).

## Thesis

A developer who finishes AgentMarvin should be able to explain — without ever having read Entire's docs — *what problem each primitive solves and when to reach for it*. The game front-loads the **felt need** for each primitive (a problem you can't solve without it), so the concept lands as relief, not homework.

## Gameplay → understanding map

| Gameplay moment | What the player *does* | Real Entire understanding it builds |
|---|---|---|
| Ep1 Hallucination Bots lie about the exit | Verify with Scanner/Session before acting | Agent output can be confidently wrong; **verify against a record**. |
| Ep1 replay a Session ghost to open a path | Watch immutable history reveal truth | A **Session** is a replayable, trustworthy record of what an agent actually did. |
| Ep1 reconcile two conflicting Sessions | Compare recordings, pick the sound one | History is evidence; **inspecting runs** resolves disputes. |
| Ep2 drop a marker, scout, rewind | Undo *your* state, not the world | A **Checkpoint** is a private, disposable savepoint — distinct from shared history. |
| Ep2 killed enemies stay dead after rewind | Feel the limit of local undo | Local rewind ≠ rewriting shared/production state. |
| Ep3 trace a locked Gate to its switches | Light up a dependency chain | A **Trail** shows lineage/causality — *why* a state exists. |
| Ep3 reject a Prompt Injection sign | Tag untrusted input | Provenance matters; not every instruction is trustworthy. |
| Ep4 scout under Safe/Fast/Thorough | Pick a policy, live with its blind spots | A **Runner** evaluates under a *policy*; criteria change the result. |
| Ep4 expose Benchmark Goblins with Thorough eval | See gamed metrics collapse | Evaluations can be gamed; choose criteria deliberately. |
| Ep5 assemble evidence, decide at a Gate | Promote/Reject/Hold with consequences | A **Gate** enforces production decisions backed by evidence. |
| Ep5 refuse the YOLO Merge | Resist shipping without evidence | The anti-pattern the whole platform exists to prevent. |

## The pedagogical loop (why it sticks)

1. **Problem before tool** — the level makes you *want* the primitive.
2. **Use before words** — you solve it, then the HUD confirms in dev-humor voice.
3. **Twist for mastery** — a complication proves you understood, not just copied.
4. **Consequence** — Trust and world-state make the lesson *matter* ([05](./05-trust-system.md)).

No tutorial popups gate progress; text only ever *confirms* what the player already discovered.

## The Final Reveal (fiction → platform)

The climax of onboarding, triggered after the [true ending](./06-episodes-and-levels.md#episode-5--production-gates-finale) at the **Origin Server**:

1. **Stabilization:** rejecting the YOLO Merge restores the Origin Server; the collapsing world snaps into clean, calm order — the neon terminal aesthetic resolves into something that looks like a real UI.
2. **The mirror:** Marvin's HUD terminal reveals that the "game" primitives map exactly to real Entire features — a short, diegetic side-by-side ("Session Replayer → Sessions", etc.), pulling directly from [glossary.md](./glossary.md).
3. **The doorway:** the final door is labeled not with a branch name but with an invitation to open a **live Entire repository**. Crossing it transitions (via a link/handoff) from the game into the actual platform, pre-seeded with a friendly first Session/Checkpoint/Trail so the new user's first real actions echo what they just mastered.
4. **Continuity of identity:** the player *is* an agent named Marvin; stepping into the real repo, they're invited to supervise real agents — the fantasy and the product become the same act.

> **Build note:** the reveal's live-repo handoff is a first-class requirement for the web target ([11](./11-technical-spec.md)) — it's why web-first was chosen. In the vertical slice, the reveal can be a static mock; the live handoff is a later milestone ([12](./12-build-plan-roadmap.md)).

## Measuring onboarding success (optional telemetry)
With consent, track: primitive-first-correct-use time, YOLO-button temptation rate vs. true-ending rate, and post-game click-through into a live repo. These validate whether the *game* actually onboards — not just whether it entertains.

# 05 — Trust System

> **Trust replaces health.** This is the game's signature mechanic and the mechanical expression of the [Trust over Violence](./00-vision-and-pillars.md) pillar. Trust is affected by how you use the [core mechanics](./02-core-mechanics.md) — especially [Gate](./02-core-mechanics.md#5-gates--enforce-production-decisions-the-ultimate-mechanic) decisions.

## Concept

In a normal FPS you lose health when hit and die at zero. In AgentMarvin, Marvin is an agent whose power is **being right**. The resource that depletes isn't blood — it's **Trust**: the reliability of Marvin's perception of the Repository. As Trust falls, the *world itself becomes unreliable* — you literally cannot believe what you see. This makes "damage" a perceptual, informational threat rather than a physical one, and makes *good decisions* the way you heal.

## The Trust pool

- **Range:** 0–100. Starts each level at 100 (or carried from the prior level in a run).
- **Display:** A neon terminal-style meter (not a health bar) reading e.g. `TRUST 84%`, with a subtle "signal quality" visual (clean → glitchy) rather than a red-flash.
- **No auto-regen by damage-avoidance.** Trust regenerates only through *correct evaluations and decisions* — you earn it back by being right, not by hiding.

## Trust gains (+)

| Action | Approx. gain | Why |
|---|---|---|
| Correct Gate decision backed by sufficient evidence | +15–30 | The core reward loop |
| Exposing a hallucinated enemy (vs. attacking it) | +3 | Rewards verification |
| Completing a Runner eval with the *appropriate* policy | +5 | Rewards fit-for-purpose evaluation |
| Reconciling conflicting Sessions correctly | +8 | Rewards using history |
| Reattaching a Detached HEAD via Trail | +5 | Rewards lineage awareness |
| Finding a truth-bearing easter egg (README room) | +2 | Rewards exploration |

## Trust losses (−)

| Action | Approx. loss | Why |
|---|---|---|
| YOLO decision (Promote with no/low evidence) | −25 to −40 | The cardinal sin |
| Acting on a hallucination (attacking a fake, following injection) | −5 to −10 | Punishes unverified action |
| Wrong Gate decision (reject good / promote bad) | −15 to −25 | Consequences are real |
| Trusting a stale Trail or rotted Checkpoint | −5 | Punishes stale context |
| Using a Fast eval where Thorough was required, then hitting the missed hazard | −8 | Punishes lazy evaluation |

> Note: enemies do **not** deal Trust damage by touching you in the traditional sense. Physical contact staggers/slows Marvin; the *Trust* cost comes from **being deceived or deciding badly**. This is the deliberate reframe.

## Distortion tiers (the world lies as Trust drops)

As Trust falls, the world escalates through four tiers. Each tier layers on top of the previous.

| Tier | Trust range | World distortion |
|---|---|---|
| **T0 — Clear** | 75–100 | World is truthful. Minor CRT shimmer only. |
| **T1 — Doubt** | 50–74 | **False doors** appear (some doors lead nowhere / are painted on). Minor UI glitches. Sessions still fully reliable. |
| **T2 — Corruption** | 25–49 | **Corrupted maps** (mislabeled branches, wrong distances), **visual glitches** (texture tearing, phantom lighting), occasional **deceptive enemies** (harmless sprites look hostile & vice versa). |
| **T3 — Collapse** | 1–24 | Heavy distortion: the minimap actively lies, hallucinated enemies are indistinguishable without a Session, audio cues invert, corridors reconfigure. The player must rely almost entirely on **verified truth** (Sessions/Trails) to navigate. |
| **Failure** | 0 | See below. |

**Design pointer:** distortion tiers are what make low Trust *scary and instructive* rather than just a number going down — they viscerally demonstrate what it feels like when you can't trust your context. The **primitives are the cure**: even at T3, a Session replay shows the ground truth, letting a skilled player recover.

## Failure & recovery (the "death" state)

- **At Trust 0**, Marvin doesn't die violently. Instead the level enters **Full Distortion**: reality is unusable and Marvin is "lost in noise."
- **Recovery, not game-over:** the player is returned to their most recent **Checkpoint** (local rewind) with Trust restored to a floor value (e.g., 40), *but the world-state consequences of prior bad Gate decisions persist*. This mirrors real life: you can recover your footing, but shipped mistakes stay shipped until fixed.
- If no Checkpoint exists (early game), restart the current level segment.
- This design keeps the game **non-punitive about exploration** (Checkpoints make experimentation safe) while keeping **production decisions weighty** (Gates can't be casually undone).

## Feedback & readability

- **Visual:** signal-quality overlay + escalating CRT glitch tied to tier; a brief green "TRUST +N (verified)" or red "TRUST −N (deceived)" toast on change, phrased to teach *why*.
- **Audio:** clean synth tones at high Trust; detuned/glitched MIDI at low Trust (see [08-visual-audio-direction.md](./08-visual-audio-direction.md)).
- **Diegetic:** the neon terminal HUD narrates in dev-humor voice ("context integrity nominal" / "hallucination detected, recommend replay").

## Tuning notes (for [12-build-plan-roadmap.md](./12-build-plan-roadmap.md))
- All numbers above are **starting values to playtest**, not final.
- The vertical slice ships **T0 and T1 only** (one distortion tier) to prove the loop before authoring the full distortion pipeline.

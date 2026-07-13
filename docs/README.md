# AgentMarvin — Game Design & Technical Specification (v2)

> A retro first-person action game (Wolfenstein 3D / DOOM / Chex Quest lineage) that **onboards developers to Entire** by teaching its five primitives — **Sessions, Checkpoints, Trails, Runners, Gates** — through gameplay instead of documentation. You play as **Agent Marvin**, an autonomous agent restoring trust in a collapsing virtual Repository.

This folder expands the original 2-page pitch (`../AgentMarvin_Game_Design_Spec_v1.pdf`, kept as the v1 historical record) into a dev-ready specification: a design bible **and** a technical/build spec.

## How to read this

**Newcomer? Read in this order:**
1. [00 — Vision & Pillars](./00-vision-and-pillars.md) — why the game exists; the four design pillars.
2. [01 — World & Regions](./01-world-and-regions.md) — the 11-region Repository and what each teaches.
3. [02 — Core Mechanics](./02-core-mechanics.md) ★ — the five primitives as gameplay systems *(the heart)*.
4. [06 — Episodes & Levels](./06-episodes-and-levels.md) ★ — the campaign, beat by beat.
5. [07 — Learning & Onboarding](./07-learning-and-onboarding.md) ★ — how play → real Entire understanding; the final reveal.

**Building it? Jump to:**
- [11 — Technical Spec](./11-technical-spec.md) ★ — stack, architecture, data formats.
- [12 — Build Plan & Roadmap](./12-build-plan-roadmap.md) ★ — vertical slice first, then milestones.

## Full document index

| Doc | Topic |
|---|---|
| [glossary.md](./glossary.md) | **Single source of truth** — Entire term ⇄ in-game analog table |
| [00-vision-and-pillars.md](./00-vision-and-pillars.md) | Vision, core fantasy, the 4 design pillars |
| [01-world-and-regions.md](./01-world-and-regions.md) | The 10 regions and the concept each introduces |
| [02-core-mechanics.md](./02-core-mechanics.md) ★ | Sessions / Checkpoints / Trails / Runners / Gates — rules & numbers |
| [03-weapons.md](./03-weapons.md) ★ | 6 weapons, 1:1 primitive mapping, inputs, upgrades |
| [04-enemies.md](./04-enemies.md) | 10 enemies + the YOLO Merge boss; failure modes & counters |
| [05-trust-system.md](./05-trust-system.md) ★ | Trust replaces health; gains/losses, distortion tiers, failure |
| [06-episodes-and-levels.md](./06-episodes-and-levels.md) ★ | 5 episodes, per-level beats & schematics |
| [07-learning-and-onboarding.md](./07-learning-and-onboarding.md) ★ | Gameplay→understanding map; the final live-repo reveal |
| [08-visual-audio-direction.md](./08-visual-audio-direction.md) | 320×200 pixel art, CRT, MIDI, neon terminal UI |
| [09-multiplayer.md](./09-multiplayer.md) | Optional co-op via asymmetric visibility (deferred) |
| [10-easter-eggs.md](./10-easter-eggs.md) | README rooms, rubber ducks, merge-conflict museum, etc. |
| [11-technical-spec.md](./11-technical-spec.md) ★ | Engine, architecture, map/save formats, performance |
| [12-build-plan-roadmap.md](./12-build-plan-roadmap.md) ★ | MVP vertical slice → milestones → deferred scope |

★ = the depth-priority areas (core mechanics & weapons, episodes/levels, trust, learning) plus the technical/build spec.

## The one-paragraph pitch

The Repository is collapsing under millions of unsupervised agents — hallucinations, broken merges, lost context. Marvin's weapons aren't guns; they're **Entire's primitives**: replay history with the **Session Replayer**, undo your own mistakes with the **Checkpoint Launcher**, trace causality with the **Trail Beacon**, evaluate the unknown with the **Runner Drone**, and make binding production calls with the **Gate Generator**. Health is replaced by **Trust** — lie to yourself and the world literally starts lying back. The finale is a single decision: ship the **YOLO Merge** with no evidence (fast, tempting, wrong), or reject it with a proper evidence-backed Gate. Win correctly and the fiction dissolves into a **live Entire repository** — you were learning to supervise real agents all along.

## Consistency contract
- [glossary.md](./glossary.md) and the mapping table in [02](./02-core-mechanics.md) are authoritative for all term ⇄ analog ⇄ weapon ⇄ enemy pairings. Other docs link, never redefine.
- All PDF concepts carry forward with none dropped: **10 regions, 5 episodes, 6 weapons, 10 enemies + boss, 4 pillars.**

## Status
- **Version:** 2.0 (spec expansion of v1 PDF). Design + technical, pre-implementation.
- **Not yet built.** No game code exists; [12](./12-build-plan-roadmap.md) defines the path from here.
- All tuning numbers ([05](./05-trust-system.md)) are playtest starting values, not final.

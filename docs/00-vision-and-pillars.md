# 00 — Vision & Design Pillars

> Expanded from the v1 PDF. Establishes *why* AgentMarvin exists and the four pillars every other design decision must serve.

## Vision

**AgentMarvin** is a retro first-person action game in the tradition of **Wolfenstein 3D, DOOM, and Chex Quest**. Its purpose is unusual: it is an **entertaining onboarding experience for Entire**. Rather than teaching Sessions, Checkpoints, Trails, Runners, and Gates through documentation, it teaches them through *gameplay* — the player internalizes Entire's mental model by using it to survive and progress.

The game must succeed **as a game first**. If it isn't fun, it won't onboard anyone. The teaching is a consequence of good mechanics, never a lecture bolted onto them.

## Core Fantasy

You play as **Agent Marvin**, an autonomous software agent exploring a **collapsing virtual Repository**. Millions of AI agents keep working without supervision, and the result is chaos: hallucinations, broken merges, lost context, and unreliable automation warp the world. Marvin's mission is to **restore trust** — not by out-shooting the chaos, but by out-*knowing* it: gathering evidence, verifying history, and making sound production decisions.

## Design Pillars

Each pillar has **concrete implications** the rest of the spec is held to.

### 1. Movement First
Fast, fluid, retro FPS movement is non-negotiable.
- *Implications:* high base move speed, responsive strafing, no sticky friction; 60fps fixed-timestep ([11](./11-technical-spec.md)); levels designed for flow. Investigation mechanics never freeze the player in menus for long.

### 2. Learn Through Play
Mechanics are used correctly *before* they are explained.
- *Implications:* every primitive is introduced by a level that can only be solved with it ([06](./06-episodes-and-levels.md)); tutorial text (if any) appears *after* the player has already done the thing; weapon acquisition == concept acquisition.

### 3. Developer Humor
Constant software-engineering jokes and easter eggs.
- *Implications:* enemy names, HUD narration, and secret rooms are steeped in dev culture ([10](./10-easter-eggs.md)); tone is affectionate and knowing, never mean; "Works on my machine," rubber ducks, commit-hash walls, merge-conflict museums.

### 4. Trust over Violence
Information and evidence are more powerful than firepower.
- *Implications:* health is replaced by **Trust** ([05](./05-trust-system.md)); five of six weapons deal no direct damage ([03](./03-weapons.md)); enemies are beaten by *exposing/countering* their failure mode ([04](./04-enemies.md)); the finale is won by *refusing* to shoot the easy button.

## What success looks like

- A player finishes the campaign and can explain, unprompted, what a Session, Checkpoint, Trail, Runner, and Gate are — because they *used* them.
- The [final reveal](./07-learning-and-onboarding.md) makes the jump from fiction to a real Entire repository feel natural, even inevitable.
- The game is shareable in one click (web-first, [11](./11-technical-spec.md)) so onboarding starts with a URL.

## Non-goals
- Not a realistic shooter; not gory; not grimdark. The collapse is *comedic-ominous*, not horror.
- Not a documentation replacement *inside* the game — the teaching is experiential; the docs live in Entire itself after the reveal.

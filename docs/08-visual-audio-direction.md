# 08 — Visual & Audio Direction

> The look and sound that sell the retro fantasy while keeping the neon-terminal, developer-humor identity. Technical constraints (resolution buffer, asset pipeline) are enforced in [11-technical-spec.md](./11-technical-spec.md).

## Visual identity

**Reference:** Wolfenstein 3D / DOOM / Chex Quest — 2.5D raycast corridors, sprite enemies, chunky pixels.

### Resolution & rendering
- **Internal resolution: 320×200**, integer-scaled up to the display (crisp pixels, no blur). Optional 320×240 "modern" mode.
- **Sprite-based enemies and items** (billboarded), textured walls, flat-shaded floors/ceilings — authentic raycaster limits embraced as style.
- **CRT filter (toggle):** scanlines, slight barrel curvature, phosphor glow. Off by default on low-end, tasteful when on.

### Palette & UI
- **Neon terminal UI:** the HUD is styled like a hacker/terminal overlay — monospace glyphs, green/cyan/magenta neon on near-black, subtle grid.
- **Per-region palettes** ([01](./01-world-and-regions.md)) so each part of the Repository reads instantly: e.g., Session Archive = cool blue solemnity; Merge Factory = hot orange sparks; Origin Server = calm white/gold.
- **Branch-labelled doors:** doors carry readable branch names (`main`, `feature/exit`, `hotfix/panic`) — both wayfinding and humor.

### Trust distortion visuals
The [Trust system](./05-trust-system.md) drives escalating visual corruption:
- **T0 Clear:** minor shimmer.
- **T1 Doubt:** false/painted doors, small UI glitches.
- **T2 Corruption:** texture tearing, phantom lighting, mislabeled maps.
- **T3 Collapse:** heavy datamosh, lying minimap, inverted cues.
These are a **rendering layer** (post-process + asset swaps), not per-level art, so any region can distort.

## Audio identity

### Music
- **MIDI/tracker-style soundtrack** — driving retro FPS energy, one **motif per region** so audio reinforces location.
- **Trust-reactive mix:** clean synth tones at high Trust; progressively **detuned/glitched** layers as Trust falls (audio mirrors the distortion tiers). At T3, cues can invert to disorient.

### SFX & voice
- Chunky retro weapon/interaction SFX; each primitive weapon has a distinct, non-aggressive signature (a "replay" shimmer, a "trace" chime, a "gate" thunk).
- **Diegetic HUD narration** in dev-humor voice — terse terminal lines ("hallucination detected, recommend replay", "context integrity nominal", "you shipped it 🎉" on the bad ending).

## Accessibility & options
- CRT filter, screen-shake, and glitch-intensity toggles (low-Trust distortion can be reduced for motion sensitivity while keeping the mechanic legible).
- Colorblind-safe accents for the Trust meter and branch labels.
- Subtitles/captions for all HUD narration and audio cues.
- Remappable controls; the investigation weapons must be reachable one-handed for [multiplayer](./09-multiplayer.md) comms.

## Asset scope for the vertical slice ([12](./12-build-plan-roadmap.md))
- One region palette (Working Directory / Session Archive), ~6 wall textures, ~4 enemy/item sprites (Hallucination Bot, Session Anchor, Context Scanner pickup, Session Replayer pickup), one MIDI track + Trust-reactive variant, T0/T1 distortion only.

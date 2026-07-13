# 10 — Developer Easter Eggs

> The [Developer Humor pillar](./00-vision-and-pillars.md) made concrete. Easter eggs reward exploration, deepen the dev-culture tone, and occasionally teach. Tone is **affectionate and knowing**, never mean.

## Placement principles
- **Every region** ([01](./01-world-and-regions.md)) hides at least one secret room or gag.
- Secrets reward the [Trust](./05-trust-system.md) economy lightly (small Trust or Context bonuses) so exploration is *encouraged*, never *required*.
- The best eggs quietly reinforce a concept (a merge-conflict museum is also a lesson).

## The catalog (from the PDF, expanded)

### Hidden README rooms
Tucked-away chambers containing a giant glowing `README.md`. Reading it grants a small Trust bonus and a genuinely useful hint about the region — a wink at "the answer was in the docs all along." Some READMEs are outdated and *lie slightly* (a low-Trust gag).

### Rubber ducks
Collectible **rubber ducks** scattered throughout. "Talking to" one (interact) makes Marvin narrate his current problem aloud — sometimes surfacing a real hint (rubber-duck debugging). A full duck collection unlocks a secret cosmetic.

### Merge conflict museum
A gallery in the **Merge Factory** ([01](./01-world-and-regions.md)) exhibiting famous/horrific merge conflicts as "artworks" (`<<<<<<< HEAD` framed on the wall). Doubles as a gentle lesson on what conflicts are and why Gates matter.

### Terminal secrets
Interactable **terminals** accept a few joke commands (`sudo make me a sandwich`, `git blame`, `rm -rf /` → politely refused). Some reveal shortcuts or lore; one hidden terminal toggles a **classic cheat-code** homage.

### Commit hash walls
Walls textured with scrolling **commit hashes**; a specific hash is a keypad code for a vault. `git log` archaeology as a puzzle.

### "Works on my machine" jokes
A recurring gag: a broken bridge/room bears a plaque "Works On My Machine ✅"; stepping on it behaves differently than it looks (a small [Trust distortion](./05-trust-system.md) joke). An achievement of the same name.

### Countless Git references
Branch-labelled doors with punny names (`feature/exit`, `hotfix/panic`, `wip/do-not-merge`), NPC agents quoting Git koans, a "detached HEAD" literally missing its head in the [Wasteland](./01-world-and-regions.md), and a boss button labeled **MERGE NOW** that is the whole [finale's](./06-episodes-and-levels.md#episode-5--production-gates-finale) temptation.

## Achievements (sampler)
- **Works On My Machine** — trigger the plaque gag.
- **Rubber Duck Debugger** — collect all ducks.
- **Read The README** — find every hidden README room.
- **git blame** — expose 50 hallucinations without attacking them.
- **YOLO (don't)** — hit MERGE NOW and get the bad ending (badge of shame, worn with pride).
- **Trust Fall** — finish an episode without dropping below T0 Clear.

## Build note
Easter eggs are **content, not systems** — they ride on existing interact/secret-room/HUD-narration mechanics, so they cost little engineering. A handful ship in the vertical slice (one README room, one rubber duck, a couple punny doors) to establish tone early ([12](./12-build-plan-roadmap.md)).

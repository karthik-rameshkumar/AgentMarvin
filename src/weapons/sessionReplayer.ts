// Session Replayer (docs/03 slot 2) — fire at a Session Anchor to replay history
// as a ghost (docs/02 §1). The ghost opens the door it once opened and reveals the
// true path; evidence is awarded when the replay completes (handled by game.ts via
// the ghost's onDone callback).

import { pickTarget, type WeaponContext } from './weapons';

const ANCHOR_RANGE = 5.0;
const ANCHOR_COS = Math.cos((30 * Math.PI) / 180);

/** Primary: replay the Session Anchor under the crosshair. */
export function replayerPrimary(ctx: WeaponContext): void {
  const anchor = pickTarget(ctx, ['session-anchor'], ANCHOR_RANGE, ANCHOR_COS);
  if (!anchor) {
    ctx.narrate('Session Replayer: aim at a Session Anchor.');
    return;
  }
  if (anchor.replayed) {
    ctx.narrate('That session has already been replayed.');
    return;
  }
  const session = ctx.sessions.find((s) => s.id === anchor.sessionId);
  if (!session) {
    ctx.narrate('Session data is missing for that anchor.');
    return;
  }
  anchor.replayed = true;
  ctx.audio.ghost();
  ctx.narrate('Replaying session — watch what history actually did.');
  ctx.spawnGhost(session);
}

/** Alt-fire (stretch): scrub. No-op for M1. */
export function replayerAlt(ctx: WeaponContext): void {
  ctx.narrate('Scrub is not available yet.');
}

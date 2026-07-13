// Context Scanner (docs/03 slot 1) — reveals the world and, crucially, exposes
// which Hallucination Bots are real vs. fake (docs/04). Exposing beats attacking:
// dispelling a fake costs nothing and yields evidence; acting on a hallucination
// (never verifying) is what costs Trust, handled where the player acts.

import type { Entity } from '../world/entities';
import { pickTarget, entityKey, type WeaponContext } from './weapons';

const CONE_RANGE = 4.0;
const CONE_COS = Math.cos((35 * Math.PI) / 180); // wide cone
const PING_RANGE = 7.0;
const PING_COS = Math.cos((10 * Math.PI) / 180); // narrow, precise

/** Reveal a single bot's nature; dispel it if it's a hallucination. */
function expose(ctx: WeaponContext, bot: Entity): boolean {
  if (bot.exposed) return false;
  bot.exposed = true;
  if (bot.real) {
    ctx.narrate('Scanner: REAL agent. This one actually touched the repo.');
    return false;
  }
  // Fake → begin dissolving; verifying it is the "right" action.
  bot.alive = false; // game loop fades it out
  const fresh = ctx.evidence.add(`expose:${entityKey(bot)}`);
  ctx.trust.change(+3, 'exposed a hallucination');
  ctx.narrate('Scanner: HALLUCINATION dispelled. Verify before you act.');
  return fresh;
}

/** Primary: wide cone that exposes every bot in front, at short range. */
export function scannerPrimary(ctx: WeaponContext): void {
  ctx.audio.scan();
  let any = false;
  for (const e of ctx.entities) {
    if (!e.alive || e.type !== 'hallucination-bot' || e.exposed) continue;
    const dx = e.pos.x - ctx.player.pos.x;
    const dy = e.pos.y - ctx.player.pos.y;
    const dist = Math.hypot(dx, dy);
    if (dist > CONE_RANGE || dist < 1e-4) continue;
    const dot = (dx / dist) * ctx.player.dir.x + (dy / dist) * ctx.player.dir.y;
    if (dot < CONE_COS) continue;
    expose(ctx, e);
    any = true;
  }
  if (!any) ctx.narrate('Scanner sweep: nothing to verify here.');
}

/** Alt-fire: precise long-range ping on the single bot under the crosshair. */
export function scannerAlt(ctx: WeaponContext): void {
  ctx.audio.ping();
  const bot = pickTarget(ctx, ['hallucination-bot'], PING_RANGE, PING_COS);
  if (!bot) {
    ctx.narrate('Ping: no target in the crosshair.');
    return;
  }
  if (bot.exposed) {
    ctx.narrate('Already verified.');
    return;
  }
  expose(ctx, bot);
}

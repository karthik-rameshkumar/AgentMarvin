// Trust distortion post-process (docs/05, docs/08). At T1 ("doubt") the world
// stops being fully trustworthy: a subtle horizontal shimmer tears across the
// framebuffer. False doors (handled in World) and the HUD glitch (CSS) complete
// the effect. T2/T3 heavier corruption is deferred to M2.

import { Framebuffer, SCREEN_W, SCREEN_H } from './framebuffer';
import type { TrustTier } from '../mechanics/trust';

/**
 * Apply distortion for the current tier. T0 is a no-op. T1 shifts a few scanlines
 * sideways by a small, time-varying amount — cheap and unmistakably "off".
 */
export function applyDistortion(fb: Framebuffer, tier: TrustTier, time: number): void {
  if (tier === 'T0') return;

  const strength = tier === 'T1' ? 1 : 2; // headroom for T2/T3 later
  const bands = 5 * strength;
  for (let b = 0; b < bands; b++) {
    // Pseudo-random band position/'shift from time; no RNG needed.
    const y = Math.floor((Math.sin(time * 1.7 + b * 12.9) * 0.5 + 0.5) * (SCREEN_H - 1));
    const shift = Math.round(Math.sin(time * 9 + b * 3.1) * 2 * strength);
    if (shift === 0) continue;
    shiftRow(fb, y, shift);
  }
}

/** Roll one scanline horizontally by `shift` pixels (wrapping). */
function shiftRow(fb: Framebuffer, y: number, shift: number): void {
  if (y < 0 || y >= SCREEN_H) return;
  const row = y * SCREEN_W;
  const copy = fb.buf.slice(row, row + SCREEN_W);
  for (let x = 0; x < SCREEN_W; x++) {
    const src = (x - shift + SCREEN_W) % SCREEN_W;
    fb.buf[row + x] = copy[src]!;
  }
}

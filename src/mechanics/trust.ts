// Trust — the health replacement (docs/05). A 0-100 pool whose tier drives world
// distortion. M1 ships T0/T1 only; the low end is clamped so the slice teaches
// without a hard-fail state (full tiers + Checkpoint recovery are M2).

export type TrustTier = 'T0' | 'T1' | 'below';

export interface TrustChange {
  value: number;
  tier: TrustTier;
  /** True if this change moved between tiers. */
  crossedTier: boolean;
  delta: number;
  reason?: string;
}

/** Tier for a given trust value (docs/05: T0 >=75, T1 50-74, below <50). */
export function tierFor(value: number): TrustTier {
  if (value >= 75) return 'T0';
  if (value >= 50) return 'T1';
  return 'below';
}

export class Trust {
  value: number;
  /** Slice clamp: Trust can't drop below this (keeps us in T0/T1). */
  readonly floor: number;

  constructor(start = 100, floor = 50) {
    this.floor = floor;
    this.value = Math.max(floor, Math.min(100, start));
  }

  get tier(): TrustTier {
    return tierFor(this.value);
  }

  /** Apply a delta (clamped). Returns the resulting state + whether a tier changed. */
  change(delta: number, reason?: string): TrustChange {
    const before = this.tier;
    this.value = Math.max(this.floor, Math.min(100, this.value + delta));
    const tier = this.tier;
    return { value: this.value, tier, crossedTier: tier !== before, delta, reason };
  }
}

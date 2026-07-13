// Gates (docs/02 §5) — the ultimate mechanic. The training Gate always opens
// (M1), but the *decision* and the evidence behind it move Trust, which is the
// lesson. `evaluateGate` is pure so the outcomes are unit-tested.

import type { GateDecision } from '../world/types';

export interface GateOutcome {
  decision: GateDecision;
  /** The training Gate always opens; the decision is what carries weight. */
  opened: boolean;
  /** Promote with zero evidence — the anti-pattern the whole game warns about. */
  yolo: boolean;
  /** Sound call, backed by enough evidence. */
  correct: boolean;
  trustDelta: number;
  message: string;
}

export function evaluateGate(
  decision: GateDecision,
  evidenceCount: number,
  requiredEvidence: number,
  soundDecision: GateDecision,
): GateOutcome {
  const base = { decision, opened: true };

  if (decision === 'promote' && evidenceCount === 0) {
    return {
      ...base,
      yolo: true,
      correct: false,
      trustDelta: -30,
      message: 'YOLO MERGE: shipped to production with zero evidence. Trust collapses.',
    };
  }

  if (decision === soundDecision && evidenceCount >= requiredEvidence) {
    return {
      ...base,
      yolo: false,
      correct: true,
      trustDelta: +25,
      message: 'Evidence-backed decision. This is how you ship. Trust restored.',
    };
  }

  if (evidenceCount < requiredEvidence) {
    return {
      ...base,
      yolo: false,
      correct: false,
      trustDelta: -10,
      message: 'Not enough evidence to be sure of that call.',
    };
  }

  return {
    ...base,
    yolo: false,
    correct: false,
    trustDelta: -5,
    message: 'The evidence did not support that decision.',
  };
}

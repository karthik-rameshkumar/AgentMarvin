import { describe, it, expect } from 'vitest';
import { evaluateGate } from '../src/mechanics/gates';

describe('evaluateGate (docs/02 §5)', () => {
  it('flags a YOLO merge: promote with zero evidence', () => {
    const o = evaluateGate('promote', 0, 1, 'promote');
    expect(o.yolo).toBe(true);
    expect(o.correct).toBe(false);
    expect(o.trustDelta).toBeLessThan(0);
    expect(o.opened).toBe(true); // training gate always opens
  });

  it('rewards the sound decision backed by enough evidence', () => {
    const o = evaluateGate('promote', 2, 1, 'promote');
    expect(o.correct).toBe(true);
    expect(o.trustDelta).toBeGreaterThan(0);
  });

  it('penalizes insufficient evidence (but not as a YOLO)', () => {
    const o = evaluateGate('reject', 0, 2, 'reject');
    expect(o.yolo).toBe(false);
    expect(o.correct).toBe(false);
    expect(o.trustDelta).toBe(-10);
  });

  it('penalizes an unsound call even with enough evidence', () => {
    const o = evaluateGate('reject', 3, 1, 'promote');
    expect(o.correct).toBe(false);
    expect(o.yolo).toBe(false);
    expect(o.trustDelta).toBe(-5);
  });
});

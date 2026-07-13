import { describe, it, expect } from 'vitest';
import { Trust, tierFor } from '../src/mechanics/trust';

describe('tierFor', () => {
  it('maps values to T0/T1/below (docs/05)', () => {
    expect(tierFor(100)).toBe('T0');
    expect(tierFor(75)).toBe('T0');
    expect(tierFor(74)).toBe('T1');
    expect(tierFor(50)).toBe('T1');
    expect(tierFor(49)).toBe('below');
  });
});

describe('Trust', () => {
  it('starts clamped into [floor,100]', () => {
    expect(new Trust(120).value).toBe(100);
    expect(new Trust(10, 50).value).toBe(50);
  });

  it('clamps at the slice floor so it stays in T0/T1', () => {
    const t = new Trust(100, 50);
    const c = t.change(-90, 'big hit');
    expect(c.value).toBe(50);
    expect(c.tier).toBe('T1');
  });

  it('does not exceed 100', () => {
    const t = new Trust(95);
    expect(t.change(+20).value).toBe(100);
  });

  it('reports tier crossings', () => {
    const t = new Trust(100);
    expect(t.change(-30).crossedTier).toBe(true); // 100 (T0) -> 70 (T1)
    expect(t.change(-5).crossedTier).toBe(false); // 70 -> 65, still T1
    expect(t.change(+20).crossedTier).toBe(true); // 65 -> 85, back to T0
  });
});

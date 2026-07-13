import { describe, it, expect } from 'vitest';
import { Evidence } from '../src/mechanics/evidence';

describe('Evidence', () => {
  it('adds unique sources and counts them', () => {
    const e = new Evidence();
    expect(e.add('session:a')).toBe(true);
    expect(e.add('expose:5,3')).toBe(true);
    expect(e.count).toBe(2);
  });

  it('does not double-count the same source', () => {
    const e = new Evidence();
    e.add('session:a');
    expect(e.add('session:a')).toBe(false);
    expect(e.count).toBe(1);
  });

  it('has() checks a threshold', () => {
    const e = new Evidence();
    e.add('a');
    expect(e.has(1)).toBe(true);
    expect(e.has(2)).toBe(false);
  });

  it('spend() consumes tokens or fails cleanly', () => {
    const e = new Evidence();
    e.add('a');
    e.add('b');
    expect(e.spend(3)).toBe(false);
    expect(e.count).toBe(2);
    expect(e.spend(2)).toBe(true);
    expect(e.count).toBe(0);
  });
});

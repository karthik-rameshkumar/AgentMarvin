import { describe, it, expect } from 'vitest';
import { castRay } from '../src/render/raycaster';

// A 5x5 grid ringed by walls (id 1), open interior.
//  y=0: 1 1 1 1 1
//  y=1: 1 0 0 0 1
//  y=2: 1 0 0 0 1
//  y=3: 1 0 0 0 1
//  y=4: 1 1 1 1 1
const grid = [
  1, 1, 1, 1, 1,
  1, 0, 0, 0, 1,
  1, 0, 0, 0, 1,
  1, 0, 0, 0, 1,
  1, 1, 1, 1, 1,
];
const W = 5;
const solidAt = (x: number, y: number): number => {
  if (x < 0 || y < 0 || x >= W || y >= 5) return 1;
  return grid[y * W + x] ?? 0;
};

describe('castRay (DDA)', () => {
  it('hits the east wall at the expected distance', () => {
    // Stand at center of tile (1,2), fire east (+x). Wall face at x=4.
    const hit = castRay(solidAt, 1.5, 2.5, 1, 0);
    expect(hit).not.toBeNull();
    expect(hit!.mapX).toBe(4);
    expect(hit!.side).toBe(0);
    expect(hit!.dist).toBeCloseTo(2.5, 5);
  });

  it('hits the north wall firing up (-y)', () => {
    // From y=3.5 the wall tile is y=0; its bottom face is at y=1.0 → dist 2.5.
    const hit = castRay(solidAt, 2.5, 3.5, 0, -1);
    expect(hit).not.toBeNull();
    expect(hit!.mapY).toBe(0);
    expect(hit!.side).toBe(1);
    expect(hit!.dist).toBeCloseTo(2.5, 5);
  });

  it('computes a wallX texture coordinate in [0,1)', () => {
    const hit = castRay(solidAt, 1.2, 2.5, 1, 0);
    expect(hit!.wallX).toBeGreaterThanOrEqual(0);
    expect(hit!.wallX).toBeLessThan(1);
  });

  it('returns null when no wall is within maxSteps', () => {
    const openWorld = (): number => 0;
    expect(castRay(openWorld, 1.5, 1.5, 1, 0, 8)).toBeNull();
  });
});

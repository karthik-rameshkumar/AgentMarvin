import { describe, it, expect } from 'vitest';
import { parseMap, World } from '../src/world/map';
import { DOOR_TILE } from '../src/render/raycaster';
import rawMap from '../public/maps/working-directory.json';

describe('parseMap', () => {
  it('parses the shipped working-directory map', () => {
    const m = parseMap(rawMap);
    expect(m.id).toBe('0-0');
    expect(m.grid.width * m.grid.height).toBe(m.grid.tiles.length);
  });

  it('rejects a grid whose tile count mismatches width*height', () => {
    expect(() =>
      parseMap({
        id: 'x',
        region: 'r',
        palette: 'p',
        grid: { width: 2, height: 2, tiles: [0, 0, 0] },
      }),
    ).toThrow(/expected 4/);
  });

  it('rejects missing grid', () => {
    expect(() => parseMap({ id: 'x', region: 'r', palette: 'p' })).toThrow(/grid/);
  });
});

describe('World', () => {
  const world = new World(parseMap(rawMap));

  it('treats border tiles as solid and open interior as passable', () => {
    expect(world.solidAt(0, 0)).toBeGreaterThan(0); // corner wall
    expect(world.isBlocked(3.5, 7.5)).toBe(false); // spawn tile
  });

  it('treats out-of-bounds as solid', () => {
    expect(world.tileAt(-1, 5)).toBe(1);
    expect(world.isBlocked(-1, 5)).toBe(true);
  });

  it('reports a closed door as solid, then passable once opened', () => {
    const w = new World(parseMap(rawMap));
    expect(w.solidAt(10, 7)).toBe(DOOR_TILE);
    // Stand just left of the door facing +x and open it.
    const result = w.tryOpenDoor({ x: 9.5, y: 7.5 }, { x: 1, y: 0 });
    expect(result).toBe('opened');
    expect(w.solidAt(10, 7)).toBe(0);
  });

  it('does nothing when no door is in front', () => {
    const w = new World(parseMap(rawMap));
    expect(w.tryOpenDoor({ x: 3.5, y: 7.5 }, { x: 0, y: -1 })).toBe('none');
  });
});

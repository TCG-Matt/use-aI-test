import { describe, it, expect, beforeEach } from 'vitest';
import { updateVisibility, isInViewRadius, hasLineOfSight, getDistance } from './fog-of-war';
import type { Dungeon, Position, Tile, TileType, VisibilityState } from './types';

describe('Fog of War', () => {
  let dungeon: Dungeon;

  beforeEach(() => {
    // Create a simple 20x20 dungeon for testing
    const tiles: Tile[][] = Array(20)
      .fill(null)
      .map((_, y) =>
        Array(20)
          .fill(null)
          .map((_, x) => ({
            position: { x, y },
            type: 'floor' as TileType,
            visibility: 'unexplored' as VisibilityState,
          }))
      );

    // Add some walls
    for (let x = 0; x < 20; x++) {
      tiles[0][x].type = 'wall';
      tiles[19][x].type = 'wall';
    }
    for (let y = 0; y < 20; y++) {
      tiles[y][0].type = 'wall';
      tiles[y][19].type = 'wall';
    }

    dungeon = {
      level: 1,
      width: 20,
      height: 20,
      tiles,
      rooms: [{ x: 5, y: 5, width: 10, height: 10 }],
      corridors: [],
    };
  });

  describe('getDistance', () => {
    it('should calculate distance between two positions', () => {
      const pos1: Position = { x: 0, y: 0 };
      const pos2: Position = { x: 3, y: 4 };
      expect(getDistance(pos1, pos2)).toBe(5);
    });

    it('should return 0 for same position', () => {
      const pos: Position = { x: 5, y: 5 };
      expect(getDistance(pos, pos)).toBe(0);
    });

    it('should calculate horizontal distance', () => {
      const pos1: Position = { x: 0, y: 0 };
      const pos2: Position = { x: 5, y: 0 };
      expect(getDistance(pos1, pos2)).toBe(5);
    });

    it('should calculate vertical distance', () => {
      const pos1: Position = { x: 0, y: 0 };
      const pos2: Position = { x: 0, y: 5 };
      expect(getDistance(pos1, pos2)).toBe(5);
    });
  });

  describe('isInViewRadius', () => {
    it('should return true for positions within radius', () => {
      const center: Position = { x: 10, y: 10 };
      const target: Position = { x: 12, y: 12 };
      expect(isInViewRadius(center, target, 5)).toBe(true);
    });

    it('should return false for positions outside radius', () => {
      const center: Position = { x: 10, y: 10 };
      const target: Position = { x: 20, y: 20 };
      expect(isInViewRadius(center, target, 5)).toBe(false);
    });

    it('should return true for positions exactly on radius', () => {
      const center: Position = { x: 10, y: 10 };
      const target: Position = { x: 15, y: 10 };
      expect(isInViewRadius(center, target, 5)).toBe(true);
    });
  });

  describe('hasLineOfSight', () => {
    it('should return true for clear line of sight', () => {
      const from: Position = { x: 5, y: 5 };
      const to: Position = { x: 10, y: 5 };
      expect(hasLineOfSight(from, to, dungeon)).toBe(true);
    });

    it('should return false when wall blocks sight', () => {
      // Place a wall between two positions
      dungeon.tiles[10][10].type = 'wall';
      const from: Position = { x: 8, y: 10 };
      const to: Position = { x: 12, y: 10 };
      expect(hasLineOfSight(from, to, dungeon)).toBe(false);
    });

    it('should return true for same position', () => {
      const pos: Position = { x: 10, y: 10 };
      expect(hasLineOfSight(pos, pos, dungeon)).toBe(true);
    });

    it('should handle diagonal lines of sight', () => {
      const from: Position = { x: 5, y: 5 };
      const to: Position = { x: 10, y: 10 };
      expect(hasLineOfSight(from, to, dungeon)).toBe(true);
    });
  });

  describe('updateVisibility', () => {
    it('should set tiles within radius to visible', () => {
      const playerPos: Position = { x: 10, y: 10 };
      updateVisibility(dungeon, playerPos, 5);

      const centerTile = dungeon.tiles[10][10];
      expect(centerTile.visibility).toBe('visible');
    });

    it('should set tiles outside radius to unexplored', () => {
      const playerPos: Position = { x: 10, y: 10 };
      updateVisibility(dungeon, playerPos, 5);

      const farTile = dungeon.tiles[1][1];
      expect(farTile.visibility).toBe('unexplored');
    });

    it('should keep previously seen tiles as explored', () => {
      const playerPos1: Position = { x: 10, y: 10 };
      updateVisibility(dungeon, playerPos1, 5);

      const tile = dungeon.tiles[12][12];
      expect(tile.visibility).toBe('visible');

      // Move player away
      const playerPos2: Position = { x: 5, y: 5 };
      updateVisibility(dungeon, playerPos2, 5);

      // Tile should now be explored (not visible, but not unexplored)
      expect(tile.visibility).toBe('explored');
    });

    it('should not see through walls', () => {
      // Place a wall
      dungeon.tiles[10][8].type = 'wall';

      const playerPos: Position = { x: 10, y: 10 };
      updateVisibility(dungeon, playerPos, 5);

      // Tile behind wall should not be visible
      const behindWall = dungeon.tiles[10][6];
      expect(behindWall.visibility).not.toBe('visible');
    });

    it('should handle edge cases at dungeon boundaries', () => {
      const playerPos: Position = { x: 1, y: 1 };
      expect(() => updateVisibility(dungeon, playerPos, 5)).not.toThrow();
    });

    it('should update visibility in a circular pattern', () => {
      const playerPos: Position = { x: 10, y: 10 };
      updateVisibility(dungeon, playerPos, 3);

      // Count visible tiles
      let visibleCount = 0;
      for (let y = 7; y <= 13; y++) {
        for (let x = 7; x <= 13; x++) {
          if (dungeon.tiles[y][x].visibility === 'visible') {
            visibleCount++;
          }
        }
      }

      // Should have visible tiles (circular pattern, not square)
      expect(visibleCount).toBeGreaterThan(0);
      expect(visibleCount).toBeLessThan(49); // Less than 7x7 square
    });
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { moveTowardsPlayer, canSeePlayer, createMob, damageMob } from './mob';
import type { Dungeon, Mob, Tile, TileType, VisibilityState } from '../types';

describe('Mob Entity', () => {
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

    dungeon = {
      level: 1,
      width: 20,
      height: 20,
      tiles,
      rooms: [],
      corridors: [],
    };
  });

  describe('createMob', () => {
    it('should create a goblin', () => {
      const mob = createMob('goblin', { x: 10, y: 10 }, 1);
      expect(mob.type).toBe('goblin');
      expect(mob.position).toEqual({ x: 10, y: 10 });
      expect(mob.health).toBeGreaterThan(0);
      expect(mob.strength).toBeGreaterThan(0);
    });

    it('should scale with level', () => {
      const mob1 = createMob('goblin', { x: 10, y: 10 }, 1);
      const mob2 = createMob('goblin', { x: 10, y: 10 }, 5);
      expect(mob2.health).toBeGreaterThan(mob1.health);
      expect(mob2.strength).toBeGreaterThan(mob1.strength);
    });

    it('should create different mob types', () => {
      const goblin = createMob('goblin', { x: 10, y: 10 }, 1);
      const skeleton = createMob('skeleton', { x: 10, y: 10 }, 1);
      const troll = createMob('troll', { x: 10, y: 10 }, 1);
      const dragon = createMob('dragon', { x: 10, y: 10 }, 1);

      expect(goblin.type).toBe('goblin');
      expect(skeleton.type).toBe('skeleton');
      expect(troll.type).toBe('troll');
      expect(dragon.type).toBe('dragon');

      // Dragons should be stronger than goblins
      expect(dragon.health).toBeGreaterThan(goblin.health);
      expect(dragon.strength).toBeGreaterThan(goblin.strength);
    });
  });

  describe('canSeePlayer', () => {
    it('should see player within view range', () => {
      const mob: Mob = {
        id: 'mob1',
        position: { x: 10, y: 10 },
        health: 30,
        strength: 5,
        viewRange: 7,
        type: 'goblin',
        drops: [],
      };
      const playerPos = { x: 12, y: 12 };
      expect(canSeePlayer(mob, playerPos, dungeon)).toBe(true);
    });

    it('should not see player outside view range', () => {
      const mob: Mob = {
        id: 'mob1',
        position: { x: 10, y: 10 },
        health: 30,
        strength: 5,
        viewRange: 3,
        type: 'goblin',
        drops: [],
      };
      const playerPos = { x: 18, y: 18 };
      expect(canSeePlayer(mob, playerPos, dungeon)).toBe(false);
    });

    it('should not see player through walls', () => {
      // Place a wall between mob and player
      for (let x = 0; x < 20; x++) {
        dungeon.tiles[12][x].type = 'wall';
      }
      const mob: Mob = {
        id: 'mob1',
        position: { x: 10, y: 10 },
        health: 30,
        strength: 5,
        viewRange: 10,
        type: 'goblin',
        drops: [],
      };
      const playerPos = { x: 10, y: 15 };
      expect(canSeePlayer(mob, playerPos, dungeon)).toBe(false);
    });
  });

  describe('moveTowardsPlayer', () => {
    it('should move towards player horizontally', () => {
      const mob: Mob = {
        id: 'mob1',
        position: { x: 10, y: 10 },
        health: 30,
        strength: 5,
        viewRange: 7,
        type: 'goblin',
        drops: [],
      };
      const playerPos = { x: 15, y: 10 };
      const newPos = moveTowardsPlayer(mob, playerPos, dungeon);
      expect(newPos.x).toBeGreaterThan(mob.position.x);
      expect(newPos.y).toBe(mob.position.y);
    });

    it('should move towards player vertically', () => {
      const mob: Mob = {
        id: 'mob1',
        position: { x: 10, y: 10 },
        health: 30,
        strength: 5,
        viewRange: 7,
        type: 'goblin',
        drops: [],
      };
      const playerPos = { x: 10, y: 15 };
      const newPos = moveTowardsPlayer(mob, playerPos, dungeon);
      expect(newPos.x).toBe(mob.position.x);
      expect(newPos.y).toBeGreaterThan(mob.position.y);
    });

    it('should not move through walls', () => {
      dungeon.tiles[10][11].type = 'wall';
      const mob: Mob = {
        id: 'mob1',
        position: { x: 10, y: 10 },
        health: 30,
        strength: 5,
        viewRange: 7,
        type: 'goblin',
        drops: [],
      };
      const playerPos = { x: 15, y: 10 };
      const newPos = moveTowardsPlayer(mob, playerPos, dungeon);
      // Should stay in place or move around wall
      expect(newPos.x).toBe(mob.position.x);
    });

    it('should stay in place when at player position', () => {
      const mob: Mob = {
        id: 'mob1',
        position: { x: 10, y: 10 },
        health: 30,
        strength: 5,
        viewRange: 7,
        type: 'goblin',
        drops: [],
      };
      const playerPos = { x: 10, y: 10 };
      const newPos = moveTowardsPlayer(mob, playerPos, dungeon);
      expect(newPos).toEqual(mob.position);
    });
  });

  describe('damageMob', () => {
    it('should reduce mob health', () => {
      const mob: Mob = {
        id: 'mob1',
        position: { x: 10, y: 10 },
        health: 30,
        strength: 5,
        viewRange: 7,
        type: 'goblin',
        drops: [],
      };
      const damagedMob = damageMob(mob, 10);
      expect(damagedMob.health).toBe(20);
    });

    it('should not reduce health below 0', () => {
      const mob: Mob = {
        id: 'mob1',
        position: { x: 10, y: 10 },
        health: 5,
        strength: 5,
        viewRange: 7,
        type: 'goblin',
        drops: [],
      };
      const damagedMob = damageMob(mob, 10);
      expect(damagedMob.health).toBe(0);
    });
  });
});

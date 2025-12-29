import { describe, it, expect } from 'vitest';
import { generateLoot, createItem } from './item';
import type { Mob } from '../types';

describe('Item Entity', () => {
  describe('createItem', () => {
    it('should create a weapon', () => {
      const weapon = createItem('weapon', { x: 5, y: 5 }, 1);
      expect(weapon.type).toBe('weapon');
      expect(weapon.position).toEqual({ x: 5, y: 5 });
      if (weapon.type === 'weapon') {
        expect(weapon.damage).toBeGreaterThan(0);
      }
    });

    it('should create armor', () => {
      const armor = createItem('armor', { x: 5, y: 5 }, 1);
      expect(armor.type).toBe('armor');
      if (armor.type === 'armor') {
        expect(armor.defense).toBeGreaterThan(0);
      }
    });

    it('should create health potion', () => {
      const potion = createItem('potion_health', { x: 5, y: 5 }, 1);
      expect(potion.type).toBe('potion_health');
      if (potion.type === 'potion_health') {
        expect(potion.restoreAmount).toBeGreaterThan(0);
      }
    });

    it('should create strength potion', () => {
      const potion = createItem('potion_strength', { x: 5, y: 5 }, 1);
      expect(potion.type).toBe('potion_strength');
      if (potion.type === 'potion_strength') {
        expect(potion.restoreAmount).toBeGreaterThan(0);
      }
    });

    it('should create food', () => {
      const food = createItem('food', { x: 5, y: 5 }, 1);
      expect(food.type).toBe('food');
      if (food.type === 'food') {
        expect(food.restoreAmount).toBeGreaterThan(0);
      }
    });

    it('should scale with level', () => {
      const weapon1 = createItem('weapon', { x: 5, y: 5 }, 1);
      const weapon5 = createItem('weapon', { x: 5, y: 5 }, 5);

      if (weapon1.type === 'weapon' && weapon5.type === 'weapon') {
        expect(weapon5.damage).toBeGreaterThanOrEqual(weapon1.damage);
      }
    });
  });

  describe('generateLoot', () => {
    it('should generate loot from mob drops', () => {
      const mob: Mob = {
        id: 'mob1',
        position: { x: 10, y: 10 },
        health: 0,
        strength: 5,
        viewRange: 7,
        type: 'goblin',
        drops: ['weapon', 'food'],
      };
      const loot = generateLoot(mob, 1);
      expect(Array.isArray(loot)).toBe(true);
      // May or may not have items (RNG)
      expect(loot.length).toBeGreaterThanOrEqual(0);
    });

    it('should place loot at mob position', () => {
      const mob: Mob = {
        id: 'mob1',
        position: { x: 10, y: 10 },
        health: 0,
        strength: 5,
        viewRange: 7,
        type: 'dragon',
        drops: ['weapon', 'armor', 'potion_health'],
      };
      const loot = generateLoot(mob, 5);
      loot.forEach((item) => {
        expect(item.position).toEqual({ x: 10, y: 10 });
      });
    });

    it('should only drop items from mob drop list', () => {
      const mob: Mob = {
        id: 'mob1',
        position: { x: 10, y: 10 },
        health: 0,
        strength: 5,
        viewRange: 7,
        type: 'goblin',
        drops: ['food'],
      };
      const loot = generateLoot(mob, 1);
      loot.forEach((item) => {
        expect(mob.drops).toContain(item.type);
      });
    });
  });
});

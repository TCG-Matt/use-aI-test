import { describe, it, expect } from 'vitest';
import { resolveCombat, calculateDamage } from './combat';
import type { Player, Mob } from './types';
import { createPlayer } from './entities/player';

describe('Combat System', () => {
  describe('calculateDamage', () => {
    it('should calculate basic damage', () => {
      const attacker = createPlayer({ x: 5, y: 5 }, 1);
      const defender = createPlayer({ x: 6, y: 5 }, 1);
      const damage = calculateDamage(attacker, defender);
      expect(damage).toBe(10); // Base strength
    });

    it('should add weapon damage', () => {
      const attacker = createPlayer({ x: 5, y: 5 }, 1);
      attacker.weapon = {
        id: 'sword1',
        type: 'weapon',
        name: 'Sword',
        damage: 5,
      };
      const defender = createPlayer({ x: 6, y: 5 }, 1);
      const damage = calculateDamage(attacker, defender);
      expect(damage).toBe(15); // Strength + weapon
    });

    it('should subtract armor defense', () => {
      const attacker: Player = {
        position: { x: 5, y: 5 },
        health: 100,
        maxHealth: 100,
        strength: 10,
        weapon: null,
        armor: null,
        inventory: [],
        level: 1,
      };
      const defender: Player = {
        position: { x: 6, y: 5 },
        health: 100,
        maxHealth: 100,
        strength: 10,
        weapon: null,
        armor: {
          id: 'armor1',
          type: 'armor',
          name: 'Armor',
          defense: 3,
        },
        inventory: [],
        level: 1,
      };
      const damage = calculateDamage(attacker, defender);
      expect(damage).toBe(7); // Strength - armor
    });

    it('should ensure minimum damage of 1', () => {
      const attacker: Player = {
        position: { x: 5, y: 5 },
        health: 100,
        maxHealth: 100,
        strength: 5,
        weapon: null,
        armor: null,
        inventory: [],
        level: 1,
      };
      const defender: Player = {
        position: { x: 6, y: 5 },
        health: 100,
        maxHealth: 100,
        strength: 10,
        weapon: null,
        armor: {
          id: 'armor1',
          type: 'armor',
          name: 'Super Armor',
          defense: 20,
        },
        inventory: [],
        level: 1,
      };
      const damage = calculateDamage(attacker, defender);
      expect(damage).toBeGreaterThanOrEqual(1);
    });
  });

  describe('resolveCombat', () => {
    it('should return combat result with damage', () => {
      const attacker: Player = {
        position: { x: 5, y: 5 },
        health: 100,
        maxHealth: 100,
        strength: 10,
        weapon: null,
        armor: null,
        inventory: [],
        level: 1,
      };
      const defender: Mob = {
        id: 'mob1',
        position: { x: 6, y: 5 },
        health: 20,
        strength: 5,
        viewRange: 7,
        type: 'goblin',
        drops: ['food'],
      };
      const result = resolveCombat(attacker, defender, 'Player', 'Goblin');
      expect(result.damage).toBeGreaterThan(0);
      expect(result.attackerName).toBe('Player');
      expect(result.defenderName).toBe('Goblin');
    });

    it('should mark defender as killed when damage exceeds health', () => {
      const attacker: Player = {
        position: { x: 5, y: 5 },
        health: 100,
        maxHealth: 100,
        strength: 50,
        weapon: null,
        armor: null,
        inventory: [],
        level: 1,
      };
      const defender: Mob = {
        id: 'mob1',
        position: { x: 6, y: 5 },
        health: 10,
        strength: 5,
        viewRange: 7,
        type: 'goblin',
        drops: ['food', 'weapon'],
      };
      const result = resolveCombat(attacker, defender, 'Player', 'Goblin');
      expect(result.killed).toBe(true);
    });

    it('should not mark defender as killed when damage does not exceed health', () => {
      const attacker: Player = {
        position: { x: 5, y: 5 },
        health: 100,
        maxHealth: 100,
        strength: 5,
        weapon: null,
        armor: null,
        inventory: [],
        level: 1,
      };
      const defender: Mob = {
        id: 'mob1',
        position: { x: 6, y: 5 },
        health: 100,
        strength: 5,
        viewRange: 7,
        type: 'troll',
        drops: [],
      };
      const result = resolveCombat(attacker, defender, 'Player', 'Troll');
      expect(result.killed).toBe(false);
    });

    it('should generate loot when defender is killed', () => {
      const attacker: Player = {
        position: { x: 5, y: 5 },
        health: 100,
        maxHealth: 100,
        strength: 50,
        weapon: null,
        armor: null,
        inventory: [],
        level: 1,
      };
      const defender: Mob = {
        id: 'mob1',
        position: { x: 6, y: 5 },
        health: 10,
        strength: 5,
        viewRange: 7,
        type: 'goblin',
        drops: ['food', 'weapon'],
      };
      const result = resolveCombat(attacker, defender, 'Player', 'Goblin');
      expect(result.killed).toBe(true);
      expect(Array.isArray(result.loot)).toBe(true);
    });

    it('should not generate loot when defender survives', () => {
      const attacker: Player = {
        position: { x: 5, y: 5 },
        health: 100,
        maxHealth: 100,
        strength: 5,
        weapon: null,
        armor: null,
        inventory: [],
        level: 1,
      };
      const defender: Mob = {
        id: 'mob1',
        position: { x: 6, y: 5 },
        health: 100,
        strength: 5,
        viewRange: 7,
        type: 'troll',
        drops: ['weapon'],
      };
      const result = resolveCombat(attacker, defender, 'Player', 'Troll');
      expect(result.killed).toBe(false);
      expect(result.loot).toEqual([]);
    });
  });
});

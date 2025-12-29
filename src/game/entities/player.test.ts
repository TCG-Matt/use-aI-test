import { describe, it, expect } from 'vitest';
import { createPlayer, equipWeapon, equipArmor, addToInventory, canCarryMore } from './player';
import type { Weapon, Armor, Item } from '../types';

describe('Player Entity', () => {
  describe('createPlayer', () => {
    it('should create a player with default stats', () => {
      const player = createPlayer({ x: 5, y: 5 }, 1);
      expect(player.health).toBe(100);
      expect(player.maxHealth).toBe(100);
      expect(player.strength).toBe(10);
      expect(player.position).toEqual({ x: 5, y: 5 });
      expect(player.level).toBe(1);
      expect(player.weapon).toBeNull();
      expect(player.armor).toBeNull();
      expect(player.inventory).toEqual([]);
    });

    it('should create player at specified position', () => {
      const player = createPlayer({ x: 10, y: 15 }, 2);
      expect(player.position.x).toBe(10);
      expect(player.position.y).toBe(15);
      expect(player.level).toBe(2);
    });
  });

  describe('equipWeapon', () => {
    it('should equip a weapon', () => {
      const player = createPlayer({ x: 5, y: 5 }, 1);
      const weapon: Weapon = {
        id: 'sword1',
        type: 'weapon',
        name: 'Sword',
        damage: 5,
      };
      const updatedPlayer = equipWeapon(player, weapon);
      expect(updatedPlayer.weapon).toEqual(weapon);
    });

    it('should replace existing weapon', () => {
      const player = createPlayer({ x: 5, y: 5 }, 1);
      const weapon1: Weapon = {
        id: 'sword1',
        type: 'weapon',
        name: 'Sword',
        damage: 5,
      };
      const weapon2: Weapon = {
        id: 'sword2',
        type: 'weapon',
        name: 'Better Sword',
        damage: 10,
      };
      const withWeapon1 = equipWeapon(player, weapon1);
      const withWeapon2 = equipWeapon(withWeapon1, weapon2);
      expect(withWeapon2.weapon).toEqual(weapon2);
    });

    it('should return old weapon to inventory when replacing', () => {
      const player = createPlayer({ x: 5, y: 5 }, 1);
      const weapon1: Weapon = {
        id: 'sword1',
        type: 'weapon',
        name: 'Sword',
        damage: 5,
      };
      const weapon2: Weapon = {
        id: 'sword2',
        type: 'weapon',
        name: 'Better Sword',
        damage: 10,
      };
      const withWeapon1 = equipWeapon(player, weapon1);
      const withWeapon2 = equipWeapon(withWeapon1, weapon2);
      expect(withWeapon2.inventory).toContainEqual(weapon1);
    });
  });

  describe('equipArmor', () => {
    it('should equip armor', () => {
      const player = createPlayer({ x: 5, y: 5 }, 1);
      const armor: Armor = {
        id: 'armor1',
        type: 'armor',
        name: 'Leather Armor',
        defense: 3,
      };
      const updatedPlayer = equipArmor(player, armor);
      expect(updatedPlayer.armor).toEqual(armor);
    });

    it('should replace existing armor', () => {
      const player = createPlayer({ x: 5, y: 5 }, 1);
      const armor1: Armor = {
        id: 'armor1',
        type: 'armor',
        name: 'Leather Armor',
        defense: 3,
      };
      const armor2: Armor = {
        id: 'armor2',
        type: 'armor',
        name: 'Iron Armor',
        defense: 8,
      };
      const withArmor1 = equipArmor(player, armor1);
      const withArmor2 = equipArmor(withArmor1, armor2);
      expect(withArmor2.armor).toEqual(armor2);
    });

    it('should return old armor to inventory when replacing', () => {
      const player = createPlayer({ x: 5, y: 5 }, 1);
      const armor1: Armor = {
        id: 'armor1',
        type: 'armor',
        name: 'Leather Armor',
        defense: 3,
      };
      const armor2: Armor = {
        id: 'armor2',
        type: 'armor',
        name: 'Iron Armor',
        defense: 8,
      };
      const withArmor1 = equipArmor(player, armor1);
      const withArmor2 = equipArmor(withArmor1, armor2);
      expect(withArmor2.inventory).toContainEqual(armor1);
    });
  });

  describe('addToInventory', () => {
    it('should add item to inventory', () => {
      const player = createPlayer({ x: 5, y: 5 }, 1);
      const item: Item = {
        id: 'potion1',
        type: 'potion_health',
        name: 'Health Potion',
        restoreAmount: 20,
      };
      const updatedPlayer = addToInventory(player, item);
      expect(updatedPlayer.inventory).toContainEqual(item);
      expect(updatedPlayer.inventory.length).toBe(1);
    });

    it('should add multiple items', () => {
      let player = createPlayer({ x: 5, y: 5 }, 1);
      const item1: Item = {
        id: 'potion1',
        type: 'potion_health',
        name: 'Health Potion',
        restoreAmount: 20,
      };
      const item2: Item = {
        id: 'food1',
        type: 'food',
        name: 'Bread',
        restoreAmount: 10,
      };
      player = addToInventory(player, item1);
      player = addToInventory(player, item2);
      expect(player.inventory.length).toBe(2);
    });
  });

  describe('canCarryMore', () => {
    it('should return true when inventory is not full', () => {
      const player = createPlayer({ x: 5, y: 5 }, 1);
      expect(canCarryMore(player)).toBe(true);
    });

    it('should return false when inventory is full', () => {
      let player = createPlayer({ x: 5, y: 5 }, 1);
      // Max inventory is 20 items
      for (let i = 0; i < 20; i++) {
        const item: Item = {
          id: `item${i}`,
          type: 'food',
          name: 'Item',
          restoreAmount: 10,
        };
        player = addToInventory(player, item);
      }
      expect(canCarryMore(player)).toBe(false);
    });
  });
});

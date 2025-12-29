/**
 * Item entity system
 */

import type { Item, ItemType, Position, Mob } from '../types';
import { getRandomPotionEffect, getPotionName } from '../potion-effects';

/**
 * Create an item
 * @param type - Type of item
 * @param position - Item position
 * @param level - Dungeon level for scaling
 * @returns New item
 */
export function createItem(type: ItemType, position: Position, level: number): Item {
  const itemId = `${type}_${Date.now()}_${Math.random()}`;

  switch (type) {
    case 'weapon': {
      const baseDamage = 3 + Math.floor(level * 1.5);
      const variance = Math.floor(Math.random() * 3);
      return {
        id: itemId,
        type: 'weapon',
        name: `Weapon +${baseDamage + variance}`,
        damage: baseDamage + variance,
        position,
      };
    }
    case 'armor': {
      const baseDefense = 2 + Math.floor(level * 1.2);
      const variance = Math.floor(Math.random() * 2);
      return {
        id: itemId,
        type: 'armor',
        name: `Armor +${baseDefense + variance}`,
        defense: baseDefense + variance,
        position,
      };
    }
    case 'potion_health': {
      const trueEffect = getRandomPotionEffect();
      return {
        id: itemId,
        type: 'potion_health',
        name: 'Unknown Potion',
        restoreAmount: 0,
        position,
        unknown: true,
        trueEffect,
      } as any;
    }
    case 'potion_strength': {
      const trueEffect = getRandomPotionEffect();
      return {
        id: itemId,
        type: 'potion_strength',
        name: 'Unknown Potion',
        restoreAmount: 0,
        position,
        unknown: true,
        trueEffect,
      } as any;
    }
      case 'food': {
        const healAmount = 1 + Math.floor(Math.random() * 3); // 1, 2, or 3
        return {
          id: itemId,
          type: 'food',
          name: `Food (+${healAmount})`,
          restoreAmount: healAmount,
          position,
        };
      }
  }
}

/**
 * Generate loot from a defeated mob
 * @param mob - The defeated mob
 * @param level - Dungeon level
 * @returns Array of dropped items
 */
export function generateLoot(mob: Mob, level: number): Item[] {
  const loot: Item[] = [];

  // 50% chance to drop each item type in the drop list
  mob.drops.forEach((dropType) => {
    if (Math.random() < 0.5) {
      loot.push(createItem(dropType, mob.position, level));
    }
  });

  return loot;
}

/**
 * Item entity system
 */

import type { Item, ItemType, Position, Mob } from '../types';

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
    case 'potion_health':
      return {
        id: itemId,
        type: 'potion_health',
        name: 'Health Potion',
        restoreAmount: 30 + Math.floor(level * 5),
        position,
      };
    case 'potion_strength':
      return {
        id: itemId,
        type: 'potion_strength',
        name: 'Strength Potion',
        restoreAmount: 5 + Math.floor(level * 2),
        position,
      };
    case 'food':
      return {
        id: itemId,
        type: 'food',
        name: 'Food',
        restoreAmount: 15 + Math.floor(level * 2),
        position,
      };
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

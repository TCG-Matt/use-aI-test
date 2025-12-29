/**
 * Player entity system
 */

import type { Player, Position, Weapon, Armor, Item } from '../types';

const MAX_INVENTORY_SIZE = 20;

/**
 * Create a new player character
 * @param position - Starting position
 * @param level - Starting dungeon level
 * @returns New player object
 */
export function createPlayer(position: Position, level: number): Player {
  return {
    position,
    health: 100,
    maxHealth: 100,
    strength: 10,
    weapon: null,
    armor: null,
    inventory: [],
    level,
    activeEffects: [],
    identifiedPotions: [],
  };
}

/**
 * Equip a weapon on the player
 * @param player - The player
 * @param weapon - The weapon to equip
 * @returns Updated player
 */
export function equipWeapon(player: Player, weapon: Weapon): Player {
  const inventory = [...player.inventory];

  // Return old weapon to inventory
  if (player.weapon) {
    const oldWeapon = { ...player.weapon };
    delete oldWeapon.position;
    inventory.push(oldWeapon);
  }

  return {
    ...player,
    weapon,
    inventory,
  };
}

/**
 * Equip armor on the player
 * @param player - The player
 * @param armor - The armor to equip
 * @returns Updated player
 */
export function equipArmor(player: Player, armor: Armor): Player {
  const inventory = [...player.inventory];

  // Return old armor to inventory
  if (player.armor) {
    const oldArmor = { ...player.armor };
    delete oldArmor.position;
    inventory.push(oldArmor);
  }

  return {
    ...player,
    armor,
    inventory,
  };
}

/**
 * Add an item to player's inventory
 * @param player - The player
 * @param item - The item to add
 * @returns Updated player
 */
export function addToInventory(player: Player, item: Item): Player {
  if (player.inventory.length >= MAX_INVENTORY_SIZE) {
    return player;
  }

  const itemCopy = { ...item };
  delete itemCopy.position;

  return {
    ...player,
    inventory: [...player.inventory, itemCopy],
  };
}

/**
 * Check if player can carry more items
 * @param player - The player
 * @returns True if player can carry more
 */
export function canCarryMore(player: Player): boolean {
  return player.inventory.length < MAX_INVENTORY_SIZE;
}

/**
 * Remove an item from inventory by ID
 * @param player - The player
 * @param itemId - ID of item to remove
 * @returns Updated player
 */
export function removeFromInventory(player: Player, itemId: string): Player {
  return {
    ...player,
    inventory: player.inventory.filter((item) => item.id !== itemId),
  };
}

/**
 * Heal the player
 * @param player - The player
 * @param amount - Amount to heal
 * @returns Updated player
 */
export function healPlayer(player: Player, amount: number): Player {
  return {
    ...player,
    health: Math.min(player.maxHealth, player.health + amount),
  };
}

/**
 * Increase player strength
 * @param player - The player
 * @param amount - Amount to increase
 * @returns Updated player
 */
export function increaseStrength(player: Player, amount: number): Player {
  return {
    ...player,
    strength: player.strength + amount,
  };
}

/**
 * Damage the player
 * @param player - The player
 * @param amount - Damage amount
 * @returns Updated player
 */
export function damagePlayer(player: Player, amount: number): Player {
  return {
    ...player,
    health: Math.max(0, player.health - amount),
  };
}

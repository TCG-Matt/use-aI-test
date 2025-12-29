/**
 * Mob entity system
 */

import type { Mob, Position, MobType, Dungeon, ItemType } from '../types';
import { getDistance, hasLineOfSight } from '../fog-of-war';

/**
 * Create a new mob
 * @param type - Type of mob to create
 * @param position - Starting position
 * @param level - Dungeon level for scaling
 * @returns New mob object
 */
export function createMob(type: MobType, position: Position, level: number): Mob {
  let baseHealth = 20;
  let baseStrength = 5;
  let viewRange = 7;
  let drops: ItemType[] = ['food'];

  switch (type) {
    case 'goblin':
      baseHealth = 20;
      baseStrength = 5;
      viewRange = 6;
      drops = ['food', 'weapon'];
      break;
    case 'skeleton':
      baseHealth = 30;
      baseStrength = 8;
      viewRange = 8;
      drops = ['weapon', 'armor'];
      break;
    case 'troll':
      baseHealth = 50;
      baseStrength = 12;
      viewRange = 7;
      drops = ['weapon', 'armor', 'potion_health'];
      break;
    case 'dragon':
      baseHealth = 100;
      baseStrength = 20;
      viewRange = 10;
      drops = ['weapon', 'armor', 'potion_health', 'potion_strength'];
      break;
  }

  return {
    id: `${type}_${Date.now()}_${Math.random()}`,
    position,
    health: baseHealth + level * 10,
    strength: baseStrength + Math.floor(level * 2),
    viewRange,
    type,
    drops,
  };
}

/**
 * Check if mob can see the player
 * @param mob - The mob
 * @param playerPos - Player's position
 * @param dungeon - The dungeon
 * @returns True if mob can see player
 */
export function canSeePlayer(mob: Mob, playerPos: Position, dungeon: Dungeon): boolean {
  const distance = getDistance(mob.position, playerPos);
  if (distance > mob.viewRange) {
    return false;
  }
  return hasLineOfSight(mob.position, playerPos, dungeon);
}

/**
 * Move mob towards player position
 * @param mob - The mob to move
 * @param playerPos - Player's position
 * @param dungeon - The dungeon
 * @returns New position for the mob
 */
export function moveTowardsPlayer(mob: Mob, playerPos: Position, dungeon: Dungeon): Position {
  const dx = playerPos.x - mob.position.x;
  const dy = playerPos.y - mob.position.y;

  // Already at player position
  if (dx === 0 && dy === 0) {
    return mob.position;
  }

  // Determine movement direction (prefer larger difference)
  let newX = mob.position.x;
  let newY = mob.position.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    newX += dx > 0 ? 1 : -1;
  } else {
    newY += dy > 0 ? 1 : -1;
  }

  // Check if new position is valid
  if (
    newX < 0 ||
    newX >= dungeon.width ||
    newY < 0 ||
    newY >= dungeon.height ||
    dungeon.tiles[newY][newX].type === 'wall'
  ) {
    // Try alternative direction
    if (Math.abs(dx) > Math.abs(dy)) {
      newX = mob.position.x;
      newY = mob.position.y + (dy > 0 ? 1 : dy < 0 ? -1 : 0);
    } else {
      newY = mob.position.y;
      newX = mob.position.x + (dx > 0 ? 1 : dx < 0 ? -1 : 0);
    }

    // Check alternative direction
    if (
      newX < 0 ||
      newX >= dungeon.width ||
      newY < 0 ||
      newY >= dungeon.height ||
      dungeon.tiles[newY][newX].type === 'wall'
    ) {
      return mob.position; // Can't move
    }
  }

  return { x: newX, y: newY };
}

/**
 * Damage a mob
 * @param mob - The mob to damage
 * @param amount - Damage amount
 * @returns Updated mob
 */
export function damageMob(mob: Mob, amount: number): Mob {
  return {
    ...mob,
    health: Math.max(0, mob.health - amount),
  };
}

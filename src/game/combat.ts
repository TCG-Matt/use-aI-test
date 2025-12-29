/**
 * Combat system for resolving battles between entities
 */

import type { Player, Mob, CombatResult } from './types';
import { generateLoot } from './entities/item';

/**
 * Entity that can attack (Player or Mob)
 */
type Attacker = Player | Mob;

/**
 * Entity that can be attacked (Player or Mob)
 */
type Defender = Player | Mob;

/**
 * Calculate damage from attacker to defender
 * @param attacker - The attacking entity
 * @param defender - The defending entity
 * @returns Damage amount
 */
export function calculateDamage(attacker: Attacker, defender: Defender): number {
  let damage = attacker.strength;

  // Add weapon damage if attacker is a player with a weapon
  if ('weapon' in attacker && attacker.weapon) {
    damage += attacker.weapon.damage;
  }

  // Subtract armor defense if defender is a player with armor
  if ('armor' in defender && defender.armor) {
    damage -= defender.armor.defense;
  }

  // Ensure minimum damage of 1
  return Math.max(1, damage);
}

/**
 * Resolve combat between attacker and defender
 * @param attacker - The attacking entity
 * @param defender - The defending entity
 * @param attackerName - Display name of attacker
 * @param defenderName - Display name of defender
 * @returns Combat result with damage, killed status, and loot
 */
export function resolveCombat(
  attacker: Attacker,
  defender: Defender,
  attackerName: string,
  defenderName: string
): CombatResult {
  const damage = calculateDamage(attacker, defender);
  const killed = damage >= defender.health;
  let loot: CombatResult['loot'] = [];

  // Generate loot if defender is killed and is a mob
  if (killed && 'drops' in defender) {
    const mob = defender as Mob;
    // Get level from attacker if it's a player, otherwise use 1
    const level = 'level' in attacker ? attacker.level : 1;
    loot = generateLoot(mob, level);
  }

  return {
    damage,
    killed,
    loot,
    attackerName,
    defenderName,
  };
}

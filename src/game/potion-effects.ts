/**
 * Potion effects system
 */

import type { PotionEffectType, ActiveEffect, Player, GameState, Mob } from './types';
import { createMob } from './entities/mob';

/**
 * Get a random potion effect
 * @returns Random potion effect type
 */
export function getRandomPotionEffect(): PotionEffectType {
  const effects: PotionEffectType[] = ['strength', 'blindness', 'spawn_monster', 'poison', 'vitality'];
  return effects[Math.floor(Math.random() * effects.length)];
}

/**
 * Apply a potion effect to the player
 * @param player - The player
 * @param effect - The effect type to apply
 * @returns Updated player and any messages
 */
export function applyPotionEffect(
  player: Player,
  effect: PotionEffectType
): { player: Player; messages: string[]; spawnedMob?: Mob } {
  const messages: string[] = [];
  let newPlayer = { ...player };
  let spawnedMob: Mob | undefined;

  switch (effect) {
    case 'strength':
      newPlayer.strength += 1;
      messages.push('You feel stronger! +1 strength permanently');
      // Mark as identified
      if (!newPlayer.identifiedPotions.includes('strength')) {
        newPlayer.identifiedPotions = [...newPlayer.identifiedPotions, 'strength'];
      }
      break;

    case 'blindness':
      newPlayer.activeEffects = [
        ...newPlayer.activeEffects,
        { type: 'blindness', duration: 15, magnitude: 3 },
      ];
      messages.push('Your vision blurs! View radius reduced for 15 steps');
      if (!newPlayer.identifiedPotions.includes('blindness')) {
        newPlayer.identifiedPotions = [...newPlayer.identifiedPotions, 'blindness'];
      }
      break;

    case 'spawn_monster':
      messages.push('The potion summons a monster!');
      // Create a mob near player - will be handled by game engine
      spawnedMob = createMob('goblin', player.position, player.level);
      if (!newPlayer.identifiedPotions.includes('spawn_monster')) {
        newPlayer.identifiedPotions = [...newPlayer.identifiedPotions, 'spawn_monster'];
      }
      break;

    case 'poison':
      newPlayer.activeEffects = [
        ...newPlayer.activeEffects,
        { type: 'poison', duration: 15, magnitude: 1 },
      ];
      messages.push('You feel sick! Losing 1 HP per step for 15 steps');
      if (!newPlayer.identifiedPotions.includes('poison')) {
        newPlayer.identifiedPotions = [...newPlayer.identifiedPotions, 'poison'];
      }
      break;

    case 'vitality':
      newPlayer.activeEffects = [
        ...newPlayer.activeEffects,
        { type: 'vitality', duration: 10, magnitude: 1 },
      ];
      messages.push('You feel revitalized! Gaining 1 HP per step for 10 steps');
      if (!newPlayer.identifiedPotions.includes('vitality')) {
        newPlayer.identifiedPotions = [...newPlayer.identifiedPotions, 'vitality'];
      }
      break;
  }

  return { player: newPlayer, messages, spawnedMob };
}

/**
 * Process active effects for one turn
 * @param player - The player
 * @returns Updated player and messages
 */
export function processActiveEffects(player: Player): { player: Player; messages: string[] } {
  const messages: string[] = [];
  let newPlayer = { ...player };
  const remainingEffects: ActiveEffect[] = [];

  for (const effect of player.activeEffects) {
    let newEffect = { ...effect, duration: effect.duration - 1 };

    // Apply effect
    switch (effect.type) {
      case 'poison':
        newPlayer.health = Math.max(0, newPlayer.health - effect.magnitude);
        if (effect.duration === 1) {
          messages.push('The poison wears off');
        }
        break;

      case 'vitality':
        newPlayer.health = Math.min(newPlayer.maxHealth, newPlayer.health + effect.magnitude);
        if (effect.duration === 1) {
          messages.push('The vitality effect wears off');
        }
        break;

      case 'blindness':
        // Effect is passive, just notify when it ends
        if (effect.duration === 1) {
          messages.push('Your vision clears');
        }
        break;
    }

    // Keep effect if duration remains
    if (newEffect.duration > 0) {
      remainingEffects.push(newEffect);
    }
  }

  newPlayer.activeEffects = remainingEffects;

  return { player: newPlayer, messages };
}

/**
 * Get current view radius adjusted for blindness
 * @param player - The player
 * @param baseRadius - Base view radius
 * @returns Adjusted view radius
 */
export function getAdjustedViewRadius(player: Player, baseRadius: number): number {
  const blindnessEffect = player.activeEffects.find((e) => e.type === 'blindness');
  if (blindnessEffect) {
    return Math.max(1, baseRadius - blindnessEffect.magnitude);
  }
  return baseRadius;
}

/**
 * Get potion name with effect if identified
 * @param effect - The potion effect
 * @param identified - Whether player has identified this effect
 * @returns Display name
 */
export function getPotionName(effect: PotionEffectType, identified: boolean): string {
  if (!identified) {
    return 'Unknown Potion';
  }

  const names: Record<PotionEffectType, string> = {
    strength: 'Potion of Strength',
    blindness: 'Potion of Blindness',
    spawn_monster: 'Potion of Summoning',
    poison: 'Potion of Poison',
    vitality: 'Potion of Vitality',
  };

  return names[effect];
}

/**
 * Core game engine for state management and game logic
 */

import type { GameState, Direction, Position, Item } from './types';
import { generateDungeon, generateMobs, populateRoom } from './dungeon-generator';
import { updateVisibility } from './fog-of-war';
import { createPlayer, equipWeapon, equipArmor, addToInventory, canCarryMore, healPlayer, increaseStrength, damagePlayer } from './entities/player';
import { canSeePlayer, moveTowardsPlayer, damageMob } from './entities/mob';
import { resolveCombat } from './combat';
import { getRoomCenter } from './dungeon-generator';
import {
  processActiveEffects,
  applyPotionEffect,
  getAdjustedViewRadius,
  getRandomPotionEffect,
} from './potion-effects';

/**
 * Handle player interaction (pick up item or use stairs)
 * @param state - Current game state
 * @returns Updated game state
 */
export function handleInteract(state: GameState): GameState {
  if (state.gameOver) {
    return state;
  }

  const playerPos = state.player.position;
  const currentTile = state.currentDungeon.tiles[playerPos.y][playerPos.x];

  // Check for item at position
  const itemAtPosition = state.items.find(
    (item) =>
      item.position &&
      item.position.x === playerPos.x &&
      item.position.y === playerPos.y
  );

  if (itemAtPosition) {
    return pickupItem(state);
  }

  // Check for stairs
  if (currentTile.type === 'stair_up') {
    return changeLevel('up', state);
  }

  if (currentTile.type === 'stair_down') {
    return changeLevel('down', state);
  }

  // Nothing to interact with
  return {
    ...state,
    messages: [...state.messages, 'Nothing to interact with here.'],
  };
}

/**
 * Initialize a new game
 * @returns Initial game state
 */
export function initializeGame(): GameState {
  const dungeon = generateDungeon(1);
  
  // Place player in center of first room
  const firstRoom = dungeon.rooms[0];
  const playerPosition = getRoomCenter(firstRoom);
  const player = createPlayer(playerPosition, 1);

  // Generate mobs and items for all rooms
  const mobs = dungeon.rooms.flatMap((room) => generateMobs(room, 1));
  const items = dungeon.rooms.flatMap((room) => populateRoom(room, 1));

  // Update visibility around player
  updateVisibility(dungeon, playerPosition, 7);

  return {
    player,
    currentDungeon: dungeon,
    mobs,
    items,
    messages: ['Welcome to the dungeon!'],
    gameOver: false,
  };
}

/**
 * Get direction deltas
 */
function getDirectionDelta(direction: Direction): Position {
  const deltas: Record<Direction, Position> = {
    n: { x: 0, y: -1 },
    ne: { x: 1, y: -1 },
    e: { x: 1, y: 0 },
    se: { x: 1, y: 1 },
    s: { x: 0, y: 1 },
    sw: { x: -1, y: 1 },
    w: { x: -1, y: 0 },
    nw: { x: -1, y: -1 },
  };
  return deltas[direction];
}

/**
 * Handle player movement
 * @param direction - Direction to move
 * @param state - Current game state
 * @returns Updated game state
 */
export function handlePlayerMove(direction: Direction, state: GameState): GameState {
  if (state.gameOver) {
    return state;
  }

  const delta = getDirectionDelta(direction);
  const newPos: Position = {
    x: state.player.position.x + delta.x,
    y: state.player.position.y + delta.y,
  };

  // Check bounds
  if (
    newPos.x < 0 ||
    newPos.x >= state.currentDungeon.width ||
    newPos.y < 0 ||
    newPos.y >= state.currentDungeon.height
  ) {
    return state;
  }

  // Check for wall
  const tile = state.currentDungeon.tiles[newPos.y][newPos.x];
  if (tile.type === 'wall') {
    return state;
  }

  // Check for mob at new position
  const mobAtPosition = state.mobs.find(
    (mob) => mob.position.x === newPos.x && mob.position.y === newPos.y
  );

  let newState = { ...state };
  const messages = [...state.messages];

  if (mobAtPosition) {
    // Combat!
    const result = resolveCombat(
      state.player,
      mobAtPosition,
      'You',
      mobAtPosition.type
    );

    messages.push(
      `You attacked ${result.defenderName} for ${result.damage} damage!`
    );

    if (result.killed) {
      messages.push(`You defeated the ${result.defenderName}!`);
      // Remove mob and add loot
      newState.mobs = state.mobs.filter((m) => m.id !== mobAtPosition.id);
      newState.items = [...state.items, ...result.loot];
    } else {
      // Mob survives, damage it
      newState.mobs = state.mobs.map((m) =>
        m.id === mobAtPosition.id ? damageMob(m, result.damage) : m
      );
      
      // Mob counter-attacks!
      const counterAttack = resolveCombat(
        mobAtPosition,
        newState.player,
        mobAtPosition.type,
        'You'
      );
      messages.push(
        `${counterAttack.attackerName} counter-attacks for ${counterAttack.damage} damage!`
      );
      newState.player = damagePlayer(newState.player, counterAttack.damage);

      if (newState.player.health <= 0) {
        messages.push('You have been defeated!');
        newState.gameOver = true;
      }
    }

    newState.messages = messages;
    return newState;
  }

  // Move player
  newState.player = {
    ...state.player,
    position: newPos,
  };

  // Process active effects each step
  const effectResult = processActiveEffects(newState.player);
  newState.player = effectResult.player;
  messages.push(...effectResult.messages);

  // Check for game over from poison
  if (newState.player.health <= 0) {
    messages.push('You have been defeated!');
    newState.gameOver = true;
    newState.messages = messages;
    return newState;
  }

  // Update visibility with adjusted radius for blindness
  const viewRadius = getAdjustedViewRadius(newState.player, 7);
  updateVisibility(newState.currentDungeon, newPos, viewRadius);

  // Update mobs
  newState = updateMobs(newState);

  newState.messages = messages;

  return newState;
}

/**
 * Update all mobs (AI and movement)
 * @param state - Current game state
 * @returns Updated game state
 */
export function updateMobs(state: GameState): GameState {
  if (state.gameOver) {
    return state;
  }

  let newState = { ...state };
  const messages = [...state.messages];

  const updatedMobs = state.mobs.map((mob) => {
    // Check if mob can see player
    if (!canSeePlayer(mob, state.player.position, state.currentDungeon)) {
      return mob;
    }

    // Move towards player
    const newPos = moveTowardsPlayer(mob, state.player.position, state.currentDungeon);

    // Check if mob reached player (attack)
    if (
      newPos.x === state.player.position.x &&
      newPos.y === state.player.position.y
    ) {
      // Mob attacks player
      const result = resolveCombat(mob, state.player, mob.type, 'You');
      messages.push(
        `${result.attackerName} attacked you for ${result.damage} damage!`
      );

      newState.player = damagePlayer(newState.player, result.damage);

      if (newState.player.health <= 0) {
        messages.push('You have been defeated!');
        newState.gameOver = true;
      }

      return mob; // Mob doesn't move, just attacks
    }

    return {
      ...mob,
      position: newPos,
    };
  });

  newState.mobs = updatedMobs;
  newState.messages = messages;

  return newState;
}

/**
 * Use an item from inventory
 * @param itemId - ID of item to use
 * @param state - Current game state
 * @returns Updated game state
 */
export function useItem(itemId: string, state: GameState): GameState {
  const item = state.player.inventory.find((i) => i.id === itemId);
  if (!item) {
    return state;
  }

  let newPlayer = state.player;
  let newState = { ...state };
  const messages = [...state.messages];

  switch (item.type) {
    case 'weapon':
      newPlayer = equipWeapon(newPlayer, item);
      // Remove from inventory
      newPlayer = {
        ...newPlayer,
        inventory: newPlayer.inventory.filter((i) => i.id !== itemId),
      };
      messages.push(`Equipped ${item.name}`);
      break;
    case 'armor':
      newPlayer = equipArmor(newPlayer, item);
      // Remove from inventory
      newPlayer = {
        ...newPlayer,
        inventory: newPlayer.inventory.filter((i) => i.id !== itemId),
      };
      messages.push(`Equipped ${item.name}`);
      break;
    case 'potion_health':
    case 'potion_strength': {
      // Check if it's an unknown potion
      const potion = item as any;
      if (potion.unknown && potion.trueEffect) {
        // Apply the true random effect
        const effectResult = applyPotionEffect(newPlayer, potion.trueEffect);
        newPlayer = effectResult.player;
        messages.push(...effectResult.messages);
        
        // Spawn monster if needed
        if (effectResult.spawnedMob) {
          // Find empty adjacent position
          const adjacentPositions = [
            { x: newPlayer.position.x + 1, y: newPlayer.position.y },
            { x: newPlayer.position.x - 1, y: newPlayer.position.y },
            { x: newPlayer.position.x, y: newPlayer.position.y + 1 },
            { x: newPlayer.position.x, y: newPlayer.position.y - 1 },
          ];
          
          const validPos = adjacentPositions.find((pos) => {
            return (
              pos.x >= 0 &&
              pos.x < state.currentDungeon.width &&
              pos.y >= 0 &&
              pos.y < state.currentDungeon.height &&
              state.currentDungeon.tiles[pos.y][pos.x].type !== 'wall' &&
              !state.mobs.some((m) => m.position.x === pos.x && m.position.y === pos.y)
            );
          });
          
          if (validPos) {
            effectResult.spawnedMob.position = validPos;
            newState.mobs = [...state.mobs, effectResult.spawnedMob];
          }
        }
      } else {
        // Regular health/strength potion
        if (item.type === 'potion_health') {
          newPlayer = healPlayer(newPlayer, item.restoreAmount);
          messages.push(`Used ${item.name}, restored ${item.restoreAmount} health`);
        } else {
          newPlayer = increaseStrength(newPlayer, item.restoreAmount);
          messages.push(`Used ${item.name}, increased strength by ${item.restoreAmount}`);
        }
      }
      
      newPlayer = {
        ...newPlayer,
        inventory: newPlayer.inventory.filter((i) => i.id !== itemId),
      };
      break;
    }
    case 'food':
      newPlayer = healPlayer(newPlayer, item.restoreAmount);
      newPlayer = {
        ...newPlayer,
        inventory: newPlayer.inventory.filter((i) => i.id !== itemId),
      };
      messages.push(`Ate ${item.name}, restored ${item.restoreAmount} health`);
      break;
  }

  return {
    ...newState,
    player: newPlayer,
    messages,
  };
}

/**
 * Pick up item at player's position
 * @param state - Current game state
 * @returns Updated game state
 */
export function pickupItem(state: GameState): GameState {
  const itemAtPosition = state.items.find(
    (item) =>
      item.position &&
      item.position.x === state.player.position.x &&
      item.position.y === state.player.position.y
  );

  if (!itemAtPosition) {
    return state;
  }

  if (!canCarryMore(state.player)) {
    return {
      ...state,
      messages: [...state.messages, 'Inventory is full!'],
    };
  }

  const newPlayer = addToInventory(state.player, itemAtPosition);
  const newItems = state.items.filter((i) => i.id !== itemAtPosition.id);

  return {
    ...state,
    player: newPlayer,
    items: newItems,
    messages: [...state.messages, `Picked up ${itemAtPosition.name}`],
  };
}

/**
 * Change dungeon level
 * @param direction - 'up' or 'down'
 * @param state - Current game state
 * @returns Updated game state
 */
export function changeLevel(direction: 'up' | 'down', state: GameState): GameState {
  const currentTile =
    state.currentDungeon.tiles[state.player.position.y][state.player.position.x];

  if (direction === 'down' && currentTile.type === 'stair_down') {
    const newLevel = state.player.level + 1;
    const newDungeon = generateDungeon(newLevel);

    // Place player on up stairs (or center of first room if no up stairs)
    const upStairTile = newDungeon.tiles
      .flat()
      .find((tile) => tile.type === 'stair_up');
    const playerPosition = upStairTile
      ? upStairTile.position
      : getRoomCenter(newDungeon.rooms[0]);

    // Generate mobs and items
    const mobs = newDungeon.rooms.flatMap((room) => generateMobs(room, newLevel));
    const items = newDungeon.rooms.flatMap((room) => populateRoom(room, newLevel));

    // Update visibility
    updateVisibility(newDungeon, playerPosition, 7);

    return {
      ...state,
      player: {
        ...state.player,
        position: playerPosition,
        level: newLevel,
      },
      currentDungeon: newDungeon,
      mobs,
      items,
      messages: [...state.messages, `Descended to level ${newLevel}`],
    };
  }

  if (direction === 'up' && currentTile.type === 'stair_up' && state.player.level > 1) {
    const newLevel = state.player.level - 1;
    const newDungeon = generateDungeon(newLevel);

    // Place player on down stairs (or center of first room)
    const downStairTile = newDungeon.tiles
      .flat()
      .find((tile) => tile.type === 'stair_down');
    const playerPosition = downStairTile
      ? downStairTile.position
      : getRoomCenter(newDungeon.rooms[0]);

    // Generate mobs and items
    const mobs = newDungeon.rooms.flatMap((room) => generateMobs(room, newLevel));
    const items = newDungeon.rooms.flatMap((room) => populateRoom(room, newLevel));

    // Update visibility
    updateVisibility(newDungeon, playerPosition, 7);

    return {
      ...state,
      player: {
        ...state.player,
        position: playerPosition,
        level: newLevel,
      },
      currentDungeon: newDungeon,
      mobs,
      items,
      messages: [...state.messages, `Ascended to level ${newLevel}`],
    };
  }

  return state;
}

/**
 * Input handler for keyboard controls
 */

import type { Direction } from './types';

/**
 * Convert keyboard key to direction
 * @param key - The pressed key
 * @returns Direction or null if not a movement key
 */
export function keyToDirection(key: string): Direction | null {
  const keyMap: Record<string, Direction> = {
    // WASD
    w: 'n',
    a: 'w',
    s: 's',
    d: 'e',
    // Arrow keys
    ArrowUp: 'n',
    ArrowLeft: 'w',
    ArrowDown: 's',
    ArrowRight: 'e',
    // Numpad (with diagonals)
    '8': 'n',
    '9': 'ne',
    '6': 'e',
    '3': 'se',
    '2': 's',
    '1': 'sw',
    '4': 'w',
    '7': 'nw',
  };

  return keyMap[key] || null;
}

/**
 * Check if a key is a movement key
 * @param key - The pressed key
 * @returns True if key is for movement
 */
export function isMovementKey(key: string): boolean {
  return keyToDirection(key) !== null;
}

/**
 * Check if a key is an action key
 * @param key - The pressed key
 * @returns True if key is for actions
 */
export function isActionKey(key: string): boolean {
  const actionKeys = ['e', 'i', ' ', 'Escape', '<', '>'];
  return actionKeys.includes(key);
}

/**
 * Action types
 */
export type GameAction =
  | { type: 'move'; direction: Direction }
  | { type: 'pickup' }
  | { type: 'inventory' }
  | { type: 'wait' }
  | { type: 'menu' }
  | { type: 'stairs_up' }
  | { type: 'stairs_down' }
  | null;

/**
 * Convert keyboard event to game action
 * @param key - The pressed key
 * @returns Game action or null
 */
export function keyToAction(key: string): GameAction {
  const direction = keyToDirection(key);
  if (direction) {
    return { type: 'move', direction };
  }

  switch (key) {
    case 'e':
      return { type: 'pickup' };
    case 'i':
      return { type: 'inventory' };
    case ' ':
      return { type: 'wait' };
    case 'Escape':
      return { type: 'menu' };
    case '<':
      return { type: 'stairs_up' };
    case '>':
      return { type: 'stairs_down' };
    default:
      return null;
  }
}

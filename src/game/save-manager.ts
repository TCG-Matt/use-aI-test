/**
 * Save/Load manager for game persistence
 */

import type { GameState } from './types';

const SAVE_KEY = 'dungeon-crawler-save';

/**
 * Save game state to localStorage
 * @param state - Game state to save
 */
export function saveGame(state: GameState): void {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(SAVE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save game:', error);
  }
}

/**
 * Load game state from localStorage
 * @returns Saved game state or null if no save exists
 */
export function loadGame(): GameState | null {
  try {
    const serialized = localStorage.getItem(SAVE_KEY);
    if (!serialized) {
      return null;
    }
    return JSON.parse(serialized) as GameState;
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
}

/**
 * Check if a saved game exists
 * @returns True if a save exists
 */
export function hasSavedGame(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null;
}

/**
 * Clear saved game
 */
export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

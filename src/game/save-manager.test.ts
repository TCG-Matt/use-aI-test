import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveGame, loadGame, hasSavedGame, clearSave } from './save-manager';
import { initializeGame } from './game-engine';

describe('Save Manager', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('saveGame', () => {
    it('should save game state to localStorage', () => {
      const state = initializeGame();
      saveGame(state);

      const saved = localStorage.getItem('dungeon-crawler-save');
      expect(saved).not.toBeNull();
    });

    it('should serialize game state correctly', () => {
      const state = initializeGame();
      state.player.health = 75;
      state.player.level = 3;

      saveGame(state);
      const loaded = loadGame();

      expect(loaded).not.toBeNull();
      expect(loaded?.player.health).toBe(75);
      expect(loaded?.player.level).toBe(3);
    });
  });

  describe('loadGame', () => {
    it('should return null when no save exists', () => {
      const loaded = loadGame();
      expect(loaded).toBeNull();
    });

    it('should load saved game state', () => {
      const state = initializeGame();
      state.player.strength = 25;
      saveGame(state);

      const loaded = loadGame();
      expect(loaded).not.toBeNull();
      expect(loaded?.player.strength).toBe(25);
    });

    it('should handle corrupt save data', () => {
      localStorage.setItem('dungeon-crawler-save', 'invalid json');
      const loaded = loadGame();
      expect(loaded).toBeNull();
    });
  });

  describe('hasSavedGame', () => {
    it('should return false when no save exists', () => {
      expect(hasSavedGame()).toBe(false);
    });

    it('should return true when save exists', () => {
      const state = initializeGame();
      saveGame(state);
      expect(hasSavedGame()).toBe(true);
    });
  });

  describe('clearSave', () => {
    it('should remove saved game', () => {
      const state = initializeGame();
      saveGame(state);
      expect(hasSavedGame()).toBe(true);

      clearSave();
      expect(hasSavedGame()).toBe(false);
    });
  });
});

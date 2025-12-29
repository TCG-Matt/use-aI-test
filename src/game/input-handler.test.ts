import { describe, it, expect } from 'vitest';
import { keyToDirection, isMovementKey, isActionKey } from './input-handler';

describe('Input Handler', () => {
  describe('keyToDirection', () => {
    it('should convert WASD keys to directions', () => {
      expect(keyToDirection('w')).toBe('n');
      expect(keyToDirection('a')).toBe('w');
      expect(keyToDirection('s')).toBe('s');
      expect(keyToDirection('d')).toBe('e');
    });

    it('should convert arrow keys to directions', () => {
      expect(keyToDirection('ArrowUp')).toBe('n');
      expect(keyToDirection('ArrowLeft')).toBe('w');
      expect(keyToDirection('ArrowDown')).toBe('s');
      expect(keyToDirection('ArrowRight')).toBe('e');
    });

    it('should convert numpad keys to directions', () => {
      expect(keyToDirection('8')).toBe('n');
      expect(keyToDirection('9')).toBe('ne');
      expect(keyToDirection('6')).toBe('e');
      expect(keyToDirection('3')).toBe('se');
      expect(keyToDirection('2')).toBe('s');
      expect(keyToDirection('1')).toBe('sw');
      expect(keyToDirection('4')).toBe('w');
      expect(keyToDirection('7')).toBe('nw');
    });

    it('should return null for non-movement keys', () => {
      expect(keyToDirection('x')).toBeNull();
      expect(keyToDirection('Enter')).toBeNull();
      expect(keyToDirection('Space')).toBeNull();
    });
  });

  describe('isMovementKey', () => {
    it('should return true for movement keys', () => {
      expect(isMovementKey('w')).toBe(true);
      expect(isMovementKey('ArrowUp')).toBe(true);
      expect(isMovementKey('8')).toBe(true);
    });

    it('should return false for non-movement keys', () => {
      expect(isMovementKey('e')).toBe(false);
      expect(isMovementKey('i')).toBe(false);
      expect(isMovementKey('Escape')).toBe(false);
    });
  });

  describe('isActionKey', () => {
    it('should identify action keys', () => {
      expect(isActionKey('e')).toBe(true);
      expect(isActionKey('i')).toBe(true);
      expect(isActionKey(' ')).toBe(true);
      expect(isActionKey('Escape')).toBe(true);
      expect(isActionKey('<')).toBe(true);
      expect(isActionKey('>')).toBe(true);
    });

    it('should return false for non-action keys', () => {
      expect(isActionKey('w')).toBe(false);
      expect(isActionKey('x')).toBe(false);
    });
  });
});

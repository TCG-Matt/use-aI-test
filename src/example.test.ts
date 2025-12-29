import { describe, it, expect } from 'vitest';
import { add, reverseString } from './example';

describe('example module', () => {
  describe('add', () => {
    it('should correctly add two numbers', () => {
      expect(add(1, 2)).toBe(3);
    });

    it('should handle negative numbers', () => {
      expect(add(-1, -2)).toBe(-3);
    });
  });

  describe('reverseString', () => {
    it('should reverse a standard string', () => {
      expect(reverseString('hello')).toBe('olleh');
    });

    it('should handle empty string', () => {
      expect(reverseString('')).toBe('');
    });
  });
});

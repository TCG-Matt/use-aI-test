import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderGame, TILE_SIZE, getColors } from './renderer';
import { initializeGame } from './game-engine';

describe('Renderer', () => {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    
    // Create a mock context since jsdom doesn't fully implement canvas
    ctx = {
      canvas: canvas,
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      fillText: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      beginPath: vi.fn(),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      font: '',
      textAlign: 'left',
      textBaseline: 'alphabetic',
    } as unknown as CanvasRenderingContext2D;
  });

  describe('TILE_SIZE', () => {
    it('should be defined', () => {
      expect(TILE_SIZE).toBe(32);
    });
  });

  describe('getColors', () => {
    it('should return color scheme', () => {
      const colors = getColors();
      expect(colors.wall).toBeDefined();
      expect(colors.floor).toBeDefined();
      expect(colors.player).toBeDefined();
    });
  });

  describe('renderGame', () => {
    it('should render without errors', () => {
      const state = initializeGame();
      expect(() => renderGame(ctx, state)).not.toThrow();
    });

    it('should call fillRect for tiles', () => {
      const state = initializeGame();
      renderGame(ctx, state);
      expect(ctx.fillRect).toHaveBeenCalled();
    });

    it('should render player', () => {
      const state = initializeGame();
      renderGame(ctx, state);
      expect(ctx.arc).toHaveBeenCalled();
    });

    it('should handle empty state', () => {
      const state = initializeGame();
      state.mobs = [];
      state.items = [];
      expect(() => renderGame(ctx, state)).not.toThrow();
    });
  });
});

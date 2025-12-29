'use client';

import { useEffect, useRef } from 'react';
import { renderGame } from '@/game/renderer';
import type { GameState } from '@/game/types';

interface GameCanvasProps {
  gameState: GameState;
  width?: number;
  height?: number;
}

/**
 * Canvas component for rendering the game
 */
export function GameCanvas({ gameState, width = 800, height = 600 }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderGame(ctx, gameState);
  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border-2 border-gray-700 bg-black"
    />
  );
}

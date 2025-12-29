/**
 * Fog of War system for managing tile visibility
 */

import type { Dungeon, Position } from './types';

/**
 * Calculate Euclidean distance between two positions
 * @param pos1 - First position
 * @param pos2 - Second position
 * @returns Distance between positions
 */
export function getDistance(pos1: Position, pos2: Position): number {
  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check if a position is within view radius
 * @param center - Center position
 * @param target - Target position to check
 * @param radius - View radius
 * @returns True if target is within radius
 */
export function isInViewRadius(center: Position, target: Position, radius: number): boolean {
  return getDistance(center, target) <= radius;
}

/**
 * Get all positions along a line using Bresenham's algorithm
 * @param from - Starting position
 * @param to - Ending position
 * @returns Array of positions along the line
 */
function getLinePositions(from: Position, to: Position): Position[] {
  const positions: Position[] = [];
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  const sx = from.x < to.x ? 1 : -1;
  const sy = from.y < to.y ? 1 : -1;
  let err = dx - dy;

  let x = from.x;
  let y = from.y;

  while (true) {
    positions.push({ x, y });

    if (x === to.x && y === to.y) {
      break;
    }

    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }

  return positions;
}

/**
 * Check if there is a clear line of sight between two positions
 * @param from - Starting position
 * @param to - Target position
 * @param dungeon - The dungeon
 * @returns True if line of sight is clear
 */
export function hasLineOfSight(from: Position, to: Position, dungeon: Dungeon): boolean {
  const linePositions = getLinePositions(from, to);

  for (const pos of linePositions) {
    // Skip the starting position
    if (pos.x === from.x && pos.y === from.y) {
      continue;
    }

    // Check bounds
    if (pos.y < 0 || pos.y >= dungeon.height || pos.x < 0 || pos.x >= dungeon.width) {
      return false;
    }

    const tile = dungeon.tiles[pos.y][pos.x];

    // Wall blocks line of sight
    if (tile.type === 'wall') {
      return false;
    }

    // If we reached the target, we have line of sight
    if (pos.x === to.x && pos.y === to.y) {
      return true;
    }
  }

  return true;
}

/**
 * Update visibility of tiles based on player position
 * @param dungeon - The dungeon to update
 * @param playerPos - Player's current position
 * @param viewRadius - How far the player can see
 */
export function updateVisibility(dungeon: Dungeon, playerPos: Position, viewRadius: number): void {
  // First pass: mark currently visible tiles as explored, visible as unexplored
  for (let y = 0; y < dungeon.height; y++) {
    for (let x = 0; x < dungeon.width; x++) {
      const tile = dungeon.tiles[y][x];
      if (tile.visibility === 'visible') {
        tile.visibility = 'explored';
      }
    }
  }

  // Second pass: mark tiles within view radius and line of sight as visible
  const minX = Math.max(0, playerPos.x - viewRadius);
  const maxX = Math.min(dungeon.width - 1, playerPos.x + viewRadius);
  const minY = Math.max(0, playerPos.y - viewRadius);
  const maxY = Math.min(dungeon.height - 1, playerPos.y + viewRadius);

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const pos: Position = { x, y };

      // Check if within circular radius
      if (!isInViewRadius(playerPos, pos, viewRadius)) {
        continue;
      }

      // Check line of sight
      if (hasLineOfSight(playerPos, pos, dungeon)) {
        dungeon.tiles[y][x].visibility = 'visible';
      }
    }
  }
}

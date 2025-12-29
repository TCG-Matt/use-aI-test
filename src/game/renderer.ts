/**
 * Canvas renderer for the game
 */

import type { GameState, Tile, TileType } from './types';

export const TILE_SIZE = 32;

/**
 * Color scheme for the game
 */
export interface ColorScheme {
  wall: string;
  floor: string;
  corridor: string;
  stairUp: string;
  stairDown: string;
  unexplored: string;
  exploredOverlay: string;
  player: string;
  goblin: string;
  skeleton: string;
  troll: string;
  dragon: string;
  weapon: string;
  armor: string;
  potion: string;
  food: string;
}

/**
 * Get the color scheme
 * @returns Color scheme object
 */
export function getColors(): ColorScheme {
  return {
    wall: '#333',
    floor: '#666',
    corridor: '#555',
    stairUp: '#4a9eff',
    stairDown: '#ff9e4a',
    unexplored: '#000',
    exploredOverlay: 'rgba(0, 0, 0, 0.5)',
    player: '#4af',
    goblin: '#f44',
    skeleton: '#ccc',
    troll: '#8f4',
    dragon: '#f4f',
    weapon: '#ffa',
    armor: '#aaf',
    potion: '#f8f',
    food: '#8f8',
  };
}

/**
 * Get tile color based on type
 */
function getTileColor(type: TileType, colors: ColorScheme): string {
  switch (type) {
    case 'wall':
      return colors.wall;
    case 'floor':
      return colors.floor;
    case 'corridor':
      return colors.corridor;
    case 'stair_up':
      return colors.stairUp;
    case 'stair_down':
      return colors.stairDown;
    default:
      return colors.floor;
  }
}

/**
 * Render a single tile
 */
function renderTile(
  ctx: CanvasRenderingContext2D,
  tile: Tile,
  cameraX: number,
  cameraY: number,
  colors: ColorScheme
): void {
  if (tile.visibility === 'unexplored') {
    ctx.fillStyle = colors.unexplored;
    ctx.fillRect(
      (tile.position.x - cameraX) * TILE_SIZE,
      (tile.position.y - cameraY) * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE
    );
    return;
  }

  // Draw base tile
  ctx.fillStyle = getTileColor(tile.type, colors);
  ctx.fillRect(
    (tile.position.x - cameraX) * TILE_SIZE,
    (tile.position.y - cameraY) * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE
  );

  // Draw stairs indicators
  if (tile.type === 'stair_up' || tile.type === 'stair_down') {
    ctx.fillStyle = '#fff';
    ctx.font = '20px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      tile.type === 'stair_up' ? '<' : '>',
      (tile.position.x - cameraX) * TILE_SIZE + TILE_SIZE / 2,
      (tile.position.y - cameraY) * TILE_SIZE + TILE_SIZE / 2
    );
  }

  // Darken explored but not visible tiles
  if (tile.visibility === 'explored') {
    ctx.fillStyle = colors.exploredOverlay;
    ctx.fillRect(
      (tile.position.x - cameraX) * TILE_SIZE,
      (tile.position.y - cameraY) * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE
    );
  }
}

/**
 * Render the entire game state
 * @param ctx - Canvas rendering context
 * @param state - Current game state
 */
export function renderGame(ctx: CanvasRenderingContext2D, state: GameState): void {
  const colors = getColors();
  const viewportWidth = Math.floor(ctx.canvas.width / TILE_SIZE);
  const viewportHeight = Math.floor(ctx.canvas.height / TILE_SIZE);

  // Center camera on player
  const cameraX = Math.floor(state.player.position.x - viewportWidth / 2);
  const cameraY = Math.floor(state.player.position.y - viewportHeight / 2);

  // Clear canvas
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Render tiles
  for (let y = Math.max(0, cameraY); y < Math.min(state.currentDungeon.height, cameraY + viewportHeight + 1); y++) {
    for (let x = Math.max(0, cameraX); x < Math.min(state.currentDungeon.width, cameraX + viewportWidth + 1); x++) {
      const tile = state.currentDungeon.tiles[y][x];
      renderTile(ctx, tile, cameraX, cameraY, colors);
    }
  }

  // Render items (only visible ones)
  state.items.forEach((item) => {
    if (!item.position) return;
    
    const tile = state.currentDungeon.tiles[item.position.y][item.position.x];
    if (tile.visibility !== 'visible') return;

    let color = colors.weapon;
    switch (item.type) {
      case 'weapon':
        color = colors.weapon;
        break;
      case 'armor':
        color = colors.armor;
        break;
      case 'potion_health':
      case 'potion_strength':
        color = colors.potion;
        break;
      case 'food':
        color = colors.food;
        break;
    }

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(
      (item.position.x - cameraX) * TILE_SIZE + TILE_SIZE / 2,
      (item.position.y - cameraY) * TILE_SIZE + TILE_SIZE / 2,
      TILE_SIZE / 4,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });

  // Render mobs (only visible ones)
  state.mobs.forEach((mob) => {
    const tile = state.currentDungeon.tiles[mob.position.y][mob.position.x];
    if (tile.visibility !== 'visible') return;

    let color = colors.goblin;
    switch (mob.type) {
      case 'goblin':
        color = colors.goblin;
        break;
      case 'skeleton':
        color = colors.skeleton;
        break;
      case 'troll':
        color = colors.troll;
        break;
      case 'dragon':
        color = colors.dragon;
        break;
    }

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(
      (mob.position.x - cameraX) * TILE_SIZE + TILE_SIZE / 2,
      (mob.position.y - cameraY) * TILE_SIZE + TILE_SIZE / 2,
      TILE_SIZE / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });

  // Render player
  ctx.fillStyle = colors.player;
  ctx.beginPath();
  ctx.arc(
    (state.player.position.x - cameraX) * TILE_SIZE + TILE_SIZE / 2,
    (state.player.position.y - cameraY) * TILE_SIZE + TILE_SIZE / 2,
    TILE_SIZE / 3,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // Draw player direction indicator
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(
    (state.player.position.x - cameraX) * TILE_SIZE + TILE_SIZE / 2,
    (state.player.position.y - cameraY) * TILE_SIZE + TILE_SIZE / 2,
    TILE_SIZE / 3,
    0,
    Math.PI * 2
  );
  ctx.stroke();
}

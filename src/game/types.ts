/**
 * Core type definitions for the dungeon crawler game
 */

/**
 * 2D position in the dungeon grid
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Types of tiles in the dungeon
 */
export type TileType = 'floor' | 'wall' | 'corridor' | 'stair_up' | 'stair_down';

/**
 * Visibility states for fog of war
 */
export type VisibilityState = 'unexplored' | 'explored' | 'visible';

/**
 * A single tile in the dungeon
 */
export interface Tile {
  position: Position;
  type: TileType;
  visibility: VisibilityState;
}

/**
 * A rectangular room in the dungeon
 */
export interface Room {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * A corridor connecting two points
 */
export interface Corridor {
  start: Position;
  end: Position;
}

/**
 * Complete dungeon level
 */
export interface Dungeon {
  level: number;
  width: number;
  height: number;
  tiles: Tile[][];
  rooms: Room[];
  corridors: Corridor[];
}

/**
 * Item types in the game
 */
export type ItemType = 'weapon' | 'armor' | 'potion_health' | 'potion_strength' | 'food';

/**
 * Base item interface
 */
export interface BaseItem {
  id: string;
  type: ItemType;
  name: string;
  position?: Position;
}

/**
 * Weapon item
 */
export interface Weapon extends BaseItem {
  type: 'weapon';
  damage: number;
}

/**
 * Armor item
 */
export interface Armor extends BaseItem {
  type: 'armor';
  defense: number;
}

/**
 * Potion item
 */
export interface Potion extends BaseItem {
  type: 'potion_health' | 'potion_strength';
  restoreAmount: number;
}

/**
 * Food item
 */
export interface Food extends BaseItem {
  type: 'food';
  restoreAmount: number;
}

/**
 * Union type for all items
 */
export type Item = Weapon | Armor | Potion | Food;

/**
 * Player character
 */
export interface Player {
  position: Position;
  health: number;
  maxHealth: number;
  strength: number;
  weapon: Weapon | null;
  armor: Armor | null;
  inventory: Item[];
  level: number; // dungeon level
}

/**
 * Mob types in the game
 */
export type MobType = 'goblin' | 'skeleton' | 'troll' | 'dragon';

/**
 * Enemy mob/monster
 */
export interface Mob {
  id: string;
  position: Position;
  health: number;
  strength: number;
  viewRange: number;
  type: MobType;
  drops: ItemType[];
}

/**
 * Direction for movement
 */
export type Direction = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

/**
 * Complete game state
 */
export interface GameState {
  player: Player;
  currentDungeon: Dungeon;
  mobs: Mob[];
  items: Item[];
  messages: string[];
  gameOver: boolean;
}

/**
 * Result of a combat encounter
 */
export interface CombatResult {
  damage: number;
  killed: boolean;
  loot: Item[];
  attackerName: string;
  defenderName: string;
}

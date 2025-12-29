/**
 * Dungeon generation system for procedural level creation
 */

import type { Room, Corridor, Dungeon, Position, Item, Mob, ItemType, Tile, TileType, VisibilityState } from './types';
import { getRandomPotionEffect } from './potion-effects';

/**
 * Check if two rooms overlap with a minimum separation distance
 * @param room1 - First room
 * @param room2 - Second room
 * @param minSeparation - Minimum distance between rooms
 * @returns True if rooms overlap
 */
export function isRoomOverlapping(room1: Room, room2: Room, minSeparation: number): boolean {
  return !(
    room1.x + room1.width + minSeparation <= room2.x ||
    room2.x + room2.width + minSeparation <= room1.x ||
    room1.y + room1.height + minSeparation <= room2.y ||
    room2.y + room2.height + minSeparation <= room1.y
  );
}

/**
 * Get the center position of a room
 * @param room - The room
 * @returns Center position
 */
export function getRoomCenter(room: Room): Position {
  return {
    x: Math.floor(room.x + room.width / 2),
    y: Math.floor(room.y + room.height / 2),
  };
}

/**
 * Create a horizontal corridor between two x coordinates
 * @param x1 - Start x coordinate
 * @param x2 - End x coordinate
 * @param y - Y coordinate
 * @returns Array of positions for the corridor
 */
export function createHorizontalCorridor(x1: number, x2: number, y: number): Position[] {
  const positions: Position[] = [];
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  for (let x = minX; x <= maxX; x++) {
    positions.push({ x, y });
  }
  return positions;
}

/**
 * Create a vertical corridor between two y coordinates
 * @param y1 - Start y coordinate
 * @param y2 - End y coordinate
 * @param x - X coordinate
 * @returns Array of positions for the corridor
 */
export function createVerticalCorridor(y1: number, y2: number, x: number): Position[] {
  const positions: Position[] = [];
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);
  for (let y = minY; y <= maxY; y++) {
    positions.push({ x, y });
  }
  return positions;
}

/**
 * Generate random rooms within the dungeon bounds
 * @param count - Number of rooms to attempt to generate
 * @param width - Dungeon width
 * @param height - Dungeon height
 * @returns Array of generated rooms
 */
export function generateRooms(count: number, width: number, height: number): Room[] {
  const rooms: Room[] = [];
  const minRoomSize = 5;
  const maxRoomSize = 12;
  const minSeparation = 2;
  const maxAttempts = count * 10;

  for (let attempt = 0; attempt < maxAttempts && rooms.length < count; attempt++) {
    const roomWidth = minRoomSize + Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1));
    const roomHeight = minRoomSize + Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1));
    const x = 1 + Math.floor(Math.random() * (width - roomWidth - 2));
    const y = 1 + Math.floor(Math.random() * (height - roomHeight - 2));

    const newRoom: Room = { x, y, width: roomWidth, height: roomHeight };

    const overlaps = rooms.some((room) => isRoomOverlapping(newRoom, room, minSeparation));

    if (!overlaps) {
      rooms.push(newRoom);
    }
  }

  return rooms;
}

/**
 * Connect rooms with L-shaped corridors
 * @param rooms - Array of rooms to connect
 * @returns Array of corridors
 */
export function connectRooms(rooms: Room[]): Corridor[] {
  const corridors: Corridor[] = [];

  if (rooms.length < 2) {
    return corridors;
  }

  for (let i = 0; i < rooms.length - 1; i++) {
    const center1 = getRoomCenter(rooms[i]);
    const center2 = getRoomCenter(rooms[i + 1]);

    corridors.push({
      start: center1,
      end: center2,
    });
  }

  return corridors;
}

/**
 * Place stairs in the dungeon
 * @param dungeon - The dungeon to place stairs in
 */
export function placeStairs(dungeon: Dungeon): void {
  if (dungeon.rooms.length === 0) {
    return;
  }

  // Place down stairs in a random room
  const downStairRoom = dungeon.rooms[Math.floor(Math.random() * dungeon.rooms.length)];
  const downStairPos = getRoomCenter(downStairRoom);
  dungeon.tiles[downStairPos.y][downStairPos.x].type = 'stair_down';

  // Place up stairs on levels 2+
  if (dungeon.level > 1) {
    let upStairRoom = dungeon.rooms[Math.floor(Math.random() * dungeon.rooms.length)];
    // Make sure it's not the same room as down stairs
    let attempts = 0;
    while (upStairRoom === downStairRoom && attempts < 10) {
      upStairRoom = dungeon.rooms[Math.floor(Math.random() * dungeon.rooms.length)];
      attempts++;
    }
    const upStairPos = getRoomCenter(upStairRoom);
    dungeon.tiles[upStairPos.y][upStairPos.x].type = 'stair_up';
  }
}

/**
 * Populate a room with items and mobs
 * @param room - The room to populate
 * @param level - Dungeon level for scaling
 * @returns Array of items (mobs are returned separately)
 */
export function populateRoom(room: Room, level: number): Item[] {
  const items: Item[] = [];
  const itemTypes: ItemType[] = ['weapon', 'armor', 'potion_health', 'potion_strength', 'food'];

  // Higher chance of items (0-4 per room)
  const itemCount = Math.floor(Math.random() * 5);

  // Increase food spawn rate (30% of items should be food)
  const foodBonus = Math.random() < 0.3 ? 1 : 0;

  for (let i = 0; i < itemCount + foodBonus; i++) {
    let itemType: ItemType;
    
    // 30% chance for food
    if (i >= itemCount || Math.random() < 0.3) {
      itemType = 'food';
    } else {
      itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    }
    
    const x = room.x + 1 + Math.floor(Math.random() * (room.width - 2));
    const y = room.y + 1 + Math.floor(Math.random() * (room.height - 2));

    const itemId = `${itemType}_${Date.now()}_${Math.random()}`;

    switch (itemType) {
      case 'weapon': {
        const baseDamage = 3 + Math.floor(level * 1.5);
        const variance = Math.floor(Math.random() * 3);
        items.push({
          id: itemId,
          type: 'weapon',
          name: `Weapon +${baseDamage + variance}`,
          damage: baseDamage + variance,
          position: { x, y },
        });
        break;
      }
      case 'armor': {
        const baseDefense = 2 + Math.floor(level * 1.2);
        const variance = Math.floor(Math.random() * 2);
        items.push({
          id: itemId,
          type: 'armor',
          name: `Armor +${baseDefense + variance}`,
          defense: baseDefense + variance,
          position: { x, y },
        });
        break;
      }
      case 'potion_health': {
        const trueEffect = getRandomPotionEffect();
        items.push({
          id: itemId,
          type: 'potion_health',
          name: 'Unknown Potion',
          restoreAmount: 0,
          position: { x, y },
          unknown: true,
          trueEffect,
        } as any);
        break;
      }
      case 'potion_strength': {
        const trueEffect = getRandomPotionEffect();
        items.push({
          id: itemId,
          type: 'potion_strength',
          name: 'Unknown Potion',
          restoreAmount: 0,
          position: { x, y },
          unknown: true,
          trueEffect,
        } as any);
        break;
      }
      case 'food': {
        const healAmount = 1 + Math.floor(Math.random() * 3); // 1, 2, or 3
        items.push({
          id: itemId,
          type: 'food',
          name: `Food (+${healAmount})`,
          restoreAmount: healAmount,
          position: { x, y },
        });
        break;
      }
    }
  }

  return items;
}

/**
 * Generate mobs for a room
 * @param room - The room to populate
 * @param level - Dungeon level for scaling
 * @returns Array of mobs
 */
export function generateMobs(room: Room, level: number): Mob[] {
  const mobs: Mob[] = [];
  const mobTypes: Array<'goblin' | 'skeleton' | 'troll' | 'dragon'> = [
    'goblin',
    'skeleton',
    'troll',
    'dragon',
  ];

  // 40% chance of having mobs in a room (reduced from 50%)
  if (Math.random() > 0.4) {
    return mobs;
  }

  // Random number of mobs (1-3 per room)
  const mobCount = 1 + Math.floor(Math.random() * 3);

  for (let i = 0; i < mobCount; i++) {
    // Higher levels can spawn stronger mobs
    let mobType: 'goblin' | 'skeleton' | 'troll' | 'dragon';
    const roll = Math.random();
    if (level >= 5 && roll < 0.1) {
      mobType = 'dragon';
    } else if (level >= 3 && roll < 0.3) {
      mobType = 'troll';
    } else if (level >= 2 && roll < 0.5) {
      mobType = 'skeleton';
    } else {
      mobType = 'goblin';
    }

    const x = room.x + 1 + Math.floor(Math.random() * (room.width - 2));
    const y = room.y + 1 + Math.floor(Math.random() * (room.height - 2));

    let baseHealth = 20;
    let baseStrength = 5;
    let viewRange = 7;
    let drops: ItemType[] = ['food'];

    switch (mobType) {
      case 'goblin':
        baseHealth = 20;
        baseStrength = 5;
        viewRange = 6;
        drops = ['food', 'weapon'];
        break;
      case 'skeleton':
        baseHealth = 30;
        baseStrength = 8;
        viewRange = 8;
        drops = ['weapon', 'armor'];
        break;
      case 'troll':
        baseHealth = 50;
        baseStrength = 12;
        viewRange = 7;
        drops = ['weapon', 'armor', 'potion_health'];
        break;
      case 'dragon':
        baseHealth = 100;
        baseStrength = 20;
        viewRange = 10;
        drops = ['weapon', 'armor', 'potion_health', 'potion_strength'];
        break;
    }

    mobs.push({
      id: `${mobType}_${Date.now()}_${Math.random()}`,
      position: { x, y },
      health: baseHealth + level * 10,
      strength: baseStrength + Math.floor(level * 2),
      viewRange,
      type: mobType,
      drops,
    });
  }

  return mobs;
}

/**
 * Generate a complete dungeon level
 * @param level - The dungeon level number
 * @returns Complete dungeon with rooms, corridors, and tiles
 */
export function generateDungeon(level: number): Dungeon {
  const width = 80;
  const height = 50;

  // Initialize all tiles as walls
  const tiles: Tile[][] = Array(height)
    .fill(null)
    .map((_, y) =>
      Array(width)
        .fill(null)
        .map((_, x) => ({
          position: { x, y },
          type: 'wall' as TileType,
          visibility: 'unexplored' as VisibilityState,
        }))
    );

  // Generate rooms
  const roomCount = 5 + Math.floor(Math.random() * 6); // 5-10 rooms
  const rooms = generateRooms(roomCount, width, height);

  // Carve out rooms
  rooms.forEach((room) => {
    for (let y = room.y; y < room.y + room.height; y++) {
      for (let x = room.x; x < room.x + room.width; x++) {
        if (y >= 0 && y < height && x >= 0 && x < width) {
          tiles[y][x].type = 'floor';
        }
      }
    }
  });

  // Connect rooms with corridors
  const corridors = connectRooms(rooms);

  // Carve out corridors (L-shaped)
  corridors.forEach((corridor) => {
    const { start, end } = corridor;

    // Create L-shaped corridor (horizontal then vertical)
    const horizontalPositions = createHorizontalCorridor(start.x, end.x, start.y);
    const verticalPositions = createVerticalCorridor(start.y, end.y, end.x);

    [...horizontalPositions, ...verticalPositions].forEach((pos) => {
      if (pos.y >= 0 && pos.y < height && pos.x >= 0 && pos.x < width) {
        if (tiles[pos.y][pos.x].type === 'wall') {
          tiles[pos.y][pos.x].type = 'corridor';
        }
      }
    });
  });

  const dungeon: Dungeon = {
    level,
    width,
    height,
    tiles,
    rooms,
    corridors,
  };

  // Place stairs
  placeStairs(dungeon);

  return dungeon;
}

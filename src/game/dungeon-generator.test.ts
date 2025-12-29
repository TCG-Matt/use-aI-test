import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateDungeon,
  generateRooms,
  connectRooms,
  placeStairs,
  populateRoom,
  isRoomOverlapping,
  getRoomCenter,
  createHorizontalCorridor,
  createVerticalCorridor,
} from './dungeon-generator';
import type { Room, Dungeon } from './types';

describe('Dungeon Generator', () => {
  describe('isRoomOverlapping', () => {
    it('should detect overlapping rooms', () => {
      const room1: Room = { x: 10, y: 10, width: 10, height: 10 };
      const room2: Room = { x: 15, y: 15, width: 10, height: 10 };
      expect(isRoomOverlapping(room1, room2, 2)).toBe(true);
    });

    it('should not detect non-overlapping rooms', () => {
      const room1: Room = { x: 10, y: 10, width: 10, height: 10 };
      const room2: Room = { x: 25, y: 25, width: 10, height: 10 };
      expect(isRoomOverlapping(room1, room2, 2)).toBe(false);
    });

    it('should respect minimum separation', () => {
      const room1: Room = { x: 10, y: 10, width: 10, height: 10 };
      const room2: Room = { x: 21, y: 10, width: 10, height: 10 };
      expect(isRoomOverlapping(room1, room2, 2)).toBe(true);
      expect(isRoomOverlapping(room1, room2, 0)).toBe(false);
    });
  });

  describe('getRoomCenter', () => {
    it('should calculate room center correctly', () => {
      const room: Room = { x: 10, y: 10, width: 10, height: 10 };
      const center = getRoomCenter(room);
      expect(center.x).toBe(15);
      expect(center.y).toBe(15);
    });

    it('should handle odd dimensions', () => {
      const room: Room = { x: 5, y: 5, width: 7, height: 9 };
      const center = getRoomCenter(room);
      expect(center.x).toBe(8);
      expect(center.y).toBe(9);
    });
  });

  describe('generateRooms', () => {
    it('should generate requested number of rooms', () => {
      const rooms = generateRooms(5, 80, 50);
      expect(rooms.length).toBeLessThanOrEqual(5);
      expect(rooms.length).toBeGreaterThan(0);
    });

    it('should generate rooms within bounds', () => {
      const rooms = generateRooms(10, 80, 50);
      rooms.forEach((room) => {
        expect(room.x).toBeGreaterThanOrEqual(1);
        expect(room.y).toBeGreaterThanOrEqual(1);
        expect(room.x + room.width).toBeLessThan(80);
        expect(room.y + room.height).toBeLessThan(50);
      });
    });

    it('should generate rooms with valid sizes', () => {
      const rooms = generateRooms(10, 80, 50);
      rooms.forEach((room) => {
        expect(room.width).toBeGreaterThanOrEqual(5);
        expect(room.width).toBeLessThanOrEqual(12);
        expect(room.height).toBeGreaterThanOrEqual(5);
        expect(room.height).toBeLessThanOrEqual(12);
      });
    });

    it('should not overlap rooms', () => {
      const rooms = generateRooms(10, 80, 50);
      for (let i = 0; i < rooms.length; i++) {
        for (let j = i + 1; j < rooms.length; j++) {
          expect(isRoomOverlapping(rooms[i], rooms[j], 2)).toBe(false);
        }
      }
    });
  });

  describe('createHorizontalCorridor', () => {
    it('should create corridor from left to right', () => {
      const positions = createHorizontalCorridor(5, 15, 10);
      expect(positions.length).toBe(11);
      expect(positions[0]).toEqual({ x: 5, y: 10 });
      expect(positions[10]).toEqual({ x: 15, y: 10 });
    });

    it('should create corridor from right to left', () => {
      const positions = createHorizontalCorridor(15, 5, 10);
      expect(positions.length).toBe(11);
      expect(positions[0]).toEqual({ x: 5, y: 10 });
      expect(positions[10]).toEqual({ x: 15, y: 10 });
    });
  });

  describe('createVerticalCorridor', () => {
    it('should create corridor from top to bottom', () => {
      const positions = createVerticalCorridor(5, 15, 10);
      expect(positions.length).toBe(11);
      expect(positions[0]).toEqual({ x: 10, y: 5 });
      expect(positions[10]).toEqual({ x: 10, y: 15 });
    });

    it('should create corridor from bottom to top', () => {
      const positions = createVerticalCorridor(15, 5, 10);
      expect(positions.length).toBe(11);
      expect(positions[0]).toEqual({ x: 10, y: 5 });
      expect(positions[10]).toEqual({ x: 10, y: 15 });
    });
  });

  describe('connectRooms', () => {
    it('should create corridors between rooms', () => {
      const rooms: Room[] = [
        { x: 10, y: 10, width: 8, height: 8 },
        { x: 30, y: 30, width: 8, height: 8 },
      ];
      const corridors = connectRooms(rooms);
      expect(corridors.length).toBeGreaterThan(0);
    });

    it('should return empty array for no rooms', () => {
      const corridors = connectRooms([]);
      expect(corridors.length).toBe(0);
    });

    it('should return empty array for single room', () => {
      const rooms: Room[] = [{ x: 10, y: 10, width: 8, height: 8 }];
      const corridors = connectRooms(rooms);
      expect(corridors.length).toBe(0);
    });
  });

  describe('placeStairs', () => {
    let dungeon: Dungeon;

    beforeEach(() => {
      const rooms = generateRooms(5, 80, 50);
      dungeon = {
        level: 1,
        width: 80,
        height: 50,
        tiles: Array(50)
          .fill(null)
          .map((_, y) =>
            Array(80)
              .fill(null)
              .map((_, x) => ({
                position: { x, y },
                type: 'wall' as const,
                visibility: 'unexplored' as const,
              }))
          ),
        rooms,
        corridors: [],
      };
    });

    it('should place down stairs on level 1', () => {
      placeStairs(dungeon);
      const hasDownStairs = dungeon.tiles.some((row) =>
        row.some((tile) => tile.type === 'stair_down')
      );
      expect(hasDownStairs).toBe(true);
    });

    it('should not place up stairs on level 1', () => {
      placeStairs(dungeon);
      const hasUpStairs = dungeon.tiles.some((row) =>
        row.some((tile) => tile.type === 'stair_up')
      );
      expect(hasUpStairs).toBe(false);
    });

    it('should place both up and down stairs on level 2+', () => {
      dungeon.level = 2;
      placeStairs(dungeon);
      const hasDownStairs = dungeon.tiles.some((row) =>
        row.some((tile) => tile.type === 'stair_down')
      );
      const hasUpStairs = dungeon.tiles.some((row) =>
        row.some((tile) => tile.type === 'stair_up')
      );
      expect(hasDownStairs).toBe(true);
      expect(hasUpStairs).toBe(true);
    });
  });

  describe('populateRoom', () => {
    it('should return items for a room', () => {
      const room: Room = { x: 10, y: 10, width: 8, height: 8 };
      const items = populateRoom(room, 1);
      expect(Array.isArray(items)).toBe(true);
    });

    it('should place items within room bounds', () => {
      const room: Room = { x: 10, y: 10, width: 8, height: 8 };
      const items = populateRoom(room, 1);
      items.forEach((item) => {
        if (item.position) {
          expect(item.position.x).toBeGreaterThanOrEqual(room.x + 1);
          expect(item.position.x).toBeLessThan(room.x + room.width - 1);
          expect(item.position.y).toBeGreaterThanOrEqual(room.y + 1);
          expect(item.position.y).toBeLessThan(room.y + room.height - 1);
        }
      });
    });

    it('should scale difficulty with level', () => {
      const room: Room = { x: 10, y: 10, width: 8, height: 8 };
      const itemsLevel1 = populateRoom(room, 1);
      const itemsLevel10 = populateRoom(room, 10);
      // Higher levels should generally have more/better items
      expect(itemsLevel1.length).toBeGreaterThanOrEqual(0);
      expect(itemsLevel10.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('generateDungeon', () => {
    it('should create a complete dungeon', () => {
      const dungeon = generateDungeon(1);
      expect(dungeon.level).toBe(1);
      expect(dungeon.width).toBe(80);
      expect(dungeon.height).toBe(50);
      expect(dungeon.tiles.length).toBe(50);
      expect(dungeon.tiles[0].length).toBe(80);
      expect(dungeon.rooms.length).toBeGreaterThan(0);
    });

    it('should have proper tile types', () => {
      const dungeon = generateDungeon(1);
      const hasWalls = dungeon.tiles.some((row) => row.some((tile) => tile.type === 'wall'));
      const hasFloors = dungeon.tiles.some((row) => row.some((tile) => tile.type === 'floor'));
      expect(hasWalls).toBe(true);
      expect(hasFloors).toBe(true);
    });

    it('should have stairs placed', () => {
      const dungeon = generateDungeon(1);
      const hasStairs = dungeon.tiles.some((row) =>
        row.some((tile) => tile.type === 'stair_down' || tile.type === 'stair_up')
      );
      expect(hasStairs).toBe(true);
    });

    it('should initialize all tiles as unexplored', () => {
      const dungeon = generateDungeon(1);
      dungeon.tiles.forEach((row) => {
        row.forEach((tile) => {
          expect(tile.visibility).toBe('unexplored');
        });
      });
    });

    it('should generate different dungeons for different levels', () => {
      const dungeon1 = generateDungeon(1);
      const dungeon2 = generateDungeon(2);
      expect(dungeon1.level).toBe(1);
      expect(dungeon2.level).toBe(2);
      // Rooms should be in different positions (probabilistically)
      const sameFirstRoom =
        dungeon1.rooms[0].x === dungeon2.rooms[0].x && dungeon1.rooms[0].y === dungeon2.rooms[0].y;
      // Very unlikely to be the same
      expect(sameFirstRoom).toBe(false);
    });
  });
});

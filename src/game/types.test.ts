import { describe, it, expect } from 'vitest';
import type {
  Position,
  Tile,
  TileType,
  Room,
  Corridor,
  Dungeon,
  Weapon,
  Armor,
  Potion,
  Food,
  Item,
  Player,
  Mob,
  GameState,
  VisibilityState,
  Direction,
} from './types';

describe('Type Definitions', () => {
  describe('Position', () => {
    it('should have x and y coordinates', () => {
      const pos: Position = { x: 5, y: 10 };
      expect(pos.x).toBe(5);
      expect(pos.y).toBe(10);
    });
  });

  describe('Tile', () => {
    it('should have position, type, and visibility', () => {
      const tile: Tile = {
        position: { x: 0, y: 0 },
        type: 'floor',
        visibility: 'unexplored',
      };
      expect(tile.type).toBe('floor');
      expect(tile.visibility).toBe('unexplored');
    });

    it('should support all tile types', () => {
      const types: TileType[] = ['floor', 'wall', 'corridor', 'stair_up', 'stair_down'];
      types.forEach((type) => {
        const tile: Tile = {
          position: { x: 0, y: 0 },
          type,
          visibility: 'unexplored',
        };
        expect(tile.type).toBe(type);
      });
    });

    it('should support all visibility states', () => {
      const states: VisibilityState[] = ['unexplored', 'explored', 'visible'];
      states.forEach((visibility) => {
        const tile: Tile = {
          position: { x: 0, y: 0 },
          type: 'floor',
          visibility,
        };
        expect(tile.visibility).toBe(visibility);
      });
    });
  });

  describe('Room', () => {
    it('should have position and dimensions', () => {
      const room: Room = {
        x: 10,
        y: 10,
        width: 8,
        height: 6,
      };
      expect(room.x).toBe(10);
      expect(room.width).toBe(8);
    });
  });

  describe('Corridor', () => {
    it('should have start and end positions', () => {
      const corridor: Corridor = {
        start: { x: 5, y: 5 },
        end: { x: 10, y: 10 },
      };
      expect(corridor.start.x).toBe(5);
      expect(corridor.end.x).toBe(10);
    });
  });

  describe('Weapon', () => {
    it('should have damage and name', () => {
      const weapon: Weapon = {
        id: 'sword1',
        type: 'weapon',
        name: 'Iron Sword',
        damage: 5,
      };
      expect(weapon.damage).toBe(5);
      expect(weapon.type).toBe('weapon');
    });
  });

  describe('Armor', () => {
    it('should have defense and name', () => {
      const armor: Armor = {
        id: 'armor1',
        type: 'armor',
        name: 'Leather Armor',
        defense: 3,
      };
      expect(armor.defense).toBe(3);
      expect(armor.type).toBe('armor');
    });
  });

  describe('Potion', () => {
    it('should have restoration amount', () => {
      const potion: Potion = {
        id: 'potion1',
        type: 'potion_health',
        name: 'Health Potion',
        restoreAmount: 20,
      };
      expect(potion.restoreAmount).toBe(20);
    });
  });

  describe('Food', () => {
    it('should have restoration amount', () => {
      const food: Food = {
        id: 'food1',
        type: 'food',
        name: 'Bread',
        restoreAmount: 10,
      };
      expect(food.restoreAmount).toBe(10);
    });
  });

  describe('Player', () => {
    it('should have all required properties', () => {
      const player: Player = {
        position: { x: 5, y: 5 },
        health: 100,
        maxHealth: 100,
        strength: 10,
        weapon: null,
        armor: null,
        inventory: [],
        level: 1,
      };
      expect(player.health).toBe(100);
      expect(player.strength).toBe(10);
      expect(player.level).toBe(1);
    });

    it('should support equipped items', () => {
      const weapon: Weapon = {
        id: 'sword1',
        type: 'weapon',
        name: 'Sword',
        damage: 5,
      };
      const armor: Armor = {
        id: 'armor1',
        type: 'armor',
        name: 'Armor',
        defense: 3,
      };
      const player: Player = {
        position: { x: 0, y: 0 },
        health: 100,
        maxHealth: 100,
        strength: 10,
        weapon,
        armor,
        inventory: [],
        level: 1,
      };
      expect(player.weapon?.damage).toBe(5);
      expect(player.armor?.defense).toBe(3);
    });
  });

  describe('Mob', () => {
    it('should have all required properties', () => {
      const mob: Mob = {
        id: 'mob1',
        position: { x: 10, y: 10 },
        health: 30,
        strength: 5,
        viewRange: 7,
        type: 'goblin',
        drops: ['weapon', 'food'],
      };
      expect(mob.health).toBe(30);
      expect(mob.type).toBe('goblin');
      expect(mob.drops).toContain('weapon');
    });

    it('should support all mob types', () => {
      const types: Array<'goblin' | 'skeleton' | 'troll' | 'dragon'> = [
        'goblin',
        'skeleton',
        'troll',
        'dragon',
      ];
      types.forEach((type) => {
        const mob: Mob = {
          id: 'mob1',
          position: { x: 0, y: 0 },
          health: 30,
          strength: 5,
          viewRange: 7,
          type,
          drops: [],
        };
        expect(mob.type).toBe(type);
      });
    });
  });

  describe('GameState', () => {
    it('should have all required properties', () => {
      const gameState: GameState = {
        player: {
          position: { x: 5, y: 5 },
          health: 100,
          maxHealth: 100,
          strength: 10,
          weapon: null,
          armor: null,
          inventory: [],
          level: 1,
        },
        currentDungeon: {
          level: 1,
          width: 80,
          height: 50,
          tiles: [],
          rooms: [],
          corridors: [],
        },
        mobs: [],
        items: [],
        messages: [],
        gameOver: false,
      };
      expect(gameState.player.health).toBe(100);
      expect(gameState.currentDungeon.level).toBe(1);
      expect(gameState.gameOver).toBe(false);
    });
  });

  describe('Direction', () => {
    it('should support 8 directions', () => {
      const directions: Direction[] = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
      directions.forEach((dir) => {
        expect(dir).toBeTruthy();
      });
    });
  });
});

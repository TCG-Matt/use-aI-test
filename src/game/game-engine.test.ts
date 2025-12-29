import { describe, it, expect } from 'vitest';
import {
  initializeGame,
  handlePlayerMove,
  updateMobs,
  useItem,
  changeLevel,
  pickupItem,
} from './game-engine';
import type { GameState } from './types';

describe('Game Engine', () => {
  describe('initializeGame', () => {
    it('should create initial game state', () => {
      const state = initializeGame();
      expect(state.player.health).toBe(100);
      expect(state.player.maxHealth).toBe(100);
      expect(state.player.strength).toBe(10);
      expect(state.player.level).toBe(1);
      expect(state.currentDungeon.level).toBe(1);
      expect(state.gameOver).toBe(false);
      expect(state.messages.length).toBeGreaterThan(0);
      expect(Array.isArray(state.mobs)).toBe(true);
      expect(Array.isArray(state.items)).toBe(true);
    });

    it('should place player in first room', () => {
      const state = initializeGame();
      const firstRoom = state.currentDungeon.rooms[0];
      expect(state.player.position.x).toBeGreaterThanOrEqual(firstRoom.x);
      expect(state.player.position.x).toBeLessThan(firstRoom.x + firstRoom.width);
      expect(state.player.position.y).toBeGreaterThanOrEqual(firstRoom.y);
      expect(state.player.position.y).toBeLessThan(firstRoom.y + firstRoom.height);
    });

    it('should update visibility around player', () => {
      const state = initializeGame();
      const playerTile =
        state.currentDungeon.tiles[state.player.position.y][state.player.position.x];
      expect(playerTile.visibility).toBe('visible');
    });
  });

  describe('handlePlayerMove', () => {
    it('should move player north', () => {
      const state = initializeGame();
      const oldY = state.player.position.y;
      const newState = handlePlayerMove('n', state);
      expect(newState.player.position.y).toBeLessThanOrEqual(oldY);
    });

    it('should move player east', () => {
      const state = initializeGame();
      const oldX = state.player.position.x;
      const newState = handlePlayerMove('e', state);
      expect(newState.player.position.x).toBeGreaterThanOrEqual(oldX);
    });

    it('should not move through walls', () => {
      const state = initializeGame();
      // Try to find a wall-blocked direction
      const directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'] as const;
      let foundBlockedMove = false;

      for (const dir of directions) {
        const newState = handlePlayerMove(dir, state);
        const tile =
          newState.currentDungeon.tiles[newState.player.position.y][newState.player.position.x];
        if (tile.type === 'wall') {
          foundBlockedMove = true;
          break;
        }
      }
      // Player should never be on a wall tile
      expect(foundBlockedMove).toBe(false);
    });

    it('should trigger combat when moving into mob', () => {
      const state = initializeGame();
      // Place a mob next to player
      if (state.mobs.length > 0) {
        state.mobs[0].position = {
          x: state.player.position.x + 1,
          y: state.player.position.y,
        };
        state.mobs[0].health = 100; // Ensure mob survives
        const initialPlayerHealth = state.player.health;
        
        const newState = handlePlayerMove('e', state);
        
        // Should have combat messages
        const hasAttackMessage = newState.messages.some((msg) => msg.includes('You attacked'));
        const hasCounterMessage = newState.messages.some((msg) => msg.includes('counter-attacks'));
        
        expect(hasAttackMessage).toBe(true);
        expect(hasCounterMessage).toBe(true);
        expect(newState.player.health).toBeLessThan(initialPlayerHealth);
      }
    });

    it('should update fog of war after moving', () => {
      const state = initializeGame();
      const newState = handlePlayerMove('e', state);
      const playerTile =
        newState.currentDungeon.tiles[newState.player.position.y][newState.player.position.x];
      expect(playerTile.visibility).toBe('visible');
    });
  });

  describe('updateMobs', () => {
    it('should move mobs towards player when in view', () => {
      const state = initializeGame();
      if (state.mobs.length > 0) {
        // Place mob near player
        const mob = state.mobs[0];
        mob.position = {
          x: state.player.position.x + 3,
          y: state.player.position.y,
        };
        const oldPos = { ...mob.position };

        const newState = updateMobs(state);
        const movedMob = newState.mobs.find((m) => m.id === mob.id);

        if (movedMob) {
          // Mob should have moved closer or attacked
          const oldDist = Math.abs(oldPos.x - state.player.position.x);
          const newDist = Math.abs(movedMob.position.x - newState.player.position.x);
          expect(newDist).toBeLessThanOrEqual(oldDist);
        }
      }
    });

    it('should not move mobs that cannot see player', () => {
      const state = initializeGame();
      if (state.mobs.length > 0) {
        // Place mob far from player
        const mob = state.mobs[0];
        mob.position = {
          x: 0,
          y: 0,
        };
        mob.viewRange = 3;
        const oldPos = { ...mob.position };

        const newState = updateMobs(state);
        const sameMob = newState.mobs.find((m) => m.id === mob.id);

        if (sameMob && Math.abs(oldPos.x - state.player.position.x) > 10) {
          expect(sameMob.position).toEqual(oldPos);
        }
      }
    });
  });

  describe('useItem', () => {
    it('should use health potion and heal player', () => {
      const state = initializeGame();
      state.player.health = 50;
      state.player.inventory = [
        {
          id: 'potion1',
          type: 'potion_health',
          name: 'Health Potion',
          restoreAmount: 30,
        },
      ];

      const newState = useItem('potion1', state);
      expect(newState.player.health).toBe(80);
      expect(newState.player.inventory.length).toBe(0);
    });

    it('should use strength potion and increase strength', () => {
      const state = initializeGame();
      state.player.inventory = [
        {
          id: 'potion1',
          type: 'potion_strength',
          name: 'Strength Potion',
          restoreAmount: 5,
        },
      ];

      const oldStrength = state.player.strength;
      const newState = useItem('potion1', state);
      expect(newState.player.strength).toBe(oldStrength + 5);
      expect(newState.player.inventory.length).toBe(0);
    });

    it('should use food and heal player', () => {
      const state = initializeGame();
      state.player.health = 70;
      state.player.inventory = [
        {
          id: 'food1',
          type: 'food',
          name: 'Bread',
          restoreAmount: 15,
        },
      ];

      const newState = useItem('food1', state);
      expect(newState.player.health).toBe(85);
      expect(newState.player.inventory.length).toBe(0);
    });

    it('should equip weapon from inventory', () => {
      const state = initializeGame();
      state.player.inventory = [
        {
          id: 'sword1',
          type: 'weapon',
          name: 'Sword',
          damage: 5,
        },
      ];

      const newState = useItem('sword1', state);
      expect(newState.player.weapon?.id).toBe('sword1');
      // Weapon is now equipped, removed from inventory but not returned since there was no previous weapon
      expect(newState.player.inventory.length).toBe(0);
    });

    it('should equip armor from inventory', () => {
      const state = initializeGame();
      state.player.inventory = [
        {
          id: 'armor1',
          type: 'armor',
          name: 'Armor',
          defense: 3,
        },
      ];

      const newState = useItem('armor1', state);
      expect(newState.player.armor?.id).toBe('armor1');
      // Armor is now equipped, removed from inventory but not returned since there was no previous armor
      expect(newState.player.inventory.length).toBe(0);
    });
  });

  describe('pickupItem', () => {
    it('should pick up item at player position', () => {
      const state = initializeGame();
      state.items = [
        {
          id: 'item1',
          type: 'food',
          name: 'Food',
          restoreAmount: 10,
          position: state.player.position,
        },
      ];

      const newState = pickupItem(state);
      expect(newState.player.inventory.length).toBe(1);
      expect(newState.items.length).toBe(0);
    });

    it('should not pick up when inventory is full', () => {
      const state = initializeGame();
      // Fill inventory
      for (let i = 0; i < 20; i++) {
        state.player.inventory.push({
          id: `item${i}`,
          type: 'food',
          name: 'Food',
          restoreAmount: 10,
        });
      }

      state.items = [
        {
          id: 'item99',
          type: 'food',
          name: 'Food',
          restoreAmount: 10,
          position: state.player.position,
        },
      ];

      const newState = pickupItem(state);
      expect(newState.items.length).toBe(1);
      expect(newState.messages.some((msg) => msg.includes('full'))).toBe(true);
    });
  });

  describe('changeLevel', () => {
    it('should go down stairs to next level', () => {
      const state = initializeGame();
      // Place player on down stairs
      const downStairTile = state.currentDungeon.tiles
        .flat()
        .find((tile) => tile.type === 'stair_down');
      if (downStairTile) {
        state.player.position = downStairTile.position;
        const newState = changeLevel('down', state);
        expect(newState.player.level).toBe(2);
        expect(newState.currentDungeon.level).toBe(2);
      }
    });

    it('should go up stairs to previous level', () => {
      const state = initializeGame();
      state.player.level = 2;
      state.currentDungeon.level = 2;

      // Find or create up stair
      const upStairTile = state.currentDungeon.tiles
        .flat()
        .find((tile) => tile.type === 'stair_up');
      if (upStairTile) {
        state.player.position = upStairTile.position;
        const newState = changeLevel('up', state);
        expect(newState.player.level).toBe(1);
        expect(newState.currentDungeon.level).toBe(1);
      }
    });

    it('should not go up from level 1', () => {
      const state = initializeGame();
      const newState = changeLevel('up', state);
      expect(newState.player.level).toBe(1);
    });
  });
});

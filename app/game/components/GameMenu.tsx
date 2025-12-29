'use client';

import { useState } from 'react';
import type { GameState, Item } from '@/game/types';

interface InventoryMenuProps {
  gameState: GameState;
  onUseItem: (itemId: string) => void;
  onClose: () => void;
}

/**
 * Inventory menu component
 */
export function InventoryMenu({ gameState, onUseItem, onClose }: InventoryMenuProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Inventory</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {gameState.player.inventory.length === 0 ? (
          <div className="text-gray-400 text-center py-8">Inventory is empty</div>
        ) : (
          <div className="grid gap-2">
            {gameState.player.inventory.map((item: Item) => (
              <button
                key={item.id}
                onClick={() => {
                  onUseItem(item.id);
                  if (item.type !== 'potion_health' && item.type !== 'potion_strength' && item.type !== 'food') {
                    onClose();
                  }
                }}
                className="bg-gray-800 hover:bg-gray-700 p-3 rounded text-left transition-colors"
              >
                <div className="font-bold">{item.name}</div>
                <div className="text-sm text-gray-400">
                  {item.type === 'weapon' && `Damage: +${item.damage}`}
                  {item.type === 'armor' && `Defense: +${item.defense}`}
                  {(item.type === 'potion_health' ||
                    item.type === 'potion_strength' ||
                    item.type === 'food') &&
                    `Restores: ${item.restoreAmount}`}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface GameMenuProps {
  onNewGame: () => void;
  onContinue: () => void;
  onSave: () => void;
  onClose: () => void;
  hasSave: boolean;
}

/**
 * Game menu component
 */
export function GameMenu({ onNewGame, onContinue, onSave, onClose, hasSave }: GameMenuProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white p-8 rounded-lg max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center">Dungeon Crawler</h2>

        <div className="space-y-3">
          {hasSave && (
            <button
              onClick={onContinue}
              className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-bold transition-colors"
            >
              Continue Game
            </button>
          )}
          
          <button
            onClick={onNewGame}
            className="w-full bg-green-600 hover:bg-green-700 px-6 py-3 rounded font-bold transition-colors"
          >
            New Game
          </button>

          <button
            onClick={onSave}
            className="w-full bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded font-bold transition-colors"
          >
            Save Game
          </button>

          <button
            onClick={onClose}
            className="w-full bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded font-bold transition-colors"
          >
            Resume
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-400 text-center">
          <p>Explore dark dungeons, fight monsters,</p>
          <p>and collect powerful items!</p>
        </div>
      </div>
    </div>
  );
}

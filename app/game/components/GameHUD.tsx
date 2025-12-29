'use client';

import type { GameState } from '@/game/types';

interface GameHUDProps {
  gameState: GameState;
}

/**
 * HUD component showing player stats and messages
 */
export function GameHUD({ gameState }: GameHUDProps) {
  const { player, messages, gameOver } = gameState;

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-900 text-white rounded-lg">
      {/* Player Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-400">Health</div>
          <div className="text-xl font-bold text-red-500">
            {player.health} / {player.maxHealth}
          </div>
          <div className="w-full bg-gray-700 h-2 rounded">
            <div
              className="bg-red-500 h-2 rounded"
              style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-400">Level</div>
          <div className="text-xl font-bold">{player.level}</div>
        </div>

        <div>
          <div className="text-sm text-gray-400">Strength</div>
          <div className="text-xl font-bold">{player.strength}</div>
        </div>

        <div>
          <div className="text-sm text-gray-400">Inventory</div>
          <div className="text-xl font-bold">{player.inventory.length} / 20</div>
        </div>
      </div>

      {/* Equipment */}
      <div className="border-t border-gray-700 pt-4">
        <div className="text-sm text-gray-400 mb-2">Equipment</div>
        <div className="space-y-1 text-sm">
          <div>
            <span className="text-gray-400">Weapon:</span>{' '}
            {player.weapon ? `${player.weapon.name} (+${player.weapon.damage})` : 'None'}
          </div>
          <div>
            <span className="text-gray-400">Armor:</span>{' '}
            {player.armor ? `${player.armor.name} (+${player.armor.defense})` : 'None'}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="border-t border-gray-700 pt-4">
        <div className="text-sm text-gray-400 mb-2">Messages</div>
        <div className="h-32 overflow-y-auto space-y-1 text-sm">
          {messages.slice(-10).map((msg: string, i: number) => (
            <div key={i} className="text-gray-300">
              {msg}
            </div>
          ))}
        </div>
      </div>

      {/* Game Over */}
      {gameOver && (
        <div className="border-t border-gray-700 pt-4">
          <div className="text-2xl font-bold text-red-500 text-center">GAME OVER</div>
        </div>
      )}

      {/* Controls Help */}
      <div className="border-t border-gray-700 pt-4 text-xs text-gray-500">
        <div>WASD/Arrows: Move</div>
        <div>E: Pick up item</div>
        <div>I: Inventory</div>
        <div>&lt; / &gt;: Use stairs</div>
        <div>ESC: Menu</div>
      </div>
    </div>
  );
}

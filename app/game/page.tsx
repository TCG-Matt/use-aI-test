'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { GameHUD } from './components/GameHUD';
import { InventoryMenu, GameMenu } from './components/GameMenu';
import {
  initializeGame,
  handlePlayerMove,
  pickupItem,
  useItem,
  changeLevel,
} from '@/game/game-engine';
import { keyToAction, type GameAction } from '@/game/input-handler';
import { saveGame, loadGame, hasSavedGame, clearSave } from '@/game/save-manager';
import type { GameState } from '@/game/types';

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showInventory, setShowInventory] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [hasSave, setHasSave] = useState(false);

  // Initialize game on mount
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      setHasSave(hasSavedGame());
    }
  }, [initialized]);

  // Handle keyboard input
  useEffect(() => {
    if (!gameState || showInventory || showMenu) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for game keys
      if (['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight', ' ', 'e', 'i', '<', '>', 'Escape'].includes(e.key)) {
        e.preventDefault();
      }

      const action = keyToAction(e.key);
      if (!action) return;

      switch (action.type) {
        case 'move':
          setGameState((prev: GameState | null) => (prev ? handlePlayerMove(action.direction, prev) : prev));
          break;
        case 'pickup':
          setGameState((prev: GameState | null) => (prev ? pickupItem(prev) : prev));
          break;
        case 'inventory':
          setShowInventory(true);
          break;
        case 'menu':
          setShowMenu(true);
          break;
        case 'stairs_up':
          setGameState((prev: GameState | null) => (prev ? changeLevel('up', prev) : prev));
          break;
        case 'stairs_down':
          setGameState((prev: GameState | null) => (prev ? changeLevel('down', prev) : prev));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, showInventory, showMenu]);

  // Auto-save on state change
  useEffect(() => {
    if (gameState && !showMenu) {
      saveGame(gameState);
    }
  }, [gameState, showMenu]);

  const handleNewGame = useCallback(() => {
    clearSave();
    const newGame = initializeGame();
    setGameState(newGame);
    setShowMenu(false);
  }, []);

  const handleContinue = useCallback(() => {
    const saved = loadGame();
    if (saved) {
      setGameState(saved);
      setShowMenu(false);
    }
  }, []);

  const handleSave = useCallback(() => {
    if (gameState) {
      saveGame(gameState);
      setHasSave(true);
      const updatedState = {
        ...gameState,
        messages: [...gameState.messages, 'Game saved!'],
      };
      setGameState(updatedState);
    }
  }, [gameState]);

  const handleUseItem = useCallback(
    (itemId: string) => {
      if (gameState) {
        setGameState(useItem(itemId, gameState));
      }
    },
    [gameState]
  );

  if (!gameState) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        {initialized && (
          <GameMenu
            onNewGame={handleNewGame}
            onContinue={handleContinue}
            onSave={() => {}}
            onClose={() => {}}
            hasSave={hasSave}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">Dungeon Crawler</h1>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Canvas */}
          <div className="lg:col-span-2">
            <GameCanvas gameState={gameState} width={800} height={600} />
          </div>

          {/* HUD */}
          <div>
            <GameHUD gameState={gameState} />
          </div>
        </div>
      </div>

      {/* Inventory Modal */}
      {showInventory && (
        <InventoryMenu
          gameState={gameState}
          onUseItem={handleUseItem}
          onClose={() => setShowInventory(false)}
        />
      )}

      {/* Menu Modal */}
      {showMenu && (
        <GameMenu
          onNewGame={handleNewGame}
          onContinue={handleContinue}
          onSave={handleSave}
          onClose={() => setShowMenu(false)}
          hasSave={hasSave}
        />
      )}
    </div>
  );
}

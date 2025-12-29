# Dungeon Crawler Game

A classic roguelike dungeon crawler built with Next.js, TypeScript, and HTML5 Canvas.

## Features

✅ **Procedurally Generated Dungeons** - Every playthrough is unique with randomly generated rooms and corridors
✅ **Fog of War** - Explore dark dungeons with limited visibility that reveals the map as you explore
✅ **Bump Combat System** - Classic roguelike combat - bump into enemies to attack them
✅ **Equipment & Inventory** - Find and equip weapons and armor, manage up to 20 items
✅ **Multiple Item Types** - Weapons, armor, health potions, strength potions, and food
✅ **Enemy Types** - Face goblins, skeletons, trolls, and dragons with different stats
✅ **Multi-Level Dungeons** - Descend deeper into the dungeon with increasing difficulty
✅ **Auto-Save** - Your progress is automatically saved to browser localStorage
✅ **Keyboard Controls** - Full keyboard support for movement and actions

## How to Play

### Controls

- **WASD** or **Arrow Keys**: Move your character (8-directional movement)
- **E**: Pick up items
- **I**: Open inventory
- **< / >**: Use stairs to change levels
- **ESC**: Open game menu
- **Space**: Wait/skip turn

### Gameplay

1. Start the game from the home page
2. Explore procedurally generated dungeons
3. Fight monsters by bumping into them
4. Collect weapons, armor, and consumables
5. Manage your health and inventory
6. Find the stairs to descend deeper
7. Try to survive as long as possible!

### Game Mechanics

- **Health**: Your HP - if it reaches 0, game over
- **Strength**: Base damage for attacks
- **Weapons**: Add bonus damage to your attacks
- **Armor**: Reduces incoming damage
- **Fog of War**: Only see tiles within your view radius (7 tiles)
- **Mob AI**: Enemies move towards you when they see you
- **Level Scaling**: Deeper floors have stronger enemies and better loot

## Running the Game

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Type check
npm run type-check
```

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **HTML5 Canvas** - High-performance game rendering
- **Tailwind CSS** - Styling
- **Vitest** - Testing framework with 148 passing tests
- **localStorage** - Game persistence

## Project Structure

```
src/game/               # Core game logic
├── types.ts           # TypeScript type definitions
├── dungeon-generator.ts  # Procedural dungeon generation
├── fog-of-war.ts      # Visibility system
├── combat.ts          # Combat resolution
├── game-engine.ts     # Core game loop and state management
├── renderer.ts        # Canvas rendering
├── input-handler.ts   # Keyboard input
├── save-manager.ts    # Save/load functionality
└── entities/          # Game entities
    ├── player.ts      # Player character
    ├── mob.ts         # Enemy monsters
    └── item.ts        # Items and loot

app/game/              # Next.js UI components
├── page.tsx           # Main game page
└── components/        # React components
    ├── GameCanvas.tsx # Canvas renderer component
    ├── GameHUD.tsx    # Player stats and messages
    └── GameMenu.tsx   # Menus and inventory

```

## Development

This project follows strict TDD practices with:
- 100% test coverage for core game logic
- All functions have explicit return types
- Comprehensive JSDoc documentation
- Immutable state updates for predictability

## Game Balance

- Player starts with 100 HP and 10 strength
- Mobs scale with dungeon level
- View radius: 7 tiles for player, 5-10 for mobs
- Inventory capacity: 20 items
- Items scale in power with dungeon depth

## License

MIT

---

Built with ❤️ using Next.js and TypeScript

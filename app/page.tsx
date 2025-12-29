import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Dungeon Crawler
        </h1>
        
        <p className="text-xl text-gray-300 mb-8">
          Explore dark dungeons, battle fearsome monsters, and collect powerful loot
          in this classic roguelike adventure.
        </p>

        <div className="space-y-4 mb-12">
          <div className="flex items-center justify-center gap-3 text-gray-400">
            <div className="text-center">
              <div className="text-3xl">⚔️</div>
              <div className="text-sm">Combat</div>
            </div>
            <div className="text-center">
              <div className="text-3xl">🗺️</div>
              <div className="text-sm">Exploration</div>
            </div>
            <div className="text-center">
              <div className="text-3xl">📦</div>
              <div className="text-sm">Loot</div>
            </div>
            <div className="text-center">
              <div className="text-3xl">🎮</div>
              <div className="text-sm">Roguelike</div>
            </div>
          </div>
        </div>

        <Link
          href="/game"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xl px-12 py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl"
        >
          Start Adventure
        </Link>

        <div className="mt-12 text-sm text-gray-500">
          <p className="mb-2">Features:</p>
          <ul className="space-y-1">
            <li>✓ Procedurally generated dungeons</li>
            <li>✓ Fog of war exploration</li>
            <li>✓ Bump combat system</li>
            <li>✓ Equipment and inventory</li>
            <li>✓ Auto-save functionality</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

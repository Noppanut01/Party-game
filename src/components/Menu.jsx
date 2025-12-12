export default function Menu({ onSelectGame }) {
  const games = [
    {
      id: 'pirate',
      emoji: '🏴‍☠️',
      title: 'PIRATE BARREL',
      description: 'ลากดาบเสียบถัง',
      gradient: 'from-amber-900 to-amber-700',
      border: 'border-yellow-600',
      players: '2-8 Players'
    },
    {
      id: 'crocodile',
      emoji: '🐊',
      title: 'CROCODILE DENTIST',
      description: 'กดฟันจระเข้ลุ้นโชค',
      gradient: 'from-green-800 to-green-600',
      border: 'border-green-400',
      players: '2-10 Players'
    },
    {
      id: 'cards',
      emoji: '🃏',
      title: 'PARTY POKER',
      description: 'ลากไพ่ทำตามคำสั่ง',
      gradient: 'from-purple-900 to-purple-700',
      border: 'border-purple-400',
      players: '2-12 Players'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-bebas text-7xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mb-4 neon-text">
        🎰 CASINO
      </h1>
      <h2 className="text-bebas text-4xl md:text-6xl text-yellow-400 mb-2 neon-text">
        PARTY GAMES
      </h2>
      <p className="text-white/80 text-xl mb-12">เลือกเกมที่คุณต้องการ</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => onSelectGame(game.id)}
            className="group cursor-pointer"
          >
            <div className={`bg-gradient-to-br ${game.gradient} rounded-3xl p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-4 ${game.border}`}>
              <div className="text-center">
                <div className="text-8xl mb-4 transform group-hover:scale-110 transition-transform">
                  {game.emoji}
                </div>
                <h3 className="text-bebas text-4xl text-yellow-300 mb-2">
                  {game.title}
                </h3>
                <p className="text-yellow-100 mb-4">{game.description}</p>
                <div className="flex items-center justify-center gap-2 text-yellow-200">
                  <span>👥</span>
                  <span>{game.players}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-12 text-white/60 text-sm">
        ⚠️ ดื่มอย่างมีสติ อย่าขับขี่หลังดื่ม
      </div>
    </div>
  )
}

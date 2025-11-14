import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Trophy, Zap } from 'lucide-react'
import { useAudio } from '../contexts/AudioContext'

interface GameCard {
  id: string
  name: string
  description: string
  players: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  available: boolean
  route?: string
}

const games: GameCard[] = [
  {
    id: 'draw',
    name: 'Draw',
    description: 'Classic domino game. Draw from the boneyard when you can\'t play.',
    players: '2-4',
    difficulty: 'Easy',
    available: true,
    route: '/play/draw',
  },
  {
    id: 'block',
    name: 'Block',
    description: 'No draws allowed. Block your opponents or get blocked!',
    players: '2-4',
    difficulty: 'Easy',
    available: false,
  },
  {
    id: 'mexican-train',
    name: 'Mexican Train',
    description: 'Build your personal train and hop on the Mexican train.',
    players: '2-8',
    difficulty: 'Medium',
    available: false,
  },
  {
    id: 'chickenfoot',
    name: 'Chickenfoot',
    description: 'Create chickenfoot patterns with doubles.',
    players: '2-8',
    difficulty: 'Medium',
    available: false,
  },
]

export default function DominoGames() {
  const navigate = useNavigate()
  const { playSound, vibrate } = useAudio()

  const handleGameClick = (game: GameCard) => {
    if (!game.available) return

    playSound('click')
    vibrate(10)

    if (game.route) {
      setTimeout(() => navigate(game.route!), 150)
    }
  }

  return (
    <div className="min-h-screen w-full p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-bone-100 mb-3 text-shadow">
            Domino Games
          </h1>
          <p className="text-bone-400 text-lg">
            Choose your game variant
          </p>
        </motion.div>

        {/* Game grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {games.map((game, index) => (
            <motion.button
              key={game.id}
              onClick={() => handleGameClick(game)}
              disabled={!game.available}
              className={`
                relative overflow-hidden rounded-xl p-6
                glass-effect text-left
                transition-all duration-300 touch-manipulation
                ${game.available
                  ? 'hover:glow-effect cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
                }
              `}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={game.available ? { scale: 1.02 } : {}}
              whileTap={game.available ? { scale: 0.98 } : {}}
            >
              {/* Badge */}
              {!game.available && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full
                                bg-bone-700 text-bone-400 text-xs font-semibold">
                  Coming Soon
                </div>
              )}

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-bone-100 mb-2">
                    {game.name}
                  </h3>
                  <p className="text-bone-400 text-sm leading-relaxed">
                    {game.description}
                  </p>
                </div>

                {/* Meta info */}
                <div className="flex flex-wrap gap-3 text-sm">
                  <div className="flex items-center gap-2 text-bone-300">
                    <Users size={16} />
                    <span>{game.players} players</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {game.difficulty === 'Easy' && (
                      <>
                        <Zap size={16} className="text-green-400" />
                        <span className="text-green-400">Easy</span>
                      </>
                    )}
                    {game.difficulty === 'Medium' && (
                      <>
                        <Trophy size={16} className="text-yellow-400" />
                        <span className="text-yellow-400">Medium</span>
                      </>
                    )}
                    {game.difficulty === 'Hard' && (
                      <>
                        <Trophy size={16} className="text-red-400" />
                        <span className="text-red-400">Hard</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Action hint */}
                {game.available && (
                  <div className="pt-2 text-bone-500 text-sm">
                    Tap to play →
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

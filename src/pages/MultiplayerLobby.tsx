import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Copy, Check, Play, UserPlus } from 'lucide-react'
import { useMultiplayer } from '../hooks/useMultiplayer'
import { useGame } from '../contexts/GameContext'
import { useAudio } from '../contexts/AudioContext'

export default function MultiplayerLobby() {
  const navigate = useNavigate()
  const { currentPlayer } = useGame()
  const { playSound, vibrate } = useAudio()
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu')
  const [roomCodeInput, setRoomCodeInput] = useState('')
  const [copied, setCopied] = useState(false)

  const {
    room,
    isConnected,
    isHost,
    error,
    createRoom,
    joinRoom,
    startGame,
  } = useMultiplayer(currentPlayer?.id || 'guest')

  const handleCreateRoom = () => {
    if (!currentPlayer) return
    createRoom(currentPlayer.name)
    setMode('create')
    playSound('click')
    vibrate(10)
  }

  const handleJoinRoom = () => {
    if (!currentPlayer || !roomCodeInput.trim()) return
    joinRoom(roomCodeInput.toUpperCase(), currentPlayer.name)
    playSound('click')
    vibrate(10)
  }

  const handleStartGame = () => {
    if (!isHost) return
    startGame()
    playSound('success')
    vibrate([10, 50, 10])
    // Navigate to game after a short delay
    setTimeout(() => navigate('/play/draw-multiplayer'), 500)
  }

  const handleCopyCode = () => {
    if (!room) return
    navigator.clipboard.writeText(room.code)
    setCopied(true)
    playSound('click')
    vibrate(5)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="spinner mx-auto" />
          <p className="text-bone-400">Connecting to server...</p>
        </div>
      </div>
    )
  }

  // Lobby view (when in a room)
  if (room) {
    return (
      <div className="min-h-screen w-full p-4 sm:p-8 flex items-center justify-center">
        <motion.div
          className="max-w-2xl w-full glass-effect rounded-2xl p-6 sm:p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Room code */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-bone-100 mb-4">Game Lobby</h2>
            <div className="flex items-center justify-center gap-3">
              <div className="glass-effect px-6 py-3 rounded-lg">
                <span className="text-bone-400 text-sm">Room Code</span>
                <p className="text-3xl font-bold text-bone-100 tracking-wider">{room.code}</p>
              </div>
              <button
                onClick={handleCopyCode}
                className="p-3 bg-bone-700 hover:bg-bone-600 rounded-lg transition-colors touch-manipulation"
              >
                {copied ? <Check size={24} className="text-green-400" /> : <Copy size={24} className="text-bone-300" />}
              </button>
            </div>
          </div>

          {/* Players list */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Users size={20} className="text-bone-400" />
              <h3 className="text-lg font-semibold text-bone-100">
                Players ({room.players.length}/{room.maxPlayers})
              </h3>
            </div>

            <div className="space-y-2">
              {room.players.map((player, index) => (
                <motion.div
                  key={player.id}
                  className="glass-effect rounded-lg p-4 flex items-center justify-between"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-bone-600 flex items-center justify-center text-bone-100 font-bold">
                      {player.name.charAt(0)}
                    </div>
                    <span className="text-bone-100 font-medium">{player.name}</span>
                  </div>
                  {player.socketId === room.host && (
                    <span className="px-3 py-1 bg-bone-600 rounded-full text-bone-100 text-sm font-semibold">
                      Host
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className="text-red-300 text-center">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dominoes')}
              className="flex-1 py-3 bg-bone-700 hover:bg-bone-600 rounded-lg
                       font-semibold text-bone-100 transition-colors touch-manipulation"
            >
              Leave Lobby
            </button>

            {isHost && (
              <button
                onClick={handleStartGame}
                disabled={room.players.length < 2}
                className={`
                  flex-1 py-3 rounded-lg font-semibold transition-colors touch-manipulation
                  flex items-center justify-center gap-2
                  ${room.players.length >= 2
                    ? 'bg-bone-600 hover:bg-bone-500 text-bone-100'
                    : 'bg-bone-800 text-bone-600 cursor-not-allowed'
                  }
                `}
              >
                <Play size={20} />
                Start Game
              </button>
            )}

            {!isHost && (
              <div className="flex-1 py-3 glass-effect rounded-lg text-center">
                <p className="text-bone-400 text-sm">Waiting for host to start...</p>
              </div>
            )}
          </div>

          {/* Minimum players notice */}
          {room.players.length < 2 && isHost && (
            <p className="text-bone-500 text-sm text-center mt-4">
              Need at least 2 players to start
            </p>
          )}
        </motion.div>
      </div>
    )
  }

  // Menu view
  return (
    <div className="min-h-screen w-full p-4 sm:p-8 flex items-center justify-center">
      <motion.div
        className="max-w-md w-full glass-effect rounded-2xl p-6 sm:p-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2 className="text-3xl font-bold text-bone-100 mb-6 text-center">
          Multiplayer Draw
        </h2>

        <AnimatePresence mode="wait">
          {mode === 'menu' && (
            <motion.div
              key="menu"
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                onClick={handleCreateRoom}
                className="w-full py-4 bg-bone-600 hover:bg-bone-500 rounded-lg
                         font-semibold text-bone-100 transition-colors touch-manipulation
                         flex items-center justify-center gap-3"
              >
                <UserPlus size={24} />
                Create Room
              </button>

              <button
                onClick={() => setMode('join')}
                className="w-full py-4 bg-bone-700 hover:bg-bone-600 rounded-lg
                         font-semibold text-bone-100 transition-colors touch-manipulation
                         flex items-center justify-center gap-3"
              >
                <Users size={24} />
                Join Room
              </button>

              <button
                onClick={() => navigate('/dominoes')}
                className="w-full py-3 bg-bone-800 hover:bg-bone-700 rounded-lg
                         font-semibold text-bone-300 transition-colors touch-manipulation"
              >
                Back
              </button>
            </motion.div>
          )}

          {mode === 'join' && (
            <motion.div
              key="join"
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div>
                <label className="block text-bone-300 text-sm font-semibold mb-2">
                  Room Code
                </label>
                <input
                  type="text"
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                  placeholder="Enter 6-letter code"
                  maxLength={6}
                  className="w-full px-4 py-3 bg-bone-800 border border-bone-700 rounded-lg
                           text-bone-100 placeholder-bone-600 text-center text-2xl tracking-wider
                           focus:outline-none focus:border-bone-500 transition-colors uppercase"
                />
              </div>

              {error && (
                <motion.div
                  className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-red-300 text-sm text-center">{error}</p>
                </motion.div>
              )}

              <button
                onClick={handleJoinRoom}
                disabled={roomCodeInput.length !== 6}
                className={`
                  w-full py-3 rounded-lg font-semibold transition-colors touch-manipulation
                  ${roomCodeInput.length === 6
                    ? 'bg-bone-600 hover:bg-bone-500 text-bone-100'
                    : 'bg-bone-800 text-bone-600 cursor-not-allowed'
                  }
                `}
              >
                Join Game
              </button>

              <button
                onClick={() => {
                  setMode('menu')
                  setRoomCodeInput('')
                  playSound('click')
                }}
                className="w-full py-3 bg-bone-800 hover:bg-bone-700 rounded-lg
                         font-semibold text-bone-300 transition-colors touch-manipulation"
              >
                Back
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

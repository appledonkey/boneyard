import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, Trophy } from 'lucide-react'
import DominoTile from '../../components/domino/DominoTile'
import GameBoard from '../../components/domino/GameBoard'
import PlayerHand from '../../components/domino/PlayerHand'
import { useAudio } from '../../contexts/AudioContext'
import { useGame } from '../../contexts/GameContext'
import { useDrawGame } from '../../hooks/useDrawGame'
import type { Domino } from '../../types/domino'

export default function DrawGame() {
  const navigate = useNavigate()
  const { playSound, vibrate } = useAudio()
  const { currentPlayer } = useGame()
  const [activeDomino, setActiveDomino] = useState<Domino | null>(null)
  const [showTutorial, setShowTutorial] = useState(true)

  const {
    gameState,
    isMyTurn,
    placeDomino,
    drawFromBoneyard,
    passTurn,
    startGame,
  } = useDrawGame(currentPlayer?.id || 'guest')

  useEffect(() => {
    // Auto-dismiss tutorial after 5 seconds
    const timer = setTimeout(() => setShowTutorial(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  const handleDragStart = (event: DragStartEvent) => {
    const domino = event.active.data.current as Domino
    setActiveDomino(domino)
    playSound('click')
    vibrate(5)
  }

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      setActiveDomino(null)

      if (!over) {
        playSound('click')
        return
      }

      const domino = active.data.current as Domino
      const side = over.id as 'left' | 'right'

      const success = placeDomino(domino, side)

      if (success) {
        playSound('snap')
        vibrate([10, 50, 10])
      } else {
        playSound('click')
        vibrate(20)
      }
    },
    [placeDomino, playSound, vibrate]
  )

  const handleDrawClick = () => {
    const drawn = drawFromBoneyard()
    if (drawn) {
      playSound('click')
      vibrate(10)
    }
  }

  const handlePassClick = () => {
    passTurn()
    playSound('click')
    vibrate(10)
  }

  if (!gameState) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="spinner mx-auto" />
          <p className="text-bone-400">Setting up game...</p>
        </div>
      </div>
    )
  }

  const currentPlayerData = gameState.players[gameState.currentPlayerIndex]
  const myPlayerData = gameState.players.find((p) => p.id === currentPlayer?.id)

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-bone-900 to-bone-800">
        {/* Header */}
        <div className="glass-effect px-4 py-3 flex items-center justify-between border-b border-bone-700/30">
          <button
            onClick={() => navigate('/dominoes')}
            className="p-2 hover:bg-bone-700/50 rounded-lg transition-colors touch-manipulation"
          >
            <ArrowLeft size={24} className="text-bone-400" />
          </button>

          <div className="text-center">
            <h2 className="text-lg font-bold text-bone-100">Draw</h2>
            <p className="text-sm text-bone-400">
              {isMyTurn ? 'Your turn' : `${currentPlayerData.name}'s turn`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-bone-300">
              <Users size={18} />
              <span className="text-sm">{gameState.players.length}</span>
            </div>
          </div>
        </div>

        {/* Tutorial overlay */}
        <AnimatePresence>
          {showTutorial && (
            <motion.div
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTutorial(false)}
            >
              <motion.div
                className="glass-effect rounded-xl p-6 max-w-md mx-4"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <h3 className="text-2xl font-bold text-bone-100 mb-4">
                  How to Play Draw
                </h3>
                <ul className="space-y-3 text-bone-300">
                  <li className="flex items-start gap-2">
                    <span className="text-bone-500 mt-1">•</span>
                    <span>Match the pips on your domino to either end of the chain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bone-500 mt-1">•</span>
                    <span>Drag a domino from your hand to a highlighted zone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bone-500 mt-1">•</span>
                    <span>Draw from the boneyard if you can't play</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bone-500 mt-1">•</span>
                    <span>First player to empty their hand wins!</span>
                  </li>
                </ul>
                <button
                  onClick={() => setShowTutorial(false)}
                  className="mt-6 w-full py-3 bg-bone-600 hover:bg-bone-500 rounded-lg
                           font-semibold text-bone-100 transition-colors touch-manipulation"
                >
                  Got it!
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game board */}
        <div className="flex-1 overflow-auto no-scrollbar p-4">
          <GameBoard
            board={gameState.board}
            boardEnds={gameState.boardEnds}
            isMyTurn={isMyTurn}
            myHand={myPlayerData?.hand || []}
          />
        </div>

        {/* Player info bar */}
        <div className="px-4 py-2 flex items-center justify-between text-sm">
          {gameState.players.map((player, index) => (
            <div
              key={player.id}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg
                ${index === gameState.currentPlayerIndex
                  ? 'bg-bone-600/30 border border-bone-500/50'
                  : 'bg-bone-800/30'
                }
              `}
            >
              <div
                className={`
                  w-2 h-2 rounded-full
                  ${player.isConnected ? 'bg-green-400' : 'bg-red-400'}
                `}
              />
              <span className="text-bone-300">{player.name}</span>
              <span className="text-bone-500">({player.hand.length})</span>
            </div>
          ))}
        </div>

        {/* Player hand */}
        <div className="border-t border-bone-700/30 bg-bone-800/50 backdrop-blur-sm">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-bone-300">Your Hand</span>
                <span className="text-xs text-bone-500">
                  ({myPlayerData?.hand.length || 0} tiles)
                </span>
              </div>

              {isMyTurn && (
                <div className="flex gap-2">
                  {gameState.boneyard.length > 0 && (
                    <button
                      onClick={handleDrawClick}
                      className="px-4 py-2 bg-bone-700 hover:bg-bone-600 rounded-lg
                               text-sm font-semibold text-bone-100 transition-colors
                               touch-manipulation"
                    >
                      Draw ({gameState.boneyard.length})
                    </button>
                  )}
                  <button
                    onClick={handlePassClick}
                    className="px-4 py-2 bg-bone-700 hover:bg-bone-600 rounded-lg
                             text-sm font-semibold text-bone-100 transition-colors
                             touch-manipulation"
                  >
                    Pass
                  </button>
                </div>
              )}
            </div>

            <PlayerHand
              hand={myPlayerData?.hand || []}
              isDraggable={isMyTurn}
            />
          </div>
        </div>

        {/* Winner overlay */}
        <AnimatePresence>
          {gameState.gamePhase === 'finished' && gameState.winner && (
            <motion.div
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="glass-effect rounded-xl p-8 max-w-md mx-4 text-center"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
              >
                <Trophy size={64} className="text-yellow-400 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-bone-100 mb-2">
                  {gameState.winner === currentPlayer?.id ? 'You Won!' : 'Game Over'}
                </h3>
                <p className="text-bone-300 mb-6">
                  {gameState.players.find((p) => p.id === gameState.winner)?.name} wins!
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate('/dominoes')}
                    className="flex-1 py-3 bg-bone-700 hover:bg-bone-600 rounded-lg
                             font-semibold text-bone-100 transition-colors"
                  >
                    Exit
                  </button>
                  <button
                    onClick={startGame}
                    className="flex-1 py-3 bg-bone-600 hover:bg-bone-500 rounded-lg
                             font-semibold text-bone-100 transition-colors"
                  >
                    Play Again
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drag overlay */}
        <DragOverlay>
          {activeDomino && <DominoTile domino={activeDomino} />}
        </DragOverlay>
      </div>
    </DndContext>
  )
}

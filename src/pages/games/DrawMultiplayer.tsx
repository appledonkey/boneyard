import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, Trophy, Wifi, WifiOff } from 'lucide-react'
import DominoTile from '../../components/domino/DominoTile'
import GameBoard from '../../components/domino/GameBoard'
import PlayerHand from '../../components/domino/PlayerHand'
import { useAudio } from '../../contexts/AudioContext'
import { useGame } from '../../contexts/GameContext'
import { useMultiplayer } from '../../hooks/useMultiplayer'
import type { Domino } from '../../types/domino'

export default function DrawMultiplayer() {
  const navigate = useNavigate()
  const { playSound, vibrate } = useAudio()
  const { currentPlayer } = useGame()
  const [activeDomino, setActiveDomino] = useState<Domino | null>(null)

  const {
    room,
    gameState,
    isMyTurn,
    placeDomino,
    drawFromBoneyard,
    passTurn,
    leaveRoom,
  } = useMultiplayer(currentPlayer?.id || 'guest')

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

      placeDomino(domino, side)
      playSound('snap')
      vibrate([10, 50, 10])
    },
    [placeDomino, playSound, vibrate]
  )

  const handleDrawClick = () => {
    drawFromBoneyard()
    playSound('click')
    vibrate(10)
  }

  const handlePassClick = () => {
    passTurn()
    playSound('click')
    vibrate(10)
  }

  const handleLeaveGame = () => {
    leaveRoom()
    navigate('/multiplayer-lobby')
  }

  if (!gameState || !room) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="spinner mx-auto" />
          <p className="text-bone-400">Loading game...</p>
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
            onClick={handleLeaveGame}
            className="p-2 hover:bg-bone-700/50 rounded-lg transition-colors touch-manipulation"
          >
            <ArrowLeft size={24} className="text-bone-400" />
          </button>

          <div className="text-center">
            <h2 className="text-lg font-bold text-bone-100">Draw • Multiplayer</h2>
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
        <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {gameState.players.map((player, index) => {
            const isCurrentTurn = index === gameState.currentPlayerIndex

            return (
              <div
                key={player.id}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap
                  ${isCurrentTurn
                    ? 'bg-bone-600/30 border border-bone-500/50'
                    : 'bg-bone-800/30'
                  }
                `}
              >
                <div className="flex items-center gap-1">
                  {player.isConnected ? (
                    <Wifi size={14} className="text-green-400" />
                  ) : (
                    <WifiOff size={14} className="text-red-400" />
                  )}
                </div>
                <span className="text-bone-300 text-sm">{player.name}</span>
                <span className="text-bone-500 text-sm">({player.hand.length})</span>
                {player.id === currentPlayer?.id && (
                  <span className="text-bone-500 text-xs">(You)</span>
                )}
              </div>
            )
          })}
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
                <button
                  onClick={handleLeaveGame}
                  className="w-full py-3 bg-bone-600 hover:bg-bone-500 rounded-lg
                           font-semibold text-bone-100 transition-colors"
                >
                  Back to Lobby
                </button>
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

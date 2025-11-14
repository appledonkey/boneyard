import { useState, useEffect, useCallback } from 'react'
import type { GameState, Domino } from '../types/domino'
import {
  generateDominoSet,
  dealDominoes,
  canPlaceDomino,
  flipDomino,
} from '../types/domino'

export function useDrawGame(playerId: string) {
  const [gameState, setGameState] = useState<GameState | null>(null)

  // Initialize game
  const startGame = useCallback(() => {
    const dominoes = generateDominoSet(6) // Double-six set
    const playerCount = 2 // Start with 2 players (can be expanded for multiplayer)
    const handSize = 7

    const { hands, boneyard } = dealDominoes(dominoes, playerCount, handSize)

    const initialState: GameState = {
      players: [
        {
          id: playerId,
          name: 'You',
          hand: hands[0],
          score: 0,
          isConnected: true,
        },
        {
          id: 'ai-opponent',
          name: 'Opponent',
          hand: hands[1],
          score: 0,
          isConnected: true,
        },
      ],
      currentPlayerIndex: 0,
      board: [],
      boneyard,
      gamePhase: 'playing',
      boardEnds: { left: null, right: null },
    }

    setGameState(initialState)
  }, [playerId])

  // Initialize on mount
  useEffect(() => {
    startGame()
  }, [startGame])

  const isMyTurn = gameState?.players[gameState.currentPlayerIndex]?.id === playerId

  // Place a domino on the board
  const placeDomino = useCallback(
    (domino: Domino, side: 'left' | 'right'): boolean => {
      if (!gameState || !isMyTurn) return false

      const currentPlayer = gameState.players[gameState.currentPlayerIndex]
      const handIndex = currentPlayer.hand.findIndex((d) => d.id === domino.id)

      if (handIndex === -1) return false

      let dominoToPlace = { ...domino }
      const targetEnd = side === 'left' ? gameState.boardEnds.left : gameState.boardEnds.right

      const { canPlace, needsFlip } = canPlaceDomino(domino, targetEnd)

      if (!canPlace) return false

      if (needsFlip) {
        dominoToPlace = flipDomino(dominoToPlace)
      }

      // Update board and ends
      const newBoard = [...gameState.board]
      let newBoardEnds = { ...gameState.boardEnds }

      if (newBoard.length === 0) {
        // First domino
        newBoard.push(dominoToPlace)
        newBoardEnds = { left: dominoToPlace.left, right: dominoToPlace.right }
      } else if (side === 'left') {
        newBoard.unshift(dominoToPlace)
        newBoardEnds.left = dominoToPlace.left === targetEnd
          ? dominoToPlace.right
          : dominoToPlace.left
      } else {
        newBoard.push(dominoToPlace)
        newBoardEnds.right = dominoToPlace.right === targetEnd
          ? dominoToPlace.left
          : dominoToPlace.right
      }

      // Update player hand
      const newHand = currentPlayer.hand.filter((_, i) => i !== handIndex)

      // Check for winner
      const winner = newHand.length === 0 ? currentPlayer.id : undefined
      const gamePhase = winner ? 'finished' : 'playing'

      // Update state
      const newPlayers = [...gameState.players]
      newPlayers[gameState.currentPlayerIndex] = {
        ...currentPlayer,
        hand: newHand,
      }

      setGameState({
        ...gameState,
        players: newPlayers,
        board: newBoard,
        boardEnds: newBoardEnds,
        currentPlayerIndex: (gameState.currentPlayerIndex + 1) % gameState.players.length,
        gamePhase,
        winner,
      })

      return true
    },
    [gameState, isMyTurn]
  )

  // Draw from boneyard
  const drawFromBoneyard = useCallback((): boolean => {
    if (!gameState || !isMyTurn || gameState.boneyard.length === 0) return false

    const currentPlayer = gameState.players[gameState.currentPlayerIndex]
    const drawnDomino = gameState.boneyard[0]
    const newBoneyard = gameState.boneyard.slice(1)

    const newPlayers = [...gameState.players]
    newPlayers[gameState.currentPlayerIndex] = {
      ...currentPlayer,
      hand: [...currentPlayer.hand, drawnDomino],
    }

    setGameState({
      ...gameState,
      players: newPlayers,
      boneyard: newBoneyard,
    })

    return true
  }, [gameState, isMyTurn])

  // Pass turn
  const passTurn = useCallback(() => {
    if (!gameState || !isMyTurn) return

    setGameState({
      ...gameState,
      currentPlayerIndex: (gameState.currentPlayerIndex + 1) % gameState.players.length,
    })
  }, [gameState, isMyTurn])

  // Simple AI opponent logic
  useEffect(() => {
    if (!gameState || gameState.gamePhase !== 'playing') return
    if (isMyTurn) return

    // AI plays after a short delay
    const timer = setTimeout(() => {
      const currentPlayer = gameState.players[gameState.currentPlayerIndex]

      // Try to find a playable domino
      let played = false

      for (const domino of currentPlayer.hand) {
        const canPlayLeft = canPlaceDomino(domino, gameState.boardEnds.left).canPlace
        const canPlayRight = canPlaceDomino(domino, gameState.boardEnds.right).canPlace

        if (canPlayLeft) {
          placeDomino(domino, 'left')
          played = true
          break
        } else if (canPlayRight) {
          placeDomino(domino, 'right')
          played = true
          break
        }
      }

      // If can't play, try to draw
      if (!played) {
        if (gameState.boneyard.length > 0) {
          drawFromBoneyard()
        } else {
          passTurn()
        }
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [gameState, isMyTurn, placeDomino, drawFromBoneyard, passTurn])

  return {
    gameState,
    isMyTurn,
    placeDomino,
    drawFromBoneyard,
    passTurn,
    startGame,
  }
}

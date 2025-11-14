import { useState, useEffect, useCallback, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import type { GameState, Domino } from '../types/domino'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'

interface Room {
  code: string
  host: string
  players: Array<{ id: string; name: string; socketId: string }>
  gameState: GameState | null
  maxPlayers: number
}

interface UseMultiplayerReturn {
  socket: Socket | null
  room: Room | null
  gameState: GameState | null
  isConnected: boolean
  isHost: boolean
  isMyTurn: boolean
  error: string | null
  createRoom: (playerName: string) => void
  joinRoom: (roomCode: string, playerName: string) => void
  startGame: () => void
  placeDomino: (domino: Domino, side: 'left' | 'right') => void
  drawFromBoneyard: () => void
  passTurn: () => void
  leaveRoom: () => void
}

export function useMultiplayer(playerId: string): UseMultiplayerReturn {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [room, setRoom] = useState<Room | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const socketRef = useRef<Socket | null>(null)

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SERVER_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    newSocket.on('connect', () => {
      console.log('Connected to server')
      setIsConnected(true)
      setError(null)
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server')
      setIsConnected(false)
    })

    newSocket.on('room-created', ({ roomCode, room: newRoom }) => {
      console.log('Room created:', roomCode)
      setRoom(newRoom)
      setError(null)
    })

    newSocket.on('room-joined', ({ room: joinedRoom }) => {
      console.log('Joined room:', joinedRoom.code)
      setRoom(joinedRoom)
      setError(null)
    })

    newSocket.on('player-joined', ({ player, room: updatedRoom }) => {
      console.log('Player joined:', player.name)
      setRoom(updatedRoom)
    })

    newSocket.on('player-left', ({ playerId: leftPlayerId, room: updatedRoom }) => {
      console.log('Player left:', leftPlayerId)
      setRoom(updatedRoom)
    })

    newSocket.on('game-started', ({ gameState: newGameState }) => {
      console.log('Game started')
      setGameState(newGameState)
    })

    newSocket.on('game-updated', ({ gameState: updatedGameState }) => {
      console.log('Game updated')
      setGameState(updatedGameState)
    })

    newSocket.on('player-disconnected', ({ playerId: disconnectedPlayerId, gameState: updatedGameState }) => {
      console.log('Player disconnected:', disconnectedPlayerId)
      setGameState(updatedGameState)
    })

    newSocket.on('room-error', ({ message }) => {
      console.error('Room error:', message)
      setError(message)
    })

    newSocket.on('error', ({ message }) => {
      console.error('Error:', message)
      setError(message)
      setTimeout(() => setError(null), 3000)
    })

    socketRef.current = newSocket
    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  const createRoom = useCallback((playerName: string) => {
    if (!socketRef.current) return
    socketRef.current.emit('create-room', { player: { id: playerId, name: playerName } })
  }, [playerId])

  const joinRoom = useCallback((roomCode: string, playerName: string) => {
    if (!socketRef.current) return
    setError(null)
    socketRef.current.emit('join-room', { roomCode, player: { id: playerId, name: playerName } })
  }, [playerId])

  const startGame = useCallback(() => {
    if (!socketRef.current) return
    socketRef.current.emit('start-game')
  }, [])

  const placeDomino = useCallback((domino: Domino, side: 'left' | 'right') => {
    if (!socketRef.current) return
    socketRef.current.emit('place-domino', { domino, side })
  }, [])

  const drawFromBoneyard = useCallback(() => {
    if (!socketRef.current) return
    socketRef.current.emit('draw-domino')
  }, [])

  const passTurn = useCallback(() => {
    if (!socketRef.current) return
    socketRef.current.emit('pass-turn')
  }, [])

  const leaveRoom = useCallback(() => {
    if (!socketRef.current) return
    socketRef.current.disconnect()
    socketRef.current.connect()
    setRoom(null)
    setGameState(null)
    setError(null)
  }, [])

  const isHost = room?.host === socket?.id
  const isMyTurn = gameState?.players[gameState.currentPlayerIndex]?.id === socket?.id

  return {
    socket,
    room,
    gameState,
    isConnected,
    isHost,
    isMyTurn,
    error,
    createRoom,
    joinRoom,
    startGame,
    placeDomino,
    drawFromBoneyard,
    passTurn,
    leaveRoom,
  }
}

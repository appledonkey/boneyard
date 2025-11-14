import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()
app.use(cors())

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
  },
})

// Game rooms storage
const rooms = new Map()
const playerRooms = new Map()

// Room code generator
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

// Initialize game state
function createGameState(players) {
  const dominoes = generateDominoSet(6)
  const shuffled = shuffle(dominoes)
  const handSize = 7
  const hands = []

  for (let i = 0; i < players.length; i++) {
    hands.push(shuffled.slice(i * handSize, (i + 1) * handSize))
  }

  const boneyard = shuffled.slice(players.length * handSize)

  return {
    players: players.map((p, i) => ({
      id: p.id,
      name: p.name,
      hand: hands[i],
      score: 0,
      isConnected: true,
    })),
    currentPlayerIndex: 0,
    board: [],
    boneyard,
    gamePhase: 'playing',
    boardEnds: { left: null, right: null },
  }
}

function generateDominoSet(maxPips = 6) {
  const dominoes = []
  let id = 0

  for (let left = 0; left <= maxPips; left++) {
    for (let right = left; right <= maxPips; right++) {
      dominoes.push({
        id: `domino-${id++}`,
        left,
        right,
        isDouble: left === right,
        orientation: 'horizontal',
      })
    }
  }

  return dominoes
}

function shuffle(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id)

  // Create a new room
  socket.on('create-room', ({ player }) => {
    const roomCode = generateRoomCode()
    const room = {
      code: roomCode,
      host: socket.id,
      players: [{ id: socket.id, name: player.name, socketId: socket.id }],
      gameState: null,
      maxPlayers: 4,
    }

    rooms.set(roomCode, room)
    playerRooms.set(socket.id, roomCode)
    socket.join(roomCode)

    socket.emit('room-created', { roomCode, room })
    console.log(`Room created: ${roomCode}`)
  })

  // Join existing room
  socket.on('join-room', ({ roomCode, player }) => {
    const room = rooms.get(roomCode)

    if (!room) {
      socket.emit('room-error', { message: 'Room not found' })
      return
    }

    if (room.players.length >= room.maxPlayers) {
      socket.emit('room-error', { message: 'Room is full' })
      return
    }

    if (room.gameState && room.gameState.gamePhase === 'playing') {
      socket.emit('room-error', { message: 'Game already in progress' })
      return
    }

    room.players.push({ id: socket.id, name: player.name, socketId: socket.id })
    playerRooms.set(socket.id, roomCode)
    socket.join(roomCode)

    io.to(roomCode).emit('player-joined', { player: { id: socket.id, name: player.name }, room })
    socket.emit('room-joined', { room })

    console.log(`Player ${player.name} joined room ${roomCode}`)
  })

  // Start game
  socket.on('start-game', () => {
    const roomCode = playerRooms.get(socket.id)
    const room = rooms.get(roomCode)

    if (!room) return
    if (room.host !== socket.id) {
      socket.emit('error', { message: 'Only host can start the game' })
      return
    }

    if (room.players.length < 2) {
      socket.emit('error', { message: 'Need at least 2 players to start' })
      return
    }

    room.gameState = createGameState(room.players)
    io.to(roomCode).emit('game-started', { gameState: room.gameState })

    console.log(`Game started in room ${roomCode}`)
  })

  // Place domino
  socket.on('place-domino', ({ domino, side }) => {
    const roomCode = playerRooms.get(socket.id)
    const room = rooms.get(roomCode)

    if (!room || !room.gameState) return

    const gameState = room.gameState
    const currentPlayer = gameState.players[gameState.currentPlayerIndex]

    if (currentPlayer.id !== socket.id) {
      socket.emit('error', { message: 'Not your turn' })
      return
    }

    // Validate and update game state (simplified - full validation should be added)
    const handIndex = currentPlayer.hand.findIndex((d) => d.id === domino.id)
    if (handIndex === -1) return

    let dominoToPlace = { ...domino }
    const targetEnd = side === 'left' ? gameState.boardEnds.left : gameState.boardEnds.right

    // Simple validation
    if (targetEnd !== null && domino.left !== targetEnd && domino.right !== targetEnd) {
      socket.emit('error', { message: 'Invalid placement' })
      return
    }

    // Flip if needed
    if (targetEnd !== null && domino.right === targetEnd) {
      dominoToPlace = { ...domino, left: domino.right, right: domino.left }
    }

    // Update board
    if (gameState.board.length === 0) {
      gameState.board.push(dominoToPlace)
      gameState.boardEnds = { left: dominoToPlace.left, right: dominoToPlace.right }
    } else if (side === 'left') {
      gameState.board.unshift(dominoToPlace)
      gameState.boardEnds.left = dominoToPlace.left === targetEnd ? dominoToPlace.right : dominoToPlace.left
    } else {
      gameState.board.push(dominoToPlace)
      gameState.boardEnds.right = dominoToPlace.right === targetEnd ? dominoToPlace.left : dominoToPlace.right
    }

    // Update player hand
    currentPlayer.hand.splice(handIndex, 1)

    // Check for winner
    if (currentPlayer.hand.length === 0) {
      gameState.gamePhase = 'finished'
      gameState.winner = currentPlayer.id
    } else {
      // Next turn
      gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length
    }

    io.to(roomCode).emit('game-updated', { gameState })
  })

  // Draw from boneyard
  socket.on('draw-domino', () => {
    const roomCode = playerRooms.get(socket.id)
    const room = rooms.get(roomCode)

    if (!room || !room.gameState) return

    const gameState = room.gameState
    const currentPlayer = gameState.players[gameState.currentPlayerIndex]

    if (currentPlayer.id !== socket.id) return
    if (gameState.boneyard.length === 0) return

    const drawnDomino = gameState.boneyard.shift()
    currentPlayer.hand.push(drawnDomino)

    io.to(roomCode).emit('game-updated', { gameState })
  })

  // Pass turn
  socket.on('pass-turn', () => {
    const roomCode = playerRooms.get(socket.id)
    const room = rooms.get(roomCode)

    if (!room || !room.gameState) return

    const gameState = room.gameState
    const currentPlayer = gameState.players[gameState.currentPlayerIndex]

    if (currentPlayer.id !== socket.id) return

    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length

    io.to(roomCode).emit('game-updated', { gameState })
  })

  // Handle disconnect
  socket.on('disconnect', () => {
    const roomCode = playerRooms.get(socket.id)
    if (!roomCode) return

    const room = rooms.get(roomCode)
    if (!room) return

    // Mark player as disconnected
    if (room.gameState) {
      const player = room.gameState.players.find((p) => p.id === socket.id)
      if (player) {
        player.isConnected = false
        io.to(roomCode).emit('player-disconnected', { playerId: socket.id, gameState: room.gameState })
      }
    }

    // Remove player from room if game hasn't started
    if (!room.gameState) {
      room.players = room.players.filter((p) => p.socketId !== socket.id)

      if (room.players.length === 0) {
        rooms.delete(roomCode)
        console.log(`Room ${roomCode} deleted (empty)`)
      } else {
        // Transfer host if needed
        if (room.host === socket.id) {
          room.host = room.players[0].socketId
        }
        io.to(roomCode).emit('player-left', { playerId: socket.id, room })
      }
    }

    playerRooms.delete(socket.id)
    console.log('Player disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 3001

httpServer.listen(PORT, () => {
  console.log(`🎲 Boneyard server running on port ${PORT}`)
})

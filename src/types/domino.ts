export interface Domino {
  id: string
  left: number
  right: number
  isDouble: boolean
  orientation: 'horizontal' | 'vertical'
  position?: { x: number; y: number }
  placedBy?: string
}

export interface DominoSet {
  maxPips: number
  dominoes: Domino[]
}

export interface GameState {
  players: GamePlayer[]
  currentPlayerIndex: number
  board: Domino[]
  boneyard: Domino[]
  gamePhase: 'waiting' | 'playing' | 'finished'
  winner?: string
  boardEnds: { left: number | null; right: number | null }
}

export interface GamePlayer {
  id: string
  name: string
  hand: Domino[]
  score: number
  isConnected: boolean
}

export interface PlacementZone {
  id: string
  side: 'left' | 'right'
  value: number
  position: { x: number; y: number }
}

// Generate a standard double-six domino set
export function generateDominoSet(maxPips: number = 6): Domino[] {
  const dominoes: Domino[] = []
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

// Shuffle an array
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Deal dominoes to players
export function dealDominoes(
  dominoes: Domino[],
  playerCount: number,
  handSize: number
): { hands: Domino[][]; boneyard: Domino[] } {
  const shuffled = shuffle(dominoes)
  const hands: Domino[][] = []

  for (let i = 0; i < playerCount; i++) {
    hands.push(shuffled.slice(i * handSize, (i + 1) * handSize))
  }

  const boneyard = shuffled.slice(playerCount * handSize)

  return { hands, boneyard }
}

// Check if a domino can be placed at a specific end
export function canPlaceDomino(
  domino: Domino,
  boardEnd: number | null
): { canPlace: boolean; needsFlip: boolean } {
  if (boardEnd === null) {
    return { canPlace: true, needsFlip: false }
  }

  if (domino.left === boardEnd) {
    return { canPlace: true, needsFlip: false }
  }

  if (domino.right === boardEnd) {
    return { canPlace: true, needsFlip: true }
  }

  return { canPlace: false, needsFlip: false }
}

// Flip a domino (swap left and right)
export function flipDomino(domino: Domino): Domino {
  return {
    ...domino,
    left: domino.right,
    right: domino.left,
  }
}

// Calculate the total pip count in a hand
export function calculateHandValue(hand: Domino[]): number {
  return hand.reduce((sum, domino) => sum + domino.left + domino.right, 0)
}

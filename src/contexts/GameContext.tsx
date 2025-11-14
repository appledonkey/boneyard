import { createContext, useContext, useState, ReactNode } from 'react'

export interface Player {
  id: string
  name: string
  isGuest: boolean
  avatar?: string
}

export interface GameSettings {
  soundEnabled: boolean
  hapticsEnabled: boolean
  darkMode: boolean
  animationSpeed: 'slow' | 'normal' | 'fast'
}

interface GameContextType {
  currentPlayer: Player | null
  setCurrentPlayer: (player: Player | null) => void
  settings: GameSettings
  updateSettings: (settings: Partial<GameSettings>) => void
  inventory: string[]
  addToInventory: (itemId: string) => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

const defaultSettings: GameSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
  darkMode: true,
  animationSpeed: 'normal',
}

// Generate a random guest name
function generateGuestName(): string {
  const adjectives = ['Lucky', 'Swift', 'Clever', 'Bold', 'Mighty', 'Wise', 'Silent', 'Quick']
  const nouns = ['Roller', 'Shark', 'Wolf', 'Eagle', 'Tiger', 'Dragon', 'Phoenix', 'Bear']
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const num = Math.floor(Math.random() * 100)
  return `${adj}${noun}${num}`
}

export function GameProvider({ children }: { children: ReactNode }) {
  // Initialize guest player from localStorage or create new
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(() => {
    const stored = localStorage.getItem('boneyard_player')
    if (stored) {
      return JSON.parse(stored)
    }
    const guestPlayer: Player = {
      id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: generateGuestName(),
      isGuest: true,
    }
    localStorage.setItem('boneyard_player', JSON.stringify(guestPlayer))
    return guestPlayer
  })

  const [settings, setSettings] = useState<GameSettings>(() => {
    const stored = localStorage.getItem('boneyard_settings')
    return stored ? JSON.parse(stored) : defaultSettings
  })

  const [inventory, setInventory] = useState<string[]>(() => {
    const stored = localStorage.getItem('boneyard_inventory')
    return stored ? JSON.parse(stored) : []
  })

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    localStorage.setItem('boneyard_settings', JSON.stringify(updated))
  }

  const addToInventory = (itemId: string) => {
    const updated = [...inventory, itemId]
    setInventory(updated)
    localStorage.setItem('boneyard_inventory', JSON.stringify(updated))
  }

  const handleSetCurrentPlayer = (player: Player | null) => {
    setCurrentPlayer(player)
    if (player) {
      localStorage.setItem('boneyard_player', JSON.stringify(player))
    } else {
      localStorage.removeItem('boneyard_player')
    }
  }

  return (
    <GameContext.Provider
      value={{
        currentPlayer,
        setCurrentPlayer: handleSetCurrentPlayer,
        settings,
        updateSettings,
        inventory,
        addToInventory,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

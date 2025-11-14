import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface AudioContextType {
  isMuted: boolean
  toggleMute: () => void
  playSound: (soundName: string) => void
  vibrate: (pattern?: number | number[]) => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

// Sound effect generators using Web Audio API
class SoundGenerator {
  private audioContext: AudioContext | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  playClick() {
    if (!this.audioContext) return
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.value = 800
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.1)
  }

  playSnap() {
    if (!this.audioContext) return
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.value = 1200
    oscillator.type = 'square'
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.05)
  }

  playDiceRoll() {
    if (!this.audioContext) return
    const bufferSize = this.audioContext.sampleRate * 0.5
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const output = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3))
    }

    const source = this.audioContext.createBufferSource()
    const gainNode = this.audioContext.createGain()

    source.buffer = buffer
    source.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    gainNode.gain.value = 0.15

    source.start()
  }

  playSuccess() {
    if (!this.audioContext) return
    const notes = [523.25, 659.25, 783.99] // C, E, G

    notes.forEach((freq, index) => {
      const oscillator = this.audioContext!.createOscillator()
      const gainNode = this.audioContext!.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext!.destination)

      oscillator.frequency.value = freq
      oscillator.type = 'sine'

      const startTime = this.audioContext!.currentTime + index * 0.1
      gainNode.gain.setValueAtTime(0.2, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3)

      oscillator.start(startTime)
      oscillator.stop(startTime + 0.3)
    })
  }
}

const soundGenerator = new SoundGenerator()

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(false)

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev)
  }, [])

  const playSound = useCallback((soundName: string) => {
    if (isMuted) return

    switch (soundName) {
      case 'click':
        soundGenerator.playClick()
        break
      case 'snap':
        soundGenerator.playSnap()
        break
      case 'dice-roll':
        soundGenerator.playDiceRoll()
        break
      case 'success':
        soundGenerator.playSuccess()
        break
    }
  }, [isMuted])

  const vibrate = useCallback((pattern: number | number[] = 10) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  }, [])

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, playSound, vibrate }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
}

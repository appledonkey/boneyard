import { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Home, ShoppingBag, Volume2, VolumeX } from 'lucide-react'
import { useAudio } from '../contexts/AudioContext'
import { useGame } from '../contexts/GameContext'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { isMuted, toggleMute } = useAudio()
  const { currentPlayer } = useGame()

  const isHomePage = location.pathname === '/'
  const isGamePage = location.pathname.startsWith('/play/')

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Top bar - hidden on home page */}
      {!isHomePage && (
        <header className="glass-effect px-4 py-3 flex items-center justify-between border-b border-bone-700/30 sticky top-0 z-50">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-bone-700/50 rounded-lg transition-colors touch-manipulation"
            aria-label="Home"
          >
            <Home size={24} className="text-bone-400" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-bone-300 hidden sm:inline">
              {currentPlayer?.name}
            </span>

            <button
              onClick={toggleMute}
              className="p-2 hover:bg-bone-700/50 rounded-lg transition-colors touch-manipulation"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX size={24} className="text-bone-400" />
              ) : (
                <Volume2 size={24} className="text-bone-400" />
              )}
            </button>

            {!isGamePage && (
              <button
                onClick={() => navigate('/store')}
                className="p-2 hover:bg-bone-700/50 rounded-lg transition-colors touch-manipulation"
                aria-label="Store"
              >
                <ShoppingBag size={24} className="text-bone-400" />
              </button>
            )}
          </div>
        </header>
      )}

      {/* Main content */}
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  )
}

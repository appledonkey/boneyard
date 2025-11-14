import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Dices, Boxes } from 'lucide-react'
import { useAudio } from '../contexts/AudioContext'

export default function Home() {
  const navigate = useNavigate()
  const { playSound, vibrate } = useAudio()

  const handlePortalClick = (path: string) => {
    playSound('click')
    vibrate(10)
    setTimeout(() => navigate(path), 150)
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-20 w-64 h-64 bg-bone-600/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-64 h-64 bg-bone-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Logo and title */}
      <motion.div
        className="text-center mb-12 z-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h1 className="text-5xl sm:text-7xl font-bold text-bone-100 mb-4 text-shadow">
          The Boneyard
        </h1>
        <p className="text-lg sm:text-xl text-bone-400">
          Modern Games. Classic Fun.
        </p>
      </motion.div>

      {/* Portal cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl z-10">
        {/* Dominoes Portal */}
        <motion.button
          onClick={() => handlePortalClick('/dominoes')}
          className="group relative overflow-hidden rounded-2xl p-8 sm:p-12
                     glass-effect hover:glow-effect
                     transition-all duration-300 touch-manipulation
                     min-h-[280px] sm:min-h-[320px]"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-bone-600/20 to-transparent
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Content */}
          <div className="relative flex flex-col items-center justify-center h-full">
            <motion.div
              className="mb-6 p-6 rounded-full bg-bone-700/30 group-hover:bg-bone-600/40
                         transition-colors duration-300"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Boxes size={64} className="text-bone-300" />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl font-bold text-bone-100 mb-3">
              Dominoes
            </h2>
            <p className="text-bone-400 text-center">
              Draw, Block, Mexican Train & more
            </p>

            {/* Animated dots */}
            <div className="absolute top-4 right-4 flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-bone-500"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.3,
                    repeat: Infinity,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.button>

        {/* Dice Portal */}
        <motion.button
          onClick={() => handlePortalClick('/dice')}
          className="group relative overflow-hidden rounded-2xl p-8 sm:p-12
                     glass-effect hover:glow-effect
                     transition-all duration-300 touch-manipulation
                     min-h-[280px] sm:min-h-[320px]"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-bone-600/20 to-transparent
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Content */}
          <div className="relative flex flex-col items-center justify-center h-full">
            <motion.div
              className="mb-6 p-6 rounded-full bg-bone-700/30 group-hover:bg-bone-600/40
                         transition-colors duration-300"
              whileHover={{ rotate: -360 }}
              transition={{ duration: 0.6 }}
            >
              <Dices size={64} className="text-bone-300" />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl font-bold text-bone-100 mb-3">
              Dice Games
            </h2>
            <p className="text-bone-400 text-center">
              Yahtzee, Farkle, Craps & more
            </p>

            {/* Animated dice dots */}
            <div className="absolute bottom-4 left-4 grid grid-cols-2 gap-1">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-sm bg-bone-500"
                  animate={{
                    rotate: [0, 90, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.button>
      </div>

      {/* Footer */}
      <motion.div
        className="mt-12 text-center text-bone-500 text-sm z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <p>Tap a portal to begin</p>
      </motion.div>
    </div>
  )
}

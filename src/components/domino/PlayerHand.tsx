import { motion } from 'framer-motion'
import DominoTile from './DominoTile'
import type { Domino } from '../../types/domino'

interface PlayerHandProps {
  hand: Domino[]
  isDraggable: boolean
}

export default function PlayerHand({ hand, isDraggable }: PlayerHandProps) {
  if (hand.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-bone-500 text-sm">No dominoes in hand</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Scrollable hand container */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar touch-pan-x">
        {hand.map((domino, index) => (
          <motion.div
            key={domino.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex-shrink-0"
          >
            <DominoTile
              domino={domino}
              isDraggable={isDraggable}
              isInHand={true}
            />
          </motion.div>
        ))}
      </div>

      {/* Scroll hint */}
      {hand.length > 5 && (
        <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-bone-800/80 to-transparent pointer-events-none flex items-center justify-end pr-2">
          <motion.div
            className="text-bone-500 text-xs"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.div>
        </div>
      )}
    </div>
  )
}

import { useDroppable } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import DominoTile from './DominoTile'
import type { Domino } from '../../types/domino'
import { canPlaceDomino } from '../../types/domino'

interface GameBoardProps {
  board: Domino[]
  boardEnds: { left: number | null; right: number | null }
  isMyTurn: boolean
  myHand: Domino[]
}

interface DropZoneProps {
  id: string
  side: 'left' | 'right'
  isActive: boolean
  position: 'left' | 'right'
}

function DropZone({ id, isActive, position }: DropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    disabled: !isActive,
  })

  return (
    <div
      ref={setNodeRef}
      className={`
        relative flex items-center justify-center
        min-w-[80px] min-h-[80px]
        ${position === 'left' ? 'mr-2' : 'ml-2'}
      `}
    >
      <motion.div
        className={`
          w-20 h-20 rounded-xl border-2 border-dashed
          flex items-center justify-center
          transition-all duration-200
          ${isActive
            ? isOver
              ? 'border-bone-400 bg-bone-600/30 scale-110'
              : 'border-bone-500/50 bg-bone-700/20 animate-glow-pulse'
            : 'border-bone-800/30 opacity-0'
          }
        `}
        animate={isActive && !isOver ? {
          scale: [1, 1.05, 1],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {isActive && (
          <span className="text-bone-400 text-xs font-semibold">
            {position === 'left' ? '← Drop' : 'Drop →'}
          </span>
        )}
      </motion.div>
    </div>
  )
}

export default function GameBoard({ board, boardEnds, isMyTurn, myHand }: GameBoardProps) {
  // Determine which drop zones should be active
  const canPlaceLeft = isMyTurn && myHand.some(
    (domino) => canPlaceDomino(domino, boardEnds.left).canPlace
  )
  const canPlaceRight = isMyTurn && myHand.some(
    (domino) => canPlaceDomino(domino, boardEnds.right).canPlace
  )

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative">
        {/* Game board surface */}
        <div className="flex items-center justify-center min-h-[120px]">
          {/* Left drop zone */}
          {(board.length > 0 || canPlaceLeft) && (
            <DropZone
              id="left"
              side="left"
              isActive={canPlaceLeft}
              position="left"
            />
          )}

          {/* Board dominoes */}
          <div className="flex items-center gap-1 flex-wrap justify-center max-w-full overflow-x-auto px-4 no-scrollbar">
            {board.length === 0 ? (
              <motion.div
                className="glass-effect rounded-xl px-8 py-6 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <p className="text-bone-400 text-lg">
                  {isMyTurn ? 'Play your first domino' : 'Waiting for first play...'}
                </p>
              </motion.div>
            ) : (
              board.map((domino, index) => (
                <motion.div
                  key={domino.id}
                  initial={{ opacity: 0, scale: 0, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                    delay: index * 0.05,
                  }}
                >
                  <DominoTile domino={domino} />
                </motion.div>
              ))
            )}
          </div>

          {/* Right drop zone */}
          {(board.length > 0 || canPlaceRight) && (
            <DropZone
              id="right"
              side="right"
              isActive={canPlaceRight}
              position="right"
            />
          )}
        </div>

        {/* Board end indicators */}
        {board.length > 0 && (
          <div className="absolute -bottom-8 left-0 right-0 flex justify-between px-4 text-xs text-bone-500">
            <span>End: {boardEnds.left ?? '?'}</span>
            <span>End: {boardEnds.right ?? '?'}</span>
          </div>
        )}
      </div>
    </div>
  )
}

import { motion } from 'framer-motion'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { Domino } from '../../types/domino'

interface DominoTileProps {
  domino: Domino
  isDraggable?: boolean
  isInHand?: boolean
  onClick?: () => void
}

// Generate pip positions for a domino half
function getPipPositions(value: number): { x: number; y: number }[] {
  switch (value) {
    case 0:
      return []
    case 1:
      return [{ x: 50, y: 50 }]
    case 2:
      return [
        { x: 30, y: 30 },
        { x: 70, y: 70 },
      ]
    case 3:
      return [
        { x: 30, y: 30 },
        { x: 50, y: 50 },
        { x: 70, y: 70 },
      ]
    case 4:
      return [
        { x: 30, y: 30 },
        { x: 70, y: 30 },
        { x: 30, y: 70 },
        { x: 70, y: 70 },
      ]
    case 5:
      return [
        { x: 30, y: 30 },
        { x: 70, y: 30 },
        { x: 50, y: 50 },
        { x: 30, y: 70 },
        { x: 70, y: 70 },
      ]
    case 6:
      return [
        { x: 30, y: 25 },
        { x: 70, y: 25 },
        { x: 30, y: 50 },
        { x: 70, y: 50 },
        { x: 30, y: 75 },
        { x: 70, y: 75 },
      ]
    default:
      return []
  }
}

export default function DominoTile({
  domino,
  isDraggable = false,
  isInHand = false,
  onClick,
}: DominoTileProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: domino.id,
    data: domino,
    disabled: !isDraggable,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isDraggable ? 'grab' : 'default',
  }

  const leftPips = getPipPositions(domino.left)
  const rightPips = getPipPositions(domino.right)

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...(isDraggable ? { ...attributes, ...listeners } : {})}
      onClick={onClick}
      className={`
        relative select-none touch-none
        ${domino.orientation === 'horizontal' ? 'w-24 h-12' : 'w-12 h-24'}
        ${isInHand ? 'hover:scale-105' : ''}
        transition-transform duration-150
      `}
      whileHover={isInHand ? { y: -8 } : {}}
      whileTap={isDraggable ? { scale: 0.95 } : {}}
    >
      {/* Domino body */}
      <div
        className={`
          w-full h-full rounded-lg
          bg-gradient-to-br from-bone-100 to-bone-200
          shadow-lg border-2 border-bone-300
          ${domino.orientation === 'horizontal' ? 'flex' : 'flex flex-col'}
        `}
      >
        {/* Left/Top half */}
        <div className="flex-1 relative">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {leftPips.map((pip, i) => (
              <circle
                key={`left-${i}`}
                cx={pip.x}
                cy={pip.y}
                r="8"
                className="fill-bone-900"
              />
            ))}
          </svg>
        </div>

        {/* Center divider */}
        <div
          className={`
            bg-bone-400
            ${domino.orientation === 'horizontal' ? 'w-0.5' : 'h-0.5'}
          `}
        />

        {/* Right/Bottom half */}
        <div className="flex-1 relative">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {rightPips.map((pip, i) => (
              <circle
                key={`right-${i}`}
                cx={pip.x}
                cy={pip.y}
                r="8"
                className="fill-bone-900"
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Dragging indicator */}
      {isDragging && (
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-bone-500 bg-bone-500/20"
          initial={{ scale: 1 }}
          animate={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  )
}

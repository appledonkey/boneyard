import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Check, Lock } from 'lucide-react'
import { useGame } from '../contexts/GameContext'
import { useAudio } from '../contexts/AudioContext'

interface StoreItem {
  id: string
  name: string
  description: string
  category: 'dominoes' | 'dice' | 'tables' | 'backgrounds'
  price: number
  imageUrl?: string
  preview: string
  isLocked: boolean
}

const storeItems: StoreItem[] = [
  {
    id: 'classic-ivory',
    name: 'Classic Ivory',
    description: 'Traditional white dominoes with black pips',
    category: 'dominoes',
    price: 0,
    preview: '🀀',
    isLocked: false,
  },
  {
    id: 'midnight-black',
    name: 'Midnight Black',
    description: 'Sleek black dominoes with white pips',
    category: 'dominoes',
    price: 299,
    preview: '🀫',
    isLocked: true,
  },
  {
    id: 'jade-emperor',
    name: 'Jade Emperor',
    description: 'Luxurious jade-colored dominoes',
    category: 'dominoes',
    price: 499,
    preview: '💚',
    isLocked: true,
  },
  {
    id: 'dice-classic-white',
    name: 'Classic White',
    description: 'Standard white dice with black pips',
    category: 'dice',
    price: 0,
    preview: '🎲',
    isLocked: false,
  },
  {
    id: 'dice-ruby-red',
    name: 'Ruby Red',
    description: 'Translucent red dice with golden pips',
    category: 'dice',
    price: 199,
    preview: '🔴',
    isLocked: true,
  },
  {
    id: 'dice-crystal-clear',
    name: 'Crystal Clear',
    description: 'Transparent dice with rainbow pips',
    category: 'dice',
    price: 399,
    preview: '💎',
    isLocked: true,
  },
  {
    id: 'table-green-felt',
    name: 'Green Felt',
    description: 'Classic casino-style green felt table',
    category: 'tables',
    price: 0,
    preview: '🟢',
    isLocked: false,
  },
  {
    id: 'table-mahogany',
    name: 'Mahogany Wood',
    description: 'Polished mahogany wood surface',
    category: 'tables',
    price: 399,
    preview: '🟤',
    isLocked: true,
  },
  {
    id: 'table-marble',
    name: 'White Marble',
    description: 'Elegant white marble table',
    category: 'tables',
    price: 599,
    preview: '⚪',
    isLocked: true,
  },
  {
    id: 'bg-boneyard',
    name: 'The Boneyard',
    description: 'Default dark gradient background',
    category: 'backgrounds',
    price: 0,
    preview: '🌑',
    isLocked: false,
  },
  {
    id: 'bg-desert-sunset',
    name: 'Desert Sunset',
    description: 'Warm orange and purple gradient',
    category: 'backgrounds',
    price: 299,
    preview: '🌅',
    isLocked: true,
  },
  {
    id: 'bg-neon-nights',
    name: 'Neon Nights',
    description: 'Electric blue and pink cyberpunk vibes',
    category: 'backgrounds',
    price: 499,
    preview: '🌃',
    isLocked: true,
  },
]

type Category = 'all' | 'dominoes' | 'dice' | 'tables' | 'backgrounds'

const categories: { id: Category; label: string; icon: string }[] = [
  { id: 'all', label: 'All Items', icon: '🎯' },
  { id: 'dominoes', label: 'Domino Sets', icon: '🀀' },
  { id: 'dice', label: 'Dice Sets', icon: '🎲' },
  { id: 'tables', label: 'Table Themes', icon: '🎨' },
  { id: 'backgrounds', label: 'Backgrounds', icon: '🖼️' },
]

export default function Store() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all')
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null)
  const { inventory, addToInventory } = useGame()
  const { playSound, vibrate } = useAudio()

  const filteredItems = storeItems.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  )

  const handlePurchase = (item: StoreItem) => {
    if (!item.isLocked || inventory.includes(item.id)) return

    // Mock purchase (in real app, would integrate with payment)
    playSound('success')
    vibrate([10, 50, 10, 50, 10])
    addToInventory(item.id)
    setSelectedItem(null)
  }

  const isOwned = (itemId: string) => !storeItems.find(i => i.id === itemId)?.isLocked || inventory.includes(itemId)

  return (
    <div className="min-h-screen w-full p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <ShoppingBag size={32} className="text-bone-400" />
            <h1 className="text-4xl sm:text-5xl font-bold text-bone-100 text-shadow">
              Store
            </h1>
          </div>
          <p className="text-bone-400 text-lg">
            Customize your gaming experience
          </p>
          <p className="text-bone-500 text-sm mt-2">
            All items are cosmetic only • No gameplay advantages
          </p>
        </motion.div>

        {/* Category tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id)
                playSound('click')
                vibrate(5)
              }}
              className={`
                px-4 py-2 rounded-lg font-semibold whitespace-nowrap
                transition-all duration-200 touch-manipulation
                ${selectedCategory === category.id
                  ? 'bg-bone-600 text-bone-100 shadow-lg'
                  : 'bg-bone-800/50 text-bone-400 hover:bg-bone-700/50'
                }
              `}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </motion.button>
          ))}
        </div>

        {/* Items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item, index) => {
            const owned = isOwned(item.id)

            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  setSelectedItem(item)
                  playSound('click')
                  vibrate(5)
                }}
                className="glass-effect rounded-xl p-6 text-left hover:glow-effect
                         transition-all duration-200 touch-manipulation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Preview */}
                <div className="text-6xl mb-4 text-center">{item.preview}</div>

                {/* Info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold text-bone-100">{item.name}</h3>
                    {owned && (
                      <Check size={20} className="text-green-400 flex-shrink-0" />
                    )}
                  </div>

                  <p className="text-sm text-bone-400 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Price */}
                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.isLocked ? (
                        <>
                          <Lock size={16} className="text-bone-500" />
                          <span className="text-bone-300 font-semibold">
                            {item.price} coins
                          </span>
                        </>
                      ) : (
                        <span className="text-green-400 font-semibold">Free</span>
                      )}
                    </div>
                    {owned && (
                      <span className="text-xs text-green-400 font-semibold">Owned</span>
                    )}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <motion.div
            className="glass-effect rounded-xl p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-bone-400 text-lg">No items in this category yet</p>
          </motion.div>
        )}
      </div>

      {/* Purchase modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              className="glass-effect rounded-xl p-6 max-w-md w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Preview */}
              <div className="text-8xl mb-6 text-center">{selectedItem.preview}</div>

              {/* Info */}
              <div className="space-y-4 mb-6">
                <h3 className="text-2xl font-bold text-bone-100 text-center">
                  {selectedItem.name}
                </h3>
                <p className="text-bone-400 text-center leading-relaxed">
                  {selectedItem.description}
                </p>

                <div className="flex items-center justify-center gap-2 pt-2">
                  {selectedItem.isLocked ? (
                    <>
                      <Lock size={20} className="text-bone-500" />
                      <span className="text-bone-300 font-bold text-xl">
                        {selectedItem.price} coins
                      </span>
                    </>
                  ) : (
                    <span className="text-green-400 font-bold text-xl">Free</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 py-3 bg-bone-700 hover:bg-bone-600 rounded-lg
                           font-semibold text-bone-100 transition-colors touch-manipulation"
                >
                  Close
                </button>
                {!isOwned(selectedItem.id) && selectedItem.isLocked && (
                  <button
                    onClick={() => handlePurchase(selectedItem)}
                    className="flex-1 py-3 bg-bone-600 hover:bg-bone-500 rounded-lg
                             font-semibold text-bone-100 transition-colors touch-manipulation"
                  >
                    Purchase
                  </button>
                )}
                {isOwned(selectedItem.id) && (
                  <button
                    className="flex-1 py-3 bg-green-600 rounded-lg
                             font-semibold text-white cursor-default"
                    disabled
                  >
                    ✓ Owned
                  </button>
                )}
              </div>

              {/* Mock payment notice */}
              {!isOwned(selectedItem.id) && selectedItem.isLocked && (
                <p className="text-bone-500 text-xs text-center mt-4">
                  This is a demo purchase. No real payment is processed.
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Box } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { useAudio } from '../../contexts/AudioContext'

interface DieProps {
  position: [number, number, number]
  isRolling: boolean
  onSettled: (value: number) => void
}

function Die({ position, isRolling, onSettled }: DieProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [rotation, setRotation] = useState<THREE.Euler>(new THREE.Euler(0, 0, 0))
  const [velocity, setVelocity] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0))
  const [angularVelocity, setAngularVelocity] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0))
  const settledRef = useRef(false)

  useFrame((_state, delta) => {
    if (!meshRef.current) return

    if (isRolling && !settledRef.current) {
      // Apply physics
      const damping = 0.98
      const gravity = -9.8

      // Update velocity
      const newVelocity = velocity.clone()
      newVelocity.y += gravity * delta

      // Update position
      const newPosition = meshRef.current.position.clone()
      newPosition.add(newVelocity.clone().multiplyScalar(delta))

      // Bounce off floor
      if (newPosition.y <= 0.5) {
        newPosition.y = 0.5
        newVelocity.y *= -0.6 // Bounce
        newVelocity.x *= 0.8
        newVelocity.z *= 0.8

        // Reduce angular velocity on bounce
        const newAngularVel = angularVelocity.clone().multiplyScalar(0.7)
        setAngularVelocity(newAngularVel)
      }

      // Apply damping
      newVelocity.multiplyScalar(damping)

      // Update rotation
      const newRotation = rotation.clone()
      newRotation.x += angularVelocity.x * delta
      newRotation.y += angularVelocity.y * delta
      newRotation.z += angularVelocity.z * delta

      // Dampen angular velocity
      const newAngularVel = angularVelocity.clone().multiplyScalar(damping)

      // Check if settled
      if (
        Math.abs(newVelocity.length()) < 0.01 &&
        Math.abs(newAngularVel.length()) < 0.01 &&
        newPosition.y <= 0.51
      ) {
        settledRef.current = true
        // Determine which face is up (simplified)
        const result = Math.floor(Math.random() * 6) + 1
        setTimeout(() => onSettled(result), 100)
      }

      meshRef.current.position.copy(newPosition)
      meshRef.current.rotation.copy(newRotation)

      setVelocity(newVelocity)
      setAngularVelocity(newAngularVel)
      setRotation(newRotation)
    }
  })

  // Start roll
  if (isRolling && velocity.length() === 0) {
    setVelocity(
      new THREE.Vector3(
        (Math.random() - 0.5) * 5,
        Math.random() * 8 + 5,
        (Math.random() - 0.5) * 5
      )
    )
    setAngularVelocity(
      new THREE.Vector3(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15
      )
    )
    settledRef.current = false
  }

  return (
    <Box ref={meshRef} args={[1, 1, 1]} position={position}>
      <meshStandardMaterial color="#f5f3ef" />
      {/* Simplified pips rendering */}
      <mesh position={[0, 0.51, 0]}>
        <circleGeometry args={[0.1, 16]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </Box>
  )
}

export default function DiceRoller() {
  const [isRolling, setIsRolling] = useState(false)
  const [results, setResults] = useState<number[]>([])
  const { playSound, vibrate } = useAudio()

  const handleRoll = () => {
    setIsRolling(true)
    setResults([])
    playSound('dice-roll')
    vibrate([10, 20, 10])
  }

  const handleDieSettled = (value: number) => {
    setResults((prev) => [...prev, value])
    if (results.length === 1) {
      // Both dice settled
      setIsRolling(false)
      playSound('click')
      vibrate(20)
    }
  }

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col">
      {/* 3D Canvas */}
      <div className="flex-1 relative rounded-xl overflow-hidden glass-effect">
        <Canvas
          camera={{ position: [0, 5, 8], fov: 50 }}
          shadows
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <pointLight position={[-10, -10, -5]} intensity={0.3} />

          {/* Table surface */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#1a4d2e" />
          </mesh>

          {/* Dice */}
          <Die
            position={[-1, 5, 0]}
            isRolling={isRolling}
            onSettled={handleDieSettled}
          />
          <Die
            position={[1, 5, 0]}
            isRolling={isRolling}
            onSettled={handleDieSettled}
          />

          <OrbitControls enableZoom={false} />
        </Canvas>

        {/* Results overlay */}
        {results.length === 2 && !isRolling && (
          <motion.div
            className="absolute top-4 left-1/2 -translate-x-1/2 glass-effect px-6 py-3 rounded-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-bone-100 font-bold text-xl">
              Result: {results[0]} + {results[1]} = {results[0] + results[1]}
            </p>
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-4 flex justify-center">
        <motion.button
          onClick={handleRoll}
          disabled={isRolling}
          className={`
            px-8 py-4 rounded-xl font-bold text-lg
            transition-all duration-200 touch-manipulation
            ${isRolling
              ? 'bg-bone-700 text-bone-500 cursor-not-allowed'
              : 'bg-bone-600 hover:bg-bone-500 text-bone-100 shadow-lg hover:shadow-xl'
            }
          `}
          whileHover={!isRolling ? { scale: 1.05 } : {}}
          whileTap={!isRolling ? { scale: 0.95 } : {}}
        >
          {isRolling ? 'Rolling...' : '🎲 Roll Dice'}
        </motion.button>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center">
        <p className="text-bone-500 text-sm">
          Tap the button to roll • Dice will tumble with realistic physics
        </p>
      </div>
    </div>
  )
}

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { useState, useRef } from 'react'
import * as THREE from 'three'

// Sword Component (clickable)
function Sword({ position, onInsert, index, isUsed }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (meshRef.current && !isUsed && hovered) {
      meshRef.current.position.y += Math.sin(Date.now() * 0.005) * 0.002
    }
  })

  if (isUsed) return null

  return (
    <group
      position={position}
      onClick={() => onInsert(index)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? [1.2, 1.2, 1.2] : [1, 1, 1]}
      ref={meshRef}
    >
      <group rotation={[0, 0, Math.PI / 4]}>
        {/* Sword Handle */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Sword Blade */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.1, 1, 0.02]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Guard */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.4, 0.05, 0.05]} />
          <meshStandardMaterial color="#FFD700" metalness={1} />
        </mesh>
      </group>

      {/* Click hint */}
      {hovered && (
        <sprite position={[0, 1, 0]} scale={[0.8, 0.8, 1]}>
          <spriteMaterial
            map={createTextTexture('CLICK!')}
            transparent
          />
        </sprite>
      )}
    </group>
  )
}

// 3D Barrel
function Barrel({ pirateState, insertedSlots }) {
  const barrelRef = useRef()

  useFrame(() => {
    if (barrelRef.current) {
      barrelRef.current.rotation.y += 0.001
    }
  })

  return (
    <group ref={barrelRef} position={[0, 0, 0]}>
      {/* Barrel Body */}
      <mesh>
        <cylinderGeometry args={[1.5, 1.5, 2, 20]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Barrel Rings */}
      {[-0.6, 0, 0.6].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[1.52, 0.08, 8, 20]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      ))}

      {/* Pirate Emoji */}
      <sprite position={[0, 0.5, 1.6]} scale={[1.5, 1.5, 1]}>
        <spriteMaterial
          map={createTextTexture(pirateState === 'hit' ? '😱' : '😴')}
          transparent
        />
      </sprite>

      {/* Slots around barrel */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const x = Math.cos(angle) * 1.3
        const z = Math.sin(angle) * 1.3
        const isInserted = insertedSlots.includes(i)

        return (
          <group key={i} position={[x, 0, z]} rotation={[0, -angle, 0]}>
            {/* Slot hole */}
            <mesh>
              <cylinderGeometry args={[0.15, 0.15, 0.3, 8]} />
              <meshStandardMaterial
                color={isInserted ? '#ff4444' : '#654321'}
                emissive={isInserted ? '#ff8800' : '#000000'}
                emissiveIntensity={isInserted ? 0.5 : 0.2}
              />
            </mesh>

            {/* Inserted sword */}
            {isInserted && (
              <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0.5, 0]}>
                <mesh>
                  <boxGeometry args={[0.08, 0.8, 0.02]} />
                  <meshStandardMaterial color="#C0C0C0" metalness={0.9} />
                </mesh>
              </group>
            )}
          </group>
        )
      })}
    </group>
  )
}

// Helper to create texture from text
function createTextTexture(text) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  ctx.font = 'bold 100px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#FFD700'
  ctx.fillText(text, 128, 128)
  return new THREE.CanvasTexture(canvas)
}

export default function PirateGame({ onBack }) {
  const [pirateSlot] = useState(() => Math.floor(Math.random() * 8))
  const [usedSlots, setUsedSlots] = useState([])
  const [gameState, setGameState] = useState('playing')
  const [pirateState, setPirateState] = useState('sleeping')

  const handleSwordInsert = (slotIndex) => {
    if (usedSlots.includes(slotIndex)) return

    const newUsedSlots = [...usedSlots, slotIndex]
    setUsedSlots(newUsedSlots)

    if (slotIndex === pirateSlot) {
      setGameState('hit')
      setPirateState('hit')
      setTimeout(() => createConfetti(), 100)
    } else if (newUsedSlots.length === 7) {
      setGameState('safe')
      setTimeout(() => createConfetti(true), 100)
    }
  }

  const handleReset = () => {
    setUsedSlots([])
    setGameState('playing')
    setPirateState('sleeping')
  }

  const createConfetti = (isSafe = false) => {
    const emojis = isSafe ? ['🎉', '✨', '🎊'] : ['💀', '🏴‍☠️', '💥']
    for (let i = 0; i < 30; i++) {
      const emoji = emojis[Math.floor(Math.random() * emojis.length)]
      const confetti = document.createElement('div')
      confetti.textContent = emoji
      confetti.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}vw;
        top: -50px;
        font-size: ${Math.random() * 30 + 20}px;
        z-index: 9999;
        pointer-events: none;
        transition: all 3s ease-out;
      `
      document.body.appendChild(confetti)

      setTimeout(() => {
        confetti.style.top = '100vh'
        confetti.style.transform = `rotate(${Math.random() * 720}deg)`
        confetti.style.opacity = '0'
      }, 100)

      setTimeout(() => confetti.remove(), 3100)
    }
  }

  // Sword positions in circle around screen
  const swordPositions = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i / 8) * Math.PI * 2
    const radius = 4
    return [
      Math.cos(angle) * radius,
      Math.sin(angle) * radius + 3,
      0
    ]
  })

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <button
          onClick={onBack}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-6 py-3 rounded-xl transition-all"
        >
          ← กลับเมนู
        </button>
      </div>

      {/* Title */}
      <div className="absolute top-20 left-0 right-0 z-10 text-center">
        <h2 className="text-bebas text-6xl text-yellow-400 neon-text">
          🏴‍☠️ PIRATE BARREL
        </h2>
        <p className="text-white text-xl mt-2">คลิกดาบเพื่อเสียบเข้าถัง!</p>
      </div>

      {/* 3D Canvas */}
      <Canvas className="h-screen">
        <PerspectiveCamera makeDefault position={[0, 3, 8]} />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} />

        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#FFD700" />

        <Barrel pirateState={pirateState} insertedSlots={usedSlots} />

        {swordPositions.map((pos, i) => (
          <Sword
            key={i}
            index={i}
            position={pos}
            onInsert={handleSwordInsert}
            isUsed={usedSlots.includes(i)}
          />
        ))}

        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#0a5f38" />
        </mesh>
      </Canvas>

      {/* Game Status */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
        <div className="max-w-2xl mx-auto casino-table rounded-3xl p-6 text-center">
          {gameState === 'hit' && (
            <div className="text-red-500 font-bold text-3xl animate-pulse mb-4">
              💥 โจรสลัดโผล่! ดื่ม! 🍺
            </div>
          )}
          {gameState === 'safe' && (
            <div className="text-yellow-400 font-bold text-3xl mb-4">
              🎉 ปลอดภัยทั้งหมด! ไม่ต้องดื่ม!
            </div>
          )}
          {gameState === 'playing' && (
            <div className="text-green-400 font-bold text-xl mb-4">
              ✅ ปลอดภัย! ({usedSlots.length}/8)
            </div>
          )}

          <button
            onClick={handleReset}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all transform hover:scale-105"
          >
            🔄 เริ่มเกมใหม่
          </button>
        </div>
      </div>
    </div>
  )
}

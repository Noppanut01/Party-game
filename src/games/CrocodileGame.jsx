import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei'
import { useState, useRef } from 'react'
import * as THREE from 'three'

// Tooth Button Component (clickable 3D tooth)
function Tooth({ position, index, onClick, isPressed }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (meshRef.current && !isPressed) {
      meshRef.current.rotation.z = hovered
        ? Math.sin(Date.now() * 0.005) * 0.1
        : 0
    }
  })

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={!isPressed ? () => onClick(index) : undefined}
        onPointerOver={() => !isPressed && setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={isPressed ? [0.8, 0.8, 0.8] : hovered ? [1.1, 1.1, 1.1] : [1, 1, 1]}
      >
        {/* Tooth shape */}
        <group>
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.3, 0.6, 0.2]} />
            <meshStandardMaterial
              color={isPressed ? '#888888' : '#ffffff'}
              metalness={0.1}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, -0.1, 0]}>
            <coneGeometry args={[0.15, 0.3, 8]} />
            <meshStandardMaterial
              color={isPressed ? '#888888' : '#ffffff'}
              metalness={0.1}
              roughness={0.3}
            />
          </mesh>
        </group>
      </mesh>

      {/* Emoji above tooth */}
      {!isPressed && (
        <sprite position={[0, 0.8, 0]} scale={[0.5, 0.5, 1]}>
          <spriteMaterial
            map={createTextTexture('🦷')}
            transparent
          />
        </sprite>
      )}
    </group>
  )
}

// Crocodile Head Component
function CrocodileHead({ isBiting }) {
  const upperJawRef = useRef()
  const lowerJawRef = useRef()

  useFrame(() => {
    if (isBiting) {
      const bite = Math.sin(Date.now() * 0.01) * 0.3
      upperJawRef.current.rotation.x = -bite
      lowerJawRef.current.rotation.x = bite
    } else {
      upperJawRef.current.rotation.x = 0
      lowerJawRef.current.rotation.x = 0
    }
  })

  return (
    <group position={[0, 1.5, 0]}>
      {/* Upper Jaw */}
      <group ref={upperJawRef} position={[0, 0.3, 0]}>
        <mesh>
          <boxGeometry args={[2, 0.5, 1.5]} />
          <meshStandardMaterial color="#2d5016" />
        </mesh>
        {/* Upper teeth */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[-0.8 + i * 0.23, -0.25, 0]}>
            <coneGeometry args={[0.08, 0.2, 4]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>

      {/* Lower Jaw */}
      <group ref={lowerJawRef} position={[0, -0.3, 0]}>
        <mesh>
          <boxGeometry args={[2, 0.5, 1.5]} />
          <meshStandardMaterial color="#3d6b1f" />
        </mesh>
        {/* Lower teeth */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[-0.8 + i * 0.23, 0.25, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.08, 0.2, 4]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>

      {/* Eyes */}
      <mesh position={[-0.6, 0.5, 0.6]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.6, 0.5, 0.6]} scale={[0.6, 0.6, 1.2]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      <mesh position={[0.6, 0.5, 0.6]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.6, 0.5, 0.6]} scale={[0.6, 0.6, 1.2]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Crocodile Emoji */}
      <sprite position={[0, 1.2, 0]} scale={[1.5, 1.5, 1]}>
        <spriteMaterial
          map={createTextTexture(isBiting ? '😠' : '🐊')}
          transparent
        />
      </sprite>
    </group>
  )
}

// Helper to create texture from text
function createTextTexture(text) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  ctx.font = '200px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 128, 128)
  return new THREE.CanvasTexture(canvas)
}

export default function CrocodileGame({ onBack }) {
  const [badTooth] = useState(() => Math.floor(Math.random() * 12))
  const [pressedTeeth, setPressedTeeth] = useState([])
  const [gameState, setGameState] = useState('playing')
  const [isBiting, setIsBiting] = useState(false)

  const handleToothPress = (index) => {
    if (pressedTeeth.includes(index)) return

    const newPressed = [...pressedTeeth, index]
    setPressedTeeth(newPressed)

    if (index === badTooth) {
      setGameState('bite')
      setIsBiting(true)
      createConfetti(false)
    } else if (newPressed.length === 11) {
      setGameState('safe')
      createConfetti(true)
    }
  }

  const handleReset = () => {
    setPressedTeeth([])
    setGameState('playing')
    setIsBiting(false)
  }

  const createConfetti = (isSafe) => {
    const emojis = isSafe ? ['🎉', '✨', '🎊'] : ['🐊', '💥', '😱']
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

  // Position teeth in a grid
  const toothPositions = []
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      toothPositions.push([-1.5 + col, -1.5 + row * 0.8, 0])
    }
  }

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
        <h2 className="text-bebas text-6xl text-green-400 neon-text">
          🐊 CROCODILE DENTIST
        </h2>
        <p className="text-white text-xl mt-2">คลิกฟันทีละอัน อย่าให้ปากกัด!</p>
      </div>

      {/* 3D Canvas */}
      <Canvas className="h-screen">
        <PerspectiveCamera makeDefault position={[0, 2, 6]} />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} />

        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[0, 3, 3]} intensity={0.8} color="#4ade80" />

        <CrocodileHead isBiting={isBiting} />

        {toothPositions.map((pos, i) => (
          <Tooth
            key={i}
            position={pos}
            index={i}
            onClick={handleToothPress}
            isPressed={pressedTeeth.includes(i)}
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
          {gameState === 'bite' && (
            <div className="text-red-500 font-bold text-3xl animate-pulse mb-4">
              💥 ปากกัด! ดื่ม! 🍺
            </div>
          )}
          {gameState === 'safe' && (
            <div className="text-yellow-400 font-bold text-3xl mb-4">
              🎉 ปลอดภัยทั้งหมด! ไม่ต้องดื่ม!
            </div>
          )}
          {gameState === 'playing' && (
            <div className="text-green-400 font-bold text-xl mb-4">
              ✅ ปลอดภัย! ({pressedTeeth.length}/12)
            </div>
          )}

          <button
            onClick={handleReset}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all transform hover:scale-105"
          >
            🔄 เริ่มเกมใหม่
          </button>
        </div>
      </div>
    </div>
  )
}

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, RoundedBox } from '@react-three/drei'
import { useState, useRef, useMemo } from 'react'
import * as THREE from 'three'

// Card data
const suits = {
  hearts: { symbol: '♥', color: '#dc2626' },
  diamonds: { symbol: '♦', color: '#dc2626' },
  clubs: { symbol: '♣', color: '#1f2937' },
  spades: { symbol: '♠', color: '#1f2937' }
}

const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

const cardActions = {
  'A': ['ดื่ม 1 shot', 'แจกให้คนอื่น 2 shots', 'เล่นเกมนับเลข 1-21'],
  '2': ['ดื่ม 2 shots', 'ให้คนทางซ้ายดื่ม', 'คนอายุน้อยสุดดื่ม'],
  '3': ['ดื่ม 3 shots', 'แจกให้ 3 คนดื่ม', 'ทุกคนดื่ม 1 shot'],
  '4': ['ตอบคำถาม Truth', 'ทำท่า 4 ท่า', 'Rock Paper Scissors'],
  '5': ['คนทางขวาดื่ม', 'โทรหาคนที่คิดถึง', 'ร้องเพลง 1 เพลง'],
  '6': ['ผู้ชายทุกคนดื่ม', 'กำหนดกฎใหม่', 'Thumb Master'],
  '7': ['คนสูงสุดดื่ม', 'ชี้ท้องฟ้า คนสุดท้ายดื่ม', 'เลือก 2 คนจูบแก้ม'],
  '8': ['เลือก Drinking Buddy', 'ส่งข้อความแฟนเก่า', 'เต้น 30 วินาที'],
  '9': ['ผู้หญิงทุกคนดื่ม', 'Rhyme Time', 'Categories'],
  '10': ['Master - คุณเป็นนาย', 'Never Have I Ever', 'ท่าโยคะ 3 ท่า'],
  'J': ['Question Master', 'เลือก 3 คนดื่ม', 'กำหนดท่าเต้น'],
  'Q': ['ทำให้ทุกคนหัวเราะ', 'ลบโพสต์ Instagram', 'กษัตริย์บอก'],
  'K': ['King\'s Cup - เทลงแก้วกลาง!', 'Make a Rule!', 'K สุดท้ายดื่มแก้วกลาง!']
}

// 3D Playing Card Component
function PlayingCard({ card, position, rotation, onClick, isFlipped }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (meshRef.current) {
      const targetRotation = isFlipped ? Math.PI : 0
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotation,
        0.1
      )

      if (hovered && !isFlipped) {
        meshRef.current.position.y = THREE.MathUtils.lerp(
          meshRef.current.position.y,
          position[1] + 0.2,
          0.1
        )
      } else {
        meshRef.current.position.y = THREE.MathUtils.lerp(
          meshRef.current.position.y,
          position[1],
          0.1
        )
      }
    }
  })

  // Create textures
  const frontTexture = useMemo(() => createCardTexture(card), [card])
  const backTexture = useMemo(() => createCardBackTexture(), [])

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? [1.05, 1.05, 1.05] : [1, 1, 1]}
    >
      {/* Card shape */}
      <boxGeometry args={[1.4, 2, 0.02]} />

      {/* Front material */}
      <meshStandardMaterial
        attach="material-0"
        map={backTexture}
      />
      <meshStandardMaterial
        attach="material-1"
        map={backTexture}
      />
      <meshStandardMaterial
        attach="material-2"
        color="white"
      />
      <meshStandardMaterial
        attach="material-3"
        color="white"
      />
      <meshStandardMaterial
        attach="material-4"
        map={frontTexture}
      />
      <meshStandardMaterial
        attach="material-5"
        map={backTexture}
      />
    </mesh>
  )
}

// Create card front texture
function createCardTexture(card) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 712
  const ctx = canvas.getContext('2d')

  // White background
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Border
  ctx.strokeStyle = '#ddd'
  ctx.lineWidth = 4
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20)

  ctx.fillStyle = card.color
  ctx.font = 'bold 120px Arial'
  ctx.textAlign = 'left'
  ctx.fillText(card.value, 40, 140)

  ctx.font = '100px Arial'
  ctx.fillText(card.symbol, 40, 240)

  // Center symbol
  ctx.font = '200px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(card.symbol, canvas.width / 2, canvas.height / 2 + 70)

  // Bottom (rotated)
  ctx.save()
  ctx.translate(canvas.width, canvas.height)
  ctx.rotate(Math.PI)
  ctx.font = 'bold 120px Arial'
  ctx.textAlign = 'left'
  ctx.fillText(card.value, 40, 140)
  ctx.font = '100px Arial'
  ctx.fillText(card.symbol, 40, 240)
  ctx.restore()

  return new THREE.CanvasTexture(canvas)
}

// Create card back texture
function createCardBackTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 712
  const ctx = canvas.getContext('2d')

  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, '#7f1d1d')
  gradient.addColorStop(1, '#991b1b')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Pattern
  ctx.strokeStyle = '#fbbf24'
  ctx.lineWidth = 6
  for (let i = 0; i < 10; i++) {
    ctx.strokeRect(
      50 + i * 10,
      50 + i * 10,
      canvas.width - 100 - i * 20,
      canvas.height - 100 - i * 20
    )
  }

  // Center emoji
  ctx.font = '200px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('🃏', canvas.width / 2, canvas.height / 2 + 70)

  return new THREE.CanvasTexture(canvas)
}

// Card Deck Component
function CardDeck({ onDraw }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (meshRef.current && hovered) {
      meshRef.current.rotation.y = Math.sin(Date.now() * 0.002) * 0.1
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={[0, 1, 0]}
      onClick={onDraw}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? [1.1, 1.1, 1.1] : [1, 1, 1]}
    >
      <boxGeometry args={[1.4, 2, 0.3]} />
      <meshStandardMaterial color="#991b1b" />

      {/* Top card visualization */}
      <sprite position={[0, 0, 0.2]} scale={[1.2, 1.2, 1]}>
        <spriteMaterial
          map={createTextTexture('🃏\nTAP TO\nDRAW')}
          transparent
        />
      </sprite>
    </mesh>
  )
}

function createTextTexture(text) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  ctx.font = 'bold 60px Arial'
  ctx.fillStyle = '#fbbf24'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const lines = text.split('\n')
  lines.forEach((line, i) => {
    ctx.fillText(line, 256, 200 + i * 80)
  })

  return new THREE.CanvasTexture(canvas)
}

export default function CardGame({ onBack }) {
  const [deck, setDeck] = useState(() => {
    const cards = []
    Object.entries(suits).forEach(([suitKey, suit]) => {
      values.forEach(value => {
        cards.push({
          suit: suitKey,
          value,
          symbol: suit.symbol,
          color: suit.color
        })
      })
    })
    // Shuffle
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]]
    }
    return cards
  })

  const [drawnCard, setDrawnCard] = useState(null)
  const [cardAction, setCardAction] = useState('')
  const [cardsLeft, setCardsLeft] = useState(52)

  const handleDraw = () => {
    if (deck.length === 0) {
      alert('ไพ่หมดแล้ว! กดปุ่มสับไพ่ใหม่')
      return
    }

    const card = deck[0]
    const remaining = deck.slice(1)
    setDeck(remaining)
    setDrawnCard(card)
    setCardsLeft(remaining.length)

    // Get random action
    const actions = cardActions[card.value]
    const action = actions[Math.floor(Math.random() * actions.length)]
    setCardAction(action)
  }

  const handleReset = () => {
    const cards = []
    Object.entries(suits).forEach(([suitKey, suit]) => {
      values.forEach(value => {
        cards.push({
          suit: suitKey,
          value,
          symbol: suit.symbol,
          color: suit.color
        })
      })
    })
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]]
    }
    setDeck(cards)
    setDrawnCard(null)
    setCardAction('')
    setCardsLeft(52)
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
        <h2 className="text-bebas text-6xl text-purple-400 neon-text">
          🃏 PARTY POKER
        </h2>
        <p className="text-white text-xl mt-2">คลิกกองไพ่เพื่อจั่ว!</p>
        <p className="text-yellow-400 text-lg mt-1">
          เหลือ {cardsLeft} ใบ
        </p>
      </div>

      {/* 3D Canvas */}
      <Canvas className="h-screen">
        <PerspectiveCamera makeDefault position={[0, 3, 5]} />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} />

        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[0, 5, 0]} intensity={0.8} color="#a855f7" />

        {!drawnCard && (
          <CardDeck onDraw={handleDraw} />
        )}

        {drawnCard && (
          <PlayingCard
            card={drawnCard}
            position={[0, 1, 0]}
            rotation={[0, 0, 0]}
            isFlipped={true}
          />
        )}

        {/* Poker Table */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <circleGeometry args={[4, 32]} />
          <meshStandardMaterial color="#0a5f38" />
        </mesh>

        {/* Table edge */}
        <mesh rotation={[0, 0, 0]} position={[0, -0.1, 0]}>
          <cylinderGeometry args={[4, 4, 0.3, 32]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </Canvas>

      {/* Card Action Display */}
      {drawnCard && (
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
          <div className="max-w-2xl mx-auto casino-table rounded-3xl p-6">
            <div className="text-yellow-400 font-bold text-3xl mb-4 text-center">
              {drawnCard.value} {drawnCard.symbol}
            </div>
            <div className="text-white text-xl mb-6 text-center">
              {cardAction}
            </div>

            <button
              onClick={handleReset}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all transform hover:scale-105"
            >
              🔄 สับไพ่ใหม่
            </button>
          </div>
        </div>
      )}

      {!drawnCard && (
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
          <div className="max-w-2xl mx-auto casino-table rounded-3xl p-6 text-center">
            <div className="text-white/60 text-xl mb-4">
              👆 คลิกกองไพ่เพื่อจั่วการ์ด
            </div>

            <button
              onClick={handleReset}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all transform hover:scale-105"
            >
              🔄 สับไพ่ใหม่
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

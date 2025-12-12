import { useState } from 'react'
import Menu from './components/Menu'
import PirateGame from './games/PirateGame'
import CrocodileGame from './games/CrocodileGame'
import CardGame from './games/CardGame'

function App() {
  const [currentGame, setCurrentGame] = useState('menu')

  const renderGame = () => {
    switch (currentGame) {
      case 'pirate':
        return <PirateGame onBack={() => setCurrentGame('menu')} />
      case 'crocodile':
        return <CrocodileGame onBack={() => setCurrentGame('menu')} />
      case 'cards':
        return <CardGame onBack={() => setCurrentGame('menu')} />
      default:
        return <Menu onSelectGame={setCurrentGame} />
    }
  }

  return (
    <div className="min-h-screen">
      {renderGame()}
    </div>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AudioProvider } from './contexts/AudioContext'
import { GameProvider } from './contexts/GameContext'
import Home from './pages/Home'
import DominoGames from './pages/DominoGames'
import DiceGames from './pages/DiceGames'
import DrawGame from './pages/games/DrawGame'
import Store from './pages/Store'
import Layout from './components/Layout'

function App() {
  return (
    <Router>
      <AudioProvider>
        <GameProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dominoes" element={<DominoGames />} />
              <Route path="/dice" element={<DiceGames />} />
              <Route path="/play/draw" element={<DrawGame />} />
              <Route path="/store" element={<Store />} />
            </Routes>
          </Layout>
        </GameProvider>
      </AudioProvider>
    </Router>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import DiceRoller from './pages/DiceRoller'
import Toolkit from './pages/Toolkit'
import GMScreen from './pages/session/GMScreen'
import PlayerMainScreen from './pages/session/PlayerMainScreen'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dice" element={<DiceRoller />} />
          <Route path="/toolkit" element={<Toolkit />} />
          <Route path="/session/gm" element={<GMScreen />} />
          <Route path="/session/player" element={<PlayerMainScreen />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

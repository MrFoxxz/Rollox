import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import DiceRoller from './pages/DiceRoller'
import Toolkit from './pages/Toolkit'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dice" element={<DiceRoller />} />
          <Route path="/toolkit" element={<Toolkit />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

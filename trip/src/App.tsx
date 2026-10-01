import { Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import SchedulePage from './pages/SchedulePage'
import SpotsPage from './pages/SpotsPage'
import DayDetailPage from './pages/DayDetailPage'

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<SchedulePage />} />
        <Route path="/spots" element={<SpotsPage />} />
        <Route path="/day/:dayNumber" element={<DayDetailPage />} />
        <Route path="/spot/:slug" element={<DayDetailPage />} />
      </Routes>
    </div>
  )
}

export default App

import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { SpotsProvider } from './data/SpotsProvider'
import { ScheduleProvider } from './data/ScheduleProvider'
import Header from './components/layout/Header'
import SchedulePage from './pages/SchedulePage'
import SpotsPage from './pages/SpotsPage'
import DayDetailPage from './pages/DayDetailPage'
import SpotFormPage from './pages/SpotFormPage'
import NotesPage from './pages/NotesPage'

function App() {
  return (
    <AuthProvider>
      <SpotsProvider>
        <ScheduleProvider>
          <div className="min-h-screen">
            <Header />
            <Routes>
              <Route path="/" element={<SchedulePage />} />
              <Route path="/spots" element={<SpotsPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/day/:dayNumber" element={<DayDetailPage />} />
              <Route path="/spot/new" element={<SpotFormPage />} />
              <Route path="/spot/:slug" element={<DayDetailPage />} />
              <Route path="/spot/:slug/edit" element={<SpotFormPage />} />
            </Routes>
          </div>
        </ScheduleProvider>
      </SpotsProvider>
    </AuthProvider>
  )
}

export default App

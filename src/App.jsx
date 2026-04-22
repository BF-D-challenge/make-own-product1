import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SplashScreen from './screens/SplashScreen'
import MyScreen from './screens/MyScreen'
import StudyScreen from './screens/StudyScreen'
import QuizScreen from './screens/QuizScreen'
import CompleteScreen from './screens/CompleteScreen'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/my" element={<MyScreen />} />
          <Route path="/study/:day/:wordIndex" element={<StudyScreen />} />
          <Route path="/quiz/:day/:wordIndex" element={<QuizScreen />} />
          <Route path="/complete/:day" element={<CompleteScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

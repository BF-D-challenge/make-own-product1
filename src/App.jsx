import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SplashScreen from './screens/SplashScreen'
import MyScreen from './screens/MyScreen'
import StudyScreen from './screens/StudyScreen'
import QuizScreen from './screens/QuizScreen'
import CompleteScreen from './screens/CompleteScreen'
import bgTexture from './assets/bg_texture.png'

export default function App() {
  return (
    <BrowserRouter>
      {/* 전체 뷰포트를 덮는 고정 배경 — 노치/홈바 포함 */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `url(${bgTexture})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        zIndex: -1,
      }} />
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

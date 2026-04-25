import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import SplashScreen from './screens/SplashScreen'
import MyScreen from './screens/MyScreen'
import StudyScreen from './screens/StudyScreen'
import QuizScreen from './screens/QuizScreen'
import CompleteScreen from './screens/CompleteScreen'
import bgTexture from './assets/bg_texture.jpg'

// 세션 내 최초 진입 여부 확인 — 탭 열릴 때마다 스플래시 표시
function RequireSplash({ children }) {
  const location = useLocation()
  const splashShown = sessionStorage.getItem('splashShown')

  if (!splashShown && location.pathname !== '/') {
    return <Navigate to="/" replace />
  }
  return children
}

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
          <Route path="/my" element={<RequireSplash><MyScreen /></RequireSplash>} />
          <Route path="/study/:day/:wordIndex" element={<RequireSplash><StudyScreen /></RequireSplash>} />
          <Route path="/quiz/:day/:wordIndex" element={<RequireSplash><QuizScreen /></RequireSplash>} />
          <Route path="/complete/:day" element={<RequireSplash><CompleteScreen /></RequireSplash>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import SplashScreen from './screens/SplashScreen'
import bgTexture from './assets/bg_texture.jpg'

// 스플래시 이후 화면은 lazy load — 초기 번들 크기 절감
const MyScreen       = lazy(() => import('./screens/MyScreen'))
const StudyScreen    = lazy(() => import('./screens/StudyScreen'))
const QuizScreen     = lazy(() => import('./screens/QuizScreen'))
const CompleteScreen = lazy(() => import('./screens/CompleteScreen'))

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
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/my" element={<RequireSplash><MyScreen /></RequireSplash>} />
            <Route path="/study/:day/:wordIndex" element={<RequireSplash><StudyScreen /></RequireSplash>} />
            <Route path="/quiz/:day/:wordIndex" element={<RequireSplash><QuizScreen /></RequireSplash>} />
            <Route path="/complete/:day" element={<RequireSplash><CompleteScreen /></RequireSplash>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  )
}

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import bgTexture from '../assets/bg_texture.png'

export default function SplashScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    // 최초 진입 여부 확인 — localStorage에 저장된 상태가 없으면 첫 방문
    const saved = localStorage.getItem('engseven_state')
    const isFirstVisit = !saved

    const timer = setTimeout(() => {
      if (isFirstVisit) {
        navigate('/quiz/1/0', { replace: true })  // 첫 방문 → 바로 퀴즈
      } else {
        navigate('/my', { replace: true })         // 재방문 → 맵 화면
      }
    }, 1200)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100svh',
      backgroundImage: `url(${bgTexture})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
      animation: 'fadeIn 0.3s ease',
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
      <img
        src={logo}
        alt="잉세븐"
        style={{
          width: '120px',
          height: 'auto',
          objectFit: 'contain',
        }}
      />
    </div>
  )
}

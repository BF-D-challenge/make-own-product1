import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import bgTexture from '../assets/bg_texture.png'
import useAppStore from '../store/useAppStore'

export default function SplashScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    // 시간 기반 잠금 해제 먼저 처리
    useAppStore.getState().checkAndUnlockDays()

    const timer = setTimeout(() => {
      const { dayProgress } = useAppStore.getState()

      // unlocked 상태인 첫 번째 날 찾기
      const unlockedEntry = Object.entries(dayProgress)
        .find(([, status]) => status === 'unlocked')

      if (unlockedEntry) {
        // 풀 수 있는 날이 있으면 바로 퀴즈로
        navigate(`/quiz/${unlockedEntry[0]}/0`, { replace: true })
      } else {
        // 모두 완료됐거나 잠긴 경우 → My 맵 화면
        navigate('/my', { replace: true })
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

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
      const { dayProgress, unlockTimes } = useAppStore.getState()
      const now = Date.now()

      // 1순위: unlocked 상태인 날
      const unlockedEntry = Object.entries(dayProgress)
        .find(([, status]) => status === 'unlocked')

      if (unlockedEntry) {
        navigate(`/quiz/${unlockedEntry[0]}/0`, { replace: true })
        return
      }

      // 2순위: unlockTimes에 7AM이 지난 날 (checkAndUnlockDays 미반영 폴백)
      const readyEntry = Object.entries(unlockTimes)
        .find(([, unlockAt]) => now >= unlockAt)

      if (readyEntry) {
        navigate(`/quiz/${readyEntry[0]}/0`, { replace: true })
        return
      }

      // 풀 수 있는 날 없음 → My 화면
      navigate('/my', { replace: true })
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

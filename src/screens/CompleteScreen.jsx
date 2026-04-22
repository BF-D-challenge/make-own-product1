import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useAppStore from '../store/useAppStore'
import StepIndicator from '../components/StepIndicator'
import complete100 from '../assets/complete_100.png'
import myIcon from '../assets/my_icon.svg'

export default function CompleteScreen() {
  const navigate = useNavigate()
  const { day } = useParams()
  const dayNum = parseInt(day)
  const { completeDay, resetProgress, nickname } = useAppStore()

  useEffect(() => {
    completeDay(dayNum)
  }, [dayNum])

  const goToMy = () => {
    if (dayNum === 7) {
      // 7일 모두 달성 → 1주일로 초기화
      resetProgress()
    }
    navigate('/my')
  }

  return (
    <div className="screen">
      {/* 상단 타이틀 — BM kkubulim, 두 줄 동일 크기 */}
      <div style={{ padding: '52px 24px 16px' }}>
        <p style={{ fontFamily: 'BM kkubulim, sans-serif', fontSize: '24px', color: '#444', lineHeight: 1.5 }}>
          {nickname}님,
        </p>
        <p style={{ fontFamily: 'BM kkubulim, sans-serif', fontSize: '24px', color: '#444', lineHeight: 1.5 }}>
          오늘도 해내셨네요, 축하해요!
        </p>
      </div>

      {/* 콘텐츠 */}
      <div className="container-content">
        {/* 스텝 인디케이터 — 전부 완료 */}
        <StepIndicator total={10} current={10} allComplete />

        {/* 완성 카드 */}
        <div
          className="card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            padding: '40px 24px',
          }}
        >
          {/* 100 손그림 이미지 */}
          <img
            src={complete100}
            alt="100점"
            style={{
              width: '220px',
              height: 'auto',
              objectFit: 'contain',
              animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
          />
          <style>{`
            @keyframes popIn {
              from { opacity: 0; transform: scale(0.6); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>

          {/* 완성 메시지 — Pretendard */}
          <p style={{
            fontFamily: 'Pretendard, sans-serif',
            fontSize: '16px',
            fontWeight: '500',
            color: '#444',
            textAlign: 'center',
            lineHeight: 1.7,
          }}>
            오늘의 10단어를 성공했어요!<br />
            내일도 10단어만 더 해볼까요?
          </p>
        </div>
      </div>

      {/* 하단 My 버튼 */}
      <div style={{
        padding: '16px 24px 36px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}>
        <div
          onClick={goToMy}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            background: '#fff',
            borderRadius: '999px',
            width: '72px',
            height: '72px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            cursor: 'pointer',
          }}
        >
          <img src={myIcon} alt="My" style={{ width: '26px', height: '26px', objectFit: 'contain' }} />
          <span style={{
            fontFamily: 'Pretendard, sans-serif',
            fontSize: '11px',
            fontWeight: '600',
            color: '#555',
          }}>My</span>
        </div>
      </div>
    </div>
  )
}

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
  const { completeDay, resetProgress, nickname, sessionWrongWords } = useAppStore()
  const hasPerfect = sessionWrongWords.length === 0

  useEffect(() => {
    completeDay(dayNum)
  }, [dayNum])

  const goToMy = () => {
    if (dayNum === 7) resetProgress()
    navigate('/my')
  }

  return (
    <div
      className="screen"
      style={{
        height: 'max(720px, 100svh)',
        minHeight: '720px',
        overflow: 'hidden',
      }}
    >
      {/* 상단 타이틀 */}
      <div style={{ padding: '52px 24px 16px', flexShrink: 0 }}>
        <p style={{ fontFamily: 'BM kkubulim, sans-serif', fontSize: '24px', color: '#444', lineHeight: 1.5 }}>
          {nickname}님,
        </p>
        <p style={{ fontFamily: 'BM kkubulim, sans-serif', fontSize: '24px', color: '#444', lineHeight: 1.5 }}>
          {hasPerfect ? '완벽해요, 대단한데요!' : '오늘도 해내셨네요, 축하해요!'}
        </p>
      </div>

      {/* 콘텐츠 */}
      <div style={{ flex: 1, padding: '0 24px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <StepIndicator total={10} current={10} allComplete />

        {/* 카드 */}
        <div
          style={{
            flex: 1,
            background: '#fff',
            borderRadius: '16px',
            padding: hasPerfect ? '40px 24px' : '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: hasPerfect ? 'center' : 'flex-start',
            justifyContent: hasPerfect ? 'center' : 'flex-start',
            gap: '12px',
            overflowY: 'auto',
          }}
        >
          {hasPerfect ? (
            <>
              <img
                src={complete100}
                alt="100점"
                style={{
                  width: '200px',
                  height: 'auto',
                  objectFit: 'contain',
                  animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                }}
              />
              <style>{`
                @keyframes popIn {
                  from { opacity: 0; transform: scale(0.6); }
                  to   { opacity: 1; transform: scale(1); }
                }
              `}</style>
              <p style={{
                fontFamily: 'Pretendard, sans-serif',
                fontSize: '16px',
                fontWeight: '500',
                color: '#444',
                textAlign: 'center',
                lineHeight: 1.7,
              }}>
                오늘의 10단어를 모두 맞혔어요!<br />
                내일도 10단어만 더 해볼까요?
              </p>
            </>
          ) : (
            <>
              <p style={{
                fontFamily: 'Pretendard, sans-serif',
                fontSize: '13px',
                fontWeight: '600',
                color: '#999',
                marginBottom: '4px',
              }}>
                틀린 단어 {sessionWrongWords.length}개 — 다시 확인해봐요
              </p>

              {sessionWrongWords.map((word, i) => (
                <div
                  key={i}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: '#FFF3F1',
                    borderRadius: '12px',
                    borderLeft: '4px solid #F4A49A',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3px',
                  }}
                >
                  <span style={{
                    fontFamily: 'Pretendard, sans-serif',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#333',
                  }}>
                    {word.english}
                  </span>
                  <span style={{
                    fontFamily: 'Pretendard, sans-serif',
                    fontSize: '13px',
                    fontWeight: '400',
                    color: '#777',
                  }}>
                    {word.korean}
                  </span>
                </div>
              ))}

              <p style={{
                fontFamily: 'Pretendard, sans-serif',
                fontSize: '14px',
                fontWeight: '500',
                color: '#aaa',
                marginTop: '4px',
                lineHeight: 1.6,
              }}>
                내일도 10단어만 더 해볼까요?
              </p>
            </>
          )}
        </div>
      </div>

      {/* 하단 My 버튼 */}
      <div style={{ padding: '16px 24px 36px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexShrink: 0 }}>
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
          <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '11px', fontWeight: '600', color: '#555' }}>My</span>
        </div>
      </div>
    </div>
  )
}

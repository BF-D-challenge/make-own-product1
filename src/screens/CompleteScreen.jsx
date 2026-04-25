import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useAppStore from '../store/useAppStore'
import StepIndicator from '../components/StepIndicator'
import complete100 from '../assets/complete_100.png'
import lineStroke from '../assets/line_stroke.svg'
import myIcon from '../assets/my_icon.svg'

export default function CompleteScreen() {
  const navigate = useNavigate()
  const { day } = useParams()
  const dayNum = parseInt(day)
  const { completeDay, resetProgress, nickname, sessionWrongWords } = useAppStore()
  const hasPerfect = sessionWrongWords.length === 0

  // 틀린 단어의 인덱스(0-based) 배열
  const wrongIndices = sessionWrongWords.map(w => w.index)

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

        {/* 스텝 인디케이터 — 맞은 건 초록, 틀린 건 빨강 */}
        <StepIndicator
          total={10}
          current={10}
          allComplete={hasPerfect}
          wrongIndices={hasPerfect ? null : wrongIndices}
        />

        {/* 카드 */}
        <div
          style={{
            flex: 1,
            background: '#fff',
            borderRadius: '16px',
            padding: '20px 20px 16px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            gap: '16px',
          }}
        >
          {hasPerfect ? (
            /* ── 100점 화면 ── */
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
            }}>
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
            </div>
          ) : (
            /* ── 오답 화면 ── */
            <>
              {/* 틀린 단어 목록 — 내부 스크롤 */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                {sessionWrongWords.map((word, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      gap: '8px',
                    }}
                  >
                    {/* 왼쪽 세로 선 */}
                    <img
                      src={lineStroke}
                      alt=""
                      style={{
                        width: '3px',
                        flexShrink: 0,
                        alignSelf: 'stretch',
                        objectFit: 'fill',
                      }}
                    />
                    {/* 단어 내용 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {/* 영단어 — 라임 하이라이트 */}
                      <span style={{
                        fontFamily: 'Pretendard, sans-serif',
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#444',
                        background: '#CCFF00',
                        borderRadius: '2px',
                        padding: '0 2px',
                        display: 'inline',
                        alignSelf: 'flex-start',
                      }}>
                        {word.english}
                      </span>
                      {/* 한국어 뜻 */}
                      <span style={{
                        fontFamily: 'Pretendard, sans-serif',
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#444',
                      }}>
                        {word.korean}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 하단 고정 메시지 */}
              <p style={{
                fontFamily: 'Pretendard, sans-serif',
                fontSize: '16px',
                fontWeight: '500',
                color: '#444',
                textAlign: 'center',
                lineHeight: 1.5,
                flexShrink: 0,
              }}>
                오늘의 오답이에요!<br />
                내일도 10단어만 더 해볼까요?
              </p>
            </>
          )}
        </div>
      </div>

      {/* 하단 My 버튼 */}
      <div style={{ padding: '12px 24px 32px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexShrink: 0 }}>
        <div
          onClick={goToMy}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
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

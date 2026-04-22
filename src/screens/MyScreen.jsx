import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '../store/useAppStore'
import mapPath from '../assets/map_path.png'
import character from '../assets/character.png'
import bgTexture from '../assets/bg_texture.png'
import homeIcon from '../assets/home_icon.svg'
import rockIcon from '../assets/rock_icon.svg'

// 맵 이미지(1005×917) 기준 스테이지 위치 (%)
// 이미지가 컨테이너를 정확히 채우므로 % = 이미지 내 실제 위치
const STAGE_POSITIONS = [
  { top: '6%',  left: '11%' },  // Day 1 — 좌상단
  { top: '6%',  left: '50%' },  // Day 2 — 중상단
  { top: '6%',  left: '89%' },  // Day 3 — 우상단
  { top: '47%', left: '89%' },  // Day 4 — 우중단
  { top: '47%', left: '50%' },  // Day 5 — 중중단
  { top: '47%', left: '11%' },  // Day 6 — 좌중단
  { top: '94%', left: '11%' },  // Day 7 — 좌하단
]

export default function MyScreen() {
  const navigate = useNavigate()
  const { nickname, dayProgress, checkAndUnlockDays } = useAppStore()

  // 마운트 시 07:00 지난 날 자동 해제
  useEffect(() => { checkAndUnlockDays() }, [])

  // 캐릭터는 항상 마지막 스테이지(Day 7)에 고정
  const charPos = STAGE_POSITIONS[STAGE_POSITIONS.length - 1]

  // 가장 최근 완료된 날로 Complete 화면 이동
  const goToComplete = () => {
    const completedDays = Object.entries(dayProgress)
      .filter(([, v]) => v === 'complete')
      .map(([k]) => parseInt(k))
    const lastCompleted = completedDays.length > 0 ? Math.max(...completedDays) : 1
    navigate(`/complete/${lastCompleted}`)
  }

  const handleDayClick = (day) => {
    const status = dayProgress[day]
    if (status === 'unlocked' || status === 'complete') {
      navigate(`/quiz/${day}/0`)
    }
  }

  return (
    <div className="screen" style={{
      backgroundImage: `url(${bgTexture})`,
      backgroundSize: '100% 100%',
      backgroundPosition: 'center top',
    }}>

      {/* 상단 타이틀 */}
      <div style={{ padding: '56px 24px 12px' }}>
        <p style={{
          fontFamily: 'BM kkubulim, sans-serif',
          fontSize: '24px',
          color: '#444',
          lineHeight: 1.4,
          marginBottom: '2px',
        }}>
          안녕하세요,
        </p>
        <h1 style={{
          fontFamily: 'BM kkubulim, sans-serif',
          fontSize: '24px',
          color: '#444',
          lineHeight: 1.4,
          margin: 0,
        }}>
          {nickname}님!
        </h1>
      </div>

      {/* 맵 영역 — flex:1로 남은 공간 차지, 내부에 정확한 aspect-ratio 컨테이너 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4px 20px',
      }}>
        {/* 이미지 비율(1005:917)에 맞춘 컨테이너 */}
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1005 / 917',
        }}>
          {/* 맵 경로 이미지 — 컨테이너를 정확히 채움 */}
          <img
            src={mapPath}
            alt="map path"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'fill',
              opacity: 0.85,
            }}
          />

          {/* 스테이지 노드 */}
          {STAGE_POSITIONS.map((pos, i) => {
            const day = i + 1
            const status = dayProgress[day] ?? 'locked'
            const isLocked = status === 'locked'
            const isClickable = status === 'unlocked' || status === 'complete'

            return (
              <div
                key={day}
                onClick={() => handleDayClick(day)}
                style={{
                  position: 'absolute',
                  top: pos.top,
                  left: pos.left,
                  transform: 'translate(-50%, -50%)',
                  width: '64px',
                  height: '64px',
                  cursor: isClickable ? 'pointer' : 'default',
                  zIndex: 2,
                  transition: 'transform 0.1s',
                }}
                onMouseDown={e => isClickable && (e.currentTarget.style.transform = 'translate(-50%, -50%) scale(0.92)')}
                onMouseUp={e => isClickable && (e.currentTarget.style.transform = 'translate(-50%, -50%)')}
                onTouchStart={e => isClickable && (e.currentTarget.style.transform = 'translate(-50%, -50%) scale(0.92)')}
                onTouchEnd={e => isClickable && (e.currentTarget.style.transform = 'translate(-50%, -50%)')}
              >
                {isLocked ? (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: '2.5px dashed #BBBBBB',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <img
                      src={rockIcon}
                      alt={`Day ${day} locked`}
                      style={{ width: '55%', height: '55%', objectFit: 'contain' }}
                    />
                  </div>
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    backgroundColor: '#CCFF00',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                  }}>
                    <span style={{
                      fontFamily: 'BM kkubulim, sans-serif',
                      fontSize: '22px',
                      color: '#222',
                      fontWeight: '700',
                      lineHeight: 1,
                    }}>
                      {day}
                    </span>
                  </div>
                )}
              </div>
            )
          })}

          {/* 현재 위치 캐릭터 — 마지막 스테이지 우측 상단에 튀어나옴 */}
          <img
            src={character}
            alt="character"
            style={{
              position: 'absolute',
              top: charPos.top,
              left: charPos.left,
              transform: 'translate(40%, -110%)',
              width: '44px',
              height: 'auto',
              zIndex: 1,
            }}
          />
        </div>
      </div>

      {/* 하단 — 안내 텍스트 + 홈 버튼 */}
      <div style={{ padding: '8px 24px 36px' }}>
        <p style={{
          fontFamily: 'Pretendard, sans-serif',
          fontSize: '14px',
          color: '#888',
          textAlign: 'center',
          marginBottom: '16px',
        }}>
          다음 단계는 다음날 07:00부터 가능해요!
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div
            onClick={goToComplete}
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
            }}>
            <img src={homeIcon} alt="home" style={{ width: '26px', height: '26px', objectFit: 'contain' }} />
            <span style={{
              fontFamily: 'Pretendard, sans-serif',
              fontSize: '11px',
              fontWeight: '600',
              color: '#555',
            }}>home</span>
          </div>
        </div>
      </div>
    </div>
  )
}

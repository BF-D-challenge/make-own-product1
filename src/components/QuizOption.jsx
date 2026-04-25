// 퀴즈 선택지 버튼
// status: 'default' | 'correct' | 'wrong' | 'disabled'
import iconCheck from '../assets/icon_check.svg'
import iconClose from '../assets/icon_close.svg'

const BG_COLORS = {
  default: '#F5F5F5',
  correct: '#F4FFCC',
  wrong: '#FCDAD3',
  disabled: '#F5F5F5',
}

export default function QuizOption({ label, status = 'default', onClick }) {
  const isCorrect = status === 'correct'
  const isWrong = status === 'wrong'
  const isDisabled = status === 'disabled'

  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      style={{
        width: '100%',
        padding: '18px 20px',
        borderRadius: '12px',
        border: isCorrect
          ? '1.5px solid #B8D900'
          : isWrong
            ? '1.5px solid #F5A89A'
            : '1.5px solid transparent',
        background: BG_COLORS[status],
        cursor: isDisabled ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        transition: 'all 0.15s ease',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <span style={{
        fontFamily: 'Pretendard, sans-serif',
        fontSize: '16px',
        fontWeight: '500',
        color: '#444444',
        textAlign: 'left',
      }}>
        {label}
      </span>
      {/* 아이콘 자리 항상 예약 — 크기 변동 방지 */}
      <div style={{ width: '24px', height: '24px', flexShrink: 0 }}>
        {isCorrect && <img src={iconCheck} alt="정답" style={{ width: '24px', height: '24px' }} />}
        {isWrong   && <img src={iconClose} alt="오답" style={{ width: '24px', height: '24px' }} />}
      </div>
    </button>
  )
}

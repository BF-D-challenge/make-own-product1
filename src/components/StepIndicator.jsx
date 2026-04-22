// 상단 1~10 진행 도트 컴포넌트

export default function StepIndicator({ total = 10, current = 0, allComplete = false }) {
  return (
    <div style={{
      display: 'flex',
      gap: '4px',
      alignItems: 'center',
      marginBottom: '20px',
    }}>
      {Array.from({ length: total }, (_, i) => {
        const isComplete = allComplete || i < current
        const isActive = !allComplete && i === current

        const bgColor = allComplete
          ? '#4CAF50'
          : isComplete
            ? '#4CAF50'
            : isActive
              ? '#444444'
              : '#DDDDDD'

        const size = isActive ? '24px' : '20px'
        const fontSize = isActive ? '12px' : '10px'
        const textColor = '#fff'

        return (
          <div
            key={i}
            style={{
              width: size,
              height: size,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: bgColor,
              flexShrink: 0,
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{
              color: textColor,
              fontSize: fontSize,
              fontFamily: 'BM kkubulim, sans-serif',
              lineHeight: 1,
              userSelect: 'none',
            }}>
              {i + 1}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// 상단 1~10 진행 도트 컴포넌트
// wrongIndices: Set or Array — 완료 화면에서 틀린 번호(0-based)를 전달하면 빨간/초록으로 구분

export default function StepIndicator({ total = 10, current = 0, allComplete = false, wrongIndices = null }) {
  return (
    <div style={{
      display: 'flex',
      gap: '4px',
      alignItems: 'center',
      marginBottom: '20px',
    }}>
      {Array.from({ length: total }, (_, i) => {
        let bgColor
        let size
        let fontSize

        if (wrongIndices !== null) {
          // 완료 화면 — 틀린 건 빨강, 맞은 건 초록
          const isWrong = Array.isArray(wrongIndices)
            ? wrongIndices.includes(i)
            : wrongIndices.has(i)
          bgColor = isWrong ? '#F04523' : '#31A552'
          size = '26px'
          fontSize = '12px'
        } else {
          const isComplete = allComplete || i < current
          const isActive = !allComplete && i === current
          bgColor = allComplete
            ? '#4CAF50'
            : isComplete ? '#4CAF50'
            : isActive  ? '#444444'
            : '#DDDDDD'
          size = isActive ? '24px' : '20px'
          fontSize = isActive ? '12px' : '10px'
        }

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
              color: '#fff',
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

import { create } from 'zustand'

// 랜덤 닉네임 생성
const ADJECTIVES = [
  '누워있는', '귀찮은', '멍때리는', '졸고있는', '미루는',
  '작심삼일', '의지박약', '뒹굴거리는', '침대찰떡', '숨만쉬는',
  '딴짓하는', '뇌가깨끗한', '파파고믿는', '번역기돌린', 'ABC모르는',
  '영어혐오', '대충사는', '흐물거리는', '갓생포기', '하품하는',
  '눈덜뜬', '입만산', '아는척하는', '까막눈인', '뇌정지온',
  '멘붕온', '뭉그적대는', '한글사랑', '무기력한', '야식먹는',
  '결제만하는', '앱만깐', '알림무시', '흐린눈의', '영포자',
  '꾸벅꾸벅', '느릿느릿', '넋나간', '꿈나라행', '의욕제로',
  '리셋된', '백지상태', '말문막힌', '단어까먹은', '당떨어진',
  '폰만보는', '이불밖위험', '거북목인', '초점없는', '세월아네월아',
]
const NOUNS = [
  '나무늘보', '개복치', '베짱이', '코알라', '거북이',
  '달팽이', '감자', '두부', '먼지', '젤리',
  '고양이', '판다', '병아리', '고구마', '양말',
  '슬리퍼', '쿠션', '빈백', '햄스터', '돌멩이',
  '물곰', '해파리', '미생물', '꼬마유령', '종이인형',
  '푸딩', '풍선껌', '솜사탕', '낙엽', '종이컵',
  '지우개', '포스트잇', '마우스', '키보드', '텀블러',
  '이어폰', '알람시계', '달력', '일기장', '운동화',
  '샌드위치', '도넛', '붕어빵', '식빵', '찹쌀떡',
  '다람쥐', '두더지', '웜뱃', '바다표범', '쿼카',
]

function generateNickname() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  return `${adj} ${noun}`
}

// 다음날 07:00 Unix timestamp 계산
function nextDay7AM() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setHours(7, 0, 0, 0)
  return d.getTime()
}

// localStorage 초기 상태 로드
function loadState() {
  try {
    const saved = localStorage.getItem('engseven_state')
    if (saved) return JSON.parse(saved)
  } catch (e) {}
  return null
}

function saveState(state) {
  try {
    localStorage.setItem('engseven_state', JSON.stringify({
      nickname: state.nickname,
      dayProgress: state.dayProgress,
      unlockTimes: state.unlockTimes,
    }))
  } catch (e) {}
}

const saved = loadState()

const initialDayProgress = {
  1: 'unlocked', 2: 'locked', 3: 'locked',
  4: 'locked',   5: 'locked', 6: 'locked', 7: 'locked',
}

const useAppStore = create((set, get) => ({
  // 닉네임
  nickname: saved?.nickname || generateNickname(),

  // 각 날의 상태: 'locked' | 'unlocked' | 'complete'
  dayProgress: saved?.dayProgress || initialDayProgress,

  // 다음날 07:00 unlock 예정 시각 { dayNum: timestamp }
  unlockTimes: saved?.unlockTimes || {},

  // 퀴즈/학습 진행 상태 (일시적, localStorage 저장 안함)
  currentDay: 1,
  currentWordIndex: 0,
  selectedAnswer: null,
  quizResult: null,

  // 날 완료 처리 — 다음날 07:00까지 잠금 유지
  completeDay: (day) => {
    set((state) => {
      const newProgress = { ...state.dayProgress, [day]: 'complete' }
      const newUnlockTimes = { ...state.unlockTimes }

      if (day < 7) {
        // 다음날 07:00에 해제 예약
        newUnlockTimes[day + 1] = nextDay7AM()
      }
      // day === 7이면 unlockTimes 추가 없음 (resetProgress로 처리)

      saveState({ nickname: state.nickname, dayProgress: newProgress, unlockTimes: newUnlockTimes })
      return { dayProgress: newProgress, unlockTimes: newUnlockTimes }
    })
  },

  // MyScreen mount 시 호출 — 07:00 지난 날 자동 해제
  checkAndUnlockDays: () => {
    set((state) => {
      const now = Date.now()
      const newProgress = { ...state.dayProgress }
      const newUnlockTimes = { ...state.unlockTimes }
      let changed = false

      Object.entries(state.unlockTimes).forEach(([dayStr, unlockAt]) => {
        const day = parseInt(dayStr)
        if (now >= unlockAt && newProgress[day] === 'locked') {
          newProgress[day] = 'unlocked'
          delete newUnlockTimes[day]
          changed = true
        }
      })

      if (changed) {
        saveState({ nickname: state.nickname, dayProgress: newProgress, unlockTimes: newUnlockTimes })
        return { dayProgress: newProgress, unlockTimes: newUnlockTimes }
      }
      return {}
    })
  },

  // 7일 모두 달성 후 초기화
  resetProgress: () => {
    set((state) => {
      const reset = { ...initialDayProgress }
      saveState({ nickname: state.nickname, dayProgress: reset, unlockTimes: {} })
      return { dayProgress: reset, unlockTimes: {} }
    })
  },

  // 퀴즈 답 선택
  selectAnswer: (answer, correct) => {
    set({ selectedAnswer: answer, quizResult: correct ? 'correct' : 'wrong' })
  },

  // 퀴즈 초기화
  resetQuiz: () => {
    set({ selectedAnswer: null, quizResult: null })
  },

  // 현재 진행 단어 설정
  setCurrentWord: (day, wordIndex) => {
    set({ currentDay: day, currentWordIndex: wordIndex, selectedAnswer: null, quizResult: null })
  },
}))

export default useAppStore

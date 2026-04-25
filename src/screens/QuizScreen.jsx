import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DAYS } from '../data/words'
import useAppStore from '../store/useAppStore'
import StepIndicator from '../components/StepIndicator'
import QuizOption from '../components/QuizOption'
import eastIcon from '../assets/east_icon.svg'
import myIcon from '../assets/my_icon.svg'

// choices 배열 셔플 (Fisher-Yates)
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function QuizScreen() {
  const navigate = useNavigate()
  const { day, wordIndex } = useParams()
  const dayNum = parseInt(day)
  const wordIdx = parseInt(wordIndex)

  const { dayProgress, nickname, addWrongWord, resetSessionWrong } = useAppStore()
  const hasCompleted = Object.values(dayProgress).some(v => v === 'complete')

  const dayData = DAYS.find((d) => d.day === dayNum)
  const word = dayData?.words[wordIdx]

  const shuffledChoices = useMemo(() => {
    if (!word) return []
    return shuffle(word.choices)
  }, [word])

  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [quizResult, setQuizResult] = useState(null)

  // 문제 바뀔 때 state 초기화 / 첫 문제면 틀린 단어 목록 리셋
  useEffect(() => {
    setSelectedAnswer(null)
    setQuizResult(null)
    if (wordIdx === 0) resetSessionWrong()
  }, [wordIdx])

  useEffect(() => {
    if (quizResult === 'correct') {
      const timer = setTimeout(() => goNext(), 300)
      return () => clearTimeout(timer)
    }
    if (quizResult === 'wrong') {
      const timer = setTimeout(() => navigate(`/study/${day}/${wordIndex}`), 1200)
      return () => clearTimeout(timer)
    }
  }, [quizResult])

  if (!word) return null

  const handleSelect = (choice) => {
    if (quizResult) return
    const correct = choice === word.english
    setSelectedAnswer(choice)
    setQuizResult(correct ? 'correct' : 'wrong')
    if (!correct) addWrongWord(word)
  }

  const goNext = () => {
    const nextIdx = wordIdx + 1
    if (nextIdx >= 10) navigate(`/complete/${day}`)
    else navigate(`/quiz/${day}/${nextIdx}`)
  }

  const goToMy = () => navigate('/my')

  const getOptionStatus = (choice) => {
    if (!selectedAnswer) return 'default'
    if (choice === word.english && quizResult === 'correct') return 'correct'
    if (choice === selectedAnswer && quizResult === 'wrong') return 'wrong'
    if (selectedAnswer) return 'disabled'
    return 'default'
  }

  return (
    <div className="screen">
      {/* 상단 타이틀 — BM kkubulim, 두 줄 동일 크기 */}
      <div style={{ padding: '52px 24px 16px' }}>
        <p style={{ fontFamily: 'BM kkubulim, sans-serif', fontSize: '24px', color: '#444', lineHeight: 1.5 }}>
          {nickname}님,
        </p>
        <p style={{ fontFamily: 'BM kkubulim, sans-serif', fontSize: '24px', color: '#444', lineHeight: 1.5 }}>
          오늘의 10단어 준비 되셨나요?
        </p>
      </div>

      {/* 콘텐츠 */}
      <div style={{ flex: 1, padding: '0 24px', display: 'flex', flexDirection: 'column' }}>
        <StepIndicator total={10} current={wordIdx} />

        {/* 퀴즈 카드 */}
        <div style={{
          flex: 1,
          background: '#fff',
          borderRadius: '16px',
          padding: '28px 24px 20px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* 한국어 뜻 — Pretendard */}
          <h2 style={{
            fontFamily: 'Pretendard, sans-serif',
            fontSize: '26px',
            fontWeight: '700',
            color: '#444',
            lineHeight: 1.35,
            marginBottom: '20px',
          }}>
            {word.korean}
          </h2>

          {/* 선택지 — Pretendard */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {shuffledChoices.map((choice, i) => (
              <QuizOption
                key={i}
                label={`${i + 1}. ${choice}`}
                status={getOptionStatus(choice)}
                onClick={() => handleSelect(choice)}
              />
            ))}
          </div>

          {/* 스페이서 */}
          <div style={{ flex: 1 }} />

        </div>
      </div>

      {/* 하단 My 버튼 — 최초 진입(완료한 날 없음)엔 숨김 */}
      <div style={{ padding: '16px 24px 36px', display: 'flex', justifyContent: 'flex-end' }}>
        {hasCompleted && (
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
        )}
      </div>
    </div>
  )
}

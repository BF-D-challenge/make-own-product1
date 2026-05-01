import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DAYS } from '../data/words'
import useAppStore from '../store/useAppStore'
import StepIndicator from '../components/StepIndicator'
import QuizOption from '../components/QuizOption'
import myIcon from '../assets/my_icon.svg'

// 개발: Vite 프록시(/quiz-api) 사용, 프로덕션: 직접 호출
const QUIZ_API = import.meta.env.DEV
  ? '/quiz-api/api/v1/quiz'
  : 'http://www.baec23.com:20001/api/v1/quiz'

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

  const {
    dayProgress, nickname,
    addWrongWord, resetSessionWrong,
    apiQuestions, setApiQuestions,
  } = useAppStore()
  const hasCompleted = Object.values(dayProgress).some(v => v === 'complete')

  // ── API 문제 fetch (첫 문제 진입 시, 캐시 없으면) ──
  useEffect(() => {
    if (wordIdx === 0) {
      resetSessionWrong()
      if (!apiQuestions[dayNum]) {
        fetch(QUIZ_API)
          .then(r => r.json())
          .then(data => {
            if (data.questions?.length > 0) setApiQuestions(dayNum, data.questions)
          })
          .catch(() => {})
      }
    }
  }, [dayNum])

  // ── 데이터 결정: API 우선, 없으면 로컬 fallback ──
  const apiQ = apiQuestions[dayNum]?.[wordIdx]       // API 문제
  const localDayData = DAYS.find(d => d.day === dayNum)
  const localWord = localDayData?.words[wordIdx]     // 로컬 단어

  // ── 셔플 (API: option 객체 배열 / 로컬: 문자열 배열) ──
  const shuffledApiOptions = useMemo(
    () => (apiQ ? shuffle(apiQ.options) : []),
    [apiQ]
  )
  const shuffledLocalChoices = useMemo(
    () => (localWord ? shuffle(localWord.choices) : []),
    [localWord]
  )

  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [quizResult, setQuizResult] = useState(null)

  // 문제 바뀔 때 초기화
  useEffect(() => {
    setSelectedAnswer(null)
    setQuizResult(null)
  }, [wordIdx])

  // 결과에 따른 화면 이동
  useEffect(() => {
    if (quizResult === 'correct') {
      const t = setTimeout(goNext, 300)
      return () => clearTimeout(t)
    }
    if (quizResult === 'wrong') {
      const t = setTimeout(() => navigate(`/study/${day}/${wordIndex}`), 1200)
      return () => clearTimeout(t)
    }
  }, [quizResult])

  if (!apiQ && !localWord) return null

  // ── 이벤트 핸들러 & 상태 계산 ──
  const handleSelectApi = (option) => {
    if (quizResult) return
    const correct = option.id === apiQ.correctOptionId
    setSelectedAnswer(option.id)
    setQuizResult(correct ? 'correct' : 'wrong')
    if (!correct) addWrongWord({ english: apiQ.term, korean: apiQ.koreanDefinition }, wordIdx)
  }

  const getStatusApi = (option) => {
    if (!selectedAnswer) return 'default'
    if (option.id === apiQ.correctOptionId && quizResult === 'correct') return 'correct'
    if (option.id === selectedAnswer && quizResult === 'wrong') return 'wrong'
    if (selectedAnswer) return 'disabled'
    return 'default'
  }

  const handleSelectLocal = (choice) => {
    if (quizResult) return
    const correct = choice === localWord.english
    setSelectedAnswer(choice)
    setQuizResult(correct ? 'correct' : 'wrong')
    if (!correct) addWrongWord(localWord, wordIdx)
  }

  const getStatusLocal = (choice) => {
    if (!selectedAnswer) return 'default'
    if (choice === localWord.english && quizResult === 'correct') return 'correct'
    if (choice === selectedAnswer && quizResult === 'wrong') return 'wrong'
    if (selectedAnswer) return 'disabled'
    return 'default'
  }

  const goNext = () => {
    const nextIdx = wordIdx + 1
    if (nextIdx >= 10) navigate(`/complete/${day}`, { state: { fromQuiz: true } })
    else navigate(`/study/${day}/${wordIdx}`)
  }

  const goToMy = () => navigate('/my')

  // ── 공통 레이아웃 ──
  const questionText = apiQ ? apiQ.term : (localWord?.korean ?? '')

  return (
    <div className="screen">
      {/* 상단 타이틀 */}
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
          <h2 style={{
            fontFamily: 'Pretendard, sans-serif',
            fontSize: '26px',
            fontWeight: '700',
            color: '#444',
            lineHeight: 1.35,
            marginBottom: '20px',
          }}>
            {questionText}
          </h2>

          {/* API 선택지 (4개, 한국어 뜻) */}
          {apiQ && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {shuffledApiOptions.map((option, i) => (
                <QuizOption
                  key={option.id}
                  label={`${i + 1}. ${option.text}`}
                  status={getStatusApi(option)}
                  onClick={() => handleSelectApi(option)}
                />
              ))}
            </div>
          )}

          {/* 로컬 선택지 (3개, 영어 단어) - API 없을 때 fallback */}
          {!apiQ && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {shuffledLocalChoices.map((choice, i) => (
                <QuizOption
                  key={i}
                  label={`${i + 1}. ${choice}`}
                  status={getStatusLocal(choice)}
                  onClick={() => handleSelectLocal(choice)}
                />
              ))}
            </div>
          )}

          <div style={{ flex: 1 }} />
        </div>
      </div>

      {/* My 버튼 */}
      <div style={{ padding: '16px 24px 36px', display: 'flex', justifyContent: 'flex-end' }}>
        {hasCompleted && (
          <div
            onClick={goToMy}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: '4px', background: '#fff',
              borderRadius: '999px', width: '72px', height: '72px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer',
            }}
          >
            <img src={myIcon} alt="My" style={{ width: '26px', height: '26px', objectFit: 'contain' }} />
            <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '11px', fontWeight: '600', color: '#555' }}>My</span>
          </div>
        )}
      </div>
    </div>
  )
}

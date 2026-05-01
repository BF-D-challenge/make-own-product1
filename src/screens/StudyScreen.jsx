import { useRef, useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DAYS } from '../data/words'
import useAppStore from '../store/useAppStore'
import StepIndicator from '../components/StepIndicator'
import eastIcon from '../assets/east_icon.svg'
import lineStroke from '../assets/line_stroke.svg'
import myIcon from '../assets/my_icon.svg'

// 단어별 데이터 캐시 (오디오 URL + 예문)
const wordDataCache = {}

function usePronunciation(word) {
  const [audioUrl, setAudioUrl] = useState(null)
  const [example, setExample] = useState(null)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    if (!word) return
    setAudioUrl(null)
    setExample(null)
    const key = word.toLowerCase()

    if (wordDataCache[key]) {
      setAudioUrl(wordDataCache[key].audio)
      setExample(wordDataCache[key].example)
      return
    }

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${key}`)
      .then(r => r.json())
      .then(data => {
        const entry = data?.[0]
        const phonetics = entry?.phonetics ?? []
        const audio = phonetics.find(p => p.audio)?.audio ?? null

        // 예문: meanings 전체를 순회해서 첫 번째 example 추출
        let ex = null
        for (const meaning of entry?.meanings ?? []) {
          for (const def of meaning.definitions ?? []) {
            if (def.example) { ex = def.example; break }
          }
          if (ex) break
        }

        wordDataCache[key] = { audio, example: ex }
        setAudioUrl(audio)
        setExample(ex)
      })
      .catch(() => {})
  }, [word])

  const play = () => {
    if (!audioUrl || playing) return
    if (audioRef.current) audioRef.current.pause()
    const audio = new Audio(audioUrl)
    audioRef.current = audio
    setPlaying(true)
    audio.play()
    audio.onended = () => setPlaying(false)
    audio.onerror = () => setPlaying(false)
  }

  return { canPlay: !!audioUrl, playing, play, example }
}

// 예문에서 {word} → 노란 하이라이트 파싱
function parseExample(example) {
  const parts = example.split(/\{([^}]+)\}/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} style={{
        background: '#CCFF00',
        borderRadius: '2px',
        padding: '0 2px',
        fontStyle: 'normal',
      }}>
        {part}
      </mark>
    ) : part
  )
}

export default function StudyScreen() {
  const navigate = useNavigate()
  const { nickname, dayProgress, apiQuestions } = useAppStore()
  const hasCompleted = Object.values(dayProgress).some(v => v === 'complete')
  const { day, wordIndex } = useParams()
  const dayNum = parseInt(day)
  const wordIdx = parseInt(wordIndex)

  // API 우선, 없으면 로컬 데이터 fallback
  const apiQ = apiQuestions[dayNum]?.[wordIdx]
  const dayData = DAYS.find((d) => d.day === dayNum)
  const localWord = dayData?.words[wordIdx] ?? null

  // API → word 형식 변환
  const word = useMemo(() => {
    if (apiQ) {
      return {
        english: apiQ.term,
        korean: apiQ.koreanDefinition,
        example: apiQ.englishDefinition,
        exampleKorean: null,
        isApi: true,   // API 데이터 여부 플래그
      }
    }
    return localWord
  }, [apiQ, localWord])

  // hook은 early return 전에 항상 호출해야 함 (Rules of Hooks)
  const { canPlay, playing, play, example: dictExample } = usePronunciation(word?.english ?? '')

  if (!word) return null

  const handleNext = () => {
    const nextIdx = wordIdx + 1
    if (nextIdx >= 10) navigate(`/complete/${day}`, { state: { fromQuiz: true } })
    else navigate(`/quiz/${day}/${nextIdx}`)
  }
  const goToMy = () => navigate('/my')

  return (
    <div className="screen">
      {/* 상단 타이틀 — 두 줄 동일 폰트/크기 */}
      <div style={{ padding: '52px 24px 16px' }}>
        <p style={{
          fontFamily: 'BM kkubulim, sans-serif',
          fontSize: '22px',
          color: '#444',
          lineHeight: 1.5,
        }}>
          {nickname}님,
        </p>
        <p style={{
          fontFamily: 'BM kkubulim, sans-serif',
          fontSize: '22px',
          color: '#444',
          lineHeight: 1.5,
        }}>
          오늘의 10단어 준비 되셨나요?
        </p>
      </div>

      {/* 콘텐츠 */}
      <div style={{ flex: 1, padding: '0 24px', display: 'flex', flexDirection: 'column' }}>
        {/* 스텝 인디케이터 */}
        <StepIndicator total={10} current={wordIdx} />

        {/* 단어 카드 */}
        <div style={{
          flex: 1,
          background: '#fff',
          borderRadius: '16px',
          padding: '28px 24px 20px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* 영단어 + 발음 버튼 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <h2 style={{
              fontFamily: 'Pretendard, sans-serif',
              fontSize: '30px',
              fontWeight: '700',
              color: '#444',
              lineHeight: 1.2,
              margin: 0,
            }}>
              {word.english}
            </h2>
            {canPlay && (
              <button
                onClick={play}
                style={{
                  background: playing ? '#CCFF00' : '#F5F5F5',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'background 0.15s ease',
                }}
              >
                {/* 스피커 아이콘 */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" fill="#444"/>
                  {playing ? (
                    <>
                      <path d="M19.07 4.93a10 10 0 010 14.14" stroke="#444" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M15.54 8.46a5 5 0 010 7.07" stroke="#444" strokeWidth="2" strokeLinecap="round"/>
                    </>
                  ) : (
                    <path d="M15.54 8.46a5 5 0 010 7.07" stroke="#444" strokeWidth="2" strokeLinecap="round"/>
                  )}
                </svg>
              </button>
            )}
          </div>

          {/* 한국어 뜻 */}
          <p style={{
            fontFamily: 'Pretendard, sans-serif',
            fontSize: '20px',
            fontWeight: '500',
            color: '#444',
            lineHeight: 1.4,
            marginBottom: '16px',
          }}>
            {word.korean}
          </p>

          {/* 예문 — blockquote 스타일 */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '10px',
            alignItems: 'flex-start',
          }}>
            <img src={lineStroke} alt="" style={{ width: '4px', flexShrink: 0, alignSelf: 'stretch', objectFit: 'fill', height: '100%' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* API 데이터: 영어 정의 */}
              {word.isApi && (
                <>
                  <p style={{
                    fontFamily: 'Pretendard, sans-serif',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#AAAAAA',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}>
                    English Definition
                  </p>
                  <p style={{
                    fontFamily: 'Pretendard, sans-serif',
                    fontSize: '14px',
                    fontWeight: '400',
                    color: '#555',
                    lineHeight: 1.7,
                  }}>
                    {word.example}
                  </p>
                </>
              )}

              {/* 로컬 데이터: {word} 하이라이트 예문 */}
              {!word.isApi && (
                <p style={{
                  fontFamily: 'Pretendard, sans-serif',
                  fontSize: '14px',
                  fontWeight: '400',
                  color: '#555',
                  lineHeight: 1.7,
                }}>
                  {parseExample(word.example)}
                </p>
              )}

              {/* dictionaryapi.dev 예문 (API 단어일 때만) */}
              {word.isApi && dictExample && (
                <>
                  <p style={{
                    fontFamily: 'Pretendard, sans-serif',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#AAAAAA',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    marginTop: '4px',
                  }}>
                    Example
                  </p>
                  <p style={{
                    fontFamily: 'Pretendard, sans-serif',
                    fontSize: '14px',
                    fontWeight: '400',
                    color: '#555',
                    lineHeight: 1.7,
                    fontStyle: 'italic',
                  }}>
                    "{dictExample}"
                  </p>
                </>
              )}

              {/* 로컬 한국어 예문 */}
              {!word.isApi && word.exampleKorean && (
                <p style={{
                  fontFamily: 'Pretendard, sans-serif',
                  fontSize: '13px',
                  fontWeight: '400',
                  color: '#888',
                  lineHeight: 1.6,
                }}>
                  {word.exampleKorean}
                </p>
              )}
            </div>
          </div>

          {/* 스페이서 */}
          <div style={{ flex: 1 }} />

          {/* 다음 버튼 — 카드 내부 우측 하단 */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button
              onClick={handleNext}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Pretendard, sans-serif',
                fontSize: '15px',
                fontWeight: '600',
                color: '#444',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 0',
              }}
            >
              다음 <img src={eastIcon} alt="→" style={{ width: '18px', height: '18px', objectFit: 'contain', verticalAlign: 'middle' }} />
            </button>
          </div>
        </div>
      </div>

      {/* My 버튼 — 카드 아래, 우측 정렬 */}
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
            <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '11px', fontWeight: '600', color: '#555' }}>My</span>
          </div>
        )}
      </div>
    </div>
  )
}

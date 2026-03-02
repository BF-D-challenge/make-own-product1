# BF.D — AI Best Friend

> poke.ai 스타일의 AI 베스트프렌드 앱. 자동화된 iMessage 발송, 실시간 채팅, 워크플로우 설정을 하나의 앱에서.

**현재 상태: MVP** — Automation / iMessage / Chat 구현 완료

---

## 구현된 기능

### 채팅 (`/chat`)
- Claude Haiku 기반 AI 베스트프렌드 "BF.D"와 실시간 대화
- 대화 컨텍스트 유지 (최근 20턴)
- 한국어/영어 자동 감지 응답
- Supabase `chat_logs`에 대화 기록 저장

### Automation 워크플로우 (`/workflow`)
- 트리거 타입: Daily / Weekly / 특정 시간 / 비활성 감지
- AI 프롬프트 기반 개인화 메시지 자동 생성
- 수신자 다수 설정 가능
- 활성/비활성 토글, 수정/삭제
- Vercel Cron (`0 * * * *`) 으로 매시간 자동 실행

### iMessage 발송
- `osascript` → macOS Messages.app 직접 제어 (진짜 iMessage, 파란 말풍선)
- Claude Haiku가 프롬프트 기반 메시지 생성 → iMessage 발송
- 발송 결과 Supabase `message_logs`에 기록

---

## 특이점

- **Twilio 없이 iMessage 발송** — osascript로 Messages.app을 직접 제어해서 Twilio 없이도 진짜 iMessage(파란 말풍선) 발송 가능. 현재 macOS 로컬 전용, Vercel 배포 시 Twilio 전환 필요
- **Claude Opus 대신 Haiku** — SMS/iMessage 생성에 Opus를 쓰면 건당 $0.015, Haiku로 바꾸면 $0.0008. 동일한 품질로 약 20배 저렴
- **poke.ai 스타일 디자인** — sky-100 배경 + SVG feTurbulence 노이즈 텍스처 + 글래스모피즘 버튼으로 poke.ai와 동일한 디자인 시스템 구현

---

## 기술 스택

| 영역 | 기술 |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS v4 |
| UI | shadcn/ui (new-york), Radix UI, Framer Motion |
| AI | Anthropic Claude Haiku (`claude-haiku-4-5-20251001`) |
| DB | Supabase (PostgreSQL) |
| 메시지 발송 | osascript → iMessage (macOS) |
| 배포 | Vercel + Vercel Cron |

---

## Supabase 테이블

```sql
-- 워크플로우 설정
create table workflows (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  trigger_type text not null,
  trigger_config jsonb not null default '{}',
  message_prompt text not null,
  recipients text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz default now(),
  last_sent_at timestamptz
);

-- 발송 로그
create table message_logs (
  id uuid default gen_random_uuid() primary key,
  workflow_id text,
  recipient text not null,
  message_body text not null,
  status text not null,
  sent_at timestamptz default now()
);

-- 채팅 기록
create table chat_logs (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  role text not null,
  content text not null,
  created_at timestamptz default now()
);
```

---

## 환경변수 (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

ANTHROPIC_API_KEY=

# Vercel 배포 시 필요
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

CRON_SECRET=
```

---

## 로드맵

- [ ] 인증 (Supabase Auth / Google OAuth)
- [ ] Gallery — 사진/메모리 저장
- [ ] 홈 날씨 연동 (OpenWeatherMap)
- [ ] Integrations 페이지
- [ ] Vercel 배포 + Twilio 전환

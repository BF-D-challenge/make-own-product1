-- ============================================================
-- kakao_conversations 테이블
-- 카카오톡 채널 AI 에이전트 대화 히스토리 저장
-- ============================================================

create table if not exists public.kakao_conversations (
  id              bigint generated always as identity primary key,
  kakao_user_id   text        not null,         -- Kakao user.id (accountId 또는 botUserKey)
  kakao_user_type text        not null default 'accountId', -- 'accountId' | 'botUserKey'
  role            text        not null check (role in ('user', 'assistant')),
  content         text        not null,
  bot_id          text,                          -- 오픈빌더 봇 ID (멀티봇 구분용)
  created_at      timestamptz not null default now()
);

-- 유저별 대화 조회 최적화 인덱스
create index if not exists kakao_conversations_user_created_idx
  on public.kakao_conversations (kakao_user_id, created_at desc);

-- ── Row Level Security ───────────────────────────────────────
alter table public.kakao_conversations enable row level security;

-- 서비스 롤만 접근 허용 (웹훅은 service_role 키 사용)
create policy "service_role_all" on public.kakao_conversations
  for all
  to service_role
  using (true)
  with check (true);

-- ── 자동 정리: 90일 이상 된 대화 삭제 (선택 사항) ─────────────
-- pg_cron 확장이 활성화된 경우에만 아래 명령어를 실행하세요.
-- select cron.schedule(
--   'cleanup-kakao-conversations',
--   '0 3 * * *',   -- 매일 오전 3시 KST (UTC+9 → UTC 18:00)
--   $$
--     delete from public.kakao_conversations
--     where created_at < now() - interval '90 days';
--   $$
-- );

-- ── (참고) 기존 chat_logs 테이블 구조 ──────────────────────────
-- create table if not exists public.chat_logs (
--   id         bigint generated always as identity primary key,
--   user_id    text        not null,
--   role       text        not null,
--   content    text        not null,
--   created_at timestamptz not null default now()
-- );

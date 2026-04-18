"use client";

import { useState, FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface HeroFormState {
  email: string;
  submitted: boolean;
  loading: boolean;
}

interface BottomFormState {
  name: string;
  email: string;
  submitted: boolean;
  loading: boolean;
}

// ─── Header ──────────────────────────────────────────────────────────────────

function Header() {
  return (
    <header className="fixed top-0 z-50 w-full bg-[rgba(250,250,247,0.85)] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1024px] items-center justify-between px-5 py-3">
        {/* Figma: Joop 워드마크 이미지 h-[20px] w-[52.112px] */}
        <img src="/logo.svg" alt="Joop" className="h-5 w-[52px] object-contain" />
        <a
          href="#notify"
          className="flex items-center justify-center whitespace-nowrap rounded-[12px] bg-[#ff5a00] px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#e05000]"
        >
          사전 알림 신청
        </a>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  const [form, setForm] = useState<HeroFormState>({
    email: "",
    submitted: false,
    loading: false,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.email) return;
    setForm((f) => ({ ...f, loading: true }));
    setTimeout(() => {
      console.log("[Hero] 이메일 신청:", form.email);
      setForm((f) => ({ ...f, submitted: true, loading: false }));
    }, 800);
  };

  return (
    <section className="flex min-h-screen items-center justify-center overflow-hidden bg-[#fafaf7] px-5 pt-14">
      <div className="mx-auto flex w-full max-w-[620px] flex-col items-center gap-[52px] py-[120px] text-center">
        {/* Badge */}
        <div className="animate-fade-in opacity-0 [animation-fill-mode:forwards]">
          <span className="inline-block rounded-full bg-[#ffeee5] px-8 py-3 text-[13px] font-semibold text-[#ff5a00]">
            GUEST EARLY ACCESS
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up flex flex-col items-center text-[32px] font-bold leading-[1.5] text-[#222] opacity-0 [animation-delay:150ms] [animation-fill-mode:forwards]">
          <span>비어있는 좋은 숙소,</span>
          <span>가볍게 줍다.</span>
        </h1>

        {/* Sub-copy */}
        <p className="animate-fade-up flex flex-col items-center text-[16px] leading-[1.5] text-[#666] opacity-0 [animation-delay:250ms] [animation-fill-mode:forwards]">
          <span>갑작스러운 취소, 평일의 빈 방.</span>
          <span>퀄리티 높은 숙소를 수수료 거품 없이 가장 합리적인 가격으로 만나보세요.</span>
        </p>

        {/* CTA Form */}
        <div className="animate-fade-up w-full opacity-0 [animation-delay:350ms] [animation-fill-mode:forwards]">
          {form.submitted ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/90 px-8 py-8 shadow-lg ring-1 ring-[#ffeee5]">
              <CheckCircle2 className="h-10 w-10 text-[#ff5a00]" />
              <p className="text-lg font-semibold text-[#222]">신청이 완료되었습니다!</p>
              <p className="text-sm text-[#666]">정식 오픈 소식과 특별 혜택을 가장 먼저 알려드릴게요.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-[12px]">
              <div className="flex w-full gap-[12px]">
                <input
                  type="email"
                  required
                  placeholder="이메일 주소를 입력해 주세요"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="h-[44px] min-w-0 flex-1 rounded-[12px] border border-[#eee] bg-white px-5 text-sm text-[#333] outline-none placeholder:text-[#aaa] focus:border-[#ff5a00] focus:ring-2 focus:ring-[#ffeee5]"
                />
                <button
                  type="submit"
                  disabled={form.loading}
                  className="flex h-[44px] shrink-0 items-center justify-center whitespace-nowrap rounded-[12px] bg-[#ff5a00] px-6 text-[14px] font-semibold text-white transition-all hover:bg-[#e05000] active:scale-95 disabled:opacity-70"
                >
                  {form.loading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  ) : (
                    "첫 줍기 혜택 알림 받기"
                  )}
                </button>
              </div>
              <p className="text-[14px] text-[#aaa]">스팸 메일은 보내지 않습니다. 언제든지 수신 거부 가능합니다.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Problem ──────────────────────────────────────────────────────────────────

function ProblemSection() {
  return (
    <section className="bg-[#222] px-5 py-[120px]">
      <div className="mx-auto flex max-w-[620px] flex-col items-center gap-[40px]">
        <div className="flex flex-col items-center gap-[24px]">
          {/* Badge */}
          <span className="inline-block rounded-full bg-[#ffdecc] px-[40px] py-[8px] text-[12px] font-semibold text-[#ff5a00]">
            PROBLEM
          </span>
          {/* Headline */}
          <h2 className="flex items-start gap-[4px] text-[32px] font-bold leading-[1.5] text-center">
            <span className="text-white">좋은 숙소는 왜</span>
            <span className="text-[#ff8b4d]">항상 비싸야만</span>
            <span className="text-white">할까요?</span>
          </h2>
        </div>

        {/* Card */}
        <div className="flex flex-col gap-[12px] rounded-[16px] bg-[#333] p-[40px] text-[16px]">
          <div className="flex flex-col items-start">
            <p className="font-medium leading-[1.5] text-[#eee]">
              마음에 드는 숙소는 너무 비싸고, 저렴한 곳은 아쉽습니다.
              <br />
              하지만 아무리 인기 있는 숙소라도
            </p>
            <div className="flex items-start gap-[4px] leading-[1.5]">
              <span className="font-bold text-white">피치 못할 예약 취소나 비수기에는 빈 방(공실)</span>
              <span className="font-medium text-[#eee]">이 생기기 마련입니다.</span>
            </div>
          </div>
          <p className="font-medium leading-[1.5] text-[#eee]">
            이 아까운 빈 공간들을 게스트가 부담 없이 누릴 방법은 없을까요?
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Solution ─────────────────────────────────────────────────────────────────

function SolutionSection() {
  const cards = [
    {
      icon: "/icon-store.svg",
      title: "가벼운 가격으로 줍다",
      description:
        "기존 예약 플랫폼들이 가져가던 과도한 수수료를 걷어냈습니다. 플랫폼이 가벼워진 만큼, 게스트는 더 정직하고 낮은 가격으로 숙소를 예약할 수 있습니다.",
    },
    {
      icon: "/icon-check.svg",
      title: "숨어있는 퀄리티를 줍다",
      description:
        "무수히 많은 리스트 속에서 피곤하게 비교할 필요 없습니다. 엄선된 기준을 통과한 퀄리티 높은 숙소의 빈 방만을 선별하여 제안합니다.",
    },
    {
      icon: "/icon-bolt.svg",
      title: "즉흥적인 설렘을 줍다",
      description:
        "완벽한 여행 계획이 없어도 괜찮습니다. 훌쩍 떠나고 싶은 날, 매력적인 가격으로 오픈된 숙소를 우연히 발견하고 줍는 기쁨을 누려보세요.",
    },
  ];

  return (
    <section className="bg-[#fafaf7] px-5 py-[120px]">
      <div className="mx-auto flex max-w-[620px] flex-col items-center gap-[64px]">
        {/* Heading block */}
        <div className="flex flex-col items-center gap-[10px] text-center">
          <span className="inline-block rounded-full bg-[#ffdecc] px-[40px] py-[8px] text-[12px] font-semibold text-[#ff5a00]">
            SOLUTION
          </span>
          <h2 className="flex flex-col items-center text-[32px] font-bold leading-[1.5]">
            <span className="text-[#222]">호스트의 아까운 빈 방이,</span>
            <span className="text-[#ff5a00]">게스트에겐 기회가 됩니다.</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="flex w-full flex-col gap-[16px]">
          {cards.map((card) => (
            <div
              key={card.title}
              className="flex h-[260px] flex-col gap-[26px] rounded-[16px] bg-white p-[40px]"
              style={{ boxShadow: "0 1px 3px rgba(34,34,34,0.06)" }}
            >
              <img src={card.icon} alt="" className="h-12 w-12 object-contain" />
              <p className="text-[18px] font-bold text-[#222]">{card.title}</p>
              <p className="text-[16px] font-medium leading-[1.5] text-[#666]">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Vision ───────────────────────────────────────────────────────────────────

function VisionSection() {
  const stats = [
    { value: "0원", label: "숨겨진 수수료", left: 0 },
    { value: "엄선", label: "퀄리티 숙소", left: 165 },
    { value: "즉시", label: "예약 가능", left: 331 },
  ];

  return (
    <section className="px-5 py-[120px]">
      <div className="mx-auto flex max-w-[620px] flex-col items-center gap-[40px] text-center">
        <h2 className="flex flex-col items-center text-[32px] font-bold leading-[1.5] text-[#222]">
          <span>일상을 여행으로 만드는</span>
          <span>가장 가벼운 방법</span>
        </h2>
        <p className="text-[16px] leading-[1.5] text-[#444]">
          특별한 기념일이나 완벽한 준비가 없어도 좋습니다.
          <br />
          지친 일상 속에서 좋은 공간을 가볍게 줍고 떠나는 것만으로도,
          <br />
          여러분의 내일은 훨씬 더 산뜻해질 거에요.
        </p>

        {/* Stat cards — absolute positioned per Figma */}
        <div className="relative h-[144px] w-[480px]">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="absolute top-0 h-[144px] w-[149px] rounded-[16px] bg-white"
              style={{ left: stat.left, boxShadow: "0 1px 3px rgba(34,34,34,0.06)" }}
            >
              <p
                className="absolute w-[117px] text-center text-[24px] font-extrabold text-[#ff5a00]"
                style={{ top: 44, left: 16 }}
              >
                {stat.value}
              </p>
              <p
                className="absolute w-[117px] text-center text-[14px] font-medium text-[#888]"
                style={{ top: 97, left: 16 }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Bottom CTA ───────────────────────────────────────────────────────────────

function BottomCTASection() {
  const [form, setForm] = useState<BottomFormState>({
    name: "",
    email: "",
    submitted: false,
    loading: false,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setForm((f) => ({ ...f, loading: true }));
    setTimeout(() => {
      console.log("[Bottom CTA] 사전 알림 신청:", { name: form.name, email: form.email });
      setForm((f) => ({ ...f, submitted: true, loading: false }));
    }, 800);
  };

  return (
    <section id="notify" className="bg-[#f5f5f5] px-5 py-[120px]">
      <div className="mx-auto max-w-[620px]">
        <div
          className="flex flex-col items-center gap-[60px] overflow-hidden rounded-[20px] bg-white p-[40px]"
          style={{ boxShadow: "0 20px 40px rgba(34,34,34,0.08)" }}
        >
          {/* Header block */}
          <div className="flex w-full flex-col items-center gap-[24px]">
            <span className="inline-block rounded-full bg-[#ffdecc] px-[40px] py-[8px] text-[12px] font-semibold text-[#ff5a00]">
              EARLY ACCESS
            </span>
            <div className="flex flex-col items-center text-[32px] leading-[1.5] text-center">
              <p className="font-bold text-[#222]">가장 먼저 좋은 숙소를 주울 준비</p>
              <p className="font-extrabold text-[#ff5a00]">되셨나요?</p>
            </div>
            <p className="text-center text-[16px] leading-[1.5] text-[#666]">
              지금 사전 알림을 신청하시면,
              <br />
              정식 오픈 소식과 함께 첫 여행을 더욱 가볍게 만들어줄{" "}
              <span className="font-bold">특별한 쿠폰</span>을 챙겨드립니다.
            </p>
          </div>

          {/* Form block */}
          <div className="w-full">
            {form.submitted ? (
              <div className="flex flex-col items-center gap-4 rounded-2xl bg-[#ffeee5] px-8 py-10">
                <CheckCircle2 className="h-12 w-12 text-[#ff5a00]" />
                <div className="text-center">
                  <p className="text-lg font-bold text-[#222]">{form.name}님, 신청이 완료되었습니다!</p>
                  <p className="mt-2 text-sm text-[#666]">정식 오픈 시 특별 쿠폰과 함께 연락드릴게요.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
                {/* Inputs row */}
                <div className="flex gap-[12px]">
                  {/* Name input with always-visible floating label */}
                  <div className="relative flex-1">
                    <label className="absolute left-[20px] top-[-7px] z-10 bg-white px-[2px] text-[12px] font-semibold text-[#666]">
                      성함
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="h-[47px] w-full rounded-[12px] border border-[#eee] bg-white px-5 text-sm text-[#333] outline-none focus:border-[#ff5a00] focus:ring-2 focus:ring-[#ffeee5]"
                    />
                  </div>
                  {/* Email input with always-visible floating label */}
                  <div className="relative flex-1">
                    <label className="absolute left-[20px] top-[-7.5px] z-10 bg-white px-[2px] text-[12px] font-semibold text-[#666]">
                      이메일
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="h-[47px] w-full rounded-[12px] border border-[#eee] bg-white px-5 text-sm text-[#333] outline-none focus:border-[#ff5a00] focus:ring-2 focus:ring-[#ffeee5]"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={form.loading}
                  className="flex h-[49px] w-full items-center justify-center rounded-[16px] bg-[#ff5a00] text-[16px] font-semibold text-white transition-all hover:bg-[#e05000] active:scale-[0.98] disabled:opacity-70"
                >
                  {form.loading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  ) : (
                    "사전 알림 및 쿠폰 신청하기"
                  )}
                </button>

                <p className="text-center text-[12px] font-medium text-[#aaa]">
                  개인정보는 오픈 안내 목적으로만 활용되며, 이후 즉시 파기됩니다.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#f0f0ee] px-5 py-[32px] text-center text-[11px] tracking-[-0.11px] text-[#bbb]">
      <p>© 2026 ZOOP. All rights reserved.</p>
      <p>본 페이지는 서비스 출시 전 수요 검증을 위한 사전 대기자 모집 페이지입니다.</p>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <main className="min-h-screen bg-[#fafaf7]">
      <Header />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <VisionSection />
      <BottomCTASection />
      <Footer />
    </main>
  );
}

"use client";

import { useState, FormEvent } from "react";
import {
  Tag,
  Star,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

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

// ─── Sub-components ──────────────────────────────────────────────────────────

function Logo() {
  return (
    <span className="text-xl font-bold tracking-tight text-slate-900">
      줍<span className="text-blue-600">.</span>
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
      {children}
    </span>
  );
}

// ─── Sections ────────────────────────────────────────────────────────────────

function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <Logo />
        <a
          href="#notify"
          className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          사전 알림 신청
        </a>
      </div>
    </header>
  );
}

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
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-5 pt-14">
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        {/* Label */}
        <div className="mb-8 animate-fade-in opacity-0 [animation-fill-mode:forwards]">
          <SectionLabel>🏨 GUEST EARLY ACCESS</SectionLabel>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up mb-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 opacity-0 [animation-delay:150ms] [animation-fill-mode:forwards] sm:text-5xl md:text-6xl">
          비어있는 좋은 숙소,
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            가볍게 줍다.
          </span>
        </h1>

        {/* Sub-copy */}
        <p className="animate-fade-up mb-12 text-base leading-relaxed text-slate-500 opacity-0 [animation-delay:250ms] [animation-fill-mode:forwards] sm:text-lg">
          갑작스러운 취소, 평일의 빈 방.
          <br className="hidden sm:block" />
          퀄리티 높은 숙소를 수수료 거품 없이 가장 합리적인 가격으로
          만나보세요.
        </p>

        {/* CTA Form */}
        <div className="animate-fade-up opacity-0 [animation-delay:350ms] [animation-fill-mode:forwards]">
          {form.submitted ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/80 px-8 py-8 shadow-lg ring-1 ring-slate-200 backdrop-blur-sm">
              <CheckCircle2 className="h-10 w-10 text-blue-500" />
              <p className="text-lg font-semibold text-slate-800">
                신청이 완료되었습니다!
              </p>
              <p className="text-sm text-slate-500">
                정식 오픈 소식과 특별 혜택을 가장 먼저 알려드릴게요.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                placeholder="이메일 주소를 입력해 주세요"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                className="flex-1 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="submit"
                disabled={form.loading}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95 disabled:opacity-70"
              >
                {form.loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <>
                    첫 줍기 혜택 알림 받기
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}
          {!form.submitted && (
            <p className="mt-3 text-xs text-slate-400">
              스팸 메일은 보내지 않습니다. 언제든지 수신 거부 가능합니다.
            </p>
          )}
        </div>

        {/* Social proof */}
        <p className="animate-fade-up mt-10 text-xs text-slate-400 opacity-0 [animation-delay:450ms] [animation-fill-mode:forwards]">
          이미{" "}
          <span className="font-semibold text-slate-600">1,200명 이상</span>이
          사전 신청을 완료했습니다.
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="h-10 w-6 rounded-full border-2 border-slate-300 p-1">
          <div className="mx-auto h-2 w-1 rounded-full bg-slate-400" />
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section className="bg-slate-900 px-5 py-24 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <SectionLabel>PROBLEM</SectionLabel>
        <h2 className="mx-auto mt-6 max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
          좋은 숙소는 왜{" "}
          <span className="text-blue-400">항상 비싸야만</span> 할까요?
        </h2>
        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-slate-700 bg-slate-800/60 p-8 text-left backdrop-blur-sm md:p-10">
          <p className="text-base leading-8 text-slate-300 sm:text-lg">
            마음에 드는 숙소는 너무 비싸고, 저렴한 곳은 아쉽습니다. 하지만
            아무리 인기 있는 숙소라도{" "}
            <span className="font-semibold text-white">
              피치 못할 예약 취소나 비수기에는 빈 방(공실)
            </span>
            이 생기기 마련입니다.
          </p>
          <p className="mt-5 text-base leading-8 text-slate-400 sm:text-lg">
            이 아까운 빈 공간들을 게스트가 부담 없이 누릴 방법은 없을까요?
          </p>
        </div>
      </div>
    </section>
  );
}

interface SolutionCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}

function SolutionSection() {
  const cards: SolutionCard[] = [
    {
      icon: <Tag className="h-7 w-7 text-blue-600" />,
      title: "가벼운 가격으로 줍다",
      description:
        "기존 예약 플랫폼들이 가져가던 과도한 수수료를 걷어냈습니다. 플랫폼이 가벼워진 만큼, 게스트는 더 정직하고 낮은 가격으로 숙소를 예약할 수 있습니다.",
      delay: "[animation-delay:0ms]",
    },
    {
      icon: <Star className="h-7 w-7 text-blue-600" />,
      title: "숨어있는 퀄리티를 줍다",
      description:
        "무수히 많은 리스트 속에서 피곤하게 비교할 필요 없습니다. 엄선된 기준을 통과한 퀄리티 높은 숙소의 빈 방만을 선별하여 제안합니다.",
      delay: "[animation-delay:100ms]",
    },
    {
      icon: <Zap className="h-7 w-7 text-blue-600" />,
      title: "즉흥적인 설렘을 줍다",
      description:
        "완벽한 여행 계획이 없어도 괜찮습니다. 훌쩍 떠나고 싶은 날, 매력적인 가격으로 오픈된 숙소를 우연히 발견하고 줍는 기쁨을 누려보세요.",
      delay: "[animation-delay:200ms]",
    },
  ];

  return (
    <section className="bg-white px-5 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <SectionLabel>SOLUTION</SectionLabel>
          <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            호스트의 아까운 빈 방이,
            <br />
            <span className="text-blue-600">게스트에겐 기회가 됩니다.</span>
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`group rounded-2xl border border-slate-100 bg-slate-50 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:bg-blue-50 hover:shadow-xl ${card.delay}`}
            >
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition-all group-hover:bg-blue-600 group-hover:ring-blue-600 [&>svg]:transition-colors [&>svg]:group-hover:text-white">
                {card.icon}
              </div>
              <h3 className="mb-3 text-lg font-bold text-slate-900">
                {card.title}
              </h3>
              <p className="text-sm leading-7 text-slate-500">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VisionSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-5 py-28 md:py-40">
      {/* Decorative elements */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-full w-full opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <div className="mb-6 flex justify-center">
          <Sparkles className="h-10 w-10 text-blue-200" />
        </div>
        <h2 className="mb-8 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
          일상을 여행으로 만드는
          <br />
          가장 가벼운 방법
        </h2>
        <p className="mx-auto max-w-xl text-base leading-8 text-blue-100 sm:text-lg">
          특별한 기념일이나 완벽한 준비가 없어도 좋습니다. 지친 일상 속에서
          좋은 공간을 가볍게 줍고 떠나는 것만으로도, 당신의 내일은 훨씬 더
          산뜻해질 것입니다.
        </p>

        {/* Floating stats */}
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-3 gap-4">
          {[
            { value: "0원", label: "숨겨진 수수료" },
            { value: "엄선", label: "퀄리티 숙소" },
            { value: "즉시", label: "예약 가능" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-white/10 px-4 py-5 backdrop-blur-sm"
            >
              <p className="text-2xl font-extrabold text-white">{stat.value}</p>
              <p className="mt-1 text-xs text-blue-200">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
      console.log("[Bottom CTA] 사전 알림 신청:", {
        name: form.name,
        email: form.email,
      });
      setForm((f) => ({ ...f, submitted: true, loading: false }));
    }, 800);
  };

  return (
    <section id="notify" className="bg-slate-50 px-5 py-24 md:py-32">
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-100">
          {/* Top accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-500" />

          <div className="px-8 py-12 md:px-14">
            <div className="mb-2 text-center">
              <SectionLabel>EARLY ACCESS</SectionLabel>
            </div>
            <h2 className="mt-5 text-center text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
              가장 먼저 좋은 숙소를 주울 준비,
              <br />
              <span className="text-blue-600">되셨나요?</span>
            </h2>
            <p className="mx-auto mt-5 max-w-md text-center text-sm leading-7 text-slate-500 sm:text-base">
              지금 사전 알림을 신청하시면, 정식 오픈 소식과 함께 첫 여행을 더욱
              가볍게 만들어줄{" "}
              <span className="font-semibold text-slate-700">특별한 쿠폰</span>
              을 챙겨드립니다.
            </p>

            <div className="mt-10">
              {form.submitted ? (
                <div className="flex flex-col items-center gap-4 rounded-2xl bg-blue-50 px-8 py-10">
                  <CheckCircle2 className="h-12 w-12 text-blue-500" />
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-800">
                      {form.name}님, 신청이 완료되었습니다!
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      정식 오픈 시 특별 쿠폰과 함께 연락드릴게요.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-1.5 block text-xs font-semibold text-slate-600"
                      >
                        성함
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        placeholder="홍길동"
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                        className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="bottom-email"
                        className="mb-1.5 block text-xs font-semibold text-slate-600"
                      >
                        이메일
                      </label>
                      <input
                        id="bottom-email"
                        type="email"
                        required
                        placeholder="hello@example.com"
                        value={form.email}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, email: e.target.value }))
                        }
                        className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={form.loading}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] disabled:opacity-70"
                  >
                    {form.loading ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    ) : (
                      <>
                        사전 알림 및 쿠폰 신청하기
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-slate-400">
                    개인정보는 오픈 안내 목적으로만 활용되며, 이후 즉시
                    파기됩니다.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white px-5 py-10">
      <div className="mx-auto max-w-5xl flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <Logo />
        <p className="text-xs text-slate-400">
          © 2025 Jjup. 비어있는 좋은 숙소, 가볍게 줍다.
        </p>
        <div className="flex gap-5 text-xs text-slate-400">
          <a href="#" className="hover:text-slate-600">
            이용약관
          </a>
          <a href="#" className="hover:text-slate-600">
            개인정보처리방침
          </a>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <main className="min-h-screen">
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

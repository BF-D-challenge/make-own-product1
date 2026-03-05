"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/home");
    }
  }, [user, loading, router]);

  const smsHref = process.env.NEXT_PUBLIC_COOLSMS_SENDER
    ? `sms:${process.env.NEXT_PUBLIC_COOLSMS_SENDER}?body=${encodeURIComponent("안녕 베프디")}`
    : "#";

  if (loading) return null;
  if (user) return null;

  return (
    <div
      className="h-dvh flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: "#080808" }}
    >
      {/* Subtle grain */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
          opacity: 0.04,
        }}
      />

      {/* Soft glow at center */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center px-8 w-full max-w-sm"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-16">
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none" aria-hidden>
            <rect width="28" height="28" rx="8" fill="#0ea5e9" />
            <text
              x="5"
              y="20"
              fontFamily="system-ui, sans-serif"
              fontWeight="800"
              fontSize="13"
              fill="white"
              letterSpacing="-0.5"
            >
              BF
            </text>
            <rect x="19" y="13" width="2" height="10" rx="1" fill="rgba(255,255,255,0.5)" />
            <rect x="22" y="10" width="2" height="13" rx="1" fill="rgba(255,255,255,0.25)" />
          </svg>
          <span className="text-white font-bold text-xl tracking-tight leading-none">
            BF<span className="text-sky-500">.</span>D
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-white text-center mb-3 tracking-tight"
          style={{ fontSize: "2rem", fontWeight: 300, lineHeight: 1.2 }}
        >
          Your AI best friend,
          <br />
          <span style={{ fontWeight: 600 }}>always here for you.</span>
        </h1>

        <p className="text-white/40 text-sm text-center mb-12 leading-relaxed">
          문자 한 통으로 시작해봐.
          <br />
          베프디가 바로 연락할게.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <a
            href={smsHref}
            className="w-full flex items-center justify-center py-4 rounded-2xl font-semibold text-sm tracking-tight transition-all active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)",
              color: "white",
              boxShadow: "0 4px 24px rgba(14,165,233,0.35)",
            }}
          >
            Get Started
          </a>

          <a
            href="/login"
            className="w-full flex items-center justify-center py-4 rounded-2xl font-semibold text-sm tracking-tight transition-all active:scale-[0.98]"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Sign In
          </a>
        </div>
      </div>

      {/* Bottom safe area */}
      <div style={{ paddingBottom: "env(safe-area-inset-bottom)" }} />
    </div>
  );
}

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createBrowserClient } from "@/lib/auth";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="rgba(255,255,255,0.9)"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="rgba(255,255,255,0.8)"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="rgba(255,255,255,0.85)"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="rgba(255,255,255,0.9)"
      />
    </svg>
  );
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "valid" | "invalid">("loading");
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    fetch(`/api/auth/verify-token?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.phone) setStatus("valid");
        else setStatus("invalid");
      })
      .catch(() => setStatus("invalid"));
  }, [token]);

  async function signInWithGoogle() {
    setSigningIn(true);
    const supabase = createBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=/home`,
      },
    });
    if (error) setSigningIn(false);
  }

  return (
    <div
      className="h-dvh flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: "#080808" }}
    >
      {/* Grain */}
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
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
        }}
      />

      <div
        className="relative z-10 flex flex-col items-center px-8 w-full max-w-sm"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-12">
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

        {status === "loading" && (
          <p className="text-white/40 text-sm">확인 중...</p>
        )}

        {status === "valid" && (
          <>
            <h1
              className="text-white text-center mb-3 tracking-tight"
              style={{ fontSize: "1.6rem", fontWeight: 300, lineHeight: 1.3 }}
            >
              거의 다 됐어!
              <br />
              <span style={{ fontWeight: 600 }}>구글로 로그인만 하면 돼.</span>
            </h1>
            <p className="text-white/40 text-sm text-center mb-10">
              베프디가 기다리고 있어 :)
            </p>

            <button
              onClick={signInWithGoogle}
              disabled={signingIn}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold text-sm tracking-tight transition-all active:scale-[0.98] disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)",
                color: "white",
                boxShadow: "0 4px 24px rgba(14,165,233,0.35)",
              }}
            >
              <GoogleIcon />
              {signingIn ? "로그인 중..." : "Google로 로그인"}
            </button>
          </>
        )}

        {status === "invalid" && (
          <>
            <h1
              className="text-white text-center mb-3 tracking-tight"
              style={{ fontSize: "1.6rem", fontWeight: 300, lineHeight: 1.3 }}
            >
              링크가 만료됐어.
            </h1>
            <p className="text-white/40 text-sm text-center mb-10">
              베프디한테 다시 문자 보내줘!<br />
              새 링크를 바로 보내줄게.
            </p>
            <a
              href="/"
              className="w-full flex items-center justify-center py-4 rounded-2xl font-semibold text-sm tracking-tight transition-all active:scale-[0.98]"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              돌아가기
            </a>
          </>
        )}
      </div>

      <div style={{ paddingBottom: "env(safe-area-inset-bottom)" }} />
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  );
}

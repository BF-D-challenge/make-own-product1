"use client";

import { useState } from "react";
import { createBrowserClient } from "@/lib/auth";

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signInWithGoogle() {
    setLoading(true);
    setError(null);
    const supabase = createBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{ backgroundColor: "#e0f2fe" }}
    >
      {/* Noise overlay */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: NOISE_SVG,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
          opacity: 0.025,
          mixBlendMode: "overlay",
        }}
      />

      <div
        className="relative w-full max-w-sm mx-4 flex flex-col items-center"
        style={{ minHeight: "100svh", justifyContent: "center" }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: "linear-gradient(135deg, #38bdf8, #6366f1)",
              boxShadow: "0 8px 32px rgba(14,165,233,0.35)",
            }}
          >
            <span className="text-white font-bold text-2xl">B</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            BF<span className="text-sky-500">.</span>D
          </h1>
          <p className="text-slate-400 text-sm mt-1">AI best friend</p>
        </div>

        {/* Card */}
        <div
          className="w-full rounded-3xl p-6"
          style={{
            background: "rgba(224,242,254,0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.7)",
            boxShadow:
              "0 4px 32px rgba(14,165,233,0.1), inset 0 1px 0 rgba(255,255,255,0.6)",
          }}
        >
          <p className="text-slate-600 text-sm text-center mb-5">
            로그인하고 BF.D와 대화를 시작해봐
          </p>

          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)",
              boxShadow: "0 4px 18px rgba(14,165,233,0.3)",
              color: "white",
            }}
          >
            <GoogleIcon />
            {loading ? "로그인 중..." : "Google로 로그인"}
          </button>

          {error && (
            <p className="text-red-500 text-xs text-center mt-3">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}

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

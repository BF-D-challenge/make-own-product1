"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MousePointerClick,
  Puzzle,
  GalleryHorizontal,
  Mail,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

// SVG noise texture as data URL
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

function BFDLogo() {
  return (
    <div className="flex items-center gap-1.5">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
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
      <span className="font-bold text-slate-800 text-lg tracking-tight leading-none">
        BF<span className="text-sky-500">.</span>D
      </span>
    </div>
  );
}

function AvatarPlaceholder() {
  return (
    <div
      className="w-9 h-9 rounded-full border-[2px] border-white/70 shadow-md overflow-hidden flex-shrink-0 flex items-end justify-center"
      style={{
        background:
          "linear-gradient(135deg, #7dd3fc 0%, #38bdf8 40%, #6366f1 100%)",
      }}
    >
      <div
        className="w-5 h-5 rounded-full mb-0 translate-y-1"
        style={{ background: "rgba(255,255,255,0.45)" }}
      />
    </div>
  );
}

interface BottomButtonProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
}

function BottomButton({ href, icon, label, primary }: BottomButtonProps) {
  return (
    <a
      href={href}
      className="flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-3xl border transition-transform active:scale-[0.98] select-none cursor-pointer"
      style={{
        background: primary
          ? "linear-gradient(145deg, rgba(14,165,233,0.88) 0%, rgba(56,189,248,0.78) 100%)"
          : "rgba(255,255,255,0.25)",
        borderColor: primary
          ? "rgba(186,230,253,0.55)"
          : "rgba(255,255,255,0.4)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        boxShadow: primary
          ? "0 4px 18px rgba(14,165,233,0.28), inset 0 1px 0 rgba(255,255,255,0.35)"
          : "inset 0 1px 0 rgba(255,255,255,0.5)",
      }}
    >
      <span className={primary ? "text-white" : "text-slate-500"}>{icon}</span>
      <span
        className={`text-xs font-semibold leading-none tracking-tight ${
          primary ? "text-white" : "text-slate-600"
        }`}
      >
        {label}
      </span>
    </a>
  );
}

export default function Home() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [dateStr, setDateStr] = useState("\u00a0");
  const [greeting, setGreeting] = useState("Good afternoon");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const now = new Date();
    setDateStr(
      now.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    );
    const h = now.getHours();
    setGreeting(
      h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"
    );
  }, []);

  if (loading || !user) return null;

  return (
    <div
      className="h-dvh flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: "#e0f2fe" }}
    >
      {/* Global noise texture overlay */}
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

      {/* Main card */}
      <div
        className="relative w-full max-w-md flex flex-col md:rounded-3xl md:overflow-hidden"
        style={{
          height: "100dvh",
          backgroundColor: "#e0f2fe",
          boxShadow:
            "0 0 0 1px rgba(148,163,184,0.08), 0 32px 80px rgba(14,165,233,0.12), 0 8px 32px rgba(0,0,0,0.06)",
        }}
      >
        {/* ── 1. TOP BAR ── */}
        <div
          className="relative z-10 flex items-center justify-between px-5 pb-3"
          style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.5rem)" }}
        >
          <BFDLogo />
          <span className="text-sm font-medium text-slate-500 tabular-nums">
            {dateStr}
          </span>
          <button onClick={signOut} title="로그아웃">
            <AvatarPlaceholder />
          </button>
        </div>

        {/* ── 2. HERO CARD ── */}
        <div
          className="relative z-10 mx-4 mt-1 rounded-3xl overflow-hidden"
          style={{ height: "55svh" }}
        >
          {/* Sky gradient background */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(160deg, #7dd3fc 0%, #38bdf8 20%, #93c5fd 45%, #bae6fd 70%, #e0f2fe 100%)",
            }}
          />

          {/* Noise inside hero */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: NOISE_SVG,
              backgroundRepeat: "repeat",
              backgroundSize: "256px 256px",
              opacity: 0.045,
              mixBlendMode: "overlay",
            }}
          />

          {/* Decorative orbs */}
          <div
            aria-hidden
            className="absolute top-5 right-7 w-32 h-32 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(186,230,253,0.15) 60%, transparent 100%)",
              filter: "blur(1px)",
            }}
          />
          <div
            aria-hidden
            className="absolute top-20 right-16 w-14 h-14 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.65) 0%, transparent 70%)",
            }}
          />

          {/* Strong bottom gradient for text legibility */}
          <div
            aria-hidden
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              height: "60%",
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(14,100,140,0.18) 40%, rgba(5,60,100,0.42) 100%)",
            }}
          />

          {/* Greeting overlaid at bottom-left */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-6 pb-7">
            <h1
              className="text-[2rem] leading-[1.2] tracking-tight text-white"
              style={{ fontWeight: 300 }}
            >
              {greeting}, 정민
            </h1>
            <p className="text-white/60 text-sm mt-1">5°C · Light rain</p>
          </div>
        </div>

        {/* ── 3. BOTTOM BUTTONS ── */}
        <div
          className="relative z-10 px-4 pt-2 space-y-2"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 2rem)" }}
        >
          {/* Row 1 — 2 columns */}
          <div className="grid grid-cols-2 gap-2">
            <BottomButton
              href="/workflow"
              icon={<MousePointerClick size={22} strokeWidth={1.75} />}
              label="Automations"
            />
            <BottomButton
              href="/integrations"
              icon={<Puzzle size={22} strokeWidth={1.75} />}
              label="Integrations"
            />
          </div>

          {/* Row 2 — 3 columns */}
          <div className="grid grid-cols-3 gap-2">
            <BottomButton
              href="/gallery"
              icon={<GalleryHorizontal size={22} strokeWidth={1.75} />}
              label="Gallery"
            />
            <BottomButton
              href="/mail"
              icon={<Mail size={22} strokeWidth={1.75} />}
              label="Mail"
            />
            <BottomButton
              href={
                process.env.NEXT_PUBLIC_COOLSMS_SENDER
                  ? `sms:${process.env.NEXT_PUBLIC_COOLSMS_SENDER}`
                  : "/chat"
              }
              icon={<MessageCircle size={22} strokeWidth={1.75} />}
              label="Text BF.D"
              primary
            />
          </div>
        </div>
      </div>
    </div>
  );
}

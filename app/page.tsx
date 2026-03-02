"use client";

import { useEffect, useState } from "react";
import {
  MousePointerClick,
  Puzzle,
  GalleryHorizontal,
  Mail,
  MessageCircle,
} from "lucide-react";

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
      {/* Simple silhouette */}
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
          : "rgba(224, 242, 254, 0.45)",
        borderColor: primary
          ? "rgba(186,230,253,0.55)"
          : "rgba(255,255,255,0.68)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        boxShadow: primary
          ? "0 4px 18px rgba(14,165,233,0.28), inset 0 1px 0 rgba(255,255,255,0.35)"
          : "0 2px 10px rgba(148,163,184,0.1), inset 0 1px 0 rgba(255,255,255,0.55)",
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
  const [dateStr, setDateStr] = useState("\u00a0");
  const [greeting, setGreeting] = useState("Good afternoon");

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

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
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
          minHeight: "100svh",
          backgroundColor: "#e0f2fe",
          // Desktop drop shadow applied directly
          boxShadow:
            "0 0 0 1px rgba(148,163,184,0.08), 0 32px 80px rgba(14,165,233,0.12), 0 8px 32px rgba(0,0,0,0.06)",
        }}
      >
        {/* ── 1. TOP BAR ── */}
        <div className="relative z-10 flex items-center justify-between px-5 pt-14 pb-3 md:pt-8">
          <BFDLogo />
          <span className="text-sm font-medium text-slate-500 tabular-nums">
            {dateStr}
          </span>
          <AvatarPlaceholder />
        </div>

        {/* ── 2. MIDDLE HERO SECTION ── */}
        <div
          className="relative z-10 mx-4 mt-2 mb-3 rounded-3xl overflow-hidden"
          style={{ minHeight: "300px", flex: "1 1 auto" }}
        >
          {/* Sky gradient (photo placeholder) */}
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
          <div
            aria-hidden
            className="absolute bottom-12 left-8 w-20 h-20 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(147,197,253,0.4) 0%, transparent 70%)",
              filter: "blur(8px)",
            }}
          />

          {/* Radial vignette — edges fade to #e0f2fe */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 100% 90% at 50% 40%, transparent 30%, rgba(224,242,254,0.55) 65%, #e0f2fe 95%)",
            }}
          />

          {/* Bottom gradient fade */}
          <div
            aria-hidden
            className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(224,242,254,0.9) 100%)",
            }}
          />

          {/* Greeting content */}
          <div
            className="relative z-10 flex flex-col justify-end h-full p-6 pb-7"
            style={{ minHeight: "300px" }}
          >
            <p className="text-slate-400 text-sm font-medium mb-1.5 tracking-wide">
              &#8212;&#xb0;C
            </p>
            <h1 className="text-[2rem] font-bold text-slate-800 leading-[1.18] tracking-tight">
              {greeting},
              <br />
              <span className="text-slate-700">이름</span>
            </h1>
          </div>
        </div>

        {/* ── 3. BOTTOM BUTTONS ── */}
        <div className="relative z-10 px-4 pb-10 md:pb-8 pt-0 space-y-2.5">
          {/* Row 1 — 2 columns */}
          <div className="grid grid-cols-2 gap-2.5">
            <BottomButton
              href="#"
              icon={<MousePointerClick size={22} strokeWidth={1.75} />}
              label="Automations"
            />
            <BottomButton
              href="#"
              icon={<Puzzle size={22} strokeWidth={1.75} />}
              label="Integrations"
            />
          </div>

          {/* Row 2 — 3 columns */}
          <div className="grid grid-cols-3 gap-2.5">
            <BottomButton
              href="#"
              icon={<GalleryHorizontal size={22} strokeWidth={1.75} />}
              label="Gallery"
            />
            <BottomButton
              href="#"
              icon={<Mail size={22} strokeWidth={1.75} />}
              label="Mail"
            />
            <BottomButton
              href="#"
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

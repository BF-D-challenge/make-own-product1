"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import type { ChatMessage } from "@/app/api/chat/route";
import { useAuth } from "@/components/AuthProvider";

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div
        className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
        style={{ background: "linear-gradient(135deg, #38bdf8, #6366f1)" }}
      >
        B
      </div>
      <div
        className="px-4 py-3 rounded-3xl rounded-bl-md"
        style={{
          background: "rgba(224,242,254,0.7)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.7)",
        }}
      >
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Bubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex items-end gap-2 mb-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar — only for assistant */}
      {!isUser && (
        <div
          className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
          style={{ background: "linear-gradient(135deg, #38bdf8, #6366f1)" }}
        >
          B
        </div>
      )}

      <div
        className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "rounded-3xl rounded-br-md text-white"
            : "rounded-3xl rounded-bl-md text-slate-700"
        }`}
        style={
          isUser
            ? {
                background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
                boxShadow: "0 2px 12px rgba(14,165,233,0.3)",
              }
            : {
                background: "rgba(224,242,254,0.7)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.7)",
              }
        }
      >
        {msg.content}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    setHistory((h) => [...h, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history, userId: user?.id }),
      });
      const data = await res.json();
      if (data.message) {
        setHistory((h) => [...h, { role: "assistant", content: data.message }]);
      }
    } catch {
      setHistory((h) => [
        ...h,
        { role: "assistant", content: "연결에 문제가 생겼어. 잠깐 뒤에 다시 해줘!" },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
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

      {/* Card */}
      <div
        className="relative w-full max-w-md flex flex-col md:rounded-3xl md:overflow-hidden"
        style={{
          minHeight: "100svh",
          backgroundColor: "#e0f2fe",
          boxShadow:
            "0 0 0 1px rgba(148,163,184,0.08), 0 32px 80px rgba(14,165,233,0.12), 0 8px 32px rgba(0,0,0,0.06)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-14 pb-4 md:pt-8">
          <Link
            href="/"
            className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-white/50 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #38bdf8, #6366f1)" }}
          >
            B
          </div>
          <div>
            <p className="text-slate-800 font-bold text-base leading-none">BF.D</p>
            <p className="text-slate-400 text-xs mt-0.5">AI best friend</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {/* Empty state */}
          {history.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-2xl font-bold text-white"
                style={{ background: "linear-gradient(135deg, #38bdf8, #6366f1)" }}
              >
                B
              </div>
              <p className="text-slate-700 font-semibold mb-1">안녕! 나 BF.D야 👋</p>
              <p className="text-slate-400 text-sm max-w-xs">
                오늘 어떻게 지냈어? 뭐든 편하게 말해줘.
              </p>
            </div>
          )}

          {history.map((msg, i) => (
            <Bubble key={i} msg={msg} />
          ))}

          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div
          className="px-4 pb-10 md:pb-6 pt-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.5)" }}
        >
          <div
            className="flex items-end gap-2 rounded-3xl px-4 py-2"
            style={{
              background: "rgba(224,242,254,0.6)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.7)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="메시지 입력…"
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-slate-700 placeholder:text-slate-400 text-sm py-1.5 max-h-32"
              style={{ lineHeight: "1.5" }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5 transition-all active:scale-95 disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
                boxShadow: "0 2px 8px rgba(14,165,233,0.4)",
              }}
            >
              <Send size={14} className="text-white translate-x-px" />
            </button>
          </div>
          <p className="text-center text-slate-400 text-xs mt-2">
            Enter로 전송 · Shift+Enter 줄바꿈
          </p>
        </div>
      </div>
    </div>
  );
}

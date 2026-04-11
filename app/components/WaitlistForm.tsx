"use client";
import { useState, useRef } from "react";

export default function WaitlistForm() {
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const hotelRef = useRef<HTMLInputElement>(null);
  const ownerRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const agreeRef = useRef<HTMLInputElement>(null);

  async function handleSubmit() {
    const hotelName = hotelRef.current?.value.trim() ?? "";
    const ownerName = ownerRef.current?.value.trim() ?? "";
    const email = emailRef.current?.value.trim() ?? "";
    const agreed = agreeRef.current?.checked ?? false;

    if (!hotelName || !ownerName || !email) {
      alert("모든 항목을 입력해 주세요.");
      return;
    }
    if (!agreed) {
      alert("개인정보 수집 및 이용에 동의해 주세요.");
      return;
    }

    setIsPending(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hotelName, ownerName, email }),
      });
      const result = await res.json();
      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setIsPending(false);
    }
  }

  if (status === "success") {
    return (
      <div
        className="waitlist-form-card"
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "22px", fontWeight: 700, color: "#1a1a1a", marginBottom: "12px" }}>
            신청이 완료되었습니다! 🎉
          </p>
          <p style={{ fontSize: "14px", color: "#999", lineHeight: 1.6 }}>
            24시간 내에 작성해주신 이메일로 안내를 드리겠습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="waitlist-form-card">
      <div className="form-field">
        <label htmlFor="hotel-name">숙소명</label>
        <input type="text" id="hotel-name" ref={hotelRef} placeholder="예: ZOOP 모텔" />
      </div>
      <div className="form-field">
        <label htmlFor="owner-name">사장님 성함</label>
        <input type="text" id="owner-name" ref={ownerRef} placeholder="성함을 입력해주세요" />
      </div>
      <div className="form-field">
        <label htmlFor="email">이메일 연락처</label>
        <input type="email" id="email" ref={emailRef} placeholder="example@email.com" />
      </div>

      <div className="privacy-box">
        <input type="checkbox" className="checkbox" id="privacy-agree" ref={agreeRef} />
        <div className="privacy-text">
          <div className="title">(필수) 개인정보 수집 및 이용 동의</div>
          <div className="items">
            <div>• 수집 목적: 서비스 오픈 안내 및 입점 상담</div>
            <div>• 수집 항목: 숙소명, 성함, 이메일</div>
            <div>• 보유 기간: <span className="bold">오픈 안내 후 1개월 이내 파기</span></div>
          </div>
        </div>
      </div>

      <button
        className="submit-btn"
        onClick={handleSubmit}
        disabled={isPending}
        style={isPending ? { opacity: 0.7, cursor: "not-allowed" } : undefined}
      >
        {isPending ? "전송 중..." : "비용 없이 사전 입점 대기자 등록하기"}
      </button>

      {status === "error" && (
        <p style={{ fontSize: "13px", color: "#ff5a00", textAlign: "center" }}>
          전송에 실패했습니다. 잠시 후 다시 시도해주세요.
        </p>
      )}
    </div>
  );
}

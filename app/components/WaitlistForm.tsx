"use client";
import { useTransition, useState, useRef } from "react";
import { submitWaitlist } from "../actions";

export default function WaitlistForm() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const hotelRef = useRef<HTMLInputElement>(null);
  const ownerRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const agreeRef = useRef<HTMLInputElement>(null);

  function handleSubmit() {
    const hotelName = hotelRef.current?.value.trim() ?? "";
    const ownerName = ownerRef.current?.value.trim() ?? "";
    const phone = phoneRef.current?.value.trim() ?? "";
    const agreed = agreeRef.current?.checked ?? false;

    if (!hotelName || !ownerName || !phone) {
      alert("모든 항목을 입력해 주세요.");
      return;
    }
    if (!agreed) {
      alert("개인정보 수집 및 이용에 동의해 주세요.");
      return;
    }

    startTransition(async () => {
      const result = await submitWaitlist({ hotelName, ownerName, phone });
      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(result.error);
      }
    });
  }

  if (status === "success") {
    return (
      <div
        className="waitlist-form-card"
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#1a1a1a",
              marginBottom: "12px",
            }}
          >
            신청이 완료되었습니다! 🎉
          </p>
          <p style={{ fontSize: "14px", color: "#999", lineHeight: 1.6 }}>
            오픈 시 가장 먼저 혜택 안내를 드리겠습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="waitlist-form-card">
      <div className="form-field">
        <label htmlFor="hotel-name">숙소명</label>
        <input type="text" id="hotel-name" ref={hotelRef} />
      </div>
      <div className="form-field">
        <label htmlFor="owner-name">사장님 성함</label>
        <input type="text" id="owner-name" ref={ownerRef} />
      </div>
      <div className="form-field">
        <label htmlFor="phone">연락처</label>
        <input type="tel" id="phone" ref={phoneRef} />
      </div>

      <div className="privacy-box">
        <input
          type="checkbox"
          className="checkbox"
          id="privacy-agree"
          ref={agreeRef}
        />
        <div className="privacy-text">
          <div className="title">(필수) 개인정보 수집 및 이용 동의</div>
          <div className="items">
            <div>• 수집 목적: 서비스 오픈 안내 및 입점 상담</div>
            <div>• 수집 항목: 숙소명, 성함, 연락처</div>
            <div>
              • 보유 기간:{" "}
              <span className="bold">오픈 안내 후 1개월 이내 파기</span>
            </div>
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
          {errorMsg}
        </p>
      )}
    </div>
  );
}

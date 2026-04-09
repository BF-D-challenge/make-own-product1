"use client";
import { useEffect } from "react";

export default function ScrollAnimations() {
  useEffect(() => {
    // ── h1 줄별 scroll opacity ──
    const lines = Array.from(document.querySelectorAll<HTMLElement>(".h1-line"));
    const STEP = 200;
    const STAGGER = 150;

    function updateH1() {
      const scrollY = window.scrollY;
      lines.forEach((line, i) => {
        const t = Math.min(1, Math.max(0, (scrollY - i * STAGGER) / STEP));
        line.style.opacity = String(0.25 + 0.75 * t);
      });
    }

    window.addEventListener("scroll", updateH1, { passive: true });
    updateH1();

    // ── Promise 카드 sticky scroll 인터랙션 ──
    const scrollArea = document.getElementById("promiseScrollArea");
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".promise-card"));
    const n = cards.length;

    function updatePromise() {
      if (!scrollArea) return;
      const rect = scrollArea.getBoundingClientRect();
      const scrolled = Math.max(0, -rect.top);
      const totalScrollable = scrollArea.offsetHeight - window.innerHeight;
      const progress = Math.min(1, scrolled / totalScrollable);

      cards.forEach((card, i) => {
        const start = i / n;
        const end = (i + 1) / n;
        const cardProgress = Math.max(0, Math.min(1, (progress - start) / (1 / n)));

        if (progress < start) {
          const depth = i;
          card.style.transform = `translateY(${depth * 14}px) scale(${1 - depth * 0.04})`;
          card.style.opacity = "1";
          card.style.zIndex = String(n - depth);
        } else if (i < n - 1 && progress >= end) {
          card.style.transform = "translateY(-80px) scale(0.95)";
          card.style.opacity = "0";
          card.style.zIndex = "0";
        } else {
          card.style.zIndex = String(n + 1);
          if (i < n - 1) {
            const exitT = Math.max(0, (cardProgress - 0.6) / 0.4);
            card.style.transform = `translateY(${-80 * exitT}px) scale(${1 - 0.05 * exitT})`;
            card.style.opacity = String(1 - exitT);
          } else {
            card.style.transform = "translateY(0) scale(1)";
            card.style.opacity = "1";
          }
        }

        if (i === Math.floor(progress * n) && i + 1 < n) {
          const next = cards[i + 1];
          const exitT = Math.max(0, (cardProgress - 0.6) / 0.4);
          const fromOffset = 1 * 14;
          const fromScale = 1 - 1 * 0.04;
          next.style.transform = `translateY(${fromOffset * (1 - exitT)}px) scale(${fromScale + (1 - fromScale) * exitT})`;
          next.style.opacity = "1";
          next.style.zIndex = String(n);
        }
      });
    }

    window.addEventListener("scroll", updatePromise, { passive: true });
    updatePromise();

    return () => {
      window.removeEventListener("scroll", updateH1);
      window.removeEventListener("scroll", updatePromise);
    };
  }, []);

  return null;
}

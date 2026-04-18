import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "줍(Jjup) — 비어있는 좋은 숙소, 가볍게 줍다",
  description:
    "갑작스러운 취소, 평일의 빈 방. 퀄리티 높은 숙소를 수수료 거품 없이 가장 합리적인 가격으로 만나보세요.",
  openGraph: {
    title: "줍(Jjup) — 비어있는 좋은 숙소, 가볍게 줍다",
    description:
      "갑작스러운 취소, 평일의 빈 방. 퀄리티 높은 숙소를 수수료 거품 없이 가장 합리적인 가격으로 만나보세요.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

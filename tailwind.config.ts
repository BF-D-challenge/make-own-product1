import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        brand: {
          50:  "#FFEEE5",
          100: "#FFEEE5",
          200: "#FFDECC",
          300: "#FFAC80",
          400: "#FF8B4D",
          500: "#FF6B1A",
          600: "#FF5A00",
          700: "#C24B0A",
          800: "#993600",
          900: "#612605",
          950: "#491F08",
        },
        canvas: "#FAFAF7",
        ink: {
          strong: "#222222",
          default: "#333333",
          muted: "#666666",
          subtle: "#888888",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.8s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

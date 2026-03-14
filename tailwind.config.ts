import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        md: "2rem",
        lg: "3rem"
      },
      screens: {
        "2xl": "1100px"
      }
    },
    extend: {
      colors: {
        brand: {
          cream: "#f4f6fa",
          ivory: "#e8edf5",
          "warm-white": "#f8fafd",
          gold: "#c9a84c",
          "gold-light": "#e8d08a",
          brown: "#7a6030",
          deep: "#0a1628",
          mid: "#2a4066",
          text: "#1a2e4a",
          muted: "#5a7099",
          border: "#c0cfe0"
        }
      },
      fontFamily: {
        brand: ["var(--font-subjectivity)", "serif"]
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        pulse: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" }
        }
      },
      animation: {
        "fade-up": "fade-up 700ms ease-out both",
        pulse: "pulse 2s ease infinite"
      }
    }
  },
  plugins: []
};

export default config;

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
        "2xl": "1280px"
      }
    },
    extend: {
      colors: {
        brand: {
          teal: "#003b4f",
          gold: "#cda349",
          white: "#ffffff"
        }
      },
      fontFamily: {
        brand: ["var(--font-subjectivity)", "serif"]
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "fade-up": "fade-up 240ms ease-out both"
      }
    }
  },
  plugins: []
};

export default config;

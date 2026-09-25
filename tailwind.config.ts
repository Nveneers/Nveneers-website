import type { Config } from "tailwindcss";

const semanticColors = Object.fromEntries(
  ["canvas", "surface", "soft", "heading", "text", "muted", "border", "accent", "accent-soft", "inverse", "inverse-text", "success", "success-soft", "warning", "warning-soft", "danger", "danger-soft"].map(
    (name) => [name, `rgb(var(--color-${name}) / <alpha-value>)`]
  )
);
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "0rem", sm: "1rem", lg: "2rem" }, screens: { "2xl": "1180px" } },
    extend: {
      colors: { brand: { ...semanticColors, cyan: "#00c6ff", blue: "#2c51f4", green: "#00ff9d" } },
      fontFamily: { brand: ["var(--font-body)", "sans-serif"] },
      fontWeight: { normal: "300", semibold: "500", bold: "800" },
      keyframes: { "fade-up": { "0%": { opacity: "0", transform: "translateY(24px)" }, "100%": { opacity: "1", transform: "translateY(0)" } } },
      animation: { "fade-up": "fade-up 700ms ease-out both" }
    }
  },
  plugins: []
} satisfies Config;

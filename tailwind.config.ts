import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      colors: {
        border: "var(--border)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        vault: {
          glow: "var(--vault-glow)",
          surface: "var(--vault-surface)",
          "surface-hover": "var(--vault-surface-hover)",
          selected: "var(--vault-selected)",
          "selected-border": "var(--vault-selected-border)",
          dim: "var(--vault-dim)",
          folder: "var(--vault-folder)",
          file: "var(--vault-file)",
        },
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(-4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;

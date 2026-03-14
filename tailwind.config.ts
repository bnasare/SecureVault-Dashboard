import type { Config } from "tailwindcss";

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
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        vault: {
          glow: "hsl(var(--vault-glow))",
          dim: "hsl(var(--vault-dim))",
          surface: "hsl(var(--vault-surface))"
        }
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#ffffff",
        abyss: "#f8fafc",
        panel: "#ffffff",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Space Grotesk'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 12px 32px -12px rgba(37,99,235,0.35)",
        "glow-lg": "0 24px 60px -20px rgba(79,70,229,0.4)",
        card: "0 20px 50px -20px rgba(15,23,42,0.15)",
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        "float-slow": "float 11s ease-in-out infinite",
        spin: "spin 14s linear infinite",
        "spin-reverse": "spin-reverse 22s linear infinite",
        marquee: "marquee 32s linear infinite",
        pulse: "pulseGlow 4.5s ease-in-out infinite",
        shimmer: "shimmer 2.8s linear infinite",
        aurora: "aurora 16s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" },
        },
        "spin-reverse": {
          to: { transform: "rotate(-360deg)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        aurora: {
          "0%": { transform: "translate(-8%, -4%) scale(1) rotate(0deg)" },
          "50%": { transform: "translate(8%, 6%) scale(1.15) rotate(8deg)" },
          "100%": { transform: "translate(-4%, 2%) scale(1.05) rotate(-6deg)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

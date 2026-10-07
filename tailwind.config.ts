import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 12px 32px -12px rgba(37,99,235,0.35)",
        "glow-lg": "0 24px 60px -20px rgba(79,70,229,0.4)",
        card: "0 20px 50px -20px rgba(15,23,42,0.15)",
      },

    },
  },
  plugins: [],
};
export default config;

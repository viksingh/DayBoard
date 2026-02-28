import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFFDF7",
        accent: {
          DEFAULT: "#D4A843",
          light: "#E8C96A",
          dark: "#B8902E",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        warm: "0 2px 8px rgba(180, 140, 60, 0.08)",
        "warm-lg": "0 8px 24px rgba(180, 140, 60, 0.12)",
        "warm-xl": "0 12px 40px rgba(180, 140, 60, 0.16)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;

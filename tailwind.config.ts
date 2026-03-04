import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F8FAFC",
        accent: {
          DEFAULT: "#4A7AB5",
          light: "#6B9BD2",
          dark: "#3A6190",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        warm: "0 2px 8px rgba(74, 122, 181, 0.08)",
        "warm-lg": "0 8px 24px rgba(74, 122, 181, 0.12)",
        "warm-xl": "0 12px 40px rgba(74, 122, 181, 0.16)",
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

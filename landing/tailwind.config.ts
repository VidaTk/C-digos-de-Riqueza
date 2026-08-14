import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A2540",
          light: "#123A5C",
          dark: "#061A2E",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F0DFA0",
          dark: "#A9862B",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "serif"],
      },
      backgroundImage: {
        "diagonal-navy":
          "linear-gradient(135deg, #061A2E 0%, #0A2540 55%, #123A5C 100%)",
      },
    },
  },
  plugins: [],
};

export default config;

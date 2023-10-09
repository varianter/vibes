import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      black: "#000000",
      white: "#FFFFFF",
      primary_default: "#423D89",
      primary_d1: "#35316E"
    },
    extend: {
    },
    fontFamily: {
      sans: ['"Graphik-Regular"', "system-ui"],
      serif: ['"Recoleta-Regular"', "ui-serif"],
    },
    screens: {
      xs: "640px",
      sm: "768px",
      md: "1024px",
      lg: "1280px",
      xl: "1400px",
    },
  },
} satisfies Config;
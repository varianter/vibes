/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      black: "#333333",
      white: "#FFFFFF",
      primary_default: "#423D89",
      primary_l1: "#A09EC4",
      primary_l2: "#C6C5DC",
      primary_l3: "#ECECF3",
      primary_l4: "#F6F5F9",
      secondary_default: "#F076A6",
      neutral_l1: "#858585",
      transparent: "transparent",
    },
    extend: {},
    screens: {
      xs: "640px",
      sm: "768px",
      md: "1024px",
      lg: "1280px",
      xl: "1400px",
    },
    boxShadow: {
      md: "0 4px 4px 0 rgba(66, 61, 137, 0.10)",
    },
  },
  plugins: [],
};

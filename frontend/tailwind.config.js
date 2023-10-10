/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      black: "#000000",
      white: "#FFFFFF",
      primary_default: "#423D89",
      primary_l3: "#ECECF3",
      secondary_default: "#F076A6",
    },
    extend: {},
    screens: {
      xs: "640px",
      sm: "768px",
      md: "1024px",
      lg: "1280px",
      xl: "1400px",
    },
  },
  plugins: [],
};

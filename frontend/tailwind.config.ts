import type { Config } from "tailwindcss";
import { screens } from "./src/screens.config";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      black: "#333333",
      white: "#FFFFFF",
      primary: "#423D89",
      secondary: "#F076A6",
      available: "#FFE5B5",

      neutral_l1: "#858585",
      offer_light: "#E4DBFB",
      offer_dark: "#35316E",
      free_light: "#FFE5B5",
      free_dark: "#573900",
      holiday_light: "#FAD2E2",
      holiday_dark: "#6C002B",
      vacation_light: "#C8EEFB",
      vacation_dark: "#00445B",
      overbooking_light: "#FFFFFF",
      overbooking_dark: "#B91456",
      absence_light: "#9FDFD9",
      absence_dark: "#004C46",
      hover_background: "#F0EFEF",
      transparent: "transparent",
    },
    extend: {},
    screens,
    boxShadow: {
      md: "0 4px 4px 0 rgba(66, 61, 137, 0.10)",
      xl: "0px 4px 20px 0px rgba(0, 0, 0, 0.30)",
    },
  },
  plugins: [],
} satisfies Config;

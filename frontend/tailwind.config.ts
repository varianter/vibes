import type { Config } from "tailwindcss";
import { screens } from "./src/screens.config";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      black: "#333333",
      white: "#FFFFFF",
      primary: "#423D89",
      primary_darker: "#35316E",
      primary_50: "#423D8980",
      secondary: "#F076A6",
      available: "#FFE5B5",
      available_darker: "#573900",
      offer: "#E4DBFB",
      holiday: "#FAD2E2",
      holiday_darker: "#6C002B",
      vacation: "#C8EEFB",
      vacation_darker: "#00445B",
      overbooked_darker: "#B91456",
      absence: "#9FDFD9",
      absence_darker: "#004C46",
      background_light_purple: "#423D8908",
      background_light_purple_hover: "#423D891A",
      text_light_black: "#333333BF",
      error: "#B91456",
    },
    fontSize: {
      h1: ["1.625rem", "2.5rem"],
    },
    extend: {
      minWidth: {
        "8": "2rem",
      },
    },
    screens,
    boxShadow: {
      md: "0 4px 4px 0 rgba(66, 61, 137, 0.10)",
      xl: "0px 4px 20px 0px rgba(0, 0, 0, 0.30)",
    },
  },
  plugins: [],
} satisfies Config;

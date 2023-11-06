import type { Config } from "tailwindcss";
import { screens } from "./src/screens.config";

export default {
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
      primary_l5: "#F9F9FB",
      secondary_default: "#F076A6",
      semantic_4_l1: "#FFF2DA",
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
      transparent: "transparent",
    },
    extend: {},
    screens,
    boxShadow: {
      md: "0 4px 4px 0 rgba(66, 61, 137, 0.10)",
    },
  },
  plugins: [],
} satisfies Config;

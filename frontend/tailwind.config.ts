import type { Config } from "tailwindcss";
import { screens } from "./src/screens.config";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      black: "#333333",
      white: "#FFFFFF",
      primary: "#242424",
      primary_darker: "#242424",
      primary_50: "#423D8980",
      secondary: "#FF87B7",
      available: "#F6CC45",
      available_darker: "#242424",
      offer: "#DEC1F4",
      holiday: "#FF87B7",
      holiday_darker: "#242424",
      vacation: "#B9ECFE",
      vacation_darker: "#00445B",
      overbooked_darker: "#242424",
      absence: "#88E1D9",
      absence_darker: "#242424",
      background_light_purple: "#423D8908",
      background_light_purple_hover: "#423D891A",
      background_grey: "#F2F2F2",
      text_light_black: "#333333BF",
      primaryActionButton: "#242424",
      hoverBorder: "#636363",
      overbooked: "#E43D47",
      deactivate: "#E71D2A",
      activate: "#267A13",
      skeleton: "#c5c5c5",

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
      sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      md: "0 4px 4px 0 rgba(66, 61, 137, 0.10)",
      xl: "0px 4px 20px 0px rgba(0, 0, 0, 0.30)",
    },
  },
  plugins: [],
} satisfies Config;

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
        terracotta: {
          DEFAULT: "#B5654A",
          dark: "#9A5139",
          light: "#D4905E",
        },
        olive: {
          DEFAULT: "#5C7044",
          light: "#7A9460",
          pale: "#E4E8DB",
        },
        cream: {
          DEFAULT: "#F8F7F4",
          dark: "#ECEAE4",
        },
        "warm-white": "#FDFCFA",
        charcoal: {
          DEFAULT: "#1A1A1A",
          light: "#3D3D3D",
        },
        stone: {
          DEFAULT: "#787571",
          light: "#A8A4A0",
        },
        rose: {
          DEFAULT: "#C45C54",
          light: "#E8A09A",
        },
        gold: {
          DEFAULT: "#B89860",
          light: "#D4B880",
        },
      },
      fontFamily: {
        display: ["DM Serif Display", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "10px",
      },
      maxWidth: {
        app: "440px",
      },
    },
  },
  plugins: [],
};
export default config;

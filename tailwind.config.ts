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
          DEFAULT: "#C2693E",
          dark: "#A85830",
          light: "#D4905E",
          subtle: "#FDF5F0",
        },
        olive: {
          DEFAULT: "#4D7C3A",
          light: "#6BA354",
          pale: "#E4E8DB",
          subtle: "#F2F7EE",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          secondary: "#F7F7F5",
          tertiary: "#EEEDE9",
        },
        charcoal: {
          DEFAULT: "#111111",
          light: "#333333",
        },
        muted: {
          DEFAULT: "#6B6B6B",
          light: "#999999",
        },
        rose: {
          DEFAULT: "#D14343",
          light: "#F5DADA",
          subtle: "#FDF2F2",
        },
        amber: {
          DEFAULT: "#D97706",
          light: "#FEF3C7",
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
        card: "12px",
      },
      maxWidth: {
        app: "600px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)",
        nav: "0 -1px 8px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;

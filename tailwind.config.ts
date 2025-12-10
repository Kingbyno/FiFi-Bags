import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        fifi: {
          50: "#faf7f5",
          100: "#f3e9e2",
          200: "#e6d3c4",
          300: "#d5b7a1",
          400: "#c29a7d",
          500: "#a67c52",
          600: "#8a623e",
          700: "#6f4a2f",
          800: "#563825",
          900: "#422a1c",
        },
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
    },
  },

  plugins: [],
};

export default config;

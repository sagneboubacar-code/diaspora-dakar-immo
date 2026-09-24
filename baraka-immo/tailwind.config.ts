import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#0F766E", dark: "#115E59", light: "#CCFBF1" },
        ink: "#0F172A",
      },
    },
  },
  plugins: [],
};
export default config;

import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F9F9F6",
        ink: "#2C2C2C",
        accent: "#9E96EB",
        accentFrom: "#7B75B7",
        accentTo: "#AFA8EE",
        coral: "#FF8C7A",
        sky: "#7EC8E3",
        mint: "#8FE3C0",
        border: "rgba(44,44,44,0.08)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Plus Jakarta Sans", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(44,44,44,0.08)",
        floating: "0 20px 60px rgba(158,150,235,0.35)",
      },
    },
  },
  plugins: [],
} satisfies Config;

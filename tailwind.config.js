/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          dark: "#1e40af",
          light: "#3b82f6",
        },
        secondary: {
          DEFAULT: "#475569",
          dark: "#334155",
          light: "#64748b",
        },
        accent: {
          DEFAULT: "#10b981",
          dark: "#059669",
          light: "#34d399",
        },
        surface: "#ffffff",
        background: "#f8fafc",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'card': "0 2px 4px rgba(0, 0, 0, 0.05)",
        'card-hover': "0 4px 8px rgba(0, 0, 0, 0.1)",
        'modal': "0 8px 24px rgba(0, 0, 0, 0.15)",
        'dragging': "0 16px 32px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [],
};
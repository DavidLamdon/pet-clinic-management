/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2563eb",
          hover: "#1d4ed8",
        },
        danger: {
          DEFAULT: "#dc2626",
          hover: "#991b1b",
        },
        muted: {
          DEFAULT: "#6b7280",
          dark: "#4b5563",
        },
      },
    },
  },
  plugins: [],
};

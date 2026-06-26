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
      },
    },
  },
  plugins: [],
};

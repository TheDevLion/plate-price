/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0b0b0f",
        "ink-soft": "#1b1b24",
        grape: {
          50: "#f6f0ff",
          100: "#e9ddff",
          200: "#d3b8ff",
          300: "#b089ff",
          400: "#8f5cff",
          500: "#7438f0",
          600: "#5f2ad3",
          700: "#4b22a8",
          800: "#351b74",
          900: "#261452",
        },
      },
    },
  },
  plugins: [],
}

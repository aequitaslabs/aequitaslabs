/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#06050a",
        ink: "#0b0a10",
        surface: "#100f15",
        "surface-2": "#141319",
        border: "rgba(255, 255, 255, 0.08)",
        gold: "#C9A84C",
        "gold-bright": "#d4b560",
        "gold-dim": "#9a7e35"
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"Coinbase Mono"', 'monospace'],
        serif: ['"Coinbase Display"', 'serif'],
      }
    },
  },
  plugins: [],
}

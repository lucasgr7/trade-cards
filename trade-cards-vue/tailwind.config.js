module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto Slab', 'sans-serif'],
      },
      colors: {
        'trade-blue-900': '#0a2c77',
        'trade-blue-800': '#3d6084',
        'trade-blue-700': '#249fec',
        'trade-blue-600': '#54a1d0',
        'trade-blue-500': '#1074d7',
        'trade-blue-400': '#1082ef',
        'trade-blue-300': '#1090ff',
        'trade-blue-200': '#10a0ff',
        'trade-blue-100': '#B0CFC7',
        'trade-blue-50': '#b9d8db',
        'trade-red-500': '#ff547a',
        'white': '#FFFFFF',
        'black': '#000000',
      }
    },
  },
  plugins: [],
}
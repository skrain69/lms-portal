// tailwind.config.js
module.exports = {
  darkMode: 'class', // enables 'dark:' utility support via class
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 10s linear infinite',
        'pulse-blip': 'blip 1.8s ease-in-out infinite',
      },
      keyframes: {
        blip: {
          '0%, 100%': { opacity: '0.02' },
          '50%': { opacity: '0.2' },
        },
      },
    },
  },
  plugins: [],
};

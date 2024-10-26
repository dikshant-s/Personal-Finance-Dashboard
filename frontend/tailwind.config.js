// tailwind.config.js
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // Enable dark mode using class strategy
  theme: {
    extend: {
      colors: {
        // Define custom colors for light mode
        light: {
          background: '#c7d2fe',
          text: '#ffffff',
        },
        // Define custom colors for dark mode
        dark: {
          background: '#0f172a',
          text: '#ffffff',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

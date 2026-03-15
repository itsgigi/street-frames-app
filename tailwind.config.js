/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Street Frames Milan brand colors
        brand: {
          main: '#f7e2c3',        // Light beige/cream
          secondary: '#ba5624',   // Reddish-brown/terracotta
          text: '#231a13',        // Very dark brown
        },
        primary: {
          50: '#fef5f0',
          100: '#fde6d8',
          200: '#fbcab0',
          300: '#f8a77e',
          400: '#f57d4a',
          500: '#ba5624',
          600: '#9d4620',
          700: '#7f361c',
          800: '#612818',
          900: '#431a14',
        },
        gray: {
          50: '#f7f5f3',
          100: '#ede9e4',
          200: '#d9d3ca',
          300: '#c5bdb0',
          400: '#b1a796',
          500: '#9d917c',
          600: '#7a6f5f',
          700: '#574d42',
          800: '#342b25',
          900: '#231a13',
        },
      },
    },
  },
  plugins: [],
};

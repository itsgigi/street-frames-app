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
        // Street Frames Milan — Design System v1.0
        sf: {
          black:        '#212226', // Darkroom Black — primary bg (dark), text on light
          cream:        '#F2DCC2', // Gelatin Cream — text on dark, warm surfaces
          orange:       '#BF5B21', // Shutter Orange — primary CTA, active states
          'orange-dark':'#BF522A', // Copper Dark — CTA hover/pressed
          rust:         '#A6432D', // Rust — deep accent, destructive
          white:        '#FAFAF8', // App background (light mode)
          'gray-light': '#EBEBEB', // Dividers, card borders
          'gray-mid':   '#B0B0B0', // Placeholder, disabled (decorative only)
          'gray-dark':  '#7A7A7A', // Secondary text, metadata, captions
          surface:      '#2E2F34', // Cards/surfaces on dark backgrounds
        },
        // Legacy brand tokens (kept for backward compatibility)
        brand: {
          main:      '#f7e2c3',
          secondary: '#ba5624',
          text:      '#231a13',
        },
        primary: {
          50:  '#fef5f0',
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
          50:  '#f7f5f3',
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

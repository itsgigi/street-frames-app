/**
 * Theme configuration for Street Frames Milan
 * Minimal, modern and photography-oriented design
 */

export const Colors = {
  // Brand colors from Street Frames Milan
  main: '#f7e2c3',        // Light beige/cream - main background
  secondary: '#ba5624',   // Reddish-brown/terracotta - accent color
  text: '#231a13',        // Very dark brown - text color
  
  // Primary (using secondary as primary)
  primary: {
    50: '#fef5f0',
    100: '#fde6d8',
    200: '#fbcab0',
    300: '#f8a77e',
    400: '#f57d4a',
    500: '#ba5624',      // Secondary color
    600: '#9d4620',
    700: '#7f361c',
    800: '#612818',
    900: '#431a14',
  },
  // Neutral grays (using text color as base)
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
    900: '#231a13',      // Text color
  },
  // Semantic colors
  white: '#ffffff',
  black: '#000000',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const Typography = {
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  // Font weights
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

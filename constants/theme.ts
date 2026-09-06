/**
 * Theme configuration for Street Frames Milan
 * Minimal, modern and photography-oriented design
 */

// Street Frames Milan — Design System v1.0
// Mirrors the sf.* tokens in tailwind.config.js
export const sf = {
  black:      '#212226', // Darkroom Black — primary bg (dark), text on light
  creamLight: '#FDF7F2', // Gelatin Cream Light — primary bg (light), text on dark
  cream:      '#F2DCC2', // Gelatin Cream — text on dark, warm surfaces
  orange:     '#BF5B21', // Shutter Orange — primary CTA, active states
  orangeDark: '#BF522A', // Copper Dark — CTA hover/pressed
  rust:       '#A6432D', // Rust — deep accent, destructive
  white:      '#FAFAF8', // App background (light mode)
  grayLight:  '#EBEBEB', // Dividers, card borders
  grayMid:    '#B0B0B0', // Placeholder, disabled (decorative only)
  grayDark:   '#7A7A7A', // Secondary text, metadata, captions
  surface:    '#2E2F34', // Cards/surfaces on dark backgrounds
} as const;

export const fonts = {
  heading: 'ChauPhilomeneOne_400Regular',
} as const;

/** Shared thin border applied to all image cards/tiles across the app */
export const cardBorder = {
  borderWidth: 0,
  borderColor: 'rgba(253, 247, 242, 0.85)',
} as const;

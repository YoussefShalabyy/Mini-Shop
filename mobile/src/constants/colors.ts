// ─── Both palettes — source of truth ────────────────────────────────────────

export const darkColors = {
  primary: '#6C63FF',
  primaryDark: '#5A52D5',
  primaryLight: '#EEF0FF',
  secondary: '#FF6584',
  accent: '#43C6AC',

  background: '#0F0F1A',
  surface: '#1A1A2E',
  surfaceLight: '#252540',
  border: '#2E2E4A',

  text: '#FFFFFF',
  textSecondary: '#9999BB',
  textMuted: '#666680',

  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',

  white: '#FFFFFF',
  black: '#000000',
};

export const lightColors = {
  primary: '#6C63FF',
  primaryDark: '#5A52D5',
  primaryLight: '#EEF0FF',
  secondary: '#FF6584',
  accent: '#009688',

  background: '#F5F5FA',
  surface: '#FFFFFF',
  surfaceLight: '#EBEBF5',
  border: '#DDDDE8',

  text: '#0F0F1A',
  textSecondary: '#44446A',
  textMuted: '#9898B8',

  success: '#388E3C',
  warning: '#E65100',
  error: '#C62828',
  info: '#1565C0',

  white: '#FFFFFF',
  black: '#000000',
};

export type AppColors = typeof darkColors;

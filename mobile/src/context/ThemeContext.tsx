import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { useThemeStore } from '@/store/theme.store';
import { darkColors, lightColors, AppColors } from '@/constants/colors';

// ─── Context ──────────────────────────────────────────────────────────────────

interface ThemeContextValue {
  colors: AppColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: darkColors,
  isDark: true,
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeStore();
  const systemScheme = useColorScheme();

  const isDark =
    mode === 'system' ? systemScheme === 'dark' : mode === 'dark';

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ colors, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useTheme = () => useContext(ThemeContext);

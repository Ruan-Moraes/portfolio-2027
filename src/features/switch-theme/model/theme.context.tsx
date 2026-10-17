'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  ACCENT_COLORS,
  ACCENT_HEX_MAP,
  THEME_MODES,
  type AccentColor,
  type ThemeMode,
} from '@/shared/config';
import { getStorageItem, setStorageItem } from '@/shared/lib';

interface ThemeContextValue {
  mode: ThemeMode;
  accent: AccentColor;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  setAccent: (accent: AccentColor) => void;
}

const STORAGE_MODE_KEY = 'portfolio_2027_theme_mode';
const STORAGE_ACCENT_KEY = 'portfolio_2027_theme_accent';

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyThemeAttributes(mode: ThemeMode, accent: AccentColor) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-theme', mode);
  root.setAttribute('data-accent', accent);

  const hexConfig = ACCENT_HEX_MAP[accent];
  root.style.setProperty('--ui-accent', hexConfig.primary);
  root.style.setProperty('--ui-accent-secondary', hexConfig.secondary);
  root.style.setProperty('--ui-accent-glow', hexConfig.glow);
}

export function ThemePreferencesProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('dark');
  const [accent, setAccentState] = useState<AccentColor>('green');

  useEffect(() => {
    const savedMode = getStorageItem<ThemeMode>(STORAGE_MODE_KEY, 'dark');
    const savedAccent = getStorageItem<AccentColor>(STORAGE_ACCENT_KEY, 'green');
    const validMode = THEME_MODES.includes(savedMode) ? savedMode : 'dark';
    const validAccent = ACCENT_COLORS.includes(savedAccent)
      ? savedAccent
      : 'green';

    setModeState(validMode);
    setAccentState(validAccent);
    applyThemeAttributes(validMode, validAccent);
  }, []);

  const setMode = useCallback(
    (nextMode: ThemeMode) => {
      setModeState(nextMode);
      setStorageItem(STORAGE_MODE_KEY, nextMode);
      applyThemeAttributes(nextMode, accent);
    },
    [accent]
  );

  const toggleMode = useCallback(() => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  }, [mode, setMode]);

  const setAccent = useCallback(
    (nextAccent: AccentColor) => {
      setAccentState(nextAccent);
      setStorageItem(STORAGE_ACCENT_KEY, nextAccent);
      applyThemeAttributes(mode, nextAccent);
    },
    [mode]
  );

  const value = useMemo(
    () => ({ mode, accent, setMode, toggleMode, setAccent }),
    [mode, accent, setMode, toggleMode, setAccent]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemePreferences(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(
      'useThemePreferences must be used within a ThemePreferencesProvider'
    );
  }
  return context;
}

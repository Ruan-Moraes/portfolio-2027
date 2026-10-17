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

function readStoredPreferences(): { mode: ThemeMode; accent: AccentColor } {
  if (typeof window === 'undefined') {
    return { mode: 'dark', accent: 'green' };
  }

  const params = new URLSearchParams(window.location.search);
  const queryTheme = params.get('theme') as ThemeMode | null;
  if (queryTheme && THEME_MODES.includes(queryTheme)) {
    setStorageItem(STORAGE_MODE_KEY, queryTheme);
  }

  const savedMode = getStorageItem<ThemeMode>(STORAGE_MODE_KEY, 'dark');
  const savedAccent = getStorageItem<AccentColor>(STORAGE_ACCENT_KEY, 'green');

  return {
    mode: THEME_MODES.includes(savedMode) ? savedMode : 'dark',
    accent: ACCENT_COLORS.includes(savedAccent) ? savedAccent : 'green',
  };
}

function applyThemeAttributes(mode: ThemeMode, accent: AccentColor) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (root.getAttribute('data-theme') !== mode) {
    root.setAttribute('data-theme', mode);
  }
  if (root.getAttribute('data-accent') !== accent) {
    root.setAttribute('data-accent', accent);
  }

  const hexConfig = ACCENT_HEX_MAP[accent];
  if (root.style.getPropertyValue('--ui-accent') !== hexConfig.primary) {
    root.style.setProperty('--ui-accent', hexConfig.primary);
    root.style.setProperty('--ui-accent-secondary', hexConfig.secondary);
    root.style.setProperty('--ui-accent-glow', hexConfig.glow);
  }
}

export function ThemePreferencesProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('dark');
  const [accent, setAccentState] = useState<AccentColor>('green');

  // Synchronize from localStorage on mount and lock <html> attributes across Next.js [locale] route transitions
  useEffect(() => {
    const initial = readStoredPreferences();
    setModeState(initial.mode);
    setAccentState(initial.accent);
    applyThemeAttributes(initial.mode, initial.accent);

    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      const current = readStoredPreferences();
      applyThemeAttributes(current.mode, current.accent);
    });
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['lang', 'data-theme', 'data-accent', 'class'],
    });

    return () => observer.disconnect();
  }, []);

  const setMode = useCallback((nextMode: ThemeMode) => {
    const current = readStoredPreferences();
    setStorageItem(STORAGE_MODE_KEY, nextMode);
    setModeState(nextMode);
    applyThemeAttributes(nextMode, current.accent);
  }, []);

  const toggleMode = useCallback(() => {
    const current = readStoredPreferences();
    const nextMode: ThemeMode = current.mode === 'dark' ? 'light' : 'dark';
    setStorageItem(STORAGE_MODE_KEY, nextMode);
    setModeState(nextMode);
    applyThemeAttributes(nextMode, current.accent);
  }, []);

  const setAccent = useCallback((nextAccent: AccentColor) => {
    const current = readStoredPreferences();
    setStorageItem(STORAGE_ACCENT_KEY, nextAccent);
    setAccentState(nextAccent);
    applyThemeAttributes(current.mode, nextAccent);
  }, []);

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

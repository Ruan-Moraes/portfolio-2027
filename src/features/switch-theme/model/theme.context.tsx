'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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

  const prefsRef = useRef<{ mode: ThemeMode; accent: AccentColor }>({
    mode: 'dark',
    accent: 'green',
  });

  useEffect(() => {
    const initial = readStoredPreferences();

    prefsRef.current = initial;

    setModeState(initial.mode);
    setAccentState(initial.accent);

    applyThemeAttributes(initial.mode, initial.accent);

    const root = document.documentElement;

    const observer = new MutationObserver(() => {
      const { mode: activeMode, accent: activeAccent } = prefsRef.current;

      applyThemeAttributes(activeMode, activeAccent);
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['lang', 'class'],
    });

    return () => observer.disconnect();
  }, []);

  const setMode = useCallback((nextMode: ThemeMode) => {
    prefsRef.current = { ...prefsRef.current, mode: nextMode };

    setStorageItem(STORAGE_MODE_KEY, nextMode);
    setModeState(nextMode);

    applyThemeAttributes(nextMode, prefsRef.current.accent);
  }, []);

  const toggleMode = useCallback(() => {
    const nextMode: ThemeMode =
      prefsRef.current.mode === 'dark' ? 'light' : 'dark';

    prefsRef.current = { ...prefsRef.current, mode: nextMode };

    setStorageItem(STORAGE_MODE_KEY, nextMode);
    setModeState(nextMode);

    applyThemeAttributes(nextMode, prefsRef.current.accent);
  }, []);

  const setAccent = useCallback((nextAccent: AccentColor) => {
    prefsRef.current = { ...prefsRef.current, accent: nextAccent };

    setStorageItem(STORAGE_ACCENT_KEY, nextAccent);
    setAccentState(nextAccent);

    applyThemeAttributes(prefsRef.current.mode, nextAccent);
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

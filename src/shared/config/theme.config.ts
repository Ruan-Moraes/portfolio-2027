export const SUPPORTED_LOCALES = ['pt-BR', 'en-US', 'es-ES'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: SupportedLocale = 'pt-BR';

export const LOCALE_METADATA: Record<
  SupportedLocale,
  { label: string; shortLabel: string; flag: string }
> = {
  'pt-BR': { label: 'Português (BR)', shortLabel: 'PT', flag: '🇧🇷' },
  'en-US': { label: 'English (US)', shortLabel: 'EN', flag: '🇺🇸' },
  'es-ES': { label: 'Español (ES)', shortLabel: 'ES', flag: '🇪🇸' },
};

export const ACCENT_COLORS = ['green', 'purple', 'blue', 'orange', 'red'] as const;
export type AccentColor = (typeof ACCENT_COLORS)[number];

export const ACCENT_HEX_MAP: Record<
  AccentColor,
  { primary: string; secondary: string; glow: string }
> = {
  green: {
    primary: '#00ff7f',
    secondary: '#10b981',
    glow: 'rgba(0, 255, 127, 0.28)',
  },
  purple: {
    primary: '#a855f7',
    secondary: '#6366f1',
    glow: 'rgba(168, 85, 247, 0.28)',
  },
  blue: {
    primary: '#38bdf8',
    secondary: '#2563eb',
    glow: 'rgba(56, 189, 248, 0.28)',
  },
  orange: {
    primary: '#fb923c',
    secondary: '#ea580c',
    glow: 'rgba(251, 146, 60, 0.28)',
  },
  red: {
    primary: '#f43f5e',
    secondary: '#e11d48',
    glow: 'rgba(244, 63, 94, 0.28)',
  },
};

export const THEME_MODES = ['dark', 'light'] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

export const PORTFOLIO_SECTIONS = [
  'home',
  'about',
  'skills',
  'career',
  'projects',
  'certificates',
  'services',
  'contact',
] as const;

export type PortfolioSectionId = (typeof PORTFOLIO_SECTIONS)[number];

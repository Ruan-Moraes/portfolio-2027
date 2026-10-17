'use client';

import type { ReactNode } from 'react';
import { CommandPaletteProvider } from '@/features/open-command-palette';
import { PortfolioLocaleProvider } from '@/features/switch-language';
import { ThemePreferencesProvider } from '@/features/switch-theme';
import type { SupportedLocale } from '@/shared/config';

interface AppProvidersProps {
  initialLocale: SupportedLocale;
  children: ReactNode;
}

export function AppProviders({ initialLocale, children }: AppProvidersProps) {
  return (
    <PortfolioLocaleProvider initialLocale={initialLocale}>
      <ThemePreferencesProvider>
        <CommandPaletteProvider>{children}</CommandPaletteProvider>
      </ThemePreferencesProvider>
    </PortfolioLocaleProvider>
  );
}
